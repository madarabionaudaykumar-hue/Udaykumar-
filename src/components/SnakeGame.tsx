import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const gameRef = useRef<HTMLDivElement>(null);

  const getRandomFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
      case 'Enter':
        if (isGameOver) resetGame();
        else setIsPaused(!isPaused);
        break;
    }
  }, [direction, isGameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return;
      }

      // Self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(getRandomFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [snake, direction, food, isGameOver, isPaused, getRandomFood]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 relative z-20">
      <div className="flex justify-between w-full max-w-[400px] mb-4 font-mono text-neon-cyan uppercase">
        <div className="flex flex-col">
          <span className="text-xs opacity-50">Score</span>
          <span className="text-2xl font-bold">{score.toString().padStart(5, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs opacity-50">Status</span>
          <span className={`text-2xl font-bold ${isPaused ? 'text-neon-yellow' : 'text-neon-cyan'}`}>
            {isGameOver ? 'HALTED' : isPaused ? 'IDLE' : 'RUNNING'}
          </span>
        </div>
      </div>

      <div 
        ref={gameRef}
        className="relative bg-black/80 border-2 border-neon-cyan p-1 pixel-border w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] shadow-[0_0_30px_rgba(0,251,255,0.2)]"
      >
        <div className="grid grid-cols-20 grid-rows-20 w-full h-full gap-px">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full ${
                  isHead ? 'bg-neon-cyan neon-glow-cyan z-10' :
                  isSnake ? 'bg-neon-cyan/60' :
                  isFood ? 'bg-neon-magenta animate-pulse neon-glow-magenta' : 
                  'bg-white/5'
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-5xl font-display font-bold text-neon-magenta glitch-text mb-4" data-text="FATAL ERROR">FATAL ERROR</h2>
                  <p className="text-neon-cyan font-mono mb-8 italic">CORE SEGMENTATION FAULT AT ADDRESS {score * 16}</p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 border-2 border-neon-cyan bg-neon-cyan/10 text-neon-cyan font-mono hover:bg-neon-cyan hover:text-black transition-all uppercase tracking-widest active:scale-95"
                  >
                    REBOOT SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-5xl font-display font-bold text-neon-yellow mb-4">SYSTEM IDLE</h2>
                  <p className="text-neon-cyan font-mono mb-8 italic opacity-60">WAITING FOR INPUT...</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 border-2 border-neon-yellow bg-neon-yellow/10 text-neon-yellow font-mono hover:bg-neon-yellow hover:text-black transition-all uppercase tracking-widest active:scale-95"
                  >
                    RESUME OPS
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-4 font-mono text-[10px] text-neon-cyan opacity-40 uppercase tracking-[0.2em]">
        <span>[ARROW_KEYS] NAVIGATE</span>
        <span>|</span>
        <span>[ENTER] PAUSE/RESUME</span>
      </div>
    </div>
  );
}
