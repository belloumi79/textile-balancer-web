import { useState } from 'react';
import { BalanceForm } from './components/BalanceForm';
import { ResultsView } from './components/ResultsView';
import { ScenarioComparison } from './components/ScenarioComparison';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useBalance } from './hooks/useBalance';
import { useScenarios } from './hooks/useScenarios';
import { ProjectData } from './types';

export default function App() {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [cycleTime, setCycleTime] = useState<number>(1.5);
  const [solver, setSolver] = useState<string>('cp_sat');
  const [objective, setObjective] = useState<string>('min_stations');
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'balance' | 'scenarios'>('balance');

  const { result, loading, error, runBalance } = useBalance();
  const { result: scenarioResult, loading: scenarioLoading, runScenarios: runScenarioComparison } = useScenarios();

  const handleBalance = () => {
    if (!projectData) return;
    runBalance(projectData, cycleTime, solver, objective, timeLimit);
  };

  const handleScenarios = (cycleTimes: number[]) => {
    if (!projectData) return;
    runScenarioComparison(projectData, cycleTimes, solver, timeLimit);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧵 Textile Line Balancer
          </h1>
          <p className="text-muted">
            Équilibrage de lignes de production textile/habillement (ALBP)
            avec solveurs RPW (heuristique) et CP-SAT (optimal)
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'balance'
                ? 'bg-primary text-white'
                : 'bg-dark-panel text-muted hover:bg-dark-card'
            }`}
          >
            ⚖️ Équilibrage
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'scenarios'
                ? 'bg-primary text-white'
                : 'bg-dark-panel text-muted hover:bg-dark-card'
            }`}
          >
            🔀 Comparaison Scénarios
          </button>
        </div>

        {activeTab === 'balance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BalanceForm
                projectData={projectData}
                onProjectDataChange={setProjectData}
                cycleTime={cycleTime}
                onCycleTimeChange={setCycleTime}
                solver={solver}
                onSolverChange={setSolver}
                objective={objective}
                onObjectiveChange={setObjective}
                timeLimit={timeLimit}
                onTimeLimitChange={setTimeLimit}
                onBalance={handleBalance}
                loading={loading}
              />
            </div>
            <div className="lg:col-span-2">
              <ResultsView
                result={result}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <ScenarioComparison
            projectData={projectData}
            onProjectDataChange={setProjectData}
            cycleTimes={[1.0, 1.5, 2.0, 2.5, 3.0]}
            onRun={handleScenarios}
            result={scenarioResult}
            loading={scenarioLoading}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
