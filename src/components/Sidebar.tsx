import {
  ArrowLeftRight,
  History,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
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
      className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-slate-200"
    >
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white">
          <Wallet className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            TemanHutang
          </span>
          <p className="text-xs text-slate-600">Catatan Piutang Pribadi</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? 'text-emerald-700' : 'text-slate-500'
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-semibold text-slate-800">Mode Simulasi</p>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Menampilkan data contoh di browser. Belum terhubung ke Supabase.
        </p>
      </div>
    </aside>
  );
}
