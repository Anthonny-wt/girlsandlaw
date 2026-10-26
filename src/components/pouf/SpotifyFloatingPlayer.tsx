import { useState, useEffect, useRef } from 'react';
import { SpotifyIcon } from '@/components/ui/SocialIcons';

interface PodcastEpisode {
  id: number;
  title: string;
  show: string;
  duration: string;
  durationSeconds: number;
  coverSrc: string;
  spotifyUrl: string;
}

const EPISODES: PodcastEpisode[] = [
  {
    id: 1,
    title: 'Ep. 04: Anatomía de un Alegato Inolvidable',
    show: 'Girls & Law Oficial · Roxana Rivera',
    duration: '22:57',
    durationSeconds: 1377,
    coverSrc: '/logogirlsandlaw-nobg.webp',
    spotifyUrl: 'https://open.spotify.com',
  },
  {
    id: 2,
    title: 'Ep. 03: Cómo Litigar Sin Pedir Disculpas',
    show: 'Girls & Law Oficial · Roxana Rivera',
    duration: '18:45',
    durationSeconds: 1125,
    coverSrc: '/logogirlsandlaw-nobg.webp',
    spotifyUrl: 'https://open.spotify.com',
  },
  {
    id: 3,
    title: 'Ep. 02: El Triángulo de Hierro Procesal',
    show: 'Girls & Law Oficial · Roxana Rivera',
    duration: '26:10',
    durationSeconds: 1570,
    coverSrc: '/logogirlsandlaw-nobg.webp',
    spotifyUrl: 'https://open.spotify.com',
  },
];

