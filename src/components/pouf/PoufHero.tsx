import { Badge } from './media';
import { Highlight } from './text';
import { Button } from './Button';
import { FounderHeroCard } from './FounderHeroCard';
import { PoufCoursesCatalog } from './PoufCoursesCatalog';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufHero() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].hero;

  return (
    <section id="trailer" className="pt-3 sm:pt-6 pb-10 sm:pb-20 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      {/* 2-Column Hero Grid: Left Content + Right Founder Card (from user design) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-full min-w-0">
        {/* Left Column: Masterclass Headline & Value Proposition */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
          {/* 1st-Pouf Pill Badge */}
          <div className="flex justify-center lg:justify-start max-w-full">
            <Badge tone="pink" className="cushion-control-active text-[10px] sm:text-xs !py-1 sm:!py-1.5 !px-3 sm:!px-4 max-w-full text-center">
              {t.badge}
            </Badge>
          </div>

          {/* 1st-Pouf Heading with Highlights */}
          <h1 className="font-pouf font-black text-ink text-center lg:text-left text-xl xs:text-2xl sm:text-3xl lg:text-[44px] tracking-tight leading-[1.25] sm:leading-[1.15] break-words max-w-full">
            <span className="inline-block">{t.title1}</span>{' '}
            <Highlight tone="pink" className="!px-2 sm:!px-3 !py-0.5 sm:!py-1">
              {t.titleHighlight1}
            </Highlight>{' '}
            <span className="font-serif italic font-normal">{t.title2}</span>{' '}
            <Highlight tone="yellow" className="!px-2 sm:!px-3 !py-0.5 sm:!py-1">
              {t.titleHighlight2}
            </Highlight>
          </h1>

          {/* Description in friendly 1st-Pouf Text */}
          <div className="max-w-xl mx-auto lg:mx-0 px-1 sm:px-0">
            <p className="font-bold text-muted text-xs sm:text-base leading-relaxed break-words">
              {t.description}
            </p>
          </div>

          {/* Puffy Action Buttons */}
          <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 max-w-xs sm:max-w-none mx-auto lg:mx-0">
            <Button
              size="md"
              tone="pink"
              className="w-full sm:w-auto !py-3 sm:!py-3.5 !text-xs sm:!text-sm font-black justify-center shadow-md active:scale-95 transition-transform"
              onClick={() => {
                document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              📚 Explorar Cursos
            </Button>
            <Button
              size="md"
              variant="quiet"
              className="w-full sm:w-auto !py-3 sm:!py-3.5 !text-xs sm:!text-sm font-bold justify-center active:scale-95 transition-transform"
              onClick={() => {
                document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              💎 Ver Planes &amp; Precios
            </Button>
          </div>

          {/* Guarantee & Pricing footnote */}
          <p className="text-[10.5px] sm:text-xs font-bold text-muted text-center lg:text-left px-1 sm:px-0 break-words">
            {t.guarantee}
          </p>

          {/* Trust Highlights Row */}
          <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black text-ink max-w-full">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-pill bg-white cushion-row shadow-2xs max-w-full text-center">
              🏛️ {t.pills.courtrooms}
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-pill bg-white cushion-row shadow-2xs max-w-full text-center">
              📄 {t.pills.models}
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-pill bg-white cushion-row shadow-2xs max-w-full text-center">
              👑 {t.pills.mentorship}
            </span>
          </div>
        </div>

        {/* Right Column: Founder / Entrepreneur Card (Matching reference uploaded by user) */}
        <div className="lg:col-span-5 flex justify-center mt-6 lg:mt-0 px-2 sm:px-0">
          <FounderHeroCard
            name="Roxana Rivera"
            photoSrc="/roxana.png"
          />
        </div>
      </div>

      {/* Catálogo de Cursos Estilo Coursera (Reemplaza el reproductor Cinema Player) */}
      <PoufCoursesCatalog />
    </section>
  );
}
