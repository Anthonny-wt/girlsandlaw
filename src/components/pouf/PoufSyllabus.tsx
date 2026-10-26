import { useState } from 'react';
import { Card, RowCard } from './surface';
import { Badge, Dot } from './media';
import { Eyebrow, Heading, Text } from './text';

interface Module {
  id: string;
  number: string;
  title: string;
  duration: string;
  description: string;
  lessons: string[];
  skills: string[];
  deliverable: string;
  tone: 'pink' | 'purple' | 'yellow' | 'mint';
}

const MODULES: Module[] = [
  {
    id: 'mod-1',
    number: '01',
    title: 'Mentalidad, Autoridad & Dominio de Sala',
    duration: '2h 45m · 4 Clases',
    description:
      'Aprende a transformar los nervios en magnetismo procesal. Postura, cadencia vocal, gestión de la mirada y control del espacio en el estrado para proyectar autoridad inmediata sin impostaciones.',
    lessons: [
      'Clase 1: Psicología del Tribunal: Qué busca realmente un juez',
      'Clase 2: Acústica y modulación: El poder de las pausas dramáticas',
      'Clase 3: Lenguaje no verbal femenino: Reclamar el espacio sin pedir disculpas',
      'Clase 4: Cómo responder ante interrupciones y descalificaciones en sala',
    ],
    skills: ['Presencia escénica', 'Modulación vocal', 'Manejo del estrés bajo presión'],
    deliverable: 'Manual Práctico de Presencia en Sala & Checklist de Entrada',
    tone: 'pink',
  },
  {
    id: 'mod-2',
    number: '02',
    title: 'Teoría del Caso Imbatible & Narrativa Persuasiva',
    duration: '3h 30m · 5 Clases',
    description:
      'El derecho no lo gana quien tiene más leyes, sino quien construye la narrativa fáctica y jurídica más verosímil y memorable. Estructuraremos casos reales de alta complejidad desde cero.',
    lessons: [
      'Clase 1: El Triángulo de Hierro: Hechos, derecho y evidencia',
      'Clase 2: Storytelling procesal: Cómo enganchar al juez desde el minuto uno',
      'Clase 3: Redacción del Alegato de Apertura: Estructura cinematográfica',
      'Clase 4: Anticipación de las defensas y trampas de la contraparte',
      'Clase 5: Mapeo de fortalezas y debilidades probatorias',
    ],
    skills: ['Estrategia procesal', 'Narrativa jurídica persuasiva', 'Diseño de alegatos'],
    deliverable: 'Plantilla de Matriz de Teoría del Caso en Excel y Word',
    tone: 'yellow',
  },
  {
    id: 'mod-3',
    number: '03',
    title: 'Interrogatorio, Contra-interrogatorio & Objeciones',
    duration: '3h 15m · 5 Clases',
    description:
      'La técnica clínica más temida y más poderosa. Aprende a formular preguntas cerradas que acorralan, a controlar testigos hostiles y a objetar en 0.5 segundos con base legal irrebatible.',
    lessons: [
      'Clase 1: Reglas de oro del Interrogatorio Directo a testigos propios',
      'Clase 2: La ciencia del Contra-interrogatorio: El método de un solo hecho',
      'Clase 3: Domar al testigo pericial: Cómo desacreditar peritajes técnicos',
      'Clase 4: Reflejos procesales: El manual relámpago de objeciones',
      'Clase 5: Alegato de Clausura: Hilvanar la prueba para no dejar dudas',
    ],
    skills: ['Contra-interrogatorio quirúrgico', 'Objeciones relámpago', 'Cierre dramático'],
    deliverable: 'Guía de Objeciones en 1 Página & Matriz de Testigos Hostiles',
    tone: 'purple',
  },
  {
    id: 'mod-4',
    number: '04',
    title: 'Marca Personal Jurídica, Negociación & Tarifas Pro',
    duration: '2h 30m · 4 Clases',
    description:
      'Litigar con excelencia debe traducirse en reconocimiento y remuneración acorde a tu talento. Aprende a cobrar por valor, negociar acuerdos extrajudiciales y posicionarte como referente.',
    lessons: [
      'Clase 1: La abogada contemporánea: Estilo, credibilidad y autenticidad',
      'Clase 2: Negociación de acuerdos según el método Harvard adaptado a Latam',
      'Clase 3: Cómo fijar honorarios premium sin sentir culpa ni regatear',
      'Clase 4: Redes sociales y presencia pública para juristas éticas',
    ],
    skills: ['Fijación de honorarios', 'Negociación estratégica', 'Marca personal ética'],
    deliverable: 'Calculadora de Honorarios por Valor & Minuta de Contrato Premium',
    tone: 'mint',
  },
];

export function PoufSyllabus() {
  const [activeModule, setActiveModule] = useState<Module>(MODULES[0]);

  return (
    <section id="temario" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Eyebrow>Plan de Estudios Clínico</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          Un temario meticulosamente curado.
        </Heading>
        <div className="mt-3">
          <Text muted size="lg">
            4 módulos intensivos diseñados para llevarte de la inseguridad teórica a la maestría en tribunales.
          </Text>
        </div>
      </div>

      {/* Pouf Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 1st-Pouf RowCards */}
        <div className="lg:col-span-5 space-y-3">
          {MODULES.map((m) => {
            const isSelected = activeModule.id === m.id;
            return (
              <RowCard
                key={m.id}
                onClick={() => setActiveModule(m)}
                selected={isSelected}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-[#E31B6D]">
                    {m.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-pouf font-black text-sm text-ink truncate leading-tight">
                      {m.title}
                    </p>
                    <p className="text-xs font-bold text-muted mt-0.5">
                      {m.duration}
                    </p>
                  </div>
                  <Dot tone={m.tone} />
                </div>
              </RowCard>
            );
          })}
        </div>

        {/* Right Column: 1st-Pouf Detailed Card */}
        <div className="lg:col-span-7">
          <Card motion="lift">
            <div className="flex items-center justify-between pb-4 border-b border-pink-100">
              <Badge tone={activeModule.tone}>Módulo {activeModule.number}</Badge>
              <span className="text-xs font-mono font-bold text-muted">{activeModule.duration}</span>
            </div>

            <Heading level={2} className="mt-4 text-ink">
              {activeModule.title}
            </Heading>
            <div className="mt-3">
              <Text size="md" muted>
                {activeModule.description}
              </Text>
            </div>

            {/* Lessons List in Cushion Rows */}
            <div className="mt-6 space-y-2">
              <p className="text-xs font-black uppercase tracking-wider text-muted mb-2">
                Clases del Módulo:
              </p>
              {activeModule.lessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-control bg-[#FFF9FB] cushion-row flex items-center gap-3 text-xs sm:text-sm font-bold text-ink"
                >
                  <span className="w-5 h-5 rounded-full bg-pink text-ink flex items-center justify-center text-[10px] font-black shrink-0">
                    {idx + 1}
                  </span>
                  <span>{lesson}</span>
                </div>
              ))}
            </div>

            {/* Skills & Deliverables */}
            <div className="mt-6 pt-4 border-t border-pink-100 space-y-3">
              <div className="flex flex-wrap gap-2">
                {activeModule.skills.map((skill, idx) => (
                  <Badge key={idx} tone={activeModule.tone}>
                    ✓ {skill}
                  </Badge>
                ))}
              </div>

              <div className="p-3 rounded-control bg-[#FFF5F9] cushion-row text-xs font-bold text-ink">
                <span className="text-muted block text-[11px]">Entregable Exclusivo:</span>
                <span className="text-[#E31B6D] font-black">{activeModule.deliverable}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
