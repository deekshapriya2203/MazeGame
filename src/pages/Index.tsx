import { useMazeGame } from '../hooks/useMazeGame';
import { MazeGrid } from '../components/maze/MazeGrid';
import { GameControls } from '../components/maze/GameControls';
import { AlgorithmPanel } from '../components/maze/AlgorithmPanel';
import { LevelSelect } from '../components/maze/LevelSelect';
import { VictoryOverlay } from '../components/maze/VictoryOverlay';
import { Helmet } from 'react-helmet';
import { Brain, Gamepad2 } from 'lucide-react';

const Index = () => {
  const {
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
    stats,
    showVictory,
    hasNextLevel,
    levels,
    setMode,
    setSpeed,
    selectLevel,
    startGame,
    resetGame,
    handleTileClick,
    nextLevel,
    setShowVictory,
  } = useMazeGame();

  return (
    <>
      <Helmet>
        <title>Grid Maze AI Explorer - Interactive Pathfinding Visualization</title>
        <meta 
          name="description" 
          content="Learn AI pathfinding algorithms through an interactive maze game. Play as human or watch A* and Backtracking algorithms solve mazes step-by-step." 
        />
      </Helmet>

      <main className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Brain className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Grid Maze AI Explorer
              </h1>
              <Gamepad2 className="w-10 h-10 text-accent" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Play, learn, and watch AI algorithms solve maze puzzles step-by-step
            </p>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel - Level Select */}
            <aside className="lg:col-span-3 order-2 lg:order-1">
              <LevelSelect
                levels={levels}
                currentLevelId={currentLevel.id}
                completedLevels={completedLevels}
                onSelectLevel={selectLevel}
              />
            </aside>

            {/* Center - Maze Grid */}
            <section className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {currentLevel.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentLevel.description}
                </p>
              </div>

              <div className="transform transition-transform hover:scale-[1.02]">
                <MazeGrid
                  level={currentLevel}
                  playerPosition={playerPosition}
                  exploredTiles={exploredTiles}
                  pathTiles={pathTiles}
                  backtrackTiles={backtrackTiles}
                  onTileClick={mode === 'human' && state === 'playing' ? handleTileClick : undefined}
                  tileSize={Math.min(40, Math.floor(400 / Math.max(currentLevel.grid[0].length, currentLevel.grid.length)))}
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-game-start" />
                  <span>Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-game-goal" />
                  <span>Goal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-game-wall" />
                  <span>Wall</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-game-trap" />
                  <span>Trap</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-game-explored" />
                  <span>Explored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-game-path" />
                  <span>Path</span>
                </div>
              </div>
            </section>

            {/* Right Panel - Controls & Algorithm Info */}
            <aside className="lg:col-span-3 order-3 space-y-4">
              <GameControls
                mode={mode}
                speed={speed}
                state={state}
                onModeChange={setMode}
                onSpeedChange={setSpeed}
                onStart={startGame}
                onReset={resetGame}
              />
              
              <AlgorithmPanel
                mode={mode}
                steps={algorithmSteps}
                currentStepIndex={currentStepIndex}
                stats={stats}
              />
            </aside>
          </div>
        </div>
      </main>

      <VictoryOverlay
        show={showVictory}
        stats={stats}
        onNextLevel={nextLevel}
        onReplay={() => {
          setShowVictory(false);
          resetGame();
        }}
        hasNextLevel={hasNextLevel}
      />
    </>
  );
};

export default Index;
