// Global store types
export interface AppState {
  // Add your state slices here
  expenses: ExpensesState;
  settings: SettingsState;
}

export interface ExpensesState {
  rawItems: ExpenseItem[];
  categorizedItems: Map<string, ExpenseItem>;
  isLoading: boolean;
  error: string | null;
}

export interface SettingsState {
  expenseCategories: string[];
  fileHeaderRoles: { [key in keyof FileHeaderRole]: number | null };
}

export interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  tags: string[];
}

export interface FileHeaderRole {
  date: string;
  debit: string;
  credit: string;
  card: string;
  category: string;
  description: string;
}

// Action types
export type AppAction = ExpensesAction | SettingsAction;

export type ExpensesAction =
  | { type: "EXPENSES_LOADING" }
  | { type: "EXPENSES_LOADED"; payload: ExpenseItem[] }
  | { type: "EXPENSES_ERROR"; payload: string }
  | { type: "EXPENSE_ADD"; payload: ExpenseItem }
  | {
      type: "EXPENSE_UPDATE";
      payload: { id: string; updates: Partial<ExpenseItem> };
    }
  | { type: "EXPENSE_DELETE"; payload: string }
  | {
      type: "UPDATE_EXPENSE_CATEGORIES";
      payload: { category: string; item: ExpenseItem };
    };

export type SettingsAction = {
  type: "UPDATE_FILE_HEADER_ROLES";
  payload: FileHeaderRole;
};
