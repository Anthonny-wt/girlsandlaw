import { Card } from './surface';
import { Blob } from './media';
import { Eyebrow, Heading, Text } from './text';

export function PoufFeatures() {
  return (
    <section id="metodologia" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Eyebrow>Ingeniería del Aprendizaje</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          Cada detalle diseñado para transformar tu carrera.
        </Heading>
        <div className="mt-3">
          <Text muted size="lg">
            Combinamos cinematografía inmersiva, rigor procesal de primera línea y comunidad exclusiva.
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
                Producción en salas de audiencias reales.
              </Heading>
              <div className="mt-3">
                <Text size="md" muted>
                  Sin salones genéricos ni diapositivas monótonas. Aprende la acústica del tribunal,
                  el manejo de la distancia con el juez y el dominio espacial que impone respeto desde el primer segundo.
                </Text>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-pink-100 flex items-center justify-between text-xs font-black text-muted">
              <span>✦ 4K Ultra HD · Masterclass Cinema</span>
              <span className="text-[#E31B6D]">12 Módulos Clínicos</span>
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
                El Vault Procesal
              </Heading>
              <div className="mt-3">
                <Text size="sm" muted>
                  15 modelos procesales editables en Word: alegatos de apertura, matrices para interrogar testigos y propuestas de honorarios.
                </Text>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-control bg-white cushion-row font-mono text-[11px] font-bold text-ink">
              📄 alegato_apertura_pro.docx
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
                Comunidad VIP Perpetua
              </Heading>
              <div className="mt-3">
                <Text size="sm" muted>
                  Pertenecerás al círculo de abogadas más activo de Latinoamérica. Derivación de casos, alianzas y networking auténtico.
                </Text>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-pink cushion-control flex items-center justify-center text-[10px] font-black text-ink">RR</div>
                <div className="w-8 h-8 rounded-full bg-yellow cushion-control flex items-center justify-center text-[10px] font-black text-ink">AC</div>
                <div className="w-8 h-8 rounded-full bg-mint cushion-control flex items-center justify-center text-[10px] font-black text-ink">KW</div>
              </div>
              <span className="text-xs font-bold text-muted">+5,000 juristas conectadas</span>
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
                Simulaciones de juicio con feedback en vivo.
              </Heading>
              <div className="mt-3">
                <Text size="md" muted>
                  No basta con saber la ley: debes saber responder bajo fuego. Practicarás objeciones en milisegundos, control de testigos difíciles y alegatos orales con evaluación experta.
                </Text>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-control bg-[#FFF5F9] cushion-row">
                <p className="text-xl font-black font-pouf text-[#E31B6D]">4 Sesiones</p>
                <p className="text-xs font-bold text-muted mt-0.5">En tiempo real</p>
              </div>
              <div className="p-4 rounded-control bg-[#FFF5F9] cushion-row">
                <p className="text-xl font-black font-pouf text-[#E31B6D]">1 a 1</p>
                <p className="text-xs font-bold text-muted mt-0.5">Revisión clínica experta</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