export function SpotifyFloatingPlayer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [episodeIndex, setEpisodeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(76); // 01:16
  const playerRef = useRef<HTMLDivElement>(null);

  const episode = EPISODES[episodeIndex];

  // Listen to custom toggle events from navbar or other buttons
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };
    const handleOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener('toggle-spotify-podcast', handleToggle);
    window.addEventListener('open-spotify-podcast', handleOpen);

    return () => {
      window.removeEventListener('toggle-spotify-podcast', handleToggle);
      window.removeEventListener('open-spotify-podcast', handleOpen);
    };
  }, []);

  // Playback timer simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= episode.durationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, episode.durationSeconds]);

  // Click outside to close (optional convenience)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        playerRef.current &&
        !playerRef.current.contains(event.target as Node)
      ) {
        // Only close if not clicking a navbar button with data-podcast-trigger
        const target = event.target as HTMLElement;
        if (!target.closest('[data-podcast-trigger]')) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, (currentTime / episode.durationSeconds) * 100);
  const remainingSeconds = Math.max(0, episode.durationSeconds - currentTime);

  const nextEpisode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEpisodeIndex((prev) => (prev + 1) % EPISODES.length);
    setCurrentTime(0);
  };

  const prevEpisode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEpisodeIndex((prev) => (prev - 1 + EPISODES.length) % EPISODES.length);
    setCurrentTime(0);
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const skipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTime((prev) => Math.min(episode.durationSeconds, prev + 15));
  };

  const skipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTime((prev) => Math.max(0, prev - 15));
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const targetSeconds = (val / 100) * episode.durationSeconds;
    setCurrentTime(Math.round(targetSeconds));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={playerRef}
      className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-50 select-none animate-in fade-in slide-in-from-bottom-6 zoom-in-95 duration-200"
    >
      <div
        className="w-[calc(100vw-24px)] sm:w-[390px] max-w-[420px] rounded-[26px] sm:rounded-[30px] bg-[#0F0914]/95 backdrop-blur-xl text-white p-4 sm:p-5 shadow-2xl border border-white/15"
        style={{
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
        role="region"
        aria-label="Reproductor de podcast de Girls & Law"
      >
        {/* Top Header: Progress Ring + Podcast Badge + Equalizer + Close button */}
        <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {/* Green Circular Progress Ring */}
            <div className="relative w-5 h-5 flex items-center justify-center">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#2E1F3B"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#1DB954"
                  strokeWidth="4"
                  strokeDasharray="88"
                  strokeDashoffset={88 - (88 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            </div>

            <span className="font-bold text-[11px] text-white/90 font-pouf">
              Girls &amp; Law · Spotify Original
            </span>
          </div>

          {/* Equalizer animation + Close button */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-end gap-0.5 h-3.5" title="Equalizador en vivo">
              <span
                className={`w-0.5 bg-[#1DB954] rounded-full transition-all duration-300 ${
                  isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5'
                }`}
              />
              <span
                className={`w-0.5 bg-[#1DB954] rounded-full transition-all duration-300 ${
                  isPlaying ? 'h-2 animate-bounce' : 'h-2.5'
                }`}
              />
              <span
                className={`w-0.5 bg-[#1DB954] rounded-full transition-all duration-300 ${
                  isPlaying ? 'h-4 animate-pulse' : 'h-1'
                }`}
              />
              <span
                className={`w-0.5 bg-[#1DB954] rounded-full transition-all duration-300 ${
                  isPlaying ? 'h-2.5 animate-bounce' : 'h-3'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              aria-label="Cerrar reproductor"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Middle: Cover Art + Episode Details + Prev/Next Arrows */}
        <div className="flex items-center gap-3 my-3.5">
          {/* Prev Episode Arrow */}
          <button
            type="button"
            onClick={prevEpisode}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white shrink-0 text-xs transition-all cursor-pointer active:scale-90"
            aria-label="Episodio anterior"
          >
            ‹
          </button>

          {/* Cover Art with subtle glow */}
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-white/5 border border-pink-400/30 shadow-md">
            <img
              src={episode.coverSrc}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Episode Info + Link pill */}
          <div className="flex-1 min-w-0">
            <h4 className="font-pouf font-bold text-sm text-white leading-tight truncate">
              {episode.title}
            </h4>
            <p className="text-[11px] text-white/60 truncate mt-0.5">
              {episode.show}
            </p>

            <a
              href={episode.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-black text-[9px] uppercase tracking-wider transition-transform active:scale-95 shadow-xs"
            >
              <SpotifyIcon className="w-3 h-3 text-black" />
              <span>Escuchar en Spotify</span>
            </a>
          </div>

          {/* Next Episode Arrow */}
          <button
            type="button"
            onClick={nextEpisode}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white shrink-0 text-xs transition-all cursor-pointer active:scale-90"
            aria-label="Siguiente episodio"
          >
            ›
          </button>
        </div>

        {/* Progress Bar / Scrubber */}
        <div className="mt-2">
          <div className="relative flex items-center group">
            <input
              type="range"
              min={0}
              max={100}
              value={progressPercent}
              onChange={handleScrubberChange}
              aria-label="Barra de tiempo del episodio"
              className="w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer accent-[#1DB954]"
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-white/50 mt-1 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remainingSeconds)}</span>
          </div>
        </div>

        {/* Controls Row: Chat icon, -15s, Play/Pause, +15s, Spotify brand */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('faq');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Ver preguntas frecuentes"
            aria-label="Ver preguntas frecuentes"
            className="w-7 h-7 rounded-full text-white/50 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            💬
          </button>

          <div className="flex items-center gap-4">
            {/* -15 Seconds */}
            <button
              type="button"
              onClick={skipBackward}
              aria-label="Retroceder 15 segundos"
              className="w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90"
              title="Retroceder 15s"
            >
              <span className="text-[13px] font-bold">⏪</span>
            </button>

            {/* Play / Pause Primary Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar episodio' : 'Reproducir episodio'}
              className="w-10 h-10 rounded-full bg-white text-ink hover:bg-[#1DB954] hover:text-black flex items-center justify-center text-base font-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* +15 Seconds */}
            <button
              type="button"
              onClick={skipForward}
              aria-label="Adelantar 15 segundos"
              className="w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90"
              title="Adelantar 15s"
            >
              <span className="text-[13px] font-bold">⏩</span>
            </button>
          </div>

          <a
            href={episode.spotifyUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir Spotify Oficial"
            title="Abrir Spotify Oficial"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#1DB954] hover:scale-110 transition-transform"
          >
            <SpotifyIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
