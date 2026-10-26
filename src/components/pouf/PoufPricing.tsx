import { useState } from 'react';
import { Card } from './surface';
import { Badge } from './media';
import { Eyebrow, Heading, Text } from './text';
import { Button } from './Button';
import { Segmented } from './Segmented';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

type Billing = 'single' | 'installments';

export function PoufPricing() {
  const [billing, setBilling] = useState<Billing>('single');
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].pricing;

  return (
    <section id="precios" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          {t.title}
        </Heading>
        <div className="mt-3">
          <Text muted size="lg">
            {t.description}
          </Text>
        </div>

        {/* 1st-Pouf Segmented Toggle */}
        <div className="mt-8 flex justify-center">
          <Segmented
            label={lang === 'es' ? 'Modalidad de pago' : 'Payment option'}
            value={billing}
            onChange={setBilling}
            tone="pink"
            options={[
              { value: 'single', label: t.singlePayment },
              { value: 'installments', label: t.installments },
            ]}
          />
        </div>
      </div>

      {/* Pouf Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
        {/* Tier 1: Digital Pro */}
        <Card motion="lift" className="flex flex-col justify-between">
          <div>
            <Badge tone="purple">{t.card1.badge}</Badge>
            <Heading level={2} className="mt-3 text-ink">
              {t.card1.title}
            </Heading>
            <div className="mt-1">
              <Text size="sm" muted>
                {t.card1.desc}
              </Text>
            </div>

            <div className="mt-6 pb-6 border-b border-pink-100">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-4xl sm:text-5xl text-ink">
                  {billing === 'single' ? t.card1.priceSingle : t.card1.priceInstallments}
                </span>
                <span className="text-xs font-bold text-muted">
                  {billing === 'single' ? `USD · ${t.card1.pricePeriodSingle}` : `USD · ${t.card1.pricePeriod}`}
                </span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm font-bold text-ink">
              {t.card1.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-[#E31B6D] font-black">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Button
              block
              size="lg"
              variant="quiet"
              onClick={() => {
                window.location.href = '#';
              }}
            >
              {t.card1.cta}
            </Button>
          </div>
        </Card>

        {/* Tier 2: VIP Masterclass (Featured) */}
        <Card motion="lift" className="flex flex-col justify-between bg-[#FFF5F9] border-2 border-pink">
          <div>
            <div className="flex justify-between items-center">
              <Badge tone="pink">{t.card2.badge}</Badge>
              <Badge tone="yellow">{lang === 'es' ? 'En Vivo + Mentoría' : 'Live + Mentorship'}</Badge>
            </div>

            <Heading level={2} className="mt-3 text-ink">
              {t.card2.title}
            </Heading>
            <div className="mt-1">
              <Text size="sm" muted>
                {t.card2.desc}
              </Text>
            </div>

            <div className="mt-6 pb-6 border-b border-pink-200">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-4xl sm:text-5xl text-[#E31B6D]">
                  {billing === 'single' ? t.card2.priceSingle : t.card2.priceInstallments}
                </span>
                <span className="text-xs font-bold text-muted">
                  {billing === 'single' ? `USD · ${t.card2.pricePeriodSingle}` : `USD · ${t.card2.pricePeriod}`}
                </span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm font-bold text-ink">
              {t.card2.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-[#E31B6D] font-black">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Button
              block
              size="lg"
              tone="pink"
              onClick={() => {
                window.location.href = '#';
              }}
            >
              {t.card2.cta}
            </Button>
          </div>
        </Card>
      </div>

      {/* Guarantee Card */}
      <div className="mt-12 max-w-2xl mx-auto">
        <Card variant="tight" className="text-center bg-white border border-pink-200">
          <Badge tone="mint" className="mb-2">
            🛡️ {lang === 'es' ? 'Garantía Incondicional de 14 Días' : '14-Day Unconditional Guarantee'}
          </Badge>
          <Text size="sm" muted className="block leading-relaxed font-bold">
            {lang === 'es'
              ? 'Ingresa a la Masterclass, mira las primeras clases y descarga las plantillas. Si sientes que no eleva tu seguridad procesal, solicita el reembolso completo con un solo clic. Sin preguntas ni letra chica.'
              : 'Join the Masterclass, explore the first sessions, and download the templates. If you feel it doesn’t elevate your trial confidence, request a 100% full refund with a single click. Zero questions asked.'}
          </Text>
        </Card>
      </div>
    </section>
  );
}
