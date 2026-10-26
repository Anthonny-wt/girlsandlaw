import { cva, cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { toneClass, type Tone } from './tone';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

const heading = cva('font-black font-pouf [text-wrap:balance]', {
  variants: {
    level: {
      1: 'pouf-h1 text-[36px] sm:text-[48px] tracking-[-1px] leading-[1.1]',
      2: 'pouf-h2 text-[24px] sm:text-[32px] tracking-[-0.5px] leading-[1.2]',
      3: 'pouf-h3 text-[18px] sm:text-[22px] tracking-[-0.2px] leading-[1.2]',
    },
  },
  defaultVariants: { level: 2 },
});

export function Heading({ children, level = 2, className = '' }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={`${heading({ level })} ${className}`}>{children}</Tag>;
}

export function Highlight({
  children,
  tone = 'pink',
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={cx(
        'pouf-highlight inline-block px-3 py-0.5 rounded-[12px] text-[var(--on-accent)] bg-[var(--tone,var(--pink))]',
        '[box-shadow:inset_0_-4px_0_rgba(0,0,0,0.1)] font-black',
        toneClass(tone)
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`pouf-eyebrow text-[12px] sm:text-[13px] tracking-[2px] uppercase font-black text-muted ${className}`}>
      {children}
    </div>
  );
}

interface TextProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  muted?: boolean;
  className?: string;
}

const textCva = cva('pouf-text font-bold font-pouf [overflow-wrap:anywhere]', {
  variants: {
    size: {
      lg: 'text-[17px] leading-relaxed',
      md: 'text-[15px] leading-relaxed',
      sm: 'text-[13px] leading-normal',
    },
    muted: { true: 'text-muted' },
  },
  defaultVariants: { size: 'md' },
});

export function Text({ children, size = 'md', muted, className = '' }: TextProps) {
  return (
    <span className={`${textCva({ size, muted })} ${className}`}>
      {children}
    </span>
  );
}
