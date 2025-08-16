import React, { useEffect, useState } from "react";
import { type CategorizedExpenseItem } from "../store";
import { Checkbox } from "./Checkbox";
import { ExpenseItem } from "./ExpenseItem";
import SlotMachine, { type SlotMachineRef } from "./SlotMachine";
import { sortByNormalizedDescription } from "../WizardSteps/Categorization/utils";

type SelectedExpenseCardProps = {
  selectedItem: CategorizedExpenseItem | null;
  itemsUpdated: number;
  handleApplyToAllClick: () => void;
  showCarousel: boolean;
  carouselItems: CategorizedExpenseItem[];
  carouselRef: React.RefObject<SlotMachineRef> | null;
};

export const SelectedExpenseCard: React.FC<SelectedExpenseCardProps> = ({
  selectedItem,
  itemsUpdated,
  handleApplyToAllClick,
  showCarousel,
  carouselItems,
  carouselRef,
}) => {
  const [frozenItems, setFrozenItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!showCarousel) return;

    // freeze the carousel nodes so that removing items from unknown category doesnt
    // cause items in the carousel too disappear.
    const nodes = carouselItems
      .sort(sortByNormalizedDescription)
      .map((item) => <ExpenseItem key={item?.id} item={item} />);
    setFrozenItems(nodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="selected-item-wrapper">
      {showCarousel && frozenItems.length > 0 ? (
        <SlotMachine
          items={frozenItems}
          height={120}
          itemHeight={38}
          ref={carouselRef}
        />
      ) : (
        selectedItem && (
          <ExpenseItem key={selectedItem?.id} item={selectedItem} />
        )
      )}
      {
        <div className="items-updated-container">
          {itemsUpdated > 0 && (
            <span>
              {itemsUpdated} items updated to {selectedItem?.category}
            </span>
          )}
        </div>
      }
      <Checkbox
        text="Apply to all"
        checked={selectedItem?.applyToAll ?? false}
        onClick={handleApplyToAllClick}
      />
      <span>Which category does this expense belong to?</span>
    </div>
  );
};
