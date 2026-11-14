import type { BankOption } from '../types/debt';

export interface BankMetadata {
  name: BankOption;
  category: 'Bank Digital' | 'Kredit Digital';
}

export const BANK_OPTIONS: readonly BankMetadata[] = [
  { name: 'Bank Jago', category: 'Bank Digital' },
  { name: 'Kredivo', category: 'Kredit Digital' },
  { name: 'Allo Bank', category: 'Bank Digital' },
  { name: 'SeaBank', category: 'Bank Digital' },
  { name: 'JULO', category: 'Kredit Digital' },
  { name: 'Superbank', category: 'Bank Digital' },
] as const;
