import { useState, useEffect } from 'react';
import { Badge } from './media';
import { Heading, Highlight, Text } from './text';
import { Button } from './Button';
import { Card } from './surface';
import { FounderHeroCard } from './FounderHeroCard';

export function PoufHero() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(23); // percentage
  const [currentChapter, setCurrentChapter] = useState<string>('Capítulo 2: Presencia Escénica & Voz');

  // Simulated video playback when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section id="trailer" className="pt-6 pb-16 sm:pt-10 sm:pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 2-Column Hero Grid: Left Content + Right Founder Card (from user design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Masterclass Headline & Value Proposition */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          {/* 1st-Pouf Pill Badge */}
          <div className="flex justify-center lg:justify-start">
            <Badge tone="pink" className="cushion-control-active">
              ✦ Masterclass Exclusiva · Nueva Edición 2026
            </Badge>
          </div>

          {/* 1st-Pouf Heading with Highlights */}
          <Heading level={1} className="font-black text-ink text-left">
            Litigio de <Highlight tone="pink">Alto Impacto</Highlight>.<br />
            <span className="font-serif italic font-normal">Poder,</span>{' '}
            <Highlight tone="yellow">Argumentación</Highlight> &amp; Autenticidad.
          </Heading>

          {/* Description in friendly 1st-Pouf Text */}
          <div className="max-w-xl mx-auto lg:mx-0">
            <Text size="lg" muted className="font-bold text-muted">
              Aprende el arte de persuadir en tribunales, construir una teoría del caso
              imbatible y proyectar una presencia magnética. La formación clínica de élite que la
              facultad nunca te enseñó.
            </Text>
          </div>

          {/* Puffy Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Button
              size="lg"
              tone="pink"
              onClick={() => {
                document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Comenzar Masterclass →
            </Button>
            <Button
              size="lg"
              variant="quiet"
              onClick={() => {
                setIsPlaying(true);
                document.getElementById('video-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {isPlaying ? '⏸ Pausar muestra' : '▶ Ver clase de muestra'}
            </Button>
          </div>

          {/* Guarantee & Pricing footnote */}
          <p className="text-xs font-bold text-muted">
            Inversión desde $39 USD/mes · 14 días de garantía incondicional
          </p>

          {/* Trust Highlights Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-black text-ink">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white cushion-row">
              🏛️ Salas de audiencia reales
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white cushion-row">
              📄 15 modelos en Word
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white cushion-row">
              👑 Mentoría con Roxana Rivera
            </span>
          </div>
        </div>

        {/* Right Column: Founder / Entrepreneur Card (Matching reference uploaded by user) */}
        <div className="lg:col-span-5 flex justify-center">
          <FounderHeroCard
            name="Roxana Rivera"
            role="FUNDADORA & DIRECTORA LEGAL"
            bio="Redefiniendo el ejercicio del derecho desde la autenticidad, la excelencia procesal y la sororidad para juristas de alto impacto."
            photoSrc="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
          />
        </div>
      </div>

      {/* Cinema Player Section Divider */}
      <div className="mt-16 sm:mt-20 pt-8 border-t border-pink-200/60 text-center">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#E31B6D]">
          Producción 4K HDR · Masterclass Cinema Pro
        </span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-ink">
          Experimenta una clase maestra desde adentro
        </h2>
      </div>

      {/* POUF Cinema Player Card */}
      <div id="video-card" className="mt-8 max-w-5xl mx-auto text-center">
        <Card variant="flush" motion="lift" className="overflow-hidden border border-pink-200/80 shadow-2xl">
          {/* Card Head (Pouf window bar) */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#FFF5F9] border-b border-pink-100">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-pink cushion-control"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow cushion-control"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-mint cushion-control"></span>
              <span className="ml-3 font-mono text-xs font-black text-muted hidden sm:inline">
                masterclass.girls-and-law.com/cinema-pro
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isPlaying && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-[#E31B6D] text-white text-[10px] font-black animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span> EN REPRODUCCIÓN
                </span>
              )}
              <Badge tone="yellow">4K HDR · CINEMA PRO</Badge>
            </div>
          </div>

          {/* Video Preview Canvas with Interactive Player */}
          <div className="relative aspect-video w-full bg-gradient-to-br from-[#FFF0F6] via-[#FFF9FB] to-[#FCE8F3] flex items-center justify-center p-6 sm:p-12 overflow-hidden select-none">
            {/* Background Studio Graphic Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-pink blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple blur-3xl"></div>
            </div>

            {isPlaying ? (
              /* ACTIVE VIDEO SIMULATION SCREEN */
              <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 sm:p-8">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-pill bg-white/90 text-ink text-xs font-black cushion-control">
                    Sesión Clínica 02: Salas de Audiencia Reales
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(false)}
                    className="px-3 py-1 rounded-pill bg-white/80 hover:bg-white text-ink text-xs font-black cursor-pointer cushion-control"
                  >
                    Cerrar Reproductor ✕
                  </button>
                </div>

                {/* Subtitle / Caption Prompt */}
                <div className="my-auto max-w-xl mx-auto text-center space-y-3">
                  <div className="inline-block p-4 sm:p-6 rounded-card bg-white/90 backdrop-blur-md cushion-card border border-pink-100">
                    <p className="font-serif italic text-base sm:text-xl text-ink leading-relaxed font-bold">
                      &ldquo;Tu primer alegato no es un resumen de la demanda; es la primera vez que el juez mira el caso a través de tus propios ojos.&rdquo;
                    </p>
                    <p className="text-xs font-black text-[#E31B6D] mt-2 uppercase tracking-wider font-pouf">
                      — Roxana Rivera · Fundadora de Girls &amp; Law
                    </p>
                  </div>
                </div>

                {/* Floating controls in playing mode */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-5 py-2.5 rounded-pill bg-pink text-ink font-black text-xs cushion-control active:cushion-control-active cursor-pointer"
                  >
                    {isPlaying ? '⏸ Pausar' : '▶ Reanudar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentChapter('Capítulo 3: La Técnica del Contra-Interrogatorio');
                      setProgress(55);
                    }}
                    className="px-4 py-2 rounded-pill bg-white text-ink font-bold text-xs cushion-control hover:bg-pink/20 cursor-pointer"
                  >
                    Siguiente Capítulo →
                  </button>
                </div>
              </div>
            ) : (
              /* RESTING POSTER WITH CLAY PLAY BUTTON */
              <div className="text-center flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Reproducir clase muestra en 4K"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink text-ink cushion-control active:cushion-control-active active:translate-y-[2px] transition-transform duration-150 flex items-center justify-center cursor-pointer group hover:scale-105"
                >
                  <svg className="w-9 h-9 fill-current ml-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>

                <h3 className="mt-5 font-black text-xl sm:text-2xl text-ink font-pouf">
                  Muestra Especial: Anatomía de un Alegato Inolvidable
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-bold text-muted max-w-md">
                  18 minutos de clase maestra grabada en sala de audiencias real con Roxana Rivera
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#E31B6D] bg-white px-3 py-1 rounded-pill cushion-control">
                    ▶ Haz clic para reproducir muestra gratuita
                  </span>
                </div>
              </div>
            )}

            {/* Timeline Scrub Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-white/85 backdrop-blur-md border-t border-pink-100 flex items-center justify-between text-xs font-bold text-ink">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="font-black text-[#E31B6D] hover:underline cursor-pointer"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <span className="text-[#E31B6D] font-mono text-xs">
                  {isPlaying ? `04:${String(Math.floor(progress * 0.18)).padStart(2, '0')}` : '04:12'}
                </span>
                <div
                  className="flex-1 h-3 rounded-full bg-pink/30 overflow-hidden cursor-pointer relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = Math.round((clickX / rect.width) * 100);
                    setProgress(Math.max(0, Math.min(100, newPct)));
                  }}
                >
                  <div
                    className="h-full bg-[#E31B6D] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-muted font-mono text-xs">18:45</span>
              </div>
              <span className="text-muted font-black text-[11px] truncate ml-3 hidden sm:inline">
                {currentChapter}
              </span>
            </div>
          </div>

          {/* Bottom POUF Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border-t border-pink-100 text-left">
            <div className="pl-3 border-l-4 border-pink">
              <p className="text-2xl font-black font-pouf text-ink">+12 Horas</p>
              <p className="text-xs font-bold text-muted">Formación clínica grabada</p>
            </div>
            <div className="pl-3 border-l-4 border-yellow">
              <p className="text-2xl font-black font-pouf text-ink">15 Modelos</p>
              <p className="text-xs font-bold text-muted">Plantillas procesales Word</p>
            </div>
            <div className="pl-3 border-l-4 border-mint">
              <p className="text-2xl font-black font-pouf text-ink">4 Sesiones</p>
              <p className="text-xs font-bold text-muted">Simulaciones en vivo</p>
            </div>
            <div className="pl-3 border-l-4 border-purple">
              <p className="text-2xl font-black font-pouf text-ink">Certificado</p>
              <p className="text-xs font-bold text-muted">Acreditación Girls &amp; Law</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
