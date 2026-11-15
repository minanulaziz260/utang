import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  titleId: string;
  maxWidthClass?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  titleId,
  maxWidthClass = 'sm:max-w-lg',
  icon,
  children,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-zinc-950/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          'w-full rounded-t-2xl sm:rounded-xl border border-border bg-card text-card-foreground shadow-lg max-h-[90dvh] overflow-y-auto',
          maxWidthClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            {icon}
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-base font-semibold leading-none tracking-tight text-foreground"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Tutup dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
