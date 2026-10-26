import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';
import type { Tone } from './tone';

const cta = cva(
  'pouf-cta rounded-card px-6 py-12 sm:px-12 sm:py-16 flex flex-col items-center text-center gap-4 cushion-control shadow-xl',
  {
    variants: {
      tone: {
        pink: 'bg-pink text-[var(--on-accent)]',
        purple: 'bg-purple text-[var(--on-accent)]',
        blue: 'bg-blue text-[var(--on-accent)]',
        mint: 'bg-mint text-[var(--on-accent)]',
        yellow: 'bg-yellow text-[var(--on-accent)]',
        surface: 'bg-surface text-ink',
      },
    },
    defaultVariants: { tone: 'pink' },
  }
);

interface CTAProps {
  title: string;
  description?: string;
  action: ReactNode;
  tone?: 'pink' | 'purple' | 'blue' | 'mint' | 'yellow' | 'surface';
  className?: string;
}

export function CTA({ title, description, action, tone = 'pink', className = '' }: CTAProps) {
  return (
    <section className={`${cta({ tone })} ${className}`}>
      <h2 className="m-0 font-black font-pouf text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-[1.05] text-current">
        {title}
      </h2>
      {description && (
        <p className="m-0 font-bold font-pouf text-[16px] sm:text-[18px] text-current/80 max-w-[52ch]">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-3 justify-center mt-3">{action}</div>
    </section>
  );
}
