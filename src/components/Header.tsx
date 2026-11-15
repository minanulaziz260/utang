import { ClipboardPaste, Plus, Wallet } from 'lucide-react';
import type { NavSection } from '../types/debt';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:hidden">
            <Wallet className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                <span className="lg:hidden">TemanHutang</span>
                <span className="hidden lg:inline">{current.title}</span>
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Data Lokal
              </Badge>
            </div>
            <p className="hidden truncate text-xs text-muted-foreground lg:block">
              {current.subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={onOpenPasteDebt}>
            <ClipboardPaste className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">Paste Data</span>
            <span className="sm:hidden">Paste</span>
          </Button>
          <Button onClick={onOpenAddDebt}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Tambah Hutang</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
