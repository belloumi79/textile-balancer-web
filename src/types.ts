export interface Operation {
  id: string;
  name: string;
  duration: number;
  predecessors: string[];
  machine_type: string;
  required_skills: string[];
  section: string;
  optional: boolean;
  task_type: string;
}

export interface Workstation {
  id: string;
  name: string;
  machine_type: string;
  available: boolean;
  max_workers: number;
  section: string;
}

export interface Worker {
  id: string;
  name: string;
  skills: string[];
  efficiency: number;
  available: boolean;
}

export interface ProjectData {
  nodes: Array<{
    id: string;
    type: string;
    enabled: boolean;
    config: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
}
