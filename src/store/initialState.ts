import { WIZARD_STEP_KEYS } from "../WizardSteps/constants";
import type { AppState } from "./types";
import db from "../db";

export const initialState: AppState = {
  expenses: {
    categorizedItems: new Map(),
    error: null,
    categoryMapper: db.getCategoryMapper(),
    totals: {
      totalsByCategory: {},
      rebateTotal: 0,
      expenseTotal: 0,
    },
  },
  file: {
    headers: [],
    data: [],
    fileHeaderRoles: {
      date: null,
      expense_amount: "",
      rebate_amount: null,
      card: null,
      category: "",
      description: "",
    },
  },
  wizard: {
    currentStep: WIZARD_STEP_KEYS.FILE_UPLOAD,
    furthestStep: WIZARD_STEP_KEYS.FILE_UPLOAD,
  },
};
