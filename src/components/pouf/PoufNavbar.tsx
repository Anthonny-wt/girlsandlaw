import { useState } from 'react';
import { Button } from './Button';
import { InstagramIcon, SpotifyIcon } from '@/components/ui/SocialIcons';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufNavbar() {
  const [activeLink, setActiveLink] = useState('#trailer');
  const { lang, setLanguage } = useLanguage();
  const t = DICTIONARY[lang].nav;

  // 5 Central Links (removed 'Preguntas' as requested for cleaner breathing room)
  const navLinks = [
    { key: 'vision', label: t.vision, href: '#trailer' },
    { key: 'methodology', label: t.methodology, href: '#metodologia' },
    { key: 'syllabus', label: t.syllabus, href: '#temario' },
    { key: 'founder', label: t.founder, href: '#fundadora' },
    { key: 'pricing', label: t.pricing, href: '#precios' },
  ];

  const toggleLanguage = () => {
    setLanguage(lang === 'es' ? 'en' : 'es');
  };

  return (
    <header className="fixed top-2 sm:top-4 inset-x-0 z-50 w-full px-2.5 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none transition-all duration-200">
      <nav
        className="pouf-navbar pointer-events-auto flex items-center justify-between min-h-[58px] sm:min-h-[78px] px-3.5 sm:px-7 rounded-full bg-white/95 backdrop-blur-md cushion-card border border-pink-100 shadow-xl"
        aria-label="Navegación Principal"
      >
        {/* Brand / Logo (Using transparent WebP logo) */}
        <a href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <img
            src="/logogirlsandlaw-nobg.webp"
            alt="Girls & Law Logo"
            width="44"
            height="44"
            className="w-8 h-8 sm:w-11 sm:h-11 object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-serif font-black text-sm sm:text-lg lg:text-xl text-ink leading-tight">
              Girls <span className="text-[#E31B6D] italic">&amp;</span> Law
            </span>
            <span className="hidden xs:inline-block text-[8px] sm:text-[9.5px] font-black tracking-[0.2em] text-[#E31B6D] uppercase leading-none mt-0.5">
              Masterclass
            </span>
          </div>
        </a>

        {/* Desktop Links (5 items, spacious and clear) */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-[#FFF5F9] border border-pink-100 shadow-inner">
          {navLinks.map((link) => {
            const isActive = activeLink === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`font-black text-xs xl:text-sm px-3.5 xl:px-4 py-2 rounded-full transition-all duration-150 ${
                  isActive
                    ? 'bg-pink text-ink cushion-control'
                    : 'text-muted hover:text-ink hover:bg-pink/20'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right Actions: Tactile Sliding Switch + Spotify + Desktop CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* REAL SLIDING LANGUAGE SWITCH [ ES ⇄ EN ] */}
          <div
            role="switch"
            aria-checked={lang === 'en'}
            aria-label="Cambiar idioma entre Español e Inglés"
            title={lang === 'es' ? 'Cambiar a English' : 'Cambiar a Español'}
            onClick={toggleLanguage}
            className="relative flex items-center w-[66px] sm:w-[78px] h-[32px] sm:h-[36px] p-0.5 sm:p-1 rounded-full bg-[#FFF0F6] border-2 border-pink-200/90 shadow-inner cursor-pointer select-none transition-all active:scale-95"
          >
            {/* Sliding Thumb Pill */}
            <div
              className={`absolute top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 w-[28px] sm:w-[34px] rounded-full bg-[#E31B6D] shadow-md transition-all duration-300 ease-out flex items-center justify-center text-white text-[9.5px] sm:text-[11px] font-black pointer-events-none ${
                lang === 'en' ? 'left-[33px] sm:left-[38px]' : 'left-0.5 sm:left-1'
              }`}
            >
              {lang.toUpperCase()}
            </div>

            {/* Static Background Labels */}
            <span
              onClick={(e) => {
                e.stopPropagation();
                setLanguage('es');
              }}
              className={`w-1/2 text-center text-[9.5px] sm:text-[11px] font-black transition-colors ${
                lang === 'es' ? 'text-transparent' : 'text-muted hover:text-ink'
              }`}
            >
              ES
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setLanguage('en');
              }}
              className={`w-1/2 text-center text-[9.5px] sm:text-[11px] font-black transition-colors ${
                lang === 'en' ? 'text-transparent' : 'text-muted hover:text-ink'
              }`}
            >
              EN
            </span>
          </div>

          {/* Spotify Official Podcast Trigger */}
          <button
            type="button"
            data-podcast-trigger="true"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('toggle-spotify-podcast'));
            }}
            title={t.podcastTitle}
            aria-label={t.podcastTitle}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#1DB954]/10 hover:bg-[#1DB954] text-[#1DB954] hover:text-white flex items-center justify-center transition-all shadow-xs border border-[#1DB954]/30 cushion-control active:translate-y-[1px] cursor-pointer group"
          >
            <SpotifyIcon className="w-4 h-4 sm:w-5.5 sm:h-5.5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#1DB954] ring-2 ring-white animate-pulse" />
          </button>

          {/* Instagram Official - shown on tablet and desktop */}
          <a
            href="https://instagram.com/girlsandlaw"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Oficial @girlsandlaw"
            title="Instagram @girlsandlaw"
            className="hidden md:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white items-center justify-center text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-all shadow-xs border border-pink-200 cushion-control active:translate-y-[1px] group cursor-pointer"
          >
            <InstagramIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          </a>

          {/* Campus / Dashboard Portal */}
          <a
            href="/dashboard"
            title="Panel de Gestión de Cursos & Campus"
            className="hidden sm:inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-black text-ink hover:text-[#E31B6D] hover:bg-[#FFF0F6] border border-pink-200/90 transition-all cursor-pointer shadow-2xs"
          >
            <span>{lang === 'es' ? 'Campus' : 'Portal'}</span>
          </a>

          {/* CTA Inscribirme Button - Desktop/Tablet only, since Mobile has sticky PoufBottomNav with Unirme */}
          <Button
            size="sm"
            tone="pink"
            className="hidden sm:inline-flex !px-3.5 sm:!px-5 !py-2 sm:!py-2.5 !text-xs sm:!text-sm font-black whitespace-nowrap"
            onClick={() => {
              document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t.enroll}
          </Button>
        </div>
      </nav>
    </header>
  );
}
