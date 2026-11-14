import { MOCK_FRIENDS, MOCK_PAYMENTS, MOCK_TRANSACTIONS } from '../data/mockData';
import type {
  CreateDebtInput,
  DashboardSummary,
  DebtStatus,
  DebtTransaction,
  Friend,
  PaymentRecord,
  RecordPaymentInput,
} from '../types/debt';

/**
 * Layer layanan untuk mengelola state catatan piutang.
 * TODO: Integrasikan dengan Supabase client pada tahap berikutnya
 * (menggantikan data simulasi in-memory ini dengan query tabel `friends`,
 * `debt_transactions`, dan `payment_records`).
 */
export function getInitialSimulatedState(): {
  friends: Friend[];
  transactions: DebtTransaction[];
  payments: PaymentRecord[];
} {
  return {
    friends: [],
    transactions: [],
    payments: [],
  };
}

export function getSampleSimulatedState(): {
  friends: Friend[];
  transactions: DebtTransaction[];
  payments: PaymentRecord[];
} {
  return {
    friends: [...MOCK_FRIENDS],
    transactions: [...MOCK_TRANSACTIONS],
    payments: [...MOCK_PAYMENTS],
  };
}

export function computeDashboardSummary(
  transactions: DebtTransaction[]
): DashboardSummary {
  return transactions.reduce<DashboardSummary>(
    (acc, trx) => {
      acc.totalReceivables += trx.principalAmount;
      if (trx.status === 'lunas') {
        acc.paidAmount += trx.principalAmount;
        acc.paidCount += 1;
      } else if (trx.status === 'terlambat') {
        acc.overdueAmount += trx.remainingAmount;
        acc.overdueCount += 1;
      } else {
        acc.unpaidAmount += trx.remainingAmount;
        acc.unpaidCount += 1;
      }
      return acc;
    },
    {
      totalReceivables: 0,
      unpaidAmount: 0,
      paidAmount: 0,
      overdueAmount: 0,
      unpaidCount: 0,
      paidCount: 0,
      overdueCount: 0,
    }
  );
}

export function buildNewDebtRecord(
  input: CreateDebtInput,
  existingFriends: Friend[]
): { transaction: DebtTransaction; newFriend: Friend | null } {
  const trimmedName = input.friendName.trim();
  const matchedFriend = existingFriends.find(
    (f) => f.name.toLowerCase() === trimmedName.toLowerCase()
  );

  let friendId = matchedFriend?.id;
  let newFriend: Friend | null = null;

  if (!friendId) {
    friendId = `fr-${Date.now()}`;
    newFriend = {
      id: friendId,
      name: trimmedName,
      phone: input.phone?.trim() || '-',
      note: 'Ditambahkan saat mencatat hutang',
    };
  }

  const todayIso = new Date().toISOString().slice(0, 10);
  const isOverdue = input.dueDate < todayIso;

  const transaction: DebtTransaction = {
    id: `trx-${Date.now()}`,
    friendId,
    friendName: trimmedName,
    bank: input.bank,
    principalAmount: input.principalAmount,
    remainingAmount: input.principalAmount,
    dueDate: input.dueDate,
    createdAt: todayIso,
    status: isOverdue ? 'terlambat' : 'belum_lunas',
    notes: input.notes?.trim() || undefined,
  };

  return { transaction, newFriend };
}

export function applyPaymentToTransactions(
  transactions: DebtTransaction[],
  input: RecordPaymentInput
): {
  updatedTransactions: DebtTransaction[];
  paymentRecord: PaymentRecord | null;
} {
  const target = transactions.find((t) => t.id === input.transactionId);
  if (!target || input.amount <= 0) {
    return { updatedTransactions: transactions, paymentRecord: null };
  }

  const appliedAmount = Math.min(input.amount, target.remainingAmount);
  const nextRemaining = Math.max(0, target.remainingAmount - appliedAmount);
  const todayIso = new Date().toISOString().slice(0, 10);

  const nextStatus: DebtStatus =
    nextRemaining === 0
      ? 'lunas'
      : target.dueDate < todayIso
        ? 'terlambat'
        : 'belum_lunas';

  const updatedTransactions = transactions.map((t) =>
    t.id === target.id
      ? {
          ...t,
          remainingAmount: nextRemaining,
          status: nextStatus,
        }
      : t
  );

  const paymentRecord: PaymentRecord = {
    id: `pay-${Date.now()}`,
    transactionId: target.id,
    friendName: target.friendName,
    bank: target.bank,
    amount: appliedAmount,
    paidAt: todayIso,
    note: input.note?.trim() || undefined,
  };

  return { updatedTransactions, paymentRecord };
}
