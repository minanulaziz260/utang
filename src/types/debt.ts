export type BankOption =
  | 'Bank Jago'
  | 'Kredivo'
  | 'Allo Bank'
  | 'SeaBank'
  | 'JULO'
  | 'Superbank';

export type DebtStatus = 'belum_lunas' | 'lunas' | 'terlambat';

export type NavSection =
  | 'dashboard'
  | 'friends'
  | 'transactions'
  | 'payments'
  | 'settings';

export interface Friend {
  id: string;
  name: string;
  phone: string;
  note?: string;
}

export interface DebtTransaction {
  id: string;
  friendId: string;
  friendName: string;
  bank: BankOption;
  principalAmount: number;
  remainingAmount: number;
  dueDate: string;
  createdAt: string;
  status: DebtStatus;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  friendName: string;
  bank: BankOption;
  amount: number;
  paidAt: string;
  note?: string;
}

export interface DashboardSummary {
  totalReceivables: number;
  unpaidAmount: number;
  paidAmount: number;
  overdueAmount: number;
  unpaidCount: number;
  paidCount: number;
  overdueCount: number;
}

export interface CreateDebtInput {
  friendName: string;
  phone?: string;
  bank: BankOption;
  principalAmount: number;
  dueDate: string;
  notes?: string;
}

export interface RecordPaymentInput {
  transactionId: string;
  amount: number;
  note?: string;
}
