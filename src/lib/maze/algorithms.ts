import { Position, MazeLevel, AlgorithmResult, AlgorithmStep, PathNode, TILE_COSTS } from './types';

// Manhattan distance heuristic
const heuristic = (a: Position, b: Position): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const posKey = (pos: Position): string => `${pos.x},${pos.y}`;

const getNeighbors = (pos: Position, grid: string[][]): Position[] => {
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
  ];
  
  return directions
    .map(dir => ({ x: pos.x + dir.x, y: pos.y + dir.y }))
    .filter(p => 
      p.x >= 0 && 
      p.x < grid[0].length && 
      p.y >= 0 && 
      p.y < grid.length
    );
};

const isWalkable = (pos: Position, level: MazeLevel): boolean => {
  const tileType = level.grid[pos.y][pos.x];
  return tileType !== 'wall' && tileType !== 'trap';
};

const getTileCost = (pos: Position, level: MazeLevel): number => {
  const tileType = level.grid[pos.y][pos.x];
  return TILE_COSTS[tileType];
};

// A* Pathfinding Algorithm
export const aStarSearch = (level: MazeLevel): AlgorithmResult => {
  const steps: AlgorithmStep[] = [];
  const explored: Position[] = [];
  
  const openSet: PathNode[] = [];
  const closedSet = new Set<string>();
  const gScores = new Map<string, number>();
  
  const startNode: PathNode = {
    position: level.start,
    g: 0,
    h: heuristic(level.start, level.goal),
    f: heuristic(level.start, level.goal),
    parent: null,
  };
  
  openSet.push(startNode);
  gScores.set(posKey(level.start), 0);
  
  steps.push({
    type: 'explore',
    position: level.start,
    message: `Starting A* from (${level.start.x}, ${level.start.y})`,
    cost: 0,
    heuristic: startNode.h,
  });
  
  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const currentKey = posKey(current.position);
    
    // Check if we reached the goal
    if (current.position.x === level.goal.x && current.position.y === level.goal.y) {
      // Reconstruct path
      const path: Position[] = [];
      let node: PathNode | null = current;
      while (node) {
        path.unshift(node.position);
        node = node.parent;
      }
      
      steps.push({
        type: 'found',
        position: current.position,
        message: `🎉 Goal reached! Total cost: ${current.g}`,
        cost: current.g,
      });
      
      return {
        path,
        steps,
        explored,
        success: true,
        totalCost: current.g,
      };
    }
    
    closedSet.add(currentKey);
    explored.push(current.position);
    
    steps.push({
      type: 'explore',
      position: current.position,
      message: `Exploring (${current.position.x}, ${current.position.y}) | g=${current.g}, h=${current.h.toFixed(1)}, f=${current.f.toFixed(1)}`,
      cost: current.g,
      heuristic: current.h,
    });
    
    // Check neighbors
    const neighbors = getNeighbors(current.position, level.grid as unknown as string[][]);
    
    for (const neighborPos of neighbors) {
      const neighborKey = posKey(neighborPos);
      
      if (closedSet.has(neighborKey) || !isWalkable(neighborPos, level)) {
        continue;
      }
      
      const tentativeG = current.g + getTileCost(neighborPos, level);
      const existingG = gScores.get(neighborKey) ?? Infinity;
      
      if (tentativeG < existingG) {
        const h = heuristic(neighborPos, level.goal);
        const neighborNode: PathNode = {
          position: neighborPos,
          g: tentativeG,
          h,
          f: tentativeG + h,
          parent: current,
        };
        
        gScores.set(neighborKey, tentativeG);
        
        const existingIndex = openSet.findIndex(n => posKey(n.position) === neighborKey);
        if (existingIndex >= 0) {
          openSet[existingIndex] = neighborNode;
        } else {
          openSet.push(neighborNode);
        }
      }
    }
  }
  
  steps.push({
    type: 'dead-end',
    position: level.goal,
    message: '❌ No path found to the goal!',
  });
  
  return {
    path: [],
    steps,
    explored,
    success: false,
    totalCost: Infinity,
  };
};

// Backtracking Algorithm (DFS with backtracking)
export const backtrackingSearch = (level: MazeLevel): AlgorithmResult => {
  const steps: AlgorithmStep[] = [];
  const explored: Position[] = [];
  const visited = new Set<string>();
  const path: Position[] = [];
  
  steps.push({
    type: 'explore',
    position: level.start,
    message: `Starting Backtracking from (${level.start.x}, ${level.start.y})`,
  });
  
  const dfs = (pos: Position): boolean => {
    const key = posKey(pos);
    
    if (visited.has(key)) return false;
    if (!isWalkable(pos, level)) return false;
    
    visited.add(key);
    explored.push(pos);
    path.push(pos);
    
    steps.push({
      type: 'explore',
      position: pos,
      message: `Exploring (${pos.x}, ${pos.y}) - Path length: ${path.length}`,
    });
    
    // Check if goal reached
    if (pos.x === level.goal.x && pos.y === level.goal.y) {
      steps.push({
        type: 'found',
        position: pos,
        message: `🎉 Goal reached! Path length: ${path.length}`,
      });
      return true;
    }
    
    // Try all neighbors
    const neighbors = getNeighbors(pos, level.grid as unknown as string[][]);
    
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }
    
    // Backtrack
    path.pop();
    steps.push({
      type: 'backtrack',
      position: pos,
      message: `Dead end at (${pos.x}, ${pos.y}) - Backtracking...`,
    });
    
    return false;
  };
  
  const success = dfs(level.start);
  
  if (!success) {
    steps.push({
      type: 'dead-end',
      position: level.goal,
      message: '❌ No path found to the goal!',
    });
  }
  
  return {
    path: success ? [...path] : [],
    steps,
    explored,
    success,
    totalCost: path.length - 1,
  };
};
