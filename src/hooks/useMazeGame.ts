import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  MazeLevel, 
  Position, 
  GameMode, 
  GameState, 
  AnimationSpeed,
  AlgorithmStep,
  AlgorithmResult,
  SPEED_VALUES 
} from '../lib/maze/types';
import { aStarSearch, backtrackingSearch } from '../lib/maze/algorithms';
import { MAZE_LEVELS } from '../lib/maze/levels';
import { toast } from 'sonner';

const posKey = (pos: Position): string => `${pos.x},${pos.y}`;

export const useMazeGame = () => {
  const [currentLevel, setCurrentLevel] = useState<MazeLevel>(MAZE_LEVELS[0]);
  const [playerPosition, setPlayerPosition] = useState<Position>(MAZE_LEVELS[0].start);
  const [mode, setMode] = useState<GameMode>('human');
  const [state, setState] = useState<GameState>('idle');
  const [speed, setSpeed] = useState<AnimationSpeed>('normal');
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  
  const [exploredTiles, setExploredTiles] = useState<Set<string>>(new Set());
  const [pathTiles, setPathTiles] = useState<Set<string>>(new Set());
  const [backtrackTiles, setBacktrackTiles] = useState<Set<string>>(new Set());
  
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null);
  
  const [showVictory, setShowVictory] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const stats = {
    explored: exploredTiles.size,
    pathLength: pathTiles.size,
    totalCost: algorithmResult?.totalCost ?? pathTiles.size,
  };

  const resetGame = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setPlayerPosition(currentLevel.start);
    setState('idle');
    setExploredTiles(new Set());
    setPathTiles(new Set());
    setBacktrackTiles(new Set());
    setAlgorithmSteps([]);
    setCurrentStepIndex(-1);
    setAlgorithmResult(null);
    setShowVictory(false);
  }, [currentLevel]);

  const selectLevel = useCallback((level: MazeLevel) => {
    setCurrentLevel(level);
    setPlayerPosition(level.start);
    setState('idle');
    setExploredTiles(new Set());
    setPathTiles(new Set());
    setBacktrackTiles(new Set());
    setAlgorithmSteps([]);
    setCurrentStepIndex(-1);
    setAlgorithmResult(null);
    setShowVictory(false);
  }, []);

  const nextLevel = useCallback(() => {
    const currentIndex = MAZE_LEVELS.findIndex(l => l.id === currentLevel.id);
    if (currentIndex < MAZE_LEVELS.length - 1) {
      selectLevel(MAZE_LEVELS[currentIndex + 1]);
    }
  }, [currentLevel, selectLevel]);

  const hasNextLevel = MAZE_LEVELS.findIndex(l => l.id === currentLevel.id) < MAZE_LEVELS.length - 1;

  const isValidMove = useCallback((from: Position, to: Position): boolean => {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    // Must be adjacent (not diagonal)
    if (dx + dy !== 1) return false;
    
    // Must be within bounds
    if (to.x < 0 || to.x >= currentLevel.grid[0].length) return false;
    if (to.y < 0 || to.y >= currentLevel.grid.length) return false;
    
    // Must not be wall or trap
    const tileType = currentLevel.grid[to.y][to.x];
    return tileType !== 'wall' && tileType !== 'trap';
  }, [currentLevel]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (state !== 'playing') return;
    
    const deltas = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    
    const delta = deltas[direction];
    const newPos = { x: playerPosition.x + delta.x, y: playerPosition.y + delta.y };
    
    if (isValidMove(playerPosition, newPos)) {
      setPlayerPosition(newPos);
      setPathTiles(prev => new Set([...prev, posKey(newPos)]));
      
      // Check for win
      if (newPos.x === currentLevel.goal.x && newPos.y === currentLevel.goal.y) {
        setState('solved');
        setCompletedLevels(prev => new Set([...prev, currentLevel.id]));
        setShowVictory(true);
        toast.success('🎉 Level Complete!');
      }
    }
  }, [state, playerPosition, isValidMove, currentLevel]);

  const handleTileClick = useCallback((pos: Position) => {
    if (state !== 'playing' || mode !== 'human') return;
    
    if (isValidMove(playerPosition, pos)) {
      setPlayerPosition(pos);
      setPathTiles(prev => new Set([...prev, posKey(pos)]));
      
      if (pos.x === currentLevel.goal.x && pos.y === currentLevel.goal.y) {
        setState('solved');
        setCompletedLevels(prev => new Set([...prev, currentLevel.id]));
        setShowVictory(true);
        toast.success('🎉 Level Complete!');
      }
    }
  }, [state, mode, playerPosition, isValidMove, currentLevel]);

  const runAlgorithm = useCallback((algorithm: 'astar' | 'backtrack') => {
    const result = algorithm === 'astar' 
      ? aStarSearch(currentLevel) 
      : backtrackingSearch(currentLevel);
    
    setAlgorithmResult(result);
    setAlgorithmSteps(result.steps);
    setState('solving');
    
    let stepIndex = 0;
    
    const animate = () => {
      if (stepIndex >= result.steps.length) {
        // Animation complete, show path
        if (result.success) {
          setPathTiles(new Set(result.path.map(posKey)));
          setState('solved');
          setCompletedLevels(prev => new Set([...prev, currentLevel.id]));
          setShowVictory(true);
          toast.success('🎉 AI solved the maze!');
        } else {
          setState('failed');
          toast.error('No path found!');
        }
        return;
      }
      
      const step = result.steps[stepIndex];
      setCurrentStepIndex(stepIndex);
      setPlayerPosition(step.position);
      
      if (step.type === 'explore') {
        setExploredTiles(prev => new Set([...prev, posKey(step.position)]));
      } else if (step.type === 'backtrack') {
        setBacktrackTiles(prev => new Set([...prev, posKey(step.position)]));
      }
      
      stepIndex++;
      animationRef.current = setTimeout(animate, SPEED_VALUES[speed]);
    };
    
    animate();
  }, [currentLevel, speed]);

  const startGame = useCallback(() => {
    resetGame();
    
    if (mode === 'human') {
      setState('playing');
      setPathTiles(new Set([posKey(currentLevel.start)]));
      toast.info('Use arrow keys or click tiles to move!');
    } else if (mode === 'ai-astar') {
      runAlgorithm('astar');
    } else if (mode === 'ai-backtrack') {
      runAlgorithm('backtrack');
    } else if (mode === 'compare') {
      // Compare mode is handled separately
      setState('solving');
    }
  }, [mode, currentLevel, resetGame, runAlgorithm]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state !== 'playing' || mode !== 'human') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, mode, movePlayer]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return {
    currentLevel,
    playerPosition,
    mode,
    state,
    speed,
    completedLevels,
    exploredTiles,
    pathTiles,
    backtrackTiles,
    algorithmSteps,
    currentStepIndex,
    algorithmResult,
    stats,
    showVictory,
    hasNextLevel,
    levels: MAZE_LEVELS,
    
    setMode,
    setSpeed,
    selectLevel,
    startGame,
    resetGame,
    handleTileClick,
    nextLevel,
    setShowVictory,
  };
};
