import { useState } from 'react';
import { Card } from './surface';
import { Eyebrow, Heading, Text } from './text';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: '¿Para qué ramas del derecho aplica esta Masterclass?',
    answer:
      'Las técnicas de argumentación, persuasión en sala, teoría del caso y contra-interrogatorio son aplicables a litigio civil, penal, laboral, constitucional y arbitrajes comerciales. Además, los principios de negociación y presencia escénica fortalecen a cualquier jurista en mediaciones y juntas de directorio.',
  },
  {
    question: '¿Qué pasa si aún soy estudiante o recién egresada?',
    answer:
      'Es el momento idóneo. La mayoría de facultades enseñan teoría abstracta pero no cómo comportarse, litigar o defender una postura en audiencia real. Llegarás a tus primeros litigios con la seguridad y el aplomo de quien lleva años en tribunales.',
  },
  {
    question: '¿Durante cuánto tiempo tengo acceso a los contenidos?',
    answer:
      'El acceso a todas las clases grabadas en 4K, actualizaciones futuras y al Vault de plantillas procesales es de por vida. Puedes ver las lecciones cuantas veces quieras y a tu propio ritmo desde cualquier dispositivo.',
  },
  {
    question: '¿Cómo funcionan las sesiones en vivo del plan VIP?',
    answer:
      'Se realizan vía Zoom con grupos reducidos de máximo 15 participantes por sala. Tendrás roles asignados (abogada demandante, defensa, objeciones) y recibirás feedback en tiempo real de Roxana Rivera y socias invitadas.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos tarjetas de crédito y débito internacionales (Visa, Mastercard, American Express), Apple Pay, Google Pay y transferencia bancaria directa para países seleccionados.',
  },
];

export function PoufFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <Eyebrow>Preguntas Frecuentes</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          Todo lo que necesitas saber.
        </Heading>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card
              key={idx}
              variant="tight"
              className="transition-all duration-150"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-pouf font-black text-base sm:text-lg text-ink">
                  {faq.question}
                </span>
                <span className={`text-lg font-black text-[#E31B6D] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {isOpen && (
                <div className="mt-4 pt-3 border-t border-pink-100 text-xs sm:text-sm font-bold text-muted leading-relaxed">
                  <Text muted size="sm">
                    {faq.answer}
                  </Text>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
