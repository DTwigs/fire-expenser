import React from "react";
import { type CategorizedExpenseItem } from "../store";

type ExpenseItemProps = {
  item: CategorizedExpenseItem;
  handleItemClick?: (item: CategorizedExpenseItem) => void;
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  item,
  handleItemClick,
}) => {
  return (
    <div className="expense-item" onClick={() => handleItemClick?.(item)}>
      <div className="expense-details">
        <span className="amount">
          $
          {item.rawItem.expense_amount ?? item.rawItem.rebate_amount ?? "$0.00"}
        </span>
        <span className="description">{item.rawItem.description}</span>
      </div>
    </div>
  );
};
