
export enum NodeType {
  USER = 'USER',
  LOAD_BALANCER = 'LOAD_BALANCER',
  FRONTEND = 'FRONTEND',
  BACKEND_API = 'BACKEND_API',
  DATABASE = 'DATABASE',
  CACHE = 'CACHE',
  AI_MODEL = 'AI_MODEL',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE'
}

export interface ArchNode {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  rank: number; // 0 for left, 10 for right
  x?: number;
  y?: number;
}

export interface ArchLink {
  source: string;
  target: string;
  label: string;
}

export interface FlowExplanation {
  step: number;
  description: string;
  nodes: string[];
}
