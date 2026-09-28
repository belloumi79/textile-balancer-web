import React, { useState } from 'react';
import { ProjectData } from '../types';

export function BalanceForm({
  projectData,
  onProjectDataChange,
  cycleTime,
  onCycleTimeChange,
  solver,
  onSolverChange,
  objective,
  onObjectiveChange,
  timeLimit,
  onTimeLimitChange,
  onBalance,
  loading,
}: {
  projectData: ProjectData | null;
  onProjectDataChange: (data: ProjectData | null) => void;
  cycleTime: number;
  onCycleTimeChange: (v: number) => void;
  solver: string;
  onSolverChange: (v: string) => void;
  objective: string;
  onObjectiveChange: (v: string) => void;
  timeLimit: number;
  onTimeLimitChange: (v: number) => void;
  onBalance: () => void;
  loading: boolean;
}) {
  const [jsonText, setJsonText] = useState('');

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
      // Ignore parse error while typing
    }
  };

  return (
    <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
      <h2 className="text-lg font-bold text-white mb-4">⚙️ Configuration</h2>

      {/* File upload */}
      <div className="mb-4">
        <label className="block text-sm text-muted mb-2">
          Importer un projet (JSON SAM)
        </label>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json,.csv,.xlsx"
            onChange={handleFileUpload}
            className="flex-1 text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-semibold file:cursor-pointer hover:file:bg-primary-hover"
          />
        </div>
        <p className="text-xs text-muted mt-1">
          Formats supportés : JSON, CSV, Excel (.xlsx)
        </p>
      </div>

      {/* JSON editor */}
      <div className="mb-4">
        <label className="block text-sm text-muted mb-2">
          Ou coller le JSON du projet
        </label>
        <textarea
          value={jsonText}
          onChange={handleJsonChange}
          rows={8}
          placeholder='{"nodes": [...], "edges": [...]}'
          className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-white font-mono resize-none focus:outline-none focus:border-primary"
        />
      </div>

      {/* Cycle time */}
      <div className="mb-4">
        <label className="block text-sm text-muted mb-2">
          Temps de cycle cible (minutes)
        </label>
        <input
          type="number"
          step="0.1"
          value={cycleTime}
          onChange={(e) => onCycleTimeChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
        />
      </div>

      {/* Solver */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-muted mb-2">Solveur</label>
          <select
            value={solver}
            onChange={(e) => onSolverChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="cp_sat">CP-SAT (Optimal)</option>
            <option value="rpw">RPW (Rapide)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-2">Objectif</label>
          <select
            value={objective}
            onChange={(e) => onObjectiveChange(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
          >
            <option value="min_stations">Min stations</option>
            <option value="min_cycle_time">Min cycle time</option>
            <option value="max_efficiency">Max efficacité</option>
            <option value="balance_workload">Équilibrage charge</option>
          </select>
        </div>
      </div>

      {/* Time limit */}
      <div className="mb-6">
        <label className="block text-sm text-muted mb-2">
          Limite de temps solveur (secondes)
        </label>
        <input
          type="number"
          value={timeLimit}
          onChange={(e) => onTimeLimitChange(parseInt(e.target.value) || 30)}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary"
        />
      </div>

      <button
        onClick={onBalance}
        disabled={loading || !projectData}
        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '⚙️ Résolution en cours...' : '⚖️ Lancer l\'équilibrage'}
      </button>
    </div>
  );
}
