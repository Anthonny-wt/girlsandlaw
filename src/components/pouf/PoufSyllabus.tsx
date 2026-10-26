import { useState } from 'react';
import { Card, RowCard } from './surface';
import { Badge, Dot } from './media';
import { Eyebrow, Heading, Text } from './text';
import { useLanguage, DICTIONARY } from '@/lib/i18n';

type Tone = 'pink' | 'purple' | 'yellow' | 'mint';
const TONES: Tone[] = ['pink', 'yellow', 'purple', 'mint'];

export function PoufSyllabus() {
  const { lang } = useLanguage();
  const t = DICTIONARY[lang].syllabus;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const modules = t.modules;
  const activeModule = modules[selectedIndex] || modules[0];
  const activeTone = TONES[selectedIndex % TONES.length];

  return (
    <section id="temario" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Pouf Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive 1st-Pouf RowCards */}
        <div className="lg:col-span-5 space-y-3">
          {modules.map((m, idx) => {
            const isSelected = selectedIndex === idx;
            const itemTone = TONES[idx % TONES.length];
            return (
              <RowCard
                key={m.id}
                onClick={() => setSelectedIndex(idx)}
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
                  <Dot tone={itemTone} />
                </div>
              </RowCard>
            );
          })}
        </div>

        {/* Right Column: 1st-Pouf Detailed Card */}
        <div className="lg:col-span-7">
          <Card motion="lift">
            <div className="flex items-center justify-between pb-4 border-b border-pink-100">
              <Badge tone={activeTone}>
                {lang === 'es' ? 'Módulo' : 'Module'} {activeModule.number}
              </Badge>
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
                {t.lessonsTitle}
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
                  <Badge key={idx} tone={activeTone}>
                    ✓ {skill}
                  </Badge>
                ))}
              </div>

              <div className="p-3 rounded-control bg-[#FFF5F9] cushion-row text-xs font-bold text-ink">
                <span className="text-muted block text-[11px]">{t.deliverableLabel}</span>
                <span className="text-[#E31B6D] font-black">{activeModule.deliverable}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
