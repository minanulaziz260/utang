import { ClipboardPaste, Plus, Wallet } from 'lucide-react';
import type { NavSection } from '../types/debt';

interface HeaderProps {
  activeSection: NavSection;
  onOpenAddDebt: () => void;
  onOpenPasteDebt: () => void;
}

const SECTION_TITLES: Record<NavSection, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Ringkasan Piutang',
    subtitle: 'Pantau catatan hutang teman dan jadwal jatuh tempo.',
  },
  friends: {
    title: 'Data Teman',
    subtitle: 'Daftar kontak teman yang memiliki catatan piutang.',
  },
  transactions: {
    title: 'Transaksi Hutang',
    subtitle: 'Kelola seluruh catatan pinjaman dan status pembayaran.',
  },
  payments: {
    title: 'Riwayat Pembayaran',
    subtitle: 'Log cicilan dan pelunasan yang sudah dicatat.',
  },
  settings: {
    title: 'Pengaturan',
    subtitle: 'Konfigurasi aplikasi dan kesiapan integrasi backend.',
  },
};

export function Header({
  activeSection,
  onOpenAddDebt,
  onOpenPasteDebt,
}: HeaderProps) {
  const current = SECTION_TITLES[activeSection];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex lg:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <Wallet className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                <span className="lg:hidden">TemanHutang</span>
                <span className="hidden lg:inline">{current.title}</span>
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                Data Simulasi
              </span>
            </div>
            <p className="hidden lg:block text-xs text-slate-600 truncate">
              {current.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenPasteDebt}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3 sm:px-3.5 py-2.5 min-h-[44px] text-sm font-medium transition-colors"
          >
            <ClipboardPaste className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span className="hidden sm:inline">Paste Data</span>
            <span className="sm:hidden">Paste</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddDebt}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white px-3.5 sm:px-4 py-2.5 min-h-[44px] text-sm font-medium transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Tambah Hutang</span>
          </button>
        </div>
      </div>
    </header>
  );
}
