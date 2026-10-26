import { CTA } from './cta';
import { Button } from './Button';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufBottomCTA() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].bottomCTA;

  return (
    <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <CTA
        tone="pink"
        title={t.title}
        description={t.description}
        action={
          <>
            <Button
              size="lg"
              tone="pink"
              onClick={() => {
                document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t.ctaPrimary}
            </Button>
            <Button
              size="lg"
              variant="quiet"
              onClick={() => {
                document.getElementById('temario')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t.ctaSecondary}
            </Button>
          </>
        }
      />
    </section>
  );
}
