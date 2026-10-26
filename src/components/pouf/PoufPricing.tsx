import { useState } from 'react';
import { Card } from './surface';
import { Badge } from './media';
import { Eyebrow, Heading, Text } from './text';
import { Button } from './Button';
import { Segmented } from './Segmented';

type Billing = 'single' | 'installments';

export function PoufPricing() {
  const [billing, setBilling] = useState<Billing>('single');

  return (
    <section id="precios" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Eyebrow>Inversión &amp; Admisión</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          Elige cómo transformar tu práctica legal.
        </Heading>
        <div className="mt-3">
          <Text muted size="lg">
            Inversión transparente sin costos ocultos. Acceso de por vida a la plataforma.
          </Text>
        </div>

        {/* 1st-Pouf Segmented Toggle */}
        <div className="mt-8 flex justify-center">
          <Segmented
            label="Modalidad de pago"
            value={billing}
            onChange={setBilling}
            tone="pink"
            options={[
              { value: 'single', label: 'Pago Único' },
              { value: 'installments', label: '3 Cuotas Sin Interés' },
            ]}
          />
        </div>
      </div>

      {/* Pouf Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
        {/* Tier 1: Digital Pro */}
        <Card motion="lift" className="flex flex-col justify-between">
          <div>
            <Badge tone="purple">Modalidad Asincrónica</Badge>
            <Heading level={2} className="mt-3 text-ink">
              Acceso Digital Pro
            </Heading>
            <div className="mt-1">
              <Text size="sm" muted>
                Aprende a tu propio ritmo con las 12 horas clínicas completas y el archivo de plantillas.
              </Text>
            </div>

            <div className="mt-6 pb-6 border-b border-pink-100">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-4xl sm:text-5xl text-ink">
                  {billing === 'single' ? '$149' : '$55'}
                </span>
                <span className="text-xs font-bold text-muted">
                  {billing === 'single' ? 'USD · Pago Único' : 'USD / mes (x 3)'}
                </span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm font-bold text-ink">
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span>12 Horas de Masterclass en 4K Ultra HD</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span>El Vault de 15 Modelos Procesales en Word</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span>Acceso de por vida a todas las actualizaciones</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span>Certificado Digital con sello Girls &amp; Law</span>
              </li>
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
              Inscribirme a Digital Pro
            </Button>
          </div>
        </Card>

        {/* Tier 2: VIP Masterclass (Featured) */}
        <Card motion="lift" className="flex flex-col justify-between bg-[#FFF5F9] border-2 border-pink">
          <div>
            <div className="flex justify-between items-center">
              <Badge tone="pink">Más Popular · 30 Vacantes</Badge>
              <Badge tone="yellow">En Vivo + Mentoría</Badge>
            </div>

            <Heading level={2} className="mt-3 text-ink">
              VIP Masterclass Experience
            </Heading>
            <div className="mt-1">
              <Text size="sm" muted>
                La experiencia transformadora definitiva con simulación de audiencias en vivo y revisión de tu caso.
              </Text>
            </div>

            <div className="mt-6 pb-6 border-b border-pink-200">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-4xl sm:text-5xl text-[#E31B6D]">
                  {billing === 'single' ? '$299' : '$109'}
                </span>
                <span className="text-xs font-bold text-muted">
                  {billing === 'single' ? 'USD · Pago Único' : 'USD / mes (x 3)'}
                </span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm font-bold text-ink">
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span className="text-ink">Todo lo incluido en el plan Digital Pro</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span><strong>4 Sesiones en Vivo</strong> de Juicio Simulado con Feedback</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span>Revisión personalizada de tu alegato por Roxana Rivera</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#E31B6D] font-black">✓</span>
                <span>Inclusión en el Directorio VIP de derivación de clientes</span>
              </li>
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
              Asegurar Mi Cupo VIP →
            </Button>
          </div>
        </Card>
      </div>

      {/* Guarantee Card */}
      <div className="mt-12 max-w-2xl mx-auto">
        <Card variant="tight" className="text-center bg-white border border-pink-200">
          <Badge tone="mint" className="mb-2">
            🛡️ Garantía Incondicional de 14 Días
          </Badge>
          <Text size="sm" muted className="block leading-relaxed font-bold">
            Ingresa a la Masterclass, mira las primeras clases y descarga las plantillas.
            Si sientes que no eleva tu seguridad procesal, solicita el reembolso completo
            con un solo clic. Sin preguntas ni letra chica.
          </Text>
        </Card>
      </div>
    </section>
  );
}
