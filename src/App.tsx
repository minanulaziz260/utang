import { useMemo, useState } from 'react';
import { AddDebtModal } from './components/AddDebtModal';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { PaymentModal } from './components/PaymentModal';
import {
  FriendsView,
  PaymentsView,
  SettingsView,
} from './components/SectionViews';
import { Sidebar } from './components/Sidebar';
import { SummaryCards } from './components/SummaryCards';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { TransactionTable } from './components/TransactionTable';
import {
  applyPaymentToTransactions,
  buildNewDebtRecord,
  computeDashboardSummary,
  getInitialSimulatedState,
  getSampleSimulatedState,
} from './services/debtService';
import type {
  CreateDebtInput,
  DebtTransaction,
  NavSection,
  RecordPaymentInput,
} from './types/debt';

export function App() {
  const initialState = useMemo(() => getInitialSimulatedState(), []);
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [friends, setFriends] = useState(initialState.friends);
  const [transactions, setTransactions] = useState(initialState.transactions);
  const [payments, setPayments] = useState(initialState.payments);

  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [prefillFriend, setPrefillFriend] = useState<{
    name: string;
    phone?: string;
  } | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<DebtTransaction | null>(
    null
  );
  const [detailTarget, setDetailTarget] = useState<DebtTransaction | null>(
    null
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const openAddDebt = (friend?: { name: string; phone?: string }) => {
    setPrefillFriend(friend ?? null);
    setIsAddDebtOpen(true);
  };

  const summary = useMemo(
    () => computeDashboardSummary(transactions),
    [transactions]
  );

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    window.setTimeout(() => {
      setFeedbackMessage((current) => (current === message ? null : current));
    }, 4000);
  };

  const handleAddDebt = (input: CreateDebtInput) => {
    const { transaction, newFriend } = buildNewDebtRecord(input, friends);
    setTransactions((prev) => [transaction, ...prev]);
    if (newFriend) {
      setFriends((prev) => [newFriend, ...prev]);
    }
    showFeedback(
      `Catatan hutang untuk ${transaction.friendName} ditambahkan ke daftar simulasi.`
    );
  };

  const handleRecordPayment = (input: RecordPaymentInput) => {
    const { updatedTransactions, paymentRecord } = applyPaymentToTransactions(
      transactions,
      input
    );
    setTransactions(updatedTransactions);
    if (paymentRecord) {
      setPayments((prev) => [paymentRecord, ...prev]);
      showFeedback(
        `Pembayaran dari ${paymentRecord.friendName} berhasil dicatat.`
      );
    }
  };

  const handleResetEmpty = () => {
    const empty = getInitialSimulatedState();
    setFriends(empty.friends);
    setTransactions(empty.transactions);
    setPayments(empty.payments);
    showFeedback('Semua data dikosongkan ke 0 data.');
  };

  const handleLoadSampleData = () => {
    const sample = getSampleSimulatedState();
    setFriends(sample.friends);
    setTransactions(sample.transactions);
    setPayments(sample.payments);
    showFeedback('Data contoh simulasi dimuat.');
  };

  const handleDeleteTransaction = (trx: DebtTransaction) => {
    setTransactions((prev) => prev.filter((item) => item.id !== trx.id));
    showFeedback(
      `Catatan ${trx.bank} untuk ${trx.friendName} dihapus dari simulasi.`
    );
  };

  const handleCopySummary = (friendName: string) => {
    showFeedback(`Ringkasan hutang ${friendName} disalin.`);
  };

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      <div className="lg:pl-64 flex flex-col min-h-dvh">
        <Header
          activeSection={activeSection}
          onOpenAddDebt={() => openAddDebt()}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-10 space-y-6">
          {feedbackMessage && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-medium text-emerald-900 flex items-center justify-between gap-2"
            >
              <span>{feedbackMessage}</span>
              <button
                type="button"
                onClick={() => setFeedbackMessage(null)}
                className="text-emerald-800 hover:text-emerald-950 underline shrink-0"
              >
                Tutup
              </button>
            </div>
          )}

          {activeSection === 'dashboard' && (
            <>
              <SummaryCards
                summary={summary}
                totalCount={transactions.length}
              />
              <TransactionTable
                transactions={transactions}
                title="Transaksi Terbaru"
                onRecordPayment={setPaymentTarget}
                onViewDetail={setDetailTarget}
                onDeleteTransaction={handleDeleteTransaction}
                onOpenAddDebt={() => openAddDebt()}
                onAddDebtForFriend={(name) => {
                  const matched = friends.find((f) => f.name === name);
                  openAddDebt({ name, phone: matched?.phone });
                }}
                onCopySummary={handleCopySummary}
              />
            </>
          )}

          {activeSection === 'friends' && (
            <FriendsView
              friends={friends}
              transactions={transactions}
              onAddDebtForFriend={(friend) =>
                openAddDebt({ name: friend.name, phone: friend.phone })
              }
            />
          )}

          {activeSection === 'transactions' && (
            <TransactionTable
              transactions={transactions}
              title="Semua Transaksi Hutang"
              onRecordPayment={setPaymentTarget}
              onViewDetail={setDetailTarget}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAddDebt={() => openAddDebt()}
              onAddDebtForFriend={(name) => {
                const matched = friends.find((f) => f.name === name);
                openAddDebt({ name, phone: matched?.phone });
              }}
              onCopySummary={handleCopySummary}
            />
          )}

          {activeSection === 'payments' && <PaymentsView payments={payments} />}

          {activeSection === 'settings' && (
            <SettingsView
              onResetEmpty={handleResetEmpty}
              onLoadSampleData={handleLoadSampleData}
            />
          )}
        </main>
      </div>

      <MobileNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      <AddDebtModal
        isOpen={isAddDebtOpen}
        prefillFriend={prefillFriend}
        onClose={() => {
          setIsAddDebtOpen(false);
          setPrefillFriend(null);
        }}
        onSubmit={handleAddDebt}
      />

      <PaymentModal
        transaction={paymentTarget}
        onClose={() => setPaymentTarget(null)}
        onSubmit={handleRecordPayment}
      />

      <TransactionDetailModal
        transaction={detailTarget}
        payments={payments}
        onClose={() => setDetailTarget(null)}
        onRecordPayment={setPaymentTarget}
      />
    </div>
  );
}

export default App;
