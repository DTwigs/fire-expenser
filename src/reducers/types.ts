import type { ExpenseItem, FileDataItem, FileHeaderRole } from "../store/types";
import type { WizardStepKey } from "../WizardSteps/types";

// Action types
export type AppAction =
  | ExpensesAction
  | SettingsAction
  | FileAction
  | WizardAction;

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

export type FileAction =
  | { type: "ADD_FILE_HEADERS"; payload: string[] }
  | { type: "ADD_FILE_DATA"; payload: FileDataItem[] }
  | { type: "REMOVE_FILE" };

export type SettingsAction =
  | { type: "UPDATE_FILE_HEADER_ROLES"; payload: FileHeaderRole }
  | {
      type: "UPDATE_SINGLE_HEADER_ROLE";
      payload: { role: keyof FileHeaderRole; header: string | null };
    }
  | { type: "REMOVE_FILE" };

export type WizardAction =
  | { type: "SET_CURRENT_STEP"; payload: WizardStepKey }
  | { type: "SET_FURTHEST_STEP"; payload: WizardStepKey };
