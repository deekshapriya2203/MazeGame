import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, Trophy } from 'lucide-react';

interface VictoryOverlayProps {
  show: boolean;
  stats: {
    explored: number;
    pathLength: number;
    totalCost: number;
  };
  onNextLevel: () => void;
  onReplay: () => void;
  hasNextLevel: boolean;
}

const Confetti = ({ delay }: { delay: number }) => {
  const colors = ['#8b5cf6', '#3b82f6', '#22c55e', '#eab308', '#ef4444'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = Math.random() * 100;
  const size = 8 + Math.random() * 8;
  
  return (
    <div
      className="absolute animate-confetti"
      style={{
        left: `${left}%`,
        top: -20,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
        animationDelay: `${delay}ms`,
      }}
    />
  );
};

export const VictoryOverlay = ({
  show,
  stats,
  onNextLevel,
  onReplay,
  hasNextLevel,
}: VictoryOverlayProps) => {
  const [confetti, setConfetti] = useState<number[]>([]);

  useEffect(() => {
    if (show) {
      setConfetti(Array.from({ length: 50 }, (_, i) => i * 60));
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((delay, i) => (
          <Confetti key={i} delay={delay} />
        ))}
      </div>
      
      <div className="relative bg-card p-8 rounded-2xl shadow-2xl border-2 border-accent animate-bounce-in max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-accent rounded-full flex items-center justify-center animate-celebrate">
            <Trophy className="w-10 h-10 text-accent-foreground" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              🎉 Level Complete!
            </h2>
            <p className="text-muted-foreground">
              Congratulations! You've solved the maze!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-primary">{stats.explored}</div>
              <div className="text-xs text-muted-foreground">Tiles Explored</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-game-path">{stats.pathLength}</div>
              <div className="text-xs text-muted-foreground">Path Length</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-accent">{stats.totalCost}</div>
              <div className="text-xs text-muted-foreground">Total Cost</div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onReplay}
              className="flex-1 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay
            </Button>
            {hasNextLevel && (
              <Button
                onClick={onNextLevel}
                className="flex-1 gap-2"
              >
                Next Level
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
