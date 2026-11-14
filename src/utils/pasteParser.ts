import { BANK_OPTIONS } from '../constants/banks';
import type { BankOption, CreateDebtInput } from '../types/debt';

export interface ParsedDebtPreviewItem {
  bank: BankOption;
  principalAmount: number;
  dueDate: string;
  rawLine: string;
}

export interface PasteParseResult {
  friendName: string;
  items: ParsedDebtPreviewItem[];
  warnings: string[];
}

function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDaysToToday(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalIsoDate(date);
}

function parseDueDateSegment(segment: string): string | null {
  const clean = segment.replace(/\u00a0/g, ' ').trim().toLowerCase();

  if (clean === 'hari ini') {
    return addDaysToToday(0);
  }

  const daysAheadMatch = clean.match(/(\d+)\s*hari\s*lagi/);
  if (daysAheadMatch) {
    return addDaysToToday(Number(daysAheadMatch[1]));
  }

  const daysAgoMatch = clean.match(/(?:(\d+)\s*hari\s*lalu|terlambat\s*(\d+)\s*hari)/);
  if (daysAgoMatch) {
    const days = Number(daysAgoMatch[1] ?? daysAgoMatch[2]);
    return addDaysToToday(-days);
  }

  const slashOrDashDmy = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashOrDashDmy) {
    const day = slashOrDashDmy[1].padStart(2, '0');
    const month = slashOrDashDmy[2].padStart(2, '0');
    const year = slashOrDashDmy[3];
    return `${year}-${month}-${day}`;
  }

  const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return clean;
  }

  return null;
}

function parseAmountSegment(segment: string): number | null {
  const digits = segment.replace(/[^\d]/g, '');
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function parseBankSegment(segment: string): BankOption | null {
  const clean = segment.replace(/\u00a0/g, ' ').trim().toLowerCase();
  if (!clean) return null;

  const exact = BANK_OPTIONS.find((b) => b.name.toLowerCase() === clean);
  if (exact) return exact.name;

  const partial = BANK_OPTIONS.find(
    (b) =>
      clean.includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(clean)
  );
  return partial ? partial.name : null;
}

export function parsePastedDebtText(rawText: string): PasteParseResult {
  const lines = rawText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\u00a0/g, ' ').trim())
    .filter((line) => line.length > 0);

  let friendName = '';
  const items: ParsedDebtPreviewItem[] = [];
  const warnings: string[] = [];

  for (const line of lines) {
    if (!line.includes('|')) {
      if (!friendName) {
        friendName = line;
      } else {
        warnings.push(`Baris dilewati (format tidak dikenali): "${line}"`);
      }
      continue;
    }

    const parts = line
      .split('|')
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length < 2) {
      warnings.push(`Baris kurang lengkap: "${line}"`);
      continue;
    }

    let dueDate: string | null = null;
    let amount: number | null = null;
    let bank: BankOption | null = null;

    for (const part of parts) {
      if (!dueDate) {
        const maybeDate = parseDueDateSegment(part);
        if (maybeDate) {
          dueDate = maybeDate;
          continue;
        }
      }
      if (!bank) {
        const maybeBank = parseBankSegment(part);
        if (maybeBank) {
          bank = maybeBank;
          continue;
        }
      }
      if (!amount) {
        const maybeAmount = parseAmountSegment(part);
        if (maybeAmount) {
          amount = maybeAmount;
          continue;
        }
      }
    }

    if (!amount) {
      warnings.push(`Nominal tidak terbaca pada baris: "${line}"`);
      continue;
    }

    items.push({
      bank: bank ?? 'Bank Jago',
      principalAmount: amount,
      dueDate: dueDate ?? addDaysToToday(30),
      rawLine: line,
    });
  }

  return { friendName, items, warnings };
}

export function toCreateDebtInputs(
  friendName: string,
  items: ParsedDebtPreviewItem[]
): CreateDebtInput[] {
  return items.map((item) => ({
    friendName: friendName.trim(),
    bank: item.bank,
    principalAmount: item.principalAmount,
    dueDate: item.dueDate,
  }));
}
