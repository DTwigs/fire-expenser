import type {
  AppState,
  AppAction,
  ExpensesAction,
  SettingsAction,
  FileAction,
} from "../store/types";
import { expensesReducer } from "./expensesReducer";
import { settingsReducer } from "./settingsReducer";
import { fileReducer } from "./fileReducer";

// Main app reducer that combines all reducers
export const appReducer = (state: AppState, action: AppAction): AppState => {
  return {
    expenses: expensesReducer(state.expenses, action as ExpensesAction),
    settings: settingsReducer(state.settings, action as SettingsAction),
    file: fileReducer(state.file, action as FileAction),
  };
};
