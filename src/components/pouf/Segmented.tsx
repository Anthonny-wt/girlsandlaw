import clsx from 'clsx';
import { type Tone } from './tone';
import { buttonClasses } from './Button';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  label: string;
  tone?: Tone;
  className?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  tone = 'pink',
  className = '',
}: SegmentedProps<T>) {
  return (
    <div
      className={`pouf-seg inline-flex gap-2 p-1.5 rounded-pill bg-white/70 cushion-row ${className}`}
      role="group"
      aria-label={label}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className={clsx(
              buttonClasses({ size: 'sm', tone: on ? tone : undefined, variant: on ? 'solid' : 'quiet' }),
              on
                ? '[transform:translateY(1px)] cushion-control'
                : 'bg-transparent text-muted hover:text-ink [box-shadow:none]'
            )}
            aria-pressed={on}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
