import type { WizardStepKey } from "../WizardSteps/types";

// Global store types
export interface AppState {
  expenses: ExpensesState;
  file: FileState;
  wizard: WizardState;
}

export type CategoryMapKey = string;
export type CategoryMapper = Map<string, CategoryMapKey>;
export type CategorizedExpenseItems = Map<string, CategorizedExpenseItem>;
export type CategorizedExpenses = Map<CategoryMapKey, CategorizedExpenseItems>;

export interface ExpensesState {
  categorizedItems: CategorizedExpenses;
  categoryMapper: CategoryMapper;
  error: string | null;
}

export interface FileState {
  headers: string[];
  data: Array<{ [key: string]: string }>;
  fileHeaderRoles: FileHeaderRole;
}

export type WizardState = {
  currentStep: WizardStepKey;
  furthestStep: WizardStepKey;
};

export type RawExpenseItem = {
  expense_amount: string;
  category: string;
  description: string;
  rebate_amount?: string | null;
  card?: string | null;
  date?: string | null;
};

export type CategorizedExpenseItem = {
  id: string;
  rawItem: RawExpenseItem;
  category?: string;
  categoryUnknown: boolean;
};

export type FileHeaderRole = {
  category: string;
  description: string;
  expense_amount: string;
  date: string | null;
  rebate_amount: string | null;
  card: string | null;
};

export interface FileDataItem {
  [key: string]: string;
}
