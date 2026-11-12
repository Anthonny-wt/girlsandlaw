import { Card } from './surface';
import { Blob } from './media';
import { Eyebrow, Heading, Text } from './text';
import { useLanguage, DICTIONARY } from '@/lib/i18n';
import { InstagramIcon, SpotifyIcon } from '@/components/ui/SocialIcons';

export function PoufIdentity() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].identity;

  return (
    <section id="identidad" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <Eyebrow>{t.badge}</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          {t.title}
        </Heading>
        <div className="mt-3">
          <Text muted size="lg">
            {t.description}
          </Text>
        </div>
      </div>

      {/* 8-Grid Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Nombre */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-white">
          <div>
            <Blob tone="pink" size="sm" className="mb-3">
              🌸
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-[#E31B6D]">
              {t.nameLabel}
            </p>
            <h3 className="font-serif font-black text-xl text-ink mt-1">
              {t.nameValue}
            </h3>
          </div>
          <p className="text-xs text-muted font-bold mt-3 pt-3 border-t border-pink-100">
            Marca registrada oficial
          </p>
        </Card>

        {/* 2. Naturaleza */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-[#FFF9FB] sm:col-span-2">
          <div>
            <Blob tone="purple" size="sm" className="mb-3">
              🌎
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-purple-700">
              {t.natureLabel}
            </p>
            <h3 className="font-serif font-black text-lg sm:text-xl text-ink mt-1">
              {t.natureValue}
            </h3>
          </div>
          <p className="text-xs text-muted font-bold mt-3 pt-3 border-t border-pink-100">
            Alcance en América Latina, Europa y Estados Unidos
          </p>
        </Card>

        {/* 3. Fundadora */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-white">
          <div>
            <Blob tone="yellow" size="sm" className="mb-3">
              👩‍⚖️
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-amber-700">
              {t.founderLabel}
            </p>
            <h3 className="font-serif font-black text-lg text-ink mt-1">
              {t.founderValue}
            </h3>
          </div>
          <p className="text-xs text-muted font-bold mt-3 pt-3 border-t border-pink-100">
            Bachiller en Derecho · USMP
          </p>
        </Card>

        {/* 4. Frase Institucional */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-gradient-to-br from-[#FFF0F6] to-[#FFE2ED] sm:col-span-2 lg:col-span-2">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-pill bg-white text-[9.5px] font-black uppercase tracking-wider text-[#E31B6D] mb-3 shadow-2xs">
              ✦ {t.sloganLabel}
            </span>
            <blockquote className="font-serif italic font-bold text-lg sm:text-2xl text-ink leading-snug">
              “{t.sloganValue}”
            </blockquote>
          </div>
          <p className="text-xs text-ink/70 font-bold mt-4 pt-3 border-t border-pink-200/80">
            Lema oficial de la comunidad
          </p>
        </Card>

        {/* 5. Podcast */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-white">
          <div>
            <Blob tone="mint" size="sm" className="mb-3">
              🎙️
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-emerald-700">
              {t.podcastLabel}
            </p>
            <h3 className="font-serif font-black text-base text-ink mt-1">
              {t.podcastValue}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-spotify-podcast'))}
            className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-black text-[#1DB954] hover:underline cursor-pointer"
          >
            <span>Escuchar en Spotify</span>
            <SpotifyIcon className="w-4 h-4" />
          </button>
        </Card>

        {/* 6. Playlist */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-white">
          <div>
            <Blob tone="pink" size="sm" className="mb-3">
              🎵
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-[#E31B6D]">
              {t.playlistLabel}
            </p>
            <h3 className="font-serif font-black text-base text-ink mt-1">
              {t.playlistValue}
            </h3>
          </div>
          <a
            href="https://open.spotify.com"
            target="_blank"
            rel="noreferrer"
            className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-black text-[#1DB954] hover:underline"
          >
            <span>Para Girls de Derecho</span>
            <SpotifyIcon className="w-4 h-4" />
          </a>
        </Card>

        {/* 7. Iniciativa Cultural: Club de Lectura */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-[#FFF9FB] sm:col-span-2">
          <div>
            <Blob tone="yellow" size="sm" className="mb-3">
              📖
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-amber-700">
              {t.cultureLabel}
            </p>
            <h3 className="font-serif font-black text-lg text-ink mt-1">
              {t.cultureValue}
            </h3>
          </div>
          <p className="text-xs text-muted font-bold mt-3 pt-3 border-t border-pink-100">
            Pensamiento crítico, cultura y diálogo entre integrantes de 14 países
          </p>
        </Card>

        {/* 8. Presencia Digital */}
        <Card motion="lift" className="flex flex-col justify-between p-5 sm:p-6 bg-white sm:col-span-2">
          <div>
            <Blob tone="purple" size="sm" className="mb-3">
              📱
            </Blob>
            <p className="text-[10.5px] font-black uppercase tracking-wider text-purple-700">
              {t.digitalLabel}
            </p>
            <h3 className="font-serif font-black text-lg text-ink mt-1">
              {t.digitalValue}
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-3">
            <a
              href="https://instagram.com/girlsandlaw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#FFF0F6] text-[#E1306C] text-xs font-black hover:bg-[#FFE0EC] transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@girlsandlaw (+17K)</span>
            </a>
            <span className="text-xs font-bold text-muted">TikTok &amp; LinkedIn</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
