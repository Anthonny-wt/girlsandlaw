import { useState } from 'react';
import { Card } from './surface';
import { Eyebrow, Heading, Text } from './text';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

export function PoufFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].faq;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <Heading level={2} className="mt-2 text-ink">
          {t.title}
        </Heading>
      </div>

      <div className="space-y-4">
        {t.items.map((faq, idx) => {
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
