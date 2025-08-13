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

      console.log({
        originCategory,
        newCategory,
        catItems: categorizedItems.get(originCategory),
        idToRemove: expense.id,
      });
      categorizedItems.get(originCategory)?.delete(expense.id);
      console.log({ afterDelete: categorizedItems.get(originCategory) });

      const newCategoryItems = categorizedItems.get(newCategory);
      if (!newCategoryItems) {
        categorizedItems.set(newCategory, new Map([[expense.id, expense]]));
      } else {
        newCategoryItems.set(expense.id, expense);
      }

      // console.log({ categorizedItems });

      return {
        ...state,
        categorizedItems,
      };
    }
    default:
      return state;
  }
};
