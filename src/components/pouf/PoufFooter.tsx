import { InstagramIcon, TikTokIcon, SpotifyIcon } from '@/components/ui/SocialIcons';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufFooter() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].footer;

  return (
    <footer className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-12 pt-6">
      <div className="bg-white rounded-card p-8 sm:p-12 lg:p-14 cushion-card border border-pink-100/80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-pink-100">
          {/* Brand & Social Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <a href="/" className="flex items-center gap-3 group inline-flex">
              <img
                src="/logogirlsandlaw-nobg.webp"
                alt="Girls & Law Logo"
                width="48"
                height="48"
                className="w-12 h-12 object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl text-ink leading-tight">
                  Girls <span className="text-[#E31B6D] italic">&amp;</span> Law
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#E31B6D] uppercase leading-none">
                  Masterclass 2026
                </span>
              </div>
            </a>

            <p className="text-sm font-bold text-muted max-w-sm leading-relaxed font-pouf">
              {t.description}
            </p>

            {/* 1st-Pouf Clay Social Blobs */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/girlsandlaw"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram de Girls and Law"
                className="w-10 h-10 rounded-blob bg-pink text-ink cushion-control active:cushion-control-active active:translate-y-[2px] transition-all hover:scale-105 flex items-center justify-center group"
              >
                <InstagramIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://tiktok.com/@girlsandlaw"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok de Girls and Law"
                className="w-10 h-10 rounded-blob bg-yellow text-ink cushion-control active:cushion-control-active active:translate-y-[2px] transition-all hover:scale-105 flex items-center justify-center group"
              >
                <TikTokIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('toggle-spotify-podcast'));
                }}
                aria-label="Spotify Podcast de Girls and Law"
                className="w-10 h-10 rounded-blob bg-[#1DB954]/15 text-[#1DB954] hover:bg-[#1DB954] hover:text-white cushion-control active:cushion-control-active active:translate-y-[2px] transition-all hover:scale-105 flex items-center justify-center group cursor-pointer"
              >
                <SpotifyIcon className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>

          {/* Nav Column 1: Masterclass (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E31B6D]">
              {t.col1Title}
            </h4>
            <ul className="space-y-2 text-sm font-bold text-muted font-pouf">
              <li>
                <a href="#metodologia" className="hover:text-ink hover:underline transition-colors">
                  {t.col1Link1}
                </a>
              </li>
              <li>
                <a href="#temario" className="hover:text-ink hover:underline transition-colors">
                  {t.col1Link2}
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-ink hover:underline transition-colors">
                  {t.col1Link3}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-ink hover:underline transition-colors">
                  {t.col1Link4}
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Comunidad & Vault (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#E31B6D]">
              {t.col2Title}
            </h4>
            <ul className="space-y-2 text-sm font-bold text-muted font-pouf">
              <li>
                <a href="#metodologia" className="hover:text-ink hover:underline transition-colors">
                  {t.col2Link1}
                </a>
              </li>
              <li>
                <a href="#fundadora" className="hover:text-ink hover:underline transition-colors">
                  {t.col2Link2}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('toggle-spotify-podcast'));
                  }}
                  className="hover:text-ink hover:underline transition-colors"
                >
                  {t.col2Link3}
                </a>
              </li>
              <li>
                <a href="https://instagram.com/girlsandlaw" target="_blank" rel="noreferrer" className="hover:text-ink hover:underline transition-colors">
                  {t.col2Link4}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="p-4 rounded-control bg-[#FFF5F9] cushion-row space-y-3">
              <span className="inline-block px-2.5 py-0.5 rounded-pill text-[10px] font-black uppercase tracking-wider bg-pink text-ink">
                {lang === 'es' ? 'Newsletter Semanal' : 'Weekly Newsletter'}
              </span>
              <h5 className="text-xs font-black text-ink font-pouf">
                {lang === 'es'
                  ? 'Estrategia procesal y consejos directos a tu bandeja.'
                  : 'Courtroom strategy delivered directly to your inbox.'}
              </h5>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(lang === 'es' ? '¡Gracias por suscribirte al boletín de Girls & Law!' : 'Thank you for subscribing to Girls & Law!');
                }}
              >
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  className="w-full text-xs font-bold px-3 py-2 rounded-control bg-white text-ink placeholder:text-muted/60 cushion-field outline-none focus:cushion-field-focus transition-all"
                />
                <button
                  type="submit"
                  className="w-full text-xs font-black py-2 px-3 rounded-control bg-pink text-ink cushion-control active:cushion-control-active active:translate-y-[1px] cursor-pointer transition-all hover:bg-[#FF9EC4]"
                >
                  {lang === 'es' ? 'Suscribirme Gratis' : 'Subscribe Free'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar with 1st-Pouf Pill */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-muted">
          <p>© 2026 Girls &amp; Law. {t.copyright}</p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-[#FFF5F9] border border-pink-100 text-[11px] font-black text-ink">
              <span className="w-2 h-2 rounded-full bg-mint"></span>
              {lang === 'es' ? 'Inscripciones abiertas · Edición 2026' : 'Enrollment Open · 2026 Edition'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
