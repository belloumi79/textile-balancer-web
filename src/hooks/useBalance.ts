import { useState } from 'react';
import { balanceDirect, BalanceResult } from '../api';

export function useBalance() {
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBalance = async (
    projectData: any,
    cycleTime: number,
    solver: string = 'cp_sat',
    objective: string = 'min_stations',
    timeLimit: number = 30
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await balanceDirect(projectData, cycleTime, solver, objective, timeLimit);
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, runBalance };
}
