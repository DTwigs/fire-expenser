import type {
  FileHeaderRole,
  CategoryMapper,
  CategorizedExpenses,
  CategorizedExpenseItem,
  ExpenseTotals,
  SettingsState,
  FileDatum,
} from "../store/types";
import type { WizardStepKey } from "../WizardSteps/types";
import {
  ADD_FILE,
  EXPENSES_ERROR,
  REMOVE_FILE,
  SET_CURRENT_STEP,
  SET_FURTHEST_STEP,
  UPDATE_CATEGORY_MAPPER,
  UPDATE_CATEGORIZED_EXPENSES,
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_SINGLE_HEADER_ROLE,
  UPDATE_CATEGORIZED_EXPENSE,
  UPDATE_TOTALS,
  REMOVE_CATEGORIZED_EXPENSE,
  SET_CATEGORIES,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  INITIALIZE_STORE,
} from "./actions";

export type AppInitializeState = {
  categoryMapper: CategoryMapper;
  settings: SettingsState;
};

// Action types
export type AppAction =
  | ExpensesAction
  | FileAction
  | WizardAction
  | SettingsAction;

export type ExpensesAction =
  | { type: typeof EXPENSES_ERROR; payload: string }
  | { type: typeof UPDATE_CATEGORY_MAPPER; payload: CategoryMapper }
  | {
      type: typeof UPDATE_CATEGORIZED_EXPENSES;
      payload: CategorizedExpenses;
    }
  | {
      type: typeof UPDATE_CATEGORIZED_EXPENSE;
      payload: CategorizedExpenseItem;
    }
  | {
      type: typeof UPDATE_CATEGORY_MAPPER;
      payload: CategoryMapper;
    }
  | {
      type: typeof SWAP_CATEGORIZED_EXPENSE;
      payload: {
        originCategory: string;
        newCategory: string;
        expense: CategorizedExpenseItem;
      };
    }
  | {
      type: typeof UPDATE_TOTALS;
      payload: ExpenseTotals;
    }
  | {
      type: typeof REMOVE_CATEGORIZED_EXPENSE;
      payload: CategorizedExpenseItem;
    }
  | { type: typeof REMOVE_FILE }
  | { type: typeof INITIALIZE_STORE; payload: AppInitializeState };

export type FileAction =
  | { type: typeof ADD_FILE; payload: FileDatum }
  | { type: typeof REMOVE_FILE; payload: string }
  | {
      type: typeof UPDATE_SINGLE_HEADER_ROLE;
      payload: {
        fileName: string;
        role: keyof FileHeaderRole;
        header: string | null;
      };
    };

export type WizardAction =
  | { type: typeof SET_CURRENT_STEP; payload: WizardStepKey }
  | { type: typeof SET_FURTHEST_STEP; payload: WizardStepKey };

export type SettingsAction =
  | { type: typeof SET_CATEGORIES; payload: Record<string, string> }
  | { type: typeof ADD_CATEGORY; payload: string }
  | { type: typeof REMOVE_CATEGORY; payload: string }
  | { type: typeof INITIALIZE_STORE; payload: AppInitializeState };
