import {
  Building2,
  Eye,
  LayoutGrid,
  ReceiptText,
  Search,
  Table2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DebtStatus, DebtTransaction } from '../types/debt';
import { formatDateId, formatRupiah } from '../utils/formatters';
import { FriendDebtGroupList } from './FriendDebtGroupList';
import { StatusBadge } from './StatusBadge';

interface TransactionTableProps {
  transactions: DebtTransaction[];
  title?: string;
  limit?: number;
  showFilters?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onRecordPayment: (transaction: DebtTransaction) => void;
  onViewDetail: (transaction: DebtTransaction) => void;
  onDeleteTransaction: (transaction: DebtTransaction) => void;
  onOpenAddDebt: () => void;
  onAddDebtForFriend: (friendName: string) => void;
  onCopySummary?: (friendName: string) => void;
}

const STATUS_FILTERS: { id: 'all' | DebtStatus; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'belum_lunas', label: 'Belum Lunas' },
  { id: 'terlambat', label: 'Terlambat' },
  { id: 'lunas', label: 'Sudah Lunas' },
];

export function TransactionTable({
  transactions,
  title = 'Transaksi Terbaru',
  limit,
  showFilters = true,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onRecordPayment,
  onViewDetail,
  onDeleteTransaction,
  onOpenAddDebt,
  onAddDebtForFriend,
  onCopySummary,
}: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DebtStatus>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = transactions.filter((trx) => {
      const matchesStatus =
        statusFilter === 'all' ? true : trx.status === statusFilter;
      const matchesQuery =
        query === '' ||
        trx.friendName.toLowerCase().includes(query) ||
        trx.bank.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }, [transactions, searchQuery, statusFilter, limit]);

  const hasActiveFilter = searchQuery.trim() !== '' || statusFilter !== 'all';

  return (
    <section
      aria-labelledby="transactions-heading"
      className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden"
    >
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2
              id="transactions-heading"
              className="text-base font-semibold text-slate-900"
            >
              {title}
            </h2>
            <p className="text-xs text-slate-600">
              Menampilkan {filteredTransactions.length} dari{' '}
              {transactions.length} catatan simulasi
            </p>
          </div>

          <div
            className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 self-start sm:self-auto"
            role="group"
            aria-label="Mode tampilan transaksi"
          >
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              aria-pressed={viewMode === 'grouped'}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 min-h-[36px] text-xs font-medium transition-colors ${
                viewMode === 'grouped'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Per Teman</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 min-h-[36px] text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tabel</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1">
              <label htmlFor="trx-search" className="sr-only">
                Cari nama teman atau bank
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
                aria-hidden="true"
              />
              <input
                id="trx-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama teman atau bank..."
                className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-9 py-2 min-h-[44px] text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus kata kunci pencarian"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter status hutang"
            >
              {STATUS_FILTERS.map((filter) => {
                const active = statusFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setStatusFilter(filter.id)}
                    aria-pressed={active}
                    className={`rounded-lg px-3 py-2 min-h-[40px] text-xs font-medium transition-colors border ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="p-8 text-center space-y-2"
        >
          <p className="text-sm font-medium text-slate-800">
            Memuat data transaksi...
          </p>
          <p className="text-xs text-slate-600">
            Menyiapkan daftar piutang simulasi.
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <div role="alert" className="p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-rose-800">
            Gagal memuat transaksi
          </p>
          <p className="text-xs text-slate-600">{errorMessage}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 min-h-[44px] text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && filteredTransactions.length === 0 && (
        <div className="p-8 sm:p-10 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {hasActiveFilter
              ? 'Tidak ada transaksi yang cocok'
              : 'Belum ada catatan hutang'}
          </p>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            {hasActiveFilter
              ? 'Ubah kata kunci pencarian atau pilih filter status lain.'
              : 'Tambahkan catatan hutang pertama untuk mulai memantau piutang teman.'}
          </p>
          <div className="pt-1 flex justify-center gap-2">
            {hasActiveFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 min-h-[44px] text-xs font-medium text-slate-800 hover:bg-slate-50"
              >
                Reset Filter
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAddDebt}
                className="inline-flex items-center rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 min-h-[44px] text-xs font-medium"
              >
                Tambah Hutang Baru
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grouped Friend Cards View (default) */}
      {!isLoading &&
        !errorMessage &&
        filteredTransactions.length > 0 &&
        viewMode === 'grouped' && (
          <div className="p-4 sm:p-5 bg-slate-50/50">
            <FriendDebtGroupList
              transactions={filteredTransactions}
              onRecordPayment={onRecordPayment}
              onViewDetail={onViewDetail}
              onDeleteTransaction={onDeleteTransaction}
              onAddDebtForFriend={onAddDebtForFriend}
              onCopySummary={(friendName) => onCopySummary?.(friendName)}
            />
          </div>
        )}

      {/* Desktop 7-Column Table View */}
      {!isLoading &&
        !errorMessage &&
        filteredTransactions.length > 0 &&
        viewMode === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700">
                  <th scope="col" className="py-3.5 pl-5 pr-3">
                    Nama Teman
                  </th>
                  <th scope="col" className="py-3.5 px-3">
                    Bank/Layanan
                  </th>
                  <th scope="col" className="py-3.5 px-3 text-right">
                    Nominal Hutang
                  </th>
                  <th scope="col" className="py-3.5 px-3">
                    Tanggal Jatuh Tempo
                  </th>
                  <th scope="col" className="py-3.5 px-3 text-right">
                    Sisa Hutang
                  </th>
                  <th scope="col" className="py-3.5 px-3">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-5 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 pl-5 pr-3 font-medium text-slate-900">
                      {trx.friendName}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2
                          className="h-3.5 w-3.5 text-slate-500 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{trx.bank}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-900 tabular-nums whitespace-nowrap">
                      {formatRupiah(trx.principalAmount)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 tabular-nums whitespace-nowrap">
                      {formatDateId(trx.dueDate)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                      {formatRupiah(trx.remainingAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={trx.status} />
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {trx.remainingAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => onRecordPayment(trx)}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 min-h-[36px] text-xs font-medium transition-colors"
                          >
                            <ReceiptText
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>Bayar</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewDetail(trx)}
                          aria-label={`Lihat detail hutang ${trx.friendName}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1.5 min-h-[36px] text-xs font-medium transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Detail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </section>
  );
}
