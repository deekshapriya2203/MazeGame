export type TileType = 'grass' | 'wall' | 'trap' | 'start' | 'goal' | 'checkpoint';

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  type: TileType;
  cost: number; // Movement cost (1 for grass, Infinity for wall/trap)
  position: Position;
}

export interface MazeLevel {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  grid: TileType[][];
  start: Position;
  goal: Position;
}

export interface PathNode {
  position: Position;
  g: number; // Cost from start
  h: number; // Heuristic (estimated cost to goal)
  f: number; // Total cost (g + h)
  parent: PathNode | null;
}

export interface AlgorithmStep {
  type: 'explore' | 'path' | 'backtrack' | 'found' | 'dead-end';
  position: Position;
  message: string;
  cost?: number;
  heuristic?: number;
}

export interface AlgorithmResult {
  path: Position[];
  steps: AlgorithmStep[];
  explored: Position[];
  success: boolean;
  totalCost: number;
}

export type GameMode = 'human' | 'ai-astar' | 'ai-backtrack' | 'compare';
export type GameState = 'idle' | 'playing' | 'solving' | 'solved' | 'failed';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export const SPEED_VALUES: Record<AnimationSpeed, number> = {
  slow: 500,
  normal: 200,
  fast: 50,
};

export const TILE_COSTS: Record<TileType, number> = {
  grass: 1,
  wall: Infinity,
  trap: Infinity,
  start: 1,
  goal: 1,
  checkpoint: 2,
};
