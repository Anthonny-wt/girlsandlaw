import { cva, cx } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { toneClass, type Tone } from './tone';

interface BlobProps {
  children?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const blob = cva(
  [
    'pouf-blob inline-flex items-center justify-center flex-none text-[var(--on-accent)]',
    'bg-[var(--tone,var(--pink))] cushion-blob [&>svg]:[transform:translateY(-2px)]',
  ],
  {
    variants: {
      size: {
        sm: 'w-11 h-11 rounded-[14px] text-[20px]',
        md: 'w-[60px] h-[60px] rounded-[18px] text-[26px]',
        lg: 'w-20 h-20 rounded-blob text-[36px]',
      },
    },
    defaultVariants: { size: 'lg' },
  }
);

export function Blob({ children, icon, tone = 'pink', size = 'lg', label, className = '' }: BlobProps) {
  return (
    <span
      className={cx(blob({ size }), toneClass(tone), className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {icon ?? children}
    </span>
  );
}

export function Badge({
  children,
  tone = 'pink',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        'pouf-badge inline-flex items-center gap-[6px] text-[12px] font-black tracking-[0.4px] uppercase',
        'text-[var(--on-accent)] bg-[var(--tone,var(--pink))] rounded-pill px-3 py-[5px] [box-shadow:none]',
        'flex-none whitespace-nowrap self-start',
        toneClass(tone),
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = 'pink' }: { tone?: Tone }) {
  return (
    <span
      className={cx(
        'pouf-dot w-[9px] h-[9px] rounded-[50%] bg-[var(--tone,var(--pink))]',
        '[box-shadow:inset_0_-2px_0_rgba(0,0,0,0.15)] flex-none',
        toneClass(tone)
      )}
      aria-hidden="true"
    />
  );
}
