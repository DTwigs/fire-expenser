import React from "react";
import { type CategorizedExpenseItem } from "../store";
import { Checkbox } from "./Checkbox";
import { ExpenseItem } from "./ExpenseItem";

type SelectedExpenseCardProps = {
  selectedItem: CategorizedExpenseItem | null;
  itemsUpdated: number;
  handleApplyToAllClick: () => void;
};

export const SelectedExpenseCard: React.FC<SelectedExpenseCardProps> = ({
  selectedItem,
  itemsUpdated,
  handleApplyToAllClick,
}) => (
  <div className="selected-item-wrapper">
    {selectedItem && <ExpenseItem key={selectedItem?.id} item={selectedItem} />}
    {itemsUpdated > 0 && (
      <div className="items-updated-container">
        <span>
          {itemsUpdated} items updated to {selectedItem?.category}
        </span>
      </div>
    )}
    <Checkbox
      text="Apply to all"
      checked={selectedItem?.applyToAll ?? false}
      onClick={handleApplyToAllClick}
    />
    <span>Which category does this expense belong to?</span>
  </div>
);
