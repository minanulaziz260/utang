import {
  ArrowLeftRight,
  History,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
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
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
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
              className={`relative flex flex-col items-center justify-center gap-1 py-2 px-1 min-h-[56px] text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-emerald-800 bg-emerald-50/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span
                  className="absolute top-0 inset-x-3 h-0.5 bg-emerald-700 rounded-b"
                  aria-hidden="true"
                />
              )}
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
