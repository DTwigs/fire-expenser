import type {
  AppState,
  ExpensesState,
  SettingsState,
  AppAction,
  ExpensesAction,
  SettingsAction,
} from "./types";

// Expenses reducer
export const expensesReducer = (
  state: ExpensesState,
  action: ExpensesAction
): ExpensesState => {
  switch (action.type) {
    case "EXPENSES_LOADING":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "EXPENSES_LOADED": {
      return {
        ...state,
        rawItems: action.payload,
        isLoading: false,
        error: null,
      };
    }
    case "EXPENSES_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "EXPENSE_ADD": {
      const newItems = [...state.rawItems, action.payload];

      return {
        ...state,
        rawItems: newItems,
      };
    }
    case "EXPENSE_DELETE": {
      const filteredItems = state.rawItems.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        rawItems: filteredItems,
      };
    }
    case "UPDATE_EXPENSE_CATEGORIES":
      return {
        ...state,
        categorizedItems: new Map(state.categorizedItems).set(
          action.payload.category,
          action.payload.item
        ),
      };
    default:
      return state;
  }
};

// Settings reducer
export const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    default:
      return state;
  }
};

// Main app reducer that combines all reducers
export const appReducer = (state: AppState, action: AppAction): AppState => {
  return {
    expenses: expensesReducer(state.expenses, action as ExpensesAction),
    settings: settingsReducer(state.settings, action as SettingsAction),
  };
};
