import type { WizardStepKey } from "../WizardSteps/types";

// Global store types
export interface AppState {
  expenses: ExpensesState;
  files: FileState;
  wizard: WizardState;
  settings: SettingsState;
}

export type ExpenseDescription = string;
export type NormalizedExpenseDesc = ExpenseDescription;
export type GUID = string;
export type CategoryKey = string;
export type CategoryMapper = Map<NormalizedExpenseDesc, CategoryKey>;
export type CategorizedExpenseItems = Map<GUID, CategorizedExpenseItem>;
export type CategorizedExpenses = Map<CategoryKey, CategorizedExpenseItems>;

export interface ExpensesState {
  categorizedItems: CategorizedExpenses;
  categoryMapper: CategoryMapper;
  totals: ExpenseTotals;
  error: string | null;
}

export type FileState = Record<string, FileDatum>;

export type FileDatum = {
  fileName: string;
  fileHeaderRoles: FileHeaderRole;
} & FileDatumContent;

export type FileDatumContent = {
  headers: string[];
  data: Array<FileDataItem>;
};

export type WizardState = {
  currentStep: WizardStepKey;
  furthestStep: WizardStepKey;
};

export interface SettingsState {
  categories: Record<string, string>;
}

export type RawExpenseItem = {
  expense_amount: number;
  category: CategoryKey;
  description: ExpenseDescription;
  rebate_amount?: string | null;
  card?: string | null;
  date?: string | null;
};

export type CategorizedExpenseItem = {
  id: GUID;
  rawItem: RawExpenseItem;
  amount: number;
  category?: CategoryKey;
  normalizedDescription?: NormalizedExpenseDesc;
  applyToAll: boolean;
};

export type ExpenseTotals = {
  totalsByCategory: Record<string, number>;
  rebateTotal: number;
  expenseTotal: number;
};

export type FileHeaderRole = {
  category: CategoryKey;
  description: ExpenseDescription;
  expense_amount: string;
  date: string | null;
  rebate_amount: string | null;
  card: string | null;
};

export interface FileDataItem {
  [key: string]: string;
}
