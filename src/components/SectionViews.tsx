import { Database, Phone, Plus, RotateCcw, Users } from 'lucide-react';
import { BANK_OPTIONS } from '../constants/banks';
import type { DebtTransaction, Friend, PaymentRecord } from '../types/debt';
import { formatDateId, formatRupiah } from '../utils/formatters';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
        <h2
          id="friends-heading"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Daftar Teman ({friends.length})
        </h2>
        <p className="text-xs text-muted-foreground">
          Ringkasan sisa piutang per kontak yang tersimpan di browser.
        </p>
      </div>

      {friends.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            Belum ada data teman
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Kontak teman otomatis tercatat saat Anda menambah catatan hutang.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend) => {
            const friendTrx = transactions.filter(
              (t) => t.friendId === friend.id
            );
            const activeRemaining = friendTrx.reduce(
              (sum, t) => sum + t.remainingAmount,
              0
            );

            return (
              <Card key={friend.id} className="space-y-3 p-4 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-primary">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {friend.name}
                    </h3>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span>{friend.phone}</span>
                    </p>
                  </div>
                </div>

                {friend.note && (
                  <p className="text-xs text-muted-foreground">{friend.note}</p>
                )}

                <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground tabular-nums">
                      Sisa {formatRupiah(activeRemaining)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {friendTrx.length} catatan hutang
                    </p>
                  </div>
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => onAddDebtForFriend(friend)}
                    className="min-h-[40px] shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Tambah Hutang</span>
                  </Button>
                </div>
              </Card>
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
    <Card aria-labelledby="payments-heading" className="overflow-hidden">
      <CardHeader className="border-b border-border p-5">
        <CardTitle id="payments-heading" className="text-base">
          Riwayat Pembayaran
        </CardTitle>
        <CardDescription>
          Catatan cicilan dan pelunasan yang tersimpan di browser.
        </CardDescription>
      </CardHeader>

      {payments.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            Belum ada riwayat pembayaran
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gunakan tombol Bayar pada daftar transaksi untuk mencatat pelunasan.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {payments.map((item) => (
            <li
              key={item.id}
              className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center sm:px-5"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {item.friendName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
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
    </Card>
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
    <section aria-labelledby="settings-heading" className="max-w-3xl space-y-4">
      <Card>
        <CardHeader className="flex-row items-start gap-3 space-y-0 pb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
            <Database className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <CardTitle id="settings-heading" className="text-base">
              Status Penyimpanan Data
            </CardTitle>
            <CardDescription className="mt-1 leading-relaxed">
              Saat ini TemanHutang menyimpan data secara lokal di{' '}
              <code>localStorage</code> browser Anda. Aplikasi belum terhubung
              dengan Supabase dan tidak melakukan integrasi rekening bank secara
              otomatis.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onResetEmpty} className="min-h-[44px]">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Kosongkan Semua Data (0 Data)</span>
          </Button>
          <Button variant="soft" size="sm" onClick={onLoadSampleData} className="min-h-[44px]">
            <span>Muat Data Contoh (Simulasi)</span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Daftar Bank &amp; Layanan Tersedia
          </CardTitle>
          <CardDescription>
            Pilihan kanal pencatatan yang tersedia saat menambah transaksi hutang:
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {BANK_OPTIONS.map((bank) => (
            <div
              key={bank.name}
              className="flex items-center justify-between rounded-md border border-border bg-muted/50 px-3.5 py-2.5 text-xs"
            >
              <span className="font-medium text-foreground">{bank.name}</span>
              <span className="text-muted-foreground">{bank.category}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
