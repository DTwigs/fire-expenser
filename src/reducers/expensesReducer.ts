import type { ExpensesState } from "../store/types";
import {
  EXPENSES_ERROR,
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORY_MAPPER,
  UPDATE_CATEGORIZED_EXPENSES,
  UPDATE_CATEGORIZED_EXPENSE,
  REMOVE_FILE,
  UPDATE_TOTALS,
  REMOVE_CATEGORIZED_EXPENSE,
  INITIALIZE_STORE,
} from "./actions";
import type { ExpensesAction } from "./types";
import db from "../db";

export const initialExpensesState: ExpensesState = {
  categorizedItems: new Map(),
  error: null,
  categoryMapper: db.getCategoryMapper(),
  totals: {
    totalsByCategory: {},
    rebateTotal: 0,
    expenseTotal: 0,
  },
};

// Expenses reducer
export const expensesReducer = (
  state: ExpensesState,
  action: ExpensesAction
): ExpensesState => {
  switch (action.type) {
    case EXPENSES_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_CATEGORY_MAPPER:
      db.setCategoryMapper(action.payload);
      return {
        ...state,
        categoryMapper: action.payload,
      };
    case UPDATE_CATEGORIZED_EXPENSES:
      return {
        ...state,
        categorizedItems: action.payload,
      };
    case UPDATE_CATEGORIZED_EXPENSE: {
      const { id, category } = action.payload;
      if (!category || !id) {
        return state;
      }

      const newCategorizedItems = new Map(state.categorizedItems);

      // replace the categorizedItem with the payload
      newCategorizedItems.get(category)?.set(id, action.payload);

      return {
        ...state,
        categorizedItems: newCategorizedItems,
      };
    }
    case SWAP_CATEGORIZED_EXPENSE: {
      const { originCategory, newCategory, expense } = action.payload;
      const categorizedItems = new Map(state.categorizedItems);

      categorizedItems.get(originCategory)?.delete(expense.id);

      const newCategoryItems = categorizedItems.get(newCategory);
      const updatedExpense = { ...expense, category: newCategory };

      if (!newCategoryItems) {
        categorizedItems.set(
          newCategory,
          new Map([[expense.id, updatedExpense]])
        );
      } else {
        newCategoryItems.set(expense.id, updatedExpense);
      }

      if (categorizedItems.get(originCategory)?.size === 0) {
        categorizedItems.delete(originCategory);
      }

      return {
        ...state,
        categorizedItems,
      };
    }
    case UPDATE_TOTALS:
      return {
        ...state,
        totals: action.payload,
      };
    case REMOVE_CATEGORIZED_EXPENSE: {
      const { id, category = "" } = action.payload;
      const categorizedItems = new Map(state.categorizedItems);
      categorizedItems.get(category)?.delete(id);
      return {
        ...state,
        categorizedItems,
      };
    }
    case REMOVE_FILE:
      return {
        ...state,
        categorizedItems: new Map(),
        error: null,
      };
    case INITIALIZE_STORE:
      return {
        ...state,
        categoryMapper: action.payload.categoryMapper,
      };
    default:
      return state;
  }
};
