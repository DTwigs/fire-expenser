import type {
  CategorizedExpenses,
  CategorizedExpenseItem,
  ExpenseTotals,
} from "../../store/types";

export const getTotals = (
  categorizedItems: CategorizedExpenses
): ExpenseTotals => {
  const totalsByCategory: Record<string, number> = {};
  const expenseRebateTotals = new ExpenseRebateTotals();
  [...categorizedItems.entries()].forEach(([category, items]) => {
    if (items.size <= 0) {
      return;
    }
    totalsByCategory[category] = [...items.values()].reduce(
      (acc: number, item: CategorizedExpenseItem) => {
        expenseRebateTotals.add(item.amount);
        return (acc += item.amount);
      },
      0
    );
  });
  return {
    totalsByCategory,
    rebateTotal: expenseRebateTotals.rebateTotal,
    expenseTotal: expenseRebateTotals.expenseTotal,
  };
};

class ExpenseRebateTotals {
  private positiveValues: number = 0;
  private negativeValues: number = 0;

  get expenseTotal() {
    return this.positiveValues;
  }

  get rebateTotal() {
    return this.negativeValues;
  }

  add(value: number) {
    if (value < 0) {
      this.negativeValues += value;
    } else {
      this.positiveValues += value;
    }
  }
}
