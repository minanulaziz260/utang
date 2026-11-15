import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'destructive';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border bg-background text-foreground',
  success: 'border-emerald-200 bg-emerald-100 text-emerald-900',
  warning: 'border-amber-200 bg-amber-100 text-amber-900',
  destructive: 'border-rose-200 bg-rose-100 text-rose-900',
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors',
        BADGE_CLASSES[variant],
        className
      )}
      {...props}
    />
  );
}
