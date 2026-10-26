import { useState } from 'react';
import { Button } from './Button';
import { InstagramIcon, SpotifyIcon } from '@/components/ui/SocialIcons';

export interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: 'Visión', href: '#trailer' },
  { label: 'Metodología', href: '#metodologia' },
  { label: 'Temario', href: '#temario' },
  { label: 'Fundadora', href: '#fundadora' },
  { label: 'Inversión', href: '#precios' },
  { label: 'Preguntas', href: '#faq' },
];

export function PoufNavbar() {
  const [activeLink, setActiveLink] = useState('#trailer');

  return (
    <header className="fixed top-4 inset-x-0 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pointer-events-none transition-all duration-200">
      <nav
        className="pouf-navbar pointer-events-auto flex items-center justify-between min-h-[70px] px-5 sm:px-6 rounded-full bg-white/95 backdrop-blur-md cushion-card border border-pink-100 shadow-xl"
        aria-label="Navegación Principal"
      >
        {/* Brand / Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/logogirlsandlaw.webp"
            alt="Girls & Law Logo"
            width="44"
            height="44"
            className="w-11 h-11 object-contain rounded-full transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg text-ink leading-tight">
              Girls <span className="text-[#E31B6D] italic">&amp;</span> Law
            </span>
            <span className="text-[9px] font-black tracking-[0.2em] text-[#E31B6D] uppercase leading-none">
              Masterclass
            </span>
          </div>
        </a>

        {/* Desktop Links (1st-Pouf style) */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#FFF5F9] border border-pink-100">
          {LINKS.map((link) => {
            const isActive = activeLink === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActiveLink(link.href)}
                className={`font-black text-xs px-3.5 py-1.5 rounded-full transition-all duration-150 ${
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

        {/* Social Icons & CTA Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instagram & Spotify Social Icons (como teníamos) */}
          <div className="flex items-center gap-1.5">
            <a
              href="https://instagram.com/girlsandlaw"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E31B6D] hover:bg-[#E31B6D] hover:text-white transition-all shadow-xs border border-pink-200 cushion-control active:translate-y-[1px]"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Spotify"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#E31B6D] hover:bg-[#E31B6D] hover:text-white transition-all shadow-xs border border-pink-200 cushion-control active:translate-y-[1px]"
            >
              <SpotifyIcon className="w-4 h-4" />
            </a>
          </div>

          <Button
            size="sm"
            tone="pink"
            onClick={() => {
              document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Inscribirme
          </Button>
        </div>
      </nav>
    </header>
  );
}
