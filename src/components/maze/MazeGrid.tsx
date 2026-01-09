import { MazeLevel, Position } from '@/lib/maze/types';
import { MazeTile } from './MazeTile';

interface MazeGridProps {
  level: MazeLevel;
  playerPosition: Position;
  exploredTiles: Set<string>;
  pathTiles: Set<string>;
  backtrackTiles: Set<string>;
  onTileClick?: (pos: Position) => void;
  tileSize?: number;
}

const posKey = (pos: Position): string => `${pos.x},${pos.y}`;

export const MazeGrid = ({
  level,
  playerPosition,
  exploredTiles,
  pathTiles,
  backtrackTiles,
  onTileClick,
  tileSize = 40,
}: MazeGridProps) => {
  return (
    <div 
      className="inline-block rounded-xl overflow-hidden shadow-2xl border-4 border-foreground/20"
      style={{
        boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.3)',
      }}
    >
      {level.grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((tileType, x) => {
            const pos = { x, y };
            const key = posKey(pos);
            const isPlayer = playerPosition.x === x && playerPosition.y === y;
            
            return (
              <MazeTile
                key={key}
                type={tileType}
                position={pos}
                isPlayer={isPlayer}
                isExplored={exploredTiles.has(key)}
                isPath={pathTiles.has(key)}
                isBacktrack={backtrackTiles.has(key)}
                onClick={onTileClick ? () => onTileClick(pos) : undefined}
                size={tileSize}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
