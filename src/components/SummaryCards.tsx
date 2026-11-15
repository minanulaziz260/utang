import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wallet,
} from 'lucide-react';
import type { DashboardSummary } from '../types/debt';
import { formatRupiah } from '../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          Statistik Piutang
        </h2>
        <span className="text-xs text-muted-foreground">
          Ringkasan data simulasi lokal
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
        <Card className="sm:col-span-2 xl:col-span-5 border-l-4 border-l-primary flex flex-col justify-between">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Piutang
              </CardTitle>
              <p className="mt-2 text-2xl font-bold tracking-tight text-foreground tabular-nums sm:text-3xl">
                {formatRupiah(summary.totalReceivables)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-primary">
              <Wallet className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground">
              Akumulasi dari {totalCount} catatan transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3 flex flex-col justify-between">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Belum Lunas
              </CardTitle>
              <p className="mt-2 text-xl font-bold tracking-tight text-foreground tabular-nums">
                {formatRupiah(summary.unpaidAmount)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-200 bg-amber-50 text-amber-800">
              <Clock className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground">
              {summary.unpaidCount} transaksi aktif berjalan
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 flex flex-col justify-between">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Sudah Lunas
              </CardTitle>
              <p className="mt-2 text-xl font-bold tracking-tight text-foreground tabular-nums">
                {formatRupiah(summary.paidAmount)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground">
              {summary.paidCount} transaksi selesai
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 flex flex-col justify-between">
          <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Terlambat
              </CardTitle>
              <p className="mt-2 text-xl font-bold tracking-tight text-rose-800 tabular-nums">
                {formatRupiah(summary.overdueAmount)}
              </p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-800">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-xs text-muted-foreground">
              {summary.overdueCount} melewati jatuh tempo
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
