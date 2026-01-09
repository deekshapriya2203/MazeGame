import { cn } from '@/lib/utils';
import { TileType, Position } from '@/lib/maze/types';
import { Flag, Skull, TreePine } from 'lucide-react';

interface MazeTileProps {
  type: TileType;
  position: Position;
  isPlayer: boolean;
  isExplored: boolean;
  isPath: boolean;
  isBacktrack: boolean;
  onClick?: () => void;
  size?: number;
}

export const MazeTile = ({
  type,
  position,
  isPlayer,
  isExplored,
  isPath,
  isBacktrack,
  onClick,
  size = 40,
}: MazeTileProps) => {
  const baseClasses = cn(
    'relative flex items-center justify-center transition-all duration-200 border border-black/10',
    onClick && 'cursor-pointer hover:brightness-110',
  );

  const getTileClasses = () => {
    switch (type) {
      case 'wall':
        return 'bg-game-wall';
      case 'trap':
        return 'bg-game-trap animate-pulse-glow';
      case 'start':
        return 'bg-game-start';
      case 'goal':
        return 'bg-game-goal animate-pulse-glow';
      case 'checkpoint':
        return 'bg-accent';
      default:
        return (position.x + position.y) % 2 === 0 
          ? 'bg-game-grass' 
          : 'bg-game-grass-light';
    }
  };

  const getOverlayClasses = () => {
    if (isPath) return 'ring-4 ring-game-path ring-inset bg-game-path/30 animate-path-trace';
    if (isBacktrack) return 'ring-2 ring-game-backtrack ring-inset bg-game-backtrack/20';
    if (isExplored) return 'bg-game-explored/40 animate-explore-pulse';
    return '';
  };

  const renderTileContent = () => {
    if (isPlayer) {
      return (
        <div className="absolute inset-0 flex items-center justify-center animate-player-move z-10">
          <div 
            className="w-3/4 h-3/4 rounded-full bg-game-player shadow-lg flex items-center justify-center"
            style={{ boxShadow: '0 4px 12px hsl(var(--player) / 0.5)' }}
          >
            <span className="text-primary-foreground text-lg">🧑</span>
          </div>
        </div>
      );
    }

    switch (type) {
      case 'wall':
        return <TreePine className="w-5 h-5 text-foreground/70" />;
      case 'trap':
        return <Skull className="w-5 h-5 text-destructive-foreground" />;
      case 'start':
        return <span className="text-xl">🚀</span>;
      case 'goal':
        return <Flag className="w-5 h-5 text-accent-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(baseClasses, getTileClasses(), getOverlayClasses())}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {renderTileContent()}
    </div>
  );
};
