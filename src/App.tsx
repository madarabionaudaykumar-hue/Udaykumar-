/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Activity, Cpu, Wifi, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [bootSequence, setBootSequence] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = [
      "LOADING SYSTEM KERNEL v0.982...",
      "INITIALIZING NEURAL INTERFACE...",
      "SYNCING AUDIO BUFFER...",
      "CALIBRATING GRID COORDINATES...",
      "ACCESS GRANTED: WELCOME USER_001",
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < sequence.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${sequence[current]}`]);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootSequence(false), 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (bootSequence) {
    return (
      <div className="fixed inset-0 bg-glitch-bg flex items-center justify-center font-mono p-8 overflow-hidden">
        <div className="w-full max-w-2xl border border-neon-cyan/30 p-6 relative">
          <div className="absolute -top-3 -left-3 text-neon-cyan"><Cpu className="w-6 h-6" /></div>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-neon-cyan text-sm flex gap-4"
                >
                  <span className="opacity-40">{`> `}</span>
                  <span className={i === logs.length - 1 ? 'glitch-text text-white font-bold' : ''} data-text={log.split('] ')[1]}>
                    {log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.div 
              animate={{ opacity: [0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="w-2 h-4 bg-neon-cyan shrink-0 ml-8 mt-2" 
            />
          </div>
        </div>
        <div className="crt-overlay" />
        <div className="static-noise" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-glitch-bg text-white font-sans relative overflow-x-hidden selection:bg-neon-magenta selection:text-white">
      {/* Background FX */}
      <div className="scanline" />
      <div className="crt-overlay" />
      <div className="static-noise" />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-black/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neon-cyan flex items-center justify-center text-black">
            <Terminal className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-display font-bold glitch-text tracking-tighter" data-text="NEON_GLITCH_OS">
            NEON_GLITCH_OS <span className="text-neon-cyan text-xs font-mono ml-2 opacity-50">v4.2.0</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[10px] font-mono text-neon-cyan/60 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>HEARTBEAT: STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            <span>UPLINK: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3" />
            <span>BUFF: 98%</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-6 flex flex-col lg:flex-row gap-8 justify-center items-center lg:items-start max-w-7xl mx-auto min-h-screen">
        
        {/* Left Side: Game Section */}
        <section className="flex-1 w-full flex flex-col items-center">
          <div className="relative group">
            {/* Decorative corners */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-neon-cyan group-hover:scale-110 transition-transform" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-neon-cyan group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-neon-magenta group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-neon-magenta group-hover:scale-110 transition-transform" />
            
            <SnakeGame />
          </div>
        </section>

        {/* Right Side: Music & Info */}
        <aside className="w-full lg:w-96 flex flex-col gap-6">
          <div className="border border-white/10 p-1">
             <MusicPlayer />
          </div>

          {/* System Terminal Widget */}
          <div className="bg-black/60 border border-neon-cyan/20 p-4 font-mono text-[10px] text-neon-cyan flex flex-col gap-3 shadow-inner">
            <div className="flex justify-between border-b border-neon-cyan/10 pb-2 mb-1">
              <span>SYSTEM_REPORTS</span>
              <span className="animate-pulse">● LIVE</span>
            </div>
            <div className="space-y-1 opacity-60 overflow-hidden">
               <p className="flex justify-between"><span>{">"} MEMORY_USAGE:</span><span>244.1 MB</span></p>
               <p className="flex justify-between"><span>{">"} CPU_FREQ:</span><span>3.42 GHZ</span></p>
               <p className="flex justify-between"><span>{">"} PACKET_LOSS:</span><span>0.002%</span></p>
               <p className="flex justify-between"><span>{">"} GLITCH_LVL:</span><span className="text-neon-magenta">CRITICAL</span></p>
            </div>
            <div className="grid grid-cols-5 gap-1 mt-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className={`h-1 ${Math.random() > 0.5 ? 'bg-neon-cyan/40' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-white/5 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Hardware ID</span>
            <span className="text-xl font-display font-bold text-white/40 tracking-widest">SNK-MUS-999-X</span>
          </div>
        </aside>
      </main>

      {/* Sidebar Labels */}
      <div className="fixed top-1/2 -left-12 rotate-90 text-[8px] font-mono text-neon-cyan opacity-20 uppercase tracking-[1em] pointer-events-none hidden xl:block">
        NEUTRAL_INTERFACE_CONNECTION
      </div>
      <div className="fixed top-1/2 -right-12 -rotate-90 text-[8px] font-mono text-neon-magenta opacity-20 uppercase tracking-[1em] pointer-events-none hidden xl:block">
        BIO_METRIC_DATA_STREAMING
      </div>

      {/* Decorative lines */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-yellow opacity-30 z-50" />
    </div>
  );
}
