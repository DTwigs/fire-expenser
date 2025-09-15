import React from "react";
import { type CategorizedExpenseItem } from "../store";
import Icon from "@mdi/react";
import { mdiSync, mdiTrashCan } from "@mdi/js";

type ExpenseItemProps = {
  item: CategorizedExpenseItem;
  handleItemClick?: (item: CategorizedExpenseItem) => void;
  deleteItem?: (item: CategorizedExpenseItem) => void;
  flipItemValue?: (item: CategorizedExpenseItem) => void;
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
  item,
  handleItemClick,
  deleteItem,
  flipItemValue,
}) => {
  if (Math.abs(item.amount) === 2800) {
    console.log({ item });
  }
  const isRebate = item.amount < 0;
  const isSelectedItem = !handleItemClick;

  const handleFlipValue = (item: CategorizedExpenseItem) => {
    if (flipItemValue) {
      flipItemValue(item);
      item.amount = item.amount * -1;
    }
  };

  return (
    <div className={`expense-item`} onClick={() => handleItemClick?.(item)}>
      {isSelectedItem && (
        <div
          className="flip-icon-wrapper icon-wrapper"
          onClick={() => handleFlipValue(item)}
        >
          <Icon path={mdiSync} className="trash-icon" size={1} />
        </div>
      )}
      <div className="expense-details">
        <span className={`amount ${isRebate ? "rebate" : ""}`}>
          {isRebate ? "-" : ""}${Math.abs(item.amount) || "0.00"}
        </span>
        <span className="description">{item.rawItem.description}</span>
      </div>
      {isSelectedItem && (
        <div
          className="trash-icon-wrapper icon-wrapper"
          onClick={() => deleteItem?.(item)}
        >
          <Icon path={mdiTrashCan} className="trash-icon" size={1} />
        </div>
      )}
    </div>
  );
};
