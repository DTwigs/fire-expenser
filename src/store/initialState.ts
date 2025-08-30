import type { AppState } from "./types";
import db from "../db";
import { initialWizardState } from "../reducers/wizardReducer";
import { initialFileState } from "../reducers/fileReducer";
import { initialExpensesState } from "../reducers/expensesReducer";

export const initialState: AppState = {
  expenses: initialExpensesState,
  files: initialFileState,
  wizard: initialWizardState,
  settings: db.getSettings(),
};
