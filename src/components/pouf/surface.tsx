import { cva } from 'class-variance-authority';
import type { ReactNode } from 'react';

const card = cva('pouf-card bg-surface rounded-card cushion-card transition-all duration-200', {
  variants: {
    variant: {
      default: 'px-8 pt-[calc(32px-var(--lip)/2)] pb-[calc(32px+var(--lip)/2)]',
      flush: 'p-0',
      tight: 'px-5 pt-[calc(20px-var(--lip)/2)] pb-[calc(20px+var(--lip)/2)]',
    },
    motion: {
      none: '',
      lift:
        '[transition:transform_160ms_ease,box-shadow_160ms_ease] hover:[transform:translateY(-4px)] hover:shadow-xl motion-reduce:[transform:none]',
      'tilt-left':
        '[transform:rotate(-0.6deg)] [transition:transform_160ms_ease] hover:[transform:rotate(0deg)_translateY(-4px)] motion-reduce:[transform:none]',
      'tilt-right':
        '[transform:rotate(0.6deg)] [transition:transform_160ms_ease] hover:[transform:rotate(0deg)_translateY(-4px)] motion-reduce:[transform:none]',
    },
  },
  defaultVariants: { variant: 'default', motion: 'none' },
});

export interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'flush' | 'tight';
  motion?: 'none' | 'lift' | 'tilt-left' | 'tilt-right';
  className?: string;
}

export function Card({ children, variant, motion, className = '' }: CardProps) {
  return <div className={`${card({ variant, motion })} ${className}`}>{children}</div>;
}

export interface RowCardProps {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const rowCard = cva(
  [
    'pouf-rowcard block w-full text-left [font:inherit] text-inherit border-none',
    'rounded-control px-4 pt-[calc(16px-var(--lip-row)/2)] pb-[calc(16px+var(--lip-row)/2)]',
    '[transition:box-shadow_140ms_ease,transform_140ms_ease]',
  ],
  {
    variants: {
      interactive: { true: 'cursor-pointer' },
      selected: {
        true: [
          'bg-pink text-[var(--on-accent)] cushion-control',
          '[&_.pouf-h1]:text-[var(--on-accent)] [&_.pouf-h2]:text-[var(--on-accent)]',
          '[&_.pouf-h3]:text-[var(--on-accent)] [&_.pouf-text]:text-[var(--on-accent)]',
        ].join(' '),
        false: 'bg-surface cushion-row',
      },
    },
    compoundVariants: [
      {
        interactive: true,
        selected: false,
        className:
          'hover:cushion-row-hover hover:[transform:translateY(-2px)] active:[transform:translateY(1px)] active:cushion-control-active',
      },
    ],
    defaultVariants: { selected: false },
  }
);

export function RowCard({ children, onClick, selected, className = '' }: RowCardProps) {
  const cvaClass = rowCard({ interactive: !!onClick, selected: !!selected });

  if (onClick) {
    return (
      <button
        type="button"
        className={`${cvaClass} ${className}`}
        onClick={onClick}
        aria-pressed={selected}
        data-selected={selected || undefined}
      >
        {children}
      </button>
    );
  }
  return (
    <div className={`${cvaClass} ${className}`} data-selected={selected || undefined}>
      {children}
    </div>
  );
}
