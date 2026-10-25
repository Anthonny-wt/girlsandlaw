import Link from 'next/link';
import { Heart } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { InstagramIcon, TikTokIcon, SpotifyIcon } from '@/components/ui/SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-[#150F1D] text-white pt-16 pb-12 border-t border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="footer" />
            <p className="text-sm text-pink-100/70 max-w-sm leading-relaxed">
              La plataforma que acompaña a las mujeres en el derecho a construir
              su propia voz profesional sin renunciar a su autenticidad.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 hover:bg-[#E31B6D] hover:text-white transition-all"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 hover:bg-[#E31B6D] hover:text-white transition-all"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Spotify"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-400 hover:bg-[#E31B6D] hover:text-white transition-all"
              >
                <SpotifyIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-4">
              Comunidad
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="#manifiesto" className="hover:text-pink-300 transition-colors">
                  Manifiesto
                </Link>
              </li>
              <li>
                <Link href="#embajadas" className="hover:text-pink-300 transition-colors">
                  Embajadas Universitarias
                </Link>
              </li>
              <li>
                <Link href="#mascota" className="hover:text-pink-300 transition-colors">
                  Mascota &amp; Identidad
                </Link>
              </li>
              <li>
                <Link href="#fundadora" className="hover:text-pink-300 transition-colors">
                  Mensaje Fundadora
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-4">
              Recursos &amp; Contenido
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link href="#libros" className="hover:text-pink-300 transition-colors">
                  Libros &amp; Diseño
                </Link>
              </li>
              <li>
                <Link href="#podcast" className="hover:text-pink-300 transition-colors">
                  Podcast en Spotify
                </Link>
              </li>
              <li>
                <Link href="#talleres" className="hover:text-pink-300 transition-colors">
                  Workshops &amp; Litigio
                </Link>
              </li>
              <li>
                <Link href="#networking" className="hover:text-pink-300 transition-colors">
                  Eventos de Networking
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-4">
              Girls &amp; Law
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a href="mailto:hola@girlsandlaw.com" className="hover:text-pink-300 transition-colors">
                  Contacto de Prensa
                </a>
              </li>
              <li>
                <Link href="#alianzas" className="hover:text-pink-300 transition-colors">
                  Alianzas Institucionales
                </Link>
              </li>
              <li>
                <Link href="#privacidad" className="hover:text-pink-300 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 Girls &amp; Law. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Creado con <Heart className="w-3.5 h-3.5 text-[#E31B6D] fill-[#E31B6D]" /> para la comunidad jurídica.
          </p>
        </div>
      </div>
    </footer>
  );
}
