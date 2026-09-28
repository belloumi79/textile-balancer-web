import { useState } from 'react';
import { runScenarios } from '../api';

export function useScenarios() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runScenariosFn = async (
    projectData: any,
    cycleTimes: number[],
    solver: string = 'rpw',
    timeLimit: number = 15
  ) => {
    setLoading(true);
    try {
      const data = await runScenarios(projectData, cycleTimes, solver, timeLimit);
      setResult(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, runScenarios: runScenariosFn };
}
