import { Card } from './surface';
import { Blob } from './media';
import { Eyebrow, Heading, Text } from './text';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufFeatures() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].features;

  return (
    <section id="metodologia" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          {t.title}
        </Heading>
        <div className="mt-3">
          <Text muted size="lg">
            {t.description}
          </Text>
        </div>
      </div>

      {/* 1st-Pouf Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Cinema 4K (8 cols) */}
        <div className="md:col-span-8">
          <Card motion="lift" className="h-full flex flex-col justify-between">
            <div>
              <Blob tone="pink" size="md" className="mb-4">
                🎬
              </Blob>
              <Heading level={2} className="text-ink">
                {t.card1.title}
              </Heading>
              <div className="mt-3">
                <Text size="md" muted>
                  {t.card1.desc}
                </Text>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-pink-100 flex items-center justify-between text-xs font-black text-muted">
              <span>{t.card1.tag1}</span>
              <span className="text-[#E31B6D]">{t.card1.tag2}</span>
            </div>
          </Card>
        </div>

        {/* Card 2: Vault (4 cols) */}
        <div className="md:col-span-4">
          <Card motion="lift" className="h-full flex flex-col justify-between bg-[#FFF9FB]">
            <div>
              <Blob tone="yellow" size="md" className="mb-4">
                📂
              </Blob>
              <Heading level={3} className="text-ink">
                {t.card2.title}
              </Heading>
              <div className="mt-3">
                <Text size="sm" muted>
                  {t.card2.desc}
                </Text>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-control bg-white cushion-row font-mono text-[11px] font-bold text-ink">
              {t.card2.sample}
            </div>
          </Card>
        </div>

        {/* Card 3: Community (5 cols) */}
        <div className="md:col-span-5">
          <Card motion="lift" className="h-full flex flex-col justify-between bg-[#FFF9FB]">
            <div>
              <Blob tone="purple" size="md" className="mb-4">
                👑
              </Blob>
              <Heading level={3} className="text-ink">
                {t.card3.title}
              </Heading>
              <div className="mt-3">
                <Text size="sm" muted>
                  {t.card3.desc}
                </Text>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-pink cushion-control flex items-center justify-center text-[10px] font-black text-ink">RR</div>
                <div className="w-8 h-8 rounded-full bg-yellow cushion-control flex items-center justify-center text-[10px] font-black text-ink">AC</div>
                <div className="w-8 h-8 rounded-full bg-mint cushion-control flex items-center justify-center text-[10px] font-black text-ink">KW</div>
              </div>
              <span className="text-xs font-bold text-muted">{t.card3.stat}</span>
            </div>
          </Card>
        </div>

        {/* Card 4: Simulation Lab (7 cols) */}
        <div className="md:col-span-7">
          <Card motion="lift" className="h-full flex flex-col justify-between">
            <div>
              <Blob tone="mint" size="md" className="mb-4">
                ⚖️
              </Blob>
              <Heading level={2} className="text-ink">
                {t.card4.title}
              </Heading>
              <div className="mt-3">
                <Text size="md" muted>
                  {t.card4.desc}
                </Text>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-control bg-[#FFF5F9] cushion-row">
                <p className="text-xl font-black font-pouf text-[#E31B6D]">{t.card4.stat1Num}</p>
                <p className="text-xs font-bold text-muted mt-0.5">{t.card4.stat1Label}</p>
              </div>
              <div className="p-4 rounded-control bg-[#FFF5F9] cushion-row">
                <p className="text-xl font-black font-pouf text-[#E31B6D]">{t.card4.stat2Num}</p>
                <p className="text-xs font-bold text-muted mt-0.5">{t.card4.stat2Label}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
