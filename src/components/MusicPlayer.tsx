import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "DEFRAGMENTATION_VIBES",
    artist: "CORE_PROCESSOR_AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "NEURAL_SYNAPSE_BEAT",
    artist: "COGNITIVE_LLM_v4",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "CIRCUIT_BREAKER_JAM",
    artist: "VOLTAGE_VALLEY_GEN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div className="w-full max-w-md bg-black/40 border-l border-r border-neon-magenta/30 p-6 flex flex-col gap-6 relative overflow-hidden">
      <audio ref={audioRef} src={currentTrack.url} />
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-magenta/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-20 h-20 bg-neon-magenta/20 border-2 border-neon-magenta pixel-border flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,0,251,0.2)]">
          <Music2 className="w-10 h-10 text-neon-magenta animate-pulse" />
        </div>
        <div className="flex flex-col gap-1 overflow-hidden">
          <h3 className="text-xl font-display font-bold text-neon-magenta truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-xs font-mono text-neon-cyan opacity-70 tracking-widest uppercase">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Simulated Visualizer */}
      <div className="h-12 flex items-end gap-1 px-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: isPlaying ? [10, Math.random() * 40 + 8, 10] : 4
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5 + Math.random() * 0.5,
              ease: "linear"
            }}
            className="flex-1 bg-gradient-to-t from-neon-magenta/20 to-neon-magenta"
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 relative cursor-pointer group">
          <div 
            className="absolute h-full bg-neon-magenta shadow-[0_0_10px_rgba(255,0,251,0.8)]" 
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute h-4 w-1 bg-white -top-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="text-neon-cyan hover:text-white transition-colors group">
              <SkipBack className="w-6 h-6 group-active:scale-90" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 bg-neon-magenta/10 border-2 border-neon-magenta rounded-full flex items-center justify-center text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all shadow-[0_0_15px_rgba(255,0,251,0.3)] active:scale-95"
            >
              {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current translate-x-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-neon-cyan hover:text-white transition-colors group">
              <SkipForward className="w-6 h-6 group-active:scale-90" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-neon-cyan/40">
            <Volume2 className="w-4 h-4" />
            <div className="w-20 h-1 bg-white/5 relative">
              <div className="absolute h-full bg-neon-cyan/40 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 font-mono text-[9px] text-neon-magenta/40 flex justify-between uppercase tracking-tighter">
        <span>AUDIO_CHNL_01: L_R_STEREO</span>
        <span>BR_44.1KHZ</span>
      </div>
    </div>
  );
}
