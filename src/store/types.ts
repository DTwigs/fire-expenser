// Global store types
export interface AppState {
  // Add your state slices here
  expenses: ExpensesState;
  settings: SettingsState;
  file: FileState;
}

export interface ExpensesState {
  rawItems: ExpenseItem[];
  categorizedItems: Map<string, ExpenseItem>;
  isLoading: boolean;
  error: string | null;
}

export interface SettingsState {
  expenseCategories: string[];
  fileHeaderRoles: { [key in keyof FileHeaderRole]: string | null };
}

export interface FileState {
  headers: string[];
  data: Array<{ [key: string]: string }>;
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
  date: string | null;
  "expense amount": string | null;
  "rebate amount": string | null;
  card: string | null;
  category: string | null;
  description: string | null;
}

export interface FileDataItem {
  [key: string]: string;
}
