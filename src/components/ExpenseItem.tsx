import React from "react";
import { type CategorizedExpenseItem } from "../store";
import Icon from "@mdi/react";
import { mdiTrashCan } from "@mdi/js";

type ExpenseItemProps = {
  item: CategorizedExpenseItem;
  handleItemClick?: (item: CategorizedExpenseItem) => void;
  deleteItem?: (item: CategorizedExpenseItem) => void;
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  item,
  handleItemClick,
  deleteItem,
}) => {
  const isRebate = item.amount < 0;
  const isSelectedItem = !handleItemClick;

  return (
    <div className={`expense-item`} onClick={() => handleItemClick?.(item)}>
      <div className="expense-details">
        <span className={`amount ${isRebate ? "rebate" : ""}`}>
          {isRebate ? "-" : ""}${Math.abs(item.amount) || "0.00"}
        </span>
        <span className="description">{item.rawItem.description}</span>
      </div>
      {isSelectedItem && (
        <div className="trash-icon-wrapper" onClick={() => deleteItem?.(item)}>
          <Icon path={mdiTrashCan} className="trash-icon" size={1} />
        </div>
      )}
    </div>
  );
};
