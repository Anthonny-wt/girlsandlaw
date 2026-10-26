import { CTA } from './cta';
import { Button } from './Button';

export function PoufBottomCTA() {
  return (
    <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <CTA
        tone="pink"
        title="Tu voz procesal merece ser escuchada con fuerza."
        description="No necesitas esperar años ni soportar la arrogancia de los métodos tradicionales. Adquiere hoy la confianza, la técnica y el respaldo de Girls & Law."
        action={
          <>
            <Button
              size="lg"
              tone="pink"
              onClick={() => {
                document.getElementById('precios')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Asegurar Mi Plaza Ahora →
            </Button>
            <Button
              size="lg"
              variant="quiet"
              onClick={() => {
                document.getElementById('temario')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Revisar Plan de Estudios
            </Button>
          </>
        }
      />
    </section>
  );
}
