import { cva, cx } from 'class-variance-authority';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { toneClass, type Tone } from './tone';

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className' | 'style' | 'onClick' | 'type' | 'disabled'
  > {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tone?: Tone;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'quiet';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
  label?: string;
}

const button = cva(
  [
    'pouf-btn relative items-center justify-center gap-2 font-pouf font-black leading-none',
    'border-none cursor-pointer [touch-action:manipulation]',
    '[transition:box-shadow_120ms_ease,transform_120ms_ease]',
    'enabled:active:[transform:translateY(2px)] enabled:active:cushion-control-active',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'text-[13px] px-4 py-[9px] min-h-[38px] rounded-[14px]',
        md: 'text-[15px] px-[26px] py-[14px] min-h-12 rounded-control',
        lg: 'text-[17px] px-8 py-[18px] min-h-14 rounded-control',
      },
      variant: {
        solid:
          'text-[var(--on-accent)] bg-[var(--tone,var(--pink))] cushion-control disabled:cushion-control-active disabled:[transform:translateY(2px)]',
        quiet:
          'text-[var(--quiet-ink,var(--ink))] bg-transparent [box-shadow:inset_0_0_0_2px_rgba(255,179,209,0.55)] enabled:hover:bg-bg enabled:hover:text-ink enabled:hover:cushion-field disabled:[box-shadow:none]',
      },
      block: {
        true: 'flex w-full',
        false: 'inline-flex',
      },
      shape: {
        label: '',
        icon: '',
      },
    },
    compoundVariants: [
      { size: 'sm', shape: 'icon', className: 'w-[38px] px-0' },
      { size: 'md', shape: 'icon', className: 'w-12 px-0' },
      { size: 'lg', shape: 'icon', className: 'w-14 px-0' },
    ],
    defaultVariants: { size: 'md', variant: 'solid', block: false, shape: 'label' },
  }
);

export function buttonClasses(
  opts: {
    tone?: Tone;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'solid' | 'quiet';
    block?: boolean;
    shape?: 'label' | 'icon';
  } = {}
): string {
  const { tone = 'pink', size, variant, block, shape } = opts;
  return cx(button({ size, variant, block, shape }), toneClass(tone));
}

function LoadingSpinner() {
  return (
    <span
      className="size-[15px] rounded-[50%] border-[3px] border-solid border-[color-mix(in_srgb,currentColor_24%,transparent)] border-t-current [animation:pouf-spin_620ms_linear_infinite]"
      aria-hidden="true"
    />
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    onClick,
    tone = 'pink',
    size = 'md',
    variant = 'solid',
    block,
    disabled,
    loading,
    type = 'button',
    label,
    ...nativeProps
  },
  ref
) {
  return (
    <button
      ref={ref}
      {...nativeProps}
      type={type}
      className={buttonClasses({ tone, size, variant, block })}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={label}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
});
