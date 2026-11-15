import {
  ArrowLeftRight,
  History,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { NavSection } from '../types/debt';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'friends', label: 'Data Teman', icon: Users },
  { id: 'transactions', label: 'Transaksi Hutang', icon: ArrowLeftRight },
  { id: 'payments', label: 'Riwayat Pembayaran', icon: History },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];

export function Sidebar({ activeSection, onSelectSection }: SidebarProps) {
  return (
    <aside
      aria-label="Navigasi utama"
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card"
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
          <Wallet className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            TemanHutang
          </span>
          <p className="text-xs text-muted-foreground">Catatan Piutang</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex w-full min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg border border-border bg-muted/50 p-3.5">
        <p className="text-xs font-semibold text-foreground">Penyimpanan Lokal</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Data tersimpan di browser ini. Belum terhubung ke Supabase.
        </p>
      </div>
    </aside>
  );
}
