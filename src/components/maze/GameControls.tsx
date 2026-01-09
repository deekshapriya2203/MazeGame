import { Button } from '@/components/ui/button';
import { GameMode, AnimationSpeed, GameState } from '@/lib/maze/types';
import { Play, RotateCcw, User, Bot, GitCompare, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  mode: GameMode;
  speed: AnimationSpeed;
  state: GameState;
  onModeChange: (mode: GameMode) => void;
  onSpeedChange: (speed: AnimationSpeed) => void;
  onStart: () => void;
  onReset: () => void;
}

export const GameControls = ({
  mode,
  speed,
  state,
  onModeChange,
  onSpeedChange,
  onStart,
  onReset,
}: GameControlsProps) => {
  const modes: { value: GameMode; label: string; icon: React.ReactNode }[] = [
    { value: 'human', label: 'Human', icon: <User className="w-4 h-4" /> },
    { value: 'ai-astar', label: 'A* AI', icon: <Bot className="w-4 h-4" /> },
    { value: 'ai-backtrack', label: 'Backtrack AI', icon: <Bot className="w-4 h-4" /> },
    { value: 'compare', label: 'Compare', icon: <GitCompare className="w-4 h-4" /> },
  ];

  const speeds: { value: AnimationSpeed; label: string }[] = [
    { value: 'slow', label: 'Slow' },
    { value: 'normal', label: 'Normal' },
    { value: 'fast', label: 'Fast' },
  ];

  const isPlaying = state === 'playing' || state === 'solving';

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-xl border border-border shadow-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Game Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {modes.map(({ value, label, icon }) => (
            <Button
              key={value}
              variant={mode === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onModeChange(value)}
              disabled={isPlaying}
              className={cn(
                'gap-2 transition-all',
                mode === value && 'ring-2 ring-primary/50'
              )}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </div>

      {mode !== 'human' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Animation Speed
          </label>
          <div className="flex gap-2">
            {speeds.map(({ value, label }) => (
              <Button
                key={value}
                variant={speed === value ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onSpeedChange(value)}
                disabled={isPlaying}
                className="flex-1"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          onClick={onStart}
          disabled={isPlaying || state === 'solved'}
          className="flex-1 gap-2"
          size="lg"
        >
          <Play className="w-5 h-5" />
          {mode === 'human' ? 'Start Game' : 'Run AI'}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </Button>
      </div>
    </div>
  );
};
