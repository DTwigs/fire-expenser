import type {
  FileDataItem,
  FileHeaderRole,
  CategoryMapper,
  CategorizedExpenses,
} from "../store/types";
import type { WizardStepKey } from "../WizardSteps/types";
import {
  ADD_FILE_DATA,
  ADD_FILE_HEADERS,
  EXPENSES_ERROR,
  REMOVE_FILE,
  SET_CURRENT_STEP,
  SET_FURTHEST_STEP,
  UPDATE_CATEGORY_MAPPER,
  UPDATE_CATEGORIZED_EXPENSES,
  UPDATE_FILE_HEADER_ROLES,
  UPDATE_SINGLE_HEADER_ROLE,
} from "./actions";

// Action types
export type AppAction = ExpensesAction | FileAction | WizardAction;

export type ExpensesAction =
  | { type: typeof EXPENSES_ERROR; payload: string }
  | {
      type: typeof UPDATE_CATEGORIZED_EXPENSES;
      payload: CategorizedExpenses;
    }
  | {
      type: typeof UPDATE_CATEGORY_MAPPER;
      payload: CategoryMapper;
    };

export type FileAction =
  | { type: typeof ADD_FILE_HEADERS; payload: string[] }
  | { type: typeof ADD_FILE_DATA; payload: FileDataItem[] }
  | { type: typeof REMOVE_FILE }
  | { type: typeof UPDATE_FILE_HEADER_ROLES; payload: FileHeaderRole }
  | {
      type: typeof UPDATE_SINGLE_HEADER_ROLE;
      payload: { role: keyof FileHeaderRole; header: string | null };
    };

export type WizardAction =
  | { type: typeof SET_CURRENT_STEP; payload: WizardStepKey }
  | { type: typeof SET_FURTHEST_STEP; payload: WizardStepKey };
