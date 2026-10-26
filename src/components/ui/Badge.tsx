import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'pink' | 'dark' | 'outline';
}

export default function Badge({ children, className, variant = 'pink' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full',
        {
          'bg-girls-pink text-white': variant === 'pink',
          'bg-girls-dark text-white': variant === 'dark',
          'border border-girls-pink text-girls-pink': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
