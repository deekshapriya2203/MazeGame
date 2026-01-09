import { MazeLevel, TileType } from './types';

// Legend: G=grass, W=wall, T=trap, S=start, E=goal(end)
const parseMaze = (template: string): TileType[][] => {
  const charMap: Record<string, TileType> = {
    'G': 'grass',
    'W': 'wall',
    'T': 'trap',
    'S': 'start',
    'E': 'goal',
    'C': 'checkpoint',
  };
  
  return template.trim().split('\n').map(row => 
    row.trim().split('').map(char => charMap[char] || 'grass')
  );
};

export const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 'level-1',
    name: 'First Steps',
    difficulty: 'easy',
    description: 'A simple path to learn the basics.',
    grid: parseMaze(`
SGGGE
GWWWG
GGGGG
GWWWG
GGGGG
    `),
    start: { x: 0, y: 0 },
    goal: { x: 4, y: 0 },
  },
  {
    id: 'level-2',
    name: 'The Winding Path',
    difficulty: 'easy',
    description: 'Navigate through a serpentine maze.',
    grid: parseMaze(`
SGGGGWG
WWWWGWG
GGGGGWG
GWWWWWG
GGGGGGG
GWWWWWW
GGGGGGE
    `),
    start: { x: 0, y: 0 },
    goal: { x: 6, y: 6 },
  },
  {
    id: 'level-3',
    name: 'Trap Alley',
    difficulty: 'medium',
    description: 'Watch out for the dangerous traps!',
    grid: parseMaze(`
SGGGGGGG
WTWTWTWE
GGGGGGGG
WTWTWTWE
GGGGGGGG
    `),
    start: { x: 0, y: 0 },
    goal: { x: 7, y: 1 },
  },
  {
    id: 'level-4',
    name: 'The Labyrinth',
    difficulty: 'medium',
    description: 'A classic labyrinth with multiple paths.',
    grid: parseMaze(`
SGWGGGGGGG
GGWGWWWWWG
WWWGWGGGGG
GGGGGWGWWW
GWWWWWGWGG
GWGGGGGWGG
GWGWWWWWGG
GWGGGGGGGW
GWWWWWWWGW
GGGGGGGGGE
    `),
    start: { x: 0, y: 0 },
    goal: { x: 9, y: 9 },
  },
  {
    id: 'level-5',
    name: 'Deadly Choices',
    difficulty: 'medium',
    description: 'Choose your path wisely - traps await the careless.',
    grid: parseMaze(`
SGGWGGGG
WTWGTWGG
GGGWGGWG
GWWWGTWG
GGGGTGGG
WTWWWWWG
GGGGGGTE
    `),
    start: { x: 0, y: 0 },
    goal: { x: 7, y: 6 },
  },
  {
    id: 'level-6',
    name: 'The Spiral',
    difficulty: 'hard',
    description: 'A spiral path that tests your pathfinding skills.',
    grid: parseMaze(`
SGGGGGGGGGG
WWWWWWWWWWG
GGGGGGGGGWG
GWWWWWWWGWG
GWGGGGGWGWG
GWGWWWGWGWG
GWGWEGWGWWG
GWGWWWGGGGG
GWGGGGGWWWW
GWWWWWWGGGG
GGGGGGGGWWE
    `),
    start: { x: 0, y: 0 },
    goal: { x: 10, y: 10 },
  },
  {
    id: 'level-7',
    name: 'Trap Maze',
    difficulty: 'hard',
    description: 'Navigate through a maze filled with deadly traps.',
    grid: parseMaze(`
SGGTGGGGTGG
WTWGWWWTWTG
GTGGGTGGGWG
GWWTWGWTWGG
GGGWGGGWGTG
WTWGWTWGWWG
GTGGGGGGTGG
GWWWWWTWGWW
GGGGTGGGGTG
WTWGWWWGWWG
GTGGGTGGGGE
    `),
    start: { x: 0, y: 0 },
    goal: { x: 10, y: 10 },
  },
  {
    id: 'level-8',
    name: 'The Ultimate Challenge',
    difficulty: 'hard',
    description: 'Only the best can find their way through this maze.',
    grid: parseMaze(`
SGGWGGGWGGGWGG
WTWGWTWGWTWGWG
GGGWGTGWGGGWGG
GWWWGWWWGWWWGW
GGGTGGGTGGGTGG
WTWGWTWGWTWGWG
GGGWGGGWGGGWGG
GWWWGWWWGWWWGW
GGGGGGGGGGGGGW
WTWWWTWWWTWWWG
GGGGGGGGGGGGGW
GWWWWWWWWWWWWG
GGGGGGGGGGGGGW
WGWTWTWTWTWGWG
GGGGGGGGGGGGGE
    `),
    start: { x: 0, y: 0 },
    goal: { x: 13, y: 14 },
  },
];
