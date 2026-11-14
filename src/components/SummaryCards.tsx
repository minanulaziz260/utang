import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wallet,
} from 'lucide-react';
import type { DashboardSummary } from '../types/debt';
import { formatRupiah } from '../utils/formatters';

interface SummaryCardsProps {
  summary: DashboardSummary;
  totalCount: number;
}

export function SummaryCards({ summary, totalCount }: SummaryCardsProps) {
  return (
    <section aria-labelledby="summary-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="summary-heading"
          className="text-sm font-semibold text-slate-800"
        >
          Statistik Piutang
        </h2>
        <span className="text-xs text-slate-600">
          Angka contoh (data simulasi)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-4">
        {/* Kartu utama: Total Piutang mendapat porsi lebih lebar sebagai focal point */}
        <article className="sm:col-span-2 xl:col-span-5 rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-700 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-600">
                Total Piutang
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {formatRupiah(summary.totalReceivables)}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Wallet className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Akumulasi dari {totalCount} catatan transaksi simulasi
          </p>
        </article>

        {/* Belum Lunas */}
        <article className="xl:col-span-3 rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-600">Belum Lunas</p>
              <p className="mt-2 text-xl font-bold text-slate-900 tabular-nums">
                {formatRupiah(summary.unpaidAmount)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            {summary.unpaidCount} transaksi aktif berjalan
          </p>
        </article>

        {/* Sudah Lunas */}
        <article className="xl:col-span-2 rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-600">Sudah Lunas</p>
              <p className="mt-2 text-xl font-bold text-slate-900 tabular-nums">
                {formatRupiah(summary.paidAmount)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            {summary.paidCount} transaksi selesai
          </p>
        </article>

        {/* Terlambat */}
        <article className="xl:col-span-2 rounded-xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-600">Terlambat</p>
              <p className="mt-2 text-xl font-bold text-rose-800 tabular-nums">
                {formatRupiah(summary.overdueAmount)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-600">
            {summary.overdueCount} melewati jatuh tempo
          </p>
        </article>
      </div>
    </section>
  );
}
