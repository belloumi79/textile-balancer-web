import { BalanceResult } from '../api';

interface ResultsViewProps {
  result: BalanceResult | null;
  loading: boolean;
  error: string | null;
}

export function ResultsView({ result, loading, error }: ResultsViewProps) {
  if (loading) {
    return (
      <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
        <div className="text-center py-12">
          <span className="text-4xl">❌</span>
          <p className="mt-4 text-red-400">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
        <div className="text-center py-12">
          <span className="text-4xl">📊</span>
          <p className="mt-4 text-muted">Aucun résultat - Lancez un équilibrage pour voir les résultats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-panel rounded-xl p-4 border border-dark-border">
          <p className="text-xs text-muted">Solveur</p>
          <p className="text-lg font-bold text-white">{result.solver_used}</p>
          <p className="text-xs text-muted mt-1">{result.status}</p>
        </div>
        <div className="bg-dark-panel rounded-xl p-4 border border-dark-border">
          <p className="text-xs text-muted">Stations</p>
          <p className="text-lg font-bold text-white">{result.stations_used}</p>
        </div>
        <div className="bg-dark-panel rounded-xl p-4 border border-dark-border">
          <p className="text-xs text-muted">Cycle réel</p>
          <p className="text-lg font-bold text-white">{result.actual_cycle_time.toFixed(2)} min</p>
        </div>
        <div className="bg-dark-panel rounded-xl p-4 border border-dark-border">
          <p className="text-xs text-muted">Efficacité</p>
          <p className="text-lg font-bold text-white">{result.efficiency.toFixed(1)}%</p>
        </div>
      </div>

      {/* Station Details Table */}
      <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
        <h3 className="text-lg font-bold text-white mb-4">📋 Détail par poste</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-dark-border">
                <th className="py-2 px-3">Station</th>
                <th className="py-2 px-3">Temps (min)</th>
                <th className="py-2 px-3">Charge (%)</th>
                <th className="py-2 px-3">Ops</th>
                <th className="py-2 px-3">Ouvriers</th>
              </tr>
            </thead>
            <tbody>
              {result.station_details.map((sd) => (
                <tr key={sd.station} className="border-b border-dark-border/50">
                  <td className="py-2 px-3 text-white font-medium">WS{sd.station}</td>
                  <td className="py-2 px-3 text-white">{sd.total_time.toFixed(2)}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sd.load_pct >= 95 ? 'bg-red-500/20 text-red-400' :
                      sd.load_pct >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {sd.load_pct.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2 px-3 text-muted">{sd.operations.length}</td>
                  <td className="py-2 px-3 text-muted">{sd.workers.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
          <h3 className="text-lg font-bold text-white mb-4">💡 Recommandations</h3>
          <div className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-dark-card rounded-lg">
                <span className="text-lg">
                  {rec.severity === 'CRITIQUE' ? '🔴' : rec.severity === 'ATTENTION' ? '🟠' : '🔵'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-white">{rec.message}</p>
                  {rec.action && <p className="text-xs text-muted mt-1">→ {rec.action}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Capacity Analysis */}
      {result.capacity && (
        <div className="bg-dark-panel rounded-xl p-6 border border-dark-border">
          <h3 className="text-lg font-bold text-white mb-4">📦 Analyse de capacité</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted">Takt requis</p>
              <p className="text-white font-medium">{result.capacity.takt_time.toFixed(2)} min/pc</p>
            </div>
            <div>
              <p className="text-xs text-muted">Production/jour</p>
              <p className="text-white font-medium">{result.capacity.projected_daily_output.toFixed(0)} pcs</p>
            </div>
            <div>
              <p className="text-xs text-muted">Verdict</p>
              <p className={`font-bold ${
                result.capacity.verdict === 'OK' ? 'text-green-400' :
                result.capacity.verdict === 'TENDU' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {result.capacity.verdict}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
