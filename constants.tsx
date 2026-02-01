
import { NodeType, ArchNode, ArchLink } from './types';

export const INITIAL_NODES: ArchNode[] = [
  { id: 'user', name: 'Browser / Client', type: NodeType.USER, description: 'End-user device initiating requests via HTTPS.', rank: 0 },
  { id: 'lb', name: 'Cloud Load Balancer', type: NodeType.LOAD_BALANCER, description: 'Global HTTPS Load Balancer managing incoming traffic.', rank: 1 },
  { id: 'fe', name: 'Frontend (Cloud Run)', type: NodeType.FRONTEND, description: 'React application serving dynamic content.', rank: 2 },
  { id: 'be', name: 'Backend API', type: NodeType.BACKEND_API, description: 'Handles business logic and authentication.', rank: 3 },
  { id: 'cache', name: 'Memorystore', type: NodeType.CACHE, description: 'Redis for frequent query results.', rank: 4 },
  { id: 'db', name: 'Cloud SQL', type: NodeType.DATABASE, description: 'PostgreSQL relational database.', rank: 4 },
  { id: 'ai', name: 'Gemini AI', type: NodeType.AI_MODEL, description: 'Generative AI for intelligence.', rank: 5 },
  { id: 'ext', name: 'External APIs', type: NodeType.EXTERNAL_SERVICE, description: 'Stripe, Auth0, or other third-party services.', rank: 5 },
];

export const INITIAL_LINKS: ArchLink[] = [
  { source: 'user', target: 'lb', label: 'HTTPS' },
  { source: 'lb', target: 'fe', label: 'Proxy' },
  { source: 'fe', target: 'be', label: 'JSON API' },
  { source: 'be', target: 'db', label: 'Queries' },
  { source: 'be', target: 'cache', label: 'Cache' },
  { source: 'be', target: 'ai', label: 'Analysis' },
  { source: 'be', target: 'ext', label: 'External' },
];
