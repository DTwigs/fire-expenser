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
      "expense amount": null,
      "rebate amount": null,
      card: null,
      category: null,
      description: null,
    },
  },
  file: {
    headers: [],
    data: [],
  },
};
