import React, { useRef, useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  getSupabaseVideoUrl,
} from '@/lib/supabase';

interface ProtectedVideoPlayerProps {
  videoUrl?: string;
  poster?: string;
  title?: string;
  userEmail?: string;
  isFreePreview?: boolean;
  onEnded?: () => void;
}

export function ProtectedVideoPlayer({
  videoUrl = '',
  poster = '',
  title = 'Clase en Video',
  userEmail = 'alumna@girlsandlaw.pe',
  isFreePreview = false,
  onEnded,
}: ProtectedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showShieldNotice, setShowShieldNotice] = useState(false);

  const isYt = isYouTubeUrl(videoUrl);
  const embedUrl = isYt ? getYouTubeEmbedUrl(videoUrl) : null;
  const directVideoUrl = !isYt && videoUrl ? getSupabaseVideoUrl(videoUrl) : '';

  // Interceptar clic derecho y teclas de inspección dentro del reproductor
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShieldNotice(true);
    setTimeout(() => setShowShieldNotice(false), 2500);
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Bloquear combinaciones comunes para inspeccionar o guardar
    if (
      (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c')) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      e.stopPropagation();
      setShowShieldNotice(true);
      setTimeout(() => setShowShieldNotice(false), 2500);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-pink-200/40 relative aspect-video flex flex-col justify-end select-none focus:outline-none group"
    >
      {/* 1. REPRODUCTOR YOUTUBE CON ESCUDO ANTI-COPIA & ANTI-FUGA */}
      {isYt && embedUrl ? (
        <div className="relative w-full h-full overflow-hidden">
          <iframe
            key={embedUrl}
            src={embedUrl}
            title={title}
            className="w-full h-full aspect-video border-0 pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* ==============================================================
           * ESCUDOS DE SEGURIDAD FÍSICOS (Click-Jacking / Anti-Leak Barriers)
           * ============================================================== */}
          
          {/* A. ESCUDO SUPERIOR (Bloquea Título de YouTube y botón 'Compartir' / 'Copiar Enlace') */}
          <div
            className="absolute top-0 left-0 right-0 h-16 z-20 cursor-default bg-gradient-to-b from-black/60 via-black/20 to-transparent flex items-center justify-between px-5 pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowShieldNotice(true);
              setTimeout(() => setShowShieldNotice(false), 2500);
            }}
            onContextMenu={handleContextMenu}
            title="Video protegido por Girls & Law"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold text-white tracking-wide drop-shadow-md truncate max-w-[280px] sm:max-w-md">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-pink-200 text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E31B6D]" />
              <span>Streaming Protegido</span>
            </div>
          </div>

          {/* B. ESCUDO INFERIOR DERECHO (Bloquea Clic en Logo 'YouTube' / 'Mirar en YouTube') */}
          <div
            className="absolute bottom-0 right-0 w-36 h-14 z-20 cursor-default pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowShieldNotice(true);
              setTimeout(() => setShowShieldNotice(false), 2500);
            }}
            onContextMenu={handleContextMenu}
            title="Contenido privado de la academia"
          />

          {/* C. ESCUDO INFERIOR IZQUIERDO (Bloquea ícono de enlace / cadena) */}
          <div
            className="absolute bottom-0 left-0 w-24 h-14 z-20 cursor-default pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowShieldNotice(true);
              setTimeout(() => setShowShieldNotice(false), 2500);
            }}
            onContextMenu={handleContextMenu}
          />
        </div>
      ) : directVideoUrl ? (
        /* 2. REPRODUCTOR DIRECTO HTML5 (SUPABASE STORAGE MP4) - 100% CERO YOUTUBE */
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={directVideoUrl}
            poster={poster}
            playsInline
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={handleContextMenu}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              onEnded?.();
            }}
            className="w-full h-full object-contain"
          >
            Tu navegador no soporta streaming HTML5 seguro.
          </video>
        </div>
      ) : (
        /* 3. SIN VIDEO ASIGNADO */
        <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-6 text-center bg-[#150B14]">
          <div className="w-14 h-14 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3 shadow-lg">
            <Video className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-white">Esta lección aún no tiene video asignado</p>
          <p className="text-xs text-pink-200/60 mt-1 max-w-sm">
            Edita el curso para agregar el enlace de YouTube o subir el archivo de video.
          </p>
        </div>
      )}

      {/* ==============================================================
       * MARCA DE AGUA FORENSE DINÁMICA ANTI-PIRATERÍA (Forensic Watermark)
       * Inmune a grabaciones de pantalla: estampa la identidad de la alumna
       * ============================================================== */}
      <div className="absolute top-16 right-4 z-30 pointer-events-none select-none opacity-40 hover:opacity-80 transition-opacity">
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/10 text-white text-[10px] font-mono flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-3 h-3 text-[#E31B6D]" />
          <span>Licencia: {userEmail}</span>
        </div>
      </div>

      {/* Marca de agua secundaria sutil en esquina inferior izquierda sobre barra */}
      <div className="absolute bottom-16 left-4 z-30 pointer-events-none select-none opacity-30">
        <span className="text-[9px] font-mono tracking-widest uppercase text-white/70 bg-black/40 px-2 py-0.5 rounded">
          Girls &amp; Law · DRM Activo
        </span>
      </div>

      {/* ==============================================================
       * AVISO TOAST FLOTANTE AL INTENTAR CLIC DERECHO O COPIAR
       * ============================================================== */}
      {showShieldNotice && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-xs flex items-center justify-center p-6 transition-all animate-in fade-in">
          <div className="bg-[#2A1828] border border-pink-500/50 rounded-2xl p-5 text-center max-w-xs shadow-2xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#E31B6D]/20 text-[#E31B6D] flex items-center justify-center mx-auto border border-[#E31B6D]/40">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-serif italic font-bold text-white text-sm">
              Contenido Protegido por Licencia
            </h4>
            <p className="text-[11px] text-pink-200/80 leading-relaxed">
              La copia de enlaces, descarga y distribución de esta masterclass están restringidas. La reproducción es exclusiva para tu cuenta de alumna.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
