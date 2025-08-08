import type { AppState } from "./types";

export const initialState: AppState = {
  expenses: {
    rawItems: [],
    categorizedItems: new Map(),
    isLoading: false,
    error: null,
  },
  settings: {
    expenseCategories: [],
    fileHeaderRoles: {
      date: null,
      debit: null,
      credit: null,
      card: null,
      category: null,
      description: null,
    },
  },
};
