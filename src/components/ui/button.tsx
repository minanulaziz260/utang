import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'soft';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:
    'bg-primary text-primary-foreground shadow-xs hover:bg-emerald-800 active:bg-emerald-900',
  secondary:
    'bg-secondary text-secondary-foreground shadow-xs hover:bg-zinc-200/80',
  outline:
    'border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
  ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
  destructive:
    'bg-destructive text-destructive-foreground shadow-xs hover:bg-rose-800',
  soft: 'border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: 'min-h-[44px] px-4 py-2 text-sm',
  sm: 'min-h-[36px] rounded-md px-3 text-xs',
  lg: 'min-h-[44px] rounded-md px-6 text-sm',
  icon: 'h-10 w-10 p-0',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
}
