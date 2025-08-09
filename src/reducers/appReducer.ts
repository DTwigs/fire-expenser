import type { AppState } from "../store/types";
import type { AppAction } from "./types";
import { expensesReducer } from "./expensesReducer";
import { settingsReducer } from "./settingsReducer";
import { fileReducer } from "./fileReducer";
import type { ExpensesAction } from "./types";
import type { SettingsAction } from "./types";
import type { FileAction } from "./types";

// Main app reducer that combines all reducers
export const appReducer = (state: AppState, action: AppAction): AppState => {
  return {
    expenses: expensesReducer(state.expenses, action as ExpensesAction),
    settings: settingsReducer(state.settings, action as SettingsAction),
    file: fileReducer(state.file, action as FileAction),
  };
};
