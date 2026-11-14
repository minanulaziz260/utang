import { Database, Phone, Plus, RotateCcw, Users } from 'lucide-react';
import { BANK_OPTIONS } from '../constants/banks';
import type { DebtTransaction, Friend, PaymentRecord } from '../types/debt';
import { formatDateId, formatRupiah } from '../utils/formatters';

interface FriendsViewProps {
  friends: Friend[];
  transactions: DebtTransaction[];
  onAddDebtForFriend: (friend: Friend) => void;
}

export function FriendsView({
  friends,
  transactions,
  onAddDebtForFriend,
}: FriendsViewProps) {
  return (
    <section aria-labelledby="friends-heading" className="space-y-4">
      <div>
        <h2 id="friends-heading" className="text-base font-semibold text-slate-900">
          Daftar Teman ({friends.length})
        </h2>
        <p className="text-xs text-slate-600">
          Ringkasan sisa piutang per kontak dari data simulasi.
        </p>
      </div>

      {friends.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
          <p className="text-sm font-medium text-slate-900">Belum ada data teman</p>
          <p className="text-xs text-slate-600 mt-1">
            Kontak teman otomatis tercatat saat Anda menambah catatan hutang.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => {
            const friendTrx = transactions.filter(
              (t) => t.friendId === friend.id
            );
            const activeRemaining = friendTrx.reduce(
              (sum, t) => sum + t.remainingAmount,
              0
            );

            return (
              <article
                key={friend.id}
                className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {friend.name}
                    </h3>
                    <p className="inline-flex items-center gap-1 text-xs text-slate-600 mt-0.5">
                      <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>{friend.phone}</span>
                    </p>
                  </div>
                </div>

                {friend.note && (
                  <p className="text-xs text-slate-600">{friend.note}</p>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 tabular-nums truncate">
                      Sisa {formatRupiah(activeRemaining)}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {friendTrx.length} catatan hutang
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddDebtForFriend(friend)}
                    className="shrink-0 inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-2 min-h-[40px] text-xs font-medium transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Tambah Hutang</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

interface PaymentsViewProps {
  payments: PaymentRecord[];
}

export function PaymentsView({ payments }: PaymentsViewProps) {
  return (
    <section
      aria-labelledby="payments-heading"
      className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden"
    >
      <div className="p-5 border-b border-slate-200">
        <h2
          id="payments-heading"
          className="text-base font-semibold text-slate-900"
        >
          Riwayat Pembayaran
        </h2>
        <p className="text-xs text-slate-600">
          Catatan cicilan dan pelunasan yang masuk pada sesi simulasi.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-900">
            Belum ada riwayat pembayaran
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Gunakan tombol Bayar pada daftar transaksi untuk mencatat pelunasan.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200">
          {payments.map((item) => (
            <li
              key={item.id}
              className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {item.friendName}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {item.bank} · {formatDateId(item.paidAt)}
                  {item.note ? ` · ${item.note}` : ''}
                </p>
              </div>
              <span className="text-sm font-bold text-emerald-800 tabular-nums">
                +{formatRupiah(item.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface SettingsViewProps {
  onResetEmpty: () => void;
  onLoadSampleData: () => void;
}

export function SettingsView({
  onResetEmpty,
  onLoadSampleData,
}: SettingsViewProps) {
  return (
    <section aria-labelledby="settings-heading" className="space-y-4 max-w-3xl">
      <article className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <Database className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="settings-heading"
              className="text-base font-semibold text-slate-900"
            >
              Status Penyimpanan Data
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Saat ini TemanHutang berjalan menggunakan data simulasi lokal di
              memori browser. Aplikasi belum terhubung dengan Supabase dan tidak
              melakukan integrasi rekening bank secara otomatis.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onResetEmpty}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 min-h-[44px] text-xs font-medium text-slate-800"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Kosongkan Semua Data (0 Data)</span>
          </button>
          <button
            type="button"
            onClick={onLoadSampleData}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 min-h-[44px] text-xs font-medium text-emerald-800"
          >
            <span>Muat Data Contoh (Simulasi)</span>
          </button>
        </div>
      </article>

      <article className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Daftar Bank &amp; Layanan Tersedia
        </h3>
        <p className="text-xs text-slate-600">
          Pilihan kanal pencatatan yang tersedia saat menambah transaksi hutang:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BANK_OPTIONS.map((bank) => (
            <div
              key={bank.name}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs"
            >
              <span className="font-medium text-slate-900">{bank.name}</span>
              <span className="text-slate-600">{bank.category}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
