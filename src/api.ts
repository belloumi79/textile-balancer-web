/**
 * Client API pour Textile Line Balancer
 * Appelle l'API Cloudflare Workers
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ── Auth ─────────────────────────────────────────────────────────────

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  return request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

// ── Balance ──────────────────────────────────────────────────────────

export interface BalanceResult {
  success: boolean;
  solver_used: string;
  status: string;
  solve_time_seconds: number;
  stations_used: number;
  actual_cycle_time: number;
  efficiency: number;
  balance_delay: number;
  smoothness_index: number;
  station_details: Array<{
    station: number;
    total_time: number;
    load_pct: number;
    operations: string[];
    workers: string[];
  }>;
  operation_assignments: Record<string, number>;
  capacity: any | null;
  recommendations: Array<{
    severity: string;
    category: string;
    message: string;
    action: string;
  }>;
}

export async function balanceDirect(
  projectData: any,
  cycleTime: number,
  solver: string = 'cp_sat',
  objective: string = 'min_stations',
  timeLimit: number = 30
): Promise<BalanceResult> {
  return request('/api/v1/balance/direct', {
    method: 'POST',
    body: JSON.stringify({
      project_data: projectData,
      cycle_time: cycleTime,
      solver,
      objective,
      time_limit: timeLimit,
    }),
  });
}

// ── Scenarios ────────────────────────────────────────────────────────

export async function runScenarios(
  projectData: any,
  cycleTimes: number[],
  solver: string = 'rpw',
  timeLimit: number = 15
): Promise<any> {
  return request('/api/v1/scenarios/direct', {
    method: 'POST',
    body: JSON.stringify({
      project_data: projectData,
      cycle_times: cycleTimes,
      solver,
      time_limit: timeLimit,
    }),
  });
}

// ── Exports ──────────────────────────────────────────────────────────

export async function exportExcel(projectData: any, cycleTime: number, solver: string = 'cp_sat'): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/v1/export/excel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_data: projectData, cycle_time: cycleTime, solver }),
  });
  if (!response.ok) throw new Error('Export failed');
  return response.blob();
}

export async function exportPdf(projectData: any, cycleTime: number, solver: string = 'cp_sat'): Promise<Blob> {
  const response = await fetch(`${API_URL}/api/v1/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_data: projectData, cycle_time: cycleTime, solver }),
  });
  if (!response.ok) throw new Error('Export failed');
  return response.blob();
}
