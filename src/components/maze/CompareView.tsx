import { MazeLevel, Position, AlgorithmStep } from '@/lib/maze/types';
import { MazeGrid } from './MazeGrid';
import { Badge } from '../ui/badge';

interface AlgorithmState {
  name: string;
  exploredTiles: Set<string>;
  pathTiles: Set<string>;
  backtrackTiles: Set<string>;
  playerPosition: Position;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  stats: {
    explored: number;
    pathLength: number;
    totalCost: number;
  };
  completed: boolean;
}

interface CompareViewProps {
  level: MazeLevel;
  astar: AlgorithmState;
  backtrack: AlgorithmState;
  tileSize?: number;
}

export const CompareView = ({
  level,
  astar,
  backtrack,
  tileSize = 32,
}: CompareViewProps) => {
  const renderAlgorithmView = (state: AlgorithmState, color: string) => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge className={color}>{state.name}</Badge>
        {state.completed && <span className="text-lg">✅</span>}
      </div>
      
      <MazeGrid
        level={level}
        playerPosition={state.playerPosition}
        exploredTiles={state.exploredTiles}
        pathTiles={state.pathTiles}
        backtrackTiles={state.backtrackTiles}
        tileSize={tileSize}
      />

      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-lg font-bold">{state.stats.explored}</div>
          <div className="text-xs text-muted-foreground">Explored</div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-lg font-bold">{state.stats.pathLength}</div>
          <div className="text-xs text-muted-foreground">Path</div>
        </div>
        <div className="p-2 bg-muted rounded text-center">
          <div className="text-lg font-bold">{state.stats.totalCost}</div>
          <div className="text-xs text-muted-foreground">Cost</div>
        </div>
      </div>

      {state.steps[state.currentStepIndex] && (
        <div className="text-xs text-center text-muted-foreground font-mono p-2 bg-muted rounded w-full truncate">
          {state.steps[state.currentStepIndex].message}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {renderAlgorithmView(astar, 'bg-primary text-primary-foreground')}
      {renderAlgorithmView(backtrack, 'bg-game-backtrack text-foreground')}
    </div>
  );
};
