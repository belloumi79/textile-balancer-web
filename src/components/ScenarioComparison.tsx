import { useState } from 'react';
import { ProjectData } from '../types';

interface ScenarioComparisonProps {
  projectData: ProjectData | null;
  onProjectDataChange: (data: ProjectData | null) => void;
  cycleTimes: number[];
  onRun: (cycleTimes: number[]) => void;
  result: any;
  loading: boolean;
}

export function ScenarioComparison({
  projectData,
  onProjectDataChange,
  cycleTimes,
  onRun,
  result,
  loading,
}: ScenarioComparisonProps) {
  const [jsonText, setJsonText] = useState('');
  const [selectedCycles, setSelectedCycles] = useState<number[]>(cycleTimes);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      try {
        const data = JSON.parse(text);
        onProjectDataChange(data);
      } catch {
        alert('JSON invalide');
      }
    };
    reader.readAsText(file);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    try {
      const data = JSON.parse(e.target.value);
      onProjectDataChange(data);
    } catch {
      // Ignore
    }
  };

  const toggleCycle = (ct: number) => {
    setSelectedCycles(prev =>
      prev.includes(ct)
        ? prev.filter(c => c !== ct)
        : [...prev, ct].sort((a, b) => a - b)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
          <h2 className="text-lg font-bold text-white mb-4">🔀 Scénarios</h2>

          <div className="mb-4">
            <label className="block text-sm text-muted mb-2">
              Projet (JSON)
            </label>
            <input
              type="file"
              accept=".json,.csv,.xlsx"
              onChange={handleFileUpload}
              className="w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-semibold file:cursor-pointer hover:file:bg-primary-hover"
            />
          </div>

          <textarea
            value={jsonText}
            onChange={handleJsonChange}
            rows={6}
            placeholder='{"nodes": [...], "edges": [...]}'
            className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-white font-mono resize-none focus:outline-none focus:border-primary mb-4"
          />

          <div className="mb-4">
            <label className="block text-sm text-muted mb-2">
              Temps de cycle à comparer (minutes)
            </label>
            <div className="flex flex-wrap gap-2">
              {cycleTimes.map(ct => (
                <button
                  key={ct}
                  onClick={() => toggleCycle(ct)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCycles.includes(ct)
                      ? 'bg-primary text-white'
                      : 'bg-dark-card text-muted hover:bg-dark-border'
                  }`}
                >
                  {ct.toFixed(1)} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onRun(selectedCycles)}
            disabled={loading || !projectData || selectedCycles.length === 0}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Comparaison...' : '_compare Les scénarios'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        {loading ? (
          <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        ) : result ? (
          <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
            <h3 className="text-lg font-bold text-white mb-4">Résultats comparatifs</h3>
            {result.best_scenario && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-white">
                  <span className="font-bold">Meilleur scénario:</span> {result.best_scenario}
                </p>
              </div>
            )}
            {result.headers && result.rows && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted border-b border-dark-border">
                      {result.headers.map((h: string, i: number) => (
                        <th key={i} className="py-2 px-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row: any[], ri: number) => (
                      <tr key={ri} className="border-b border-dark-border/50">
                        {row.map((cell, ci) => (
                          <td key={ci} className="py-2 px-3 text-white">{String(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
            <div className="text-center py-12">
              <span className="text-4xl">🔀</span>
              <p className="mt-4 text-muted">Sélectionnez des temps de cycle et lancez la comparaison</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
