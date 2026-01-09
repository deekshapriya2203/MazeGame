import { MazeLevel } from '@/lib/maze/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lock, Star, Trophy } from 'lucide-react';

interface LevelSelectProps {
  levels: MazeLevel[];
  currentLevelId: string;
  completedLevels: Set<string>;
  onSelectLevel: (level: MazeLevel) => void;
}

export const LevelSelect = ({
  levels,
  currentLevelId,
  completedLevels,
  onSelectLevel,
}: LevelSelectProps) => {
  const getDifficultyColor = (difficulty: MazeLevel['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-game-grass text-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getDifficultyStars = (difficulty: MazeLevel['difficulty']) => {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-current" />
    ));
  };

  return (
    <div className="p-4 bg-card rounded-xl border border-border shadow-lg">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-accent" />
        Select Level
      </h3>
      <div className="grid gap-2">
        {levels.map((level, index) => {
          const isCompleted = completedLevels.has(level.id);
          const isCurrent = level.id === currentLevelId;
          
          return (
            <Button
              key={level.id}
              variant={isCurrent ? 'default' : 'outline'}
              className={cn(
                'justify-between h-auto py-3 px-4',
                isCurrent && 'ring-2 ring-primary/50',
                isCompleted && !isCurrent && 'border-game-path'
              )}
              onClick={() => onSelectLevel(level)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <div className="text-left">
                  <div className="font-semibold">{level.name}</div>
                  <div className="text-xs text-muted-foreground">{level.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn('gap-1', getDifficultyColor(level.difficulty))}>
                  {getDifficultyStars(level.difficulty)}
                </Badge>
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-game-path flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
