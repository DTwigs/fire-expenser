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
    default:
      return state;
  }
};
