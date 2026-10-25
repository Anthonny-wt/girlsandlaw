'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';
import { InstagramIcon, TikTokIcon, SpotifyIcon } from '@/components/ui/SocialIcons';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full shadow-xs">
      {/* Upper Main Navbar */}
      <header className="w-full bg-[#FDF1F5] border-b border-[#F8D7E3]/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Brand */}
            <Logo />

            {/* Central Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-medium text-girls-dark/85 hover:text-girls-pink transition-colors duration-150 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Group: Social Icons & CTA */}
            <div className="hidden md:flex items-center gap-4">
              {/* Social Circles */}
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-girls-pink hover:bg-girls-pink hover:text-white transition-all shadow-2xs border border-girls-pink/20"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-girls-pink hover:bg-girls-pink hover:text-white transition-all shadow-2xs border border-girls-pink/20"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Spotify"
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-girls-pink hover:bg-girls-pink hover:text-white transition-all shadow-2xs border border-girls-pink/20"
                >
                  <SpotifyIcon className="w-4 h-4" />
                </a>
              </div>

              {/* CTA Button */}
              <Button
                variant="primary"
                size="md"
                className="bg-[#E31B6D] hover:bg-[#C2185B] text-white shadow-md shadow-[#E31B6D]/30 text-xs sm:text-sm tracking-wide font-bold px-6 py-2.5"
              >
                Únete al Movimiento
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <Button
                variant="primary"
                size="sm"
                className="text-xs px-3 py-1.5 md:hidden"
              >
                Únete
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-girls-dark hover:bg-white/80 transition-colors"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-[#F8D7E3] px-5 py-4 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-girls-dark hover:text-girls-pink py-1.5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FDF1F5] flex items-center justify-center text-girls-pink"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FDF1F5] flex items-center justify-center text-girls-pink"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://spotify.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-[#FDF1F5] flex items-center justify-center text-girls-pink"
                >
                  <SpotifyIcon className="w-4 h-4" />
                </a>
              </div>
              <Button size="sm" className="bg-[#E31B6D]">
                Únete al Movimiento
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Solid Magenta Separator Stripe (High visual fidelity with screenshot) */}
      <div className="h-2 w-full bg-[#9B004F]" />
    </div>
  );
}
