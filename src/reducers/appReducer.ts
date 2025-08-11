import type { AppState } from "../store/types";
import type { AppAction, WizardAction } from "./types";
import { expensesReducer } from "./expensesReducer";
import { fileReducer } from "./fileReducer";
import { wizardReducer } from "./wizardReducer";
import type { ExpensesAction } from "./types";
import type { FileAction } from "./types";

// Main app reducer that combines all reducers
export const appReducer = (state: AppState, action: AppAction): AppState => {
  return {
    expenses: expensesReducer(state.expenses, action as ExpensesAction),
    file: fileReducer(state.file, action as FileAction),
    wizard: wizardReducer(state.wizard, action as WizardAction),
  };
};
