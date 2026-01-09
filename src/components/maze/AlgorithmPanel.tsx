import { AlgorithmStep, GameMode } from '@/lib/maze/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Brain, MapPin, RotateCcw, Trophy, XCircle } from 'lucide-react';

interface AlgorithmPanelProps {
  mode: GameMode;
  steps: AlgorithmStep[];
  currentStepIndex: number;
  stats: {
    explored: number;
    pathLength: number;
    totalCost: number;
  };
}

export const AlgorithmPanel = ({
  mode,
  steps,
  currentStepIndex,
  stats,
}: AlgorithmPanelProps) => {
  const getAlgorithmInfo = () => {
    switch (mode) {
      case 'ai-astar':
        return {
          name: 'A* Pathfinding',
          description: 'Finds the optimal path by combining actual cost (g) with estimated distance to goal (h).',
          color: 'bg-primary',
        };
      case 'ai-backtrack':
        return {
          name: 'Backtracking (DFS)',
          description: 'Explores paths depth-first, backtracking when hitting dead ends.',
          color: 'bg-game-backtrack',
        };
      default:
        return {
          name: 'Human Mode',
          description: 'Use arrow keys or click adjacent tiles to move.',
          color: 'bg-secondary',
        };
    }
  };

  const info = getAlgorithmInfo();
  const currentStep = steps[currentStepIndex];

  const getStepIcon = (type: AlgorithmStep['type']) => {
    switch (type) {
      case 'explore': return <MapPin className="w-3 h-3" />;
      case 'path': return <Brain className="w-3 h-3" />;
      case 'backtrack': return <RotateCcw className="w-3 h-3" />;
      case 'found': return <Trophy className="w-3 h-3" />;
      case 'dead-end': return <XCircle className="w-3 h-3" />;
    }
  };

  const getStepColor = (type: AlgorithmStep['type']) => {
    switch (type) {
      case 'explore': return 'bg-game-explored text-foreground';
      case 'path': return 'bg-game-path text-foreground';
      case 'backtrack': return 'bg-game-backtrack text-foreground';
      case 'found': return 'bg-game-goal text-foreground';
      case 'dead-end': return 'bg-destructive text-destructive-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border border-border shadow-lg h-full">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={cn(info.color, 'text-primary-foreground')}>
            {info.name}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{info.description}</p>
      </div>

      {mode !== 'human' && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">{stats.explored}</div>
              <div className="text-xs text-muted-foreground">Explored</div>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold text-game-path">{stats.pathLength}</div>
              <div className="text-xs text-muted-foreground">Path</div>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold text-accent">{stats.totalCost}</div>
              <div className="text-xs text-muted-foreground">Cost</div>
            </div>
          </div>

          {currentStep && (
            <div className={cn(
              'p-3 rounded-lg flex items-center gap-2',
              getStepColor(currentStep.type)
            )}>
              {getStepIcon(currentStep.type)}
              <span className="text-sm font-medium font-mono">{currentStep.message}</span>
            </div>
          )}

          <ScrollArea className="flex-1 max-h-48">
            <div className="space-y-1 pr-4">
              {steps.slice(0, currentStepIndex + 1).reverse().map((step, i) => (
                <div
                  key={steps.length - 1 - i}
                  className={cn(
                    'text-xs p-2 rounded flex items-center gap-2 font-mono',
                    i === 0 ? 'bg-muted' : 'opacity-60'
                  )}
                >
                  {getStepIcon(step.type)}
                  <span className="truncate">{step.message}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {mode === 'human' && (
        <div className="space-y-3">
          <div className="text-sm font-medium">Controls:</div>
          <div className="grid grid-cols-3 gap-1 max-w-[150px] mx-auto">
            <div />
            <div className="p-2 bg-muted rounded text-center text-sm font-mono">↑</div>
            <div />
            <div className="p-2 bg-muted rounded text-center text-sm font-mono">←</div>
            <div className="p-2 bg-muted rounded text-center text-sm font-mono">↓</div>
            <div className="p-2 bg-muted rounded text-center text-sm font-mono">→</div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Or click on adjacent tiles to move
          </p>
        </div>
      )}
    </div>
  );
};
