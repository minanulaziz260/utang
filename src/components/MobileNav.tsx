import {
  ArrowLeftRight,
  History,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { NavSection } from '../types/debt';

interface MobileNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

const MOBILE_ITEMS: {
  id: NavSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'friends', label: 'Teman', icon: Users },
  { id: 'transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { id: 'payments', label: 'Riwayat', icon: History },
  { id: 'settings', label: 'Setelan', icon: Settings },
];

export function MobileNav({ activeSection, onSelectSection }: MobileNavProps) {
  return (
    <nav
      aria-label="Navigasi seluler"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <span
                  className="absolute top-0 inset-x-3 h-0.5 rounded-b bg-primary"
                  aria-hidden="true"
                />
              )}
              <Icon
                className={cn('h-5 w-5', isActive ? 'text-primary' : '')}
                aria-hidden="true"
              />
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
