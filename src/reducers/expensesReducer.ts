import type { ExpensesState } from "../store/types";
import type { ExpensesAction } from "./types";

// Expenses reducer
export const expensesReducer = (
  state: ExpensesState,
  action: ExpensesAction
): ExpensesState => {
  switch (action.type) {
    case "EXPENSES_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "UPDATE_CATEGORIZED_EXPENSES":
      return {
        ...state,
        categorizedItems: action.payload,
      };
    case "SWAP_CATEGORIZED_EXPENSE": {
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
    default:
      return state;
  }
};
