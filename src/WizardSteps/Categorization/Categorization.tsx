import React, { useCallback, useState } from "react";
import {
  useExpenses,
  type CategorizedExpenseItem,
  type CategoryKey,
} from "../../store";
import {
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORY_MAPPER,
} from "../../reducers/actions";
import { populateCategoryMapper, applyCategorySwapToAll } from "./utils";
import { WIZARD_STEP_KEYS } from "../constants";
import NextStepButton from "../../components/NextStepButton";
import { CATEGORY_NAMES } from "./constants";
import { CategoryItem } from "../../components/CategoryItem";
import { normalizeString } from "../../utils/common";
import { SelectedExpenseCard } from "../../components/SelectedExpenseCard";
import "./Categorization.css";

export const Categorization: React.FC = () => {
  const { expenses, dispatch } = useExpenses();
  const [itemsUpdated, setItemsUpdated] = useState(0);
  const [selectedItem, setSelectedItem] =
    useState<CategorizedExpenseItem | null>(null);

  const handleItemClick = (item: CategorizedExpenseItem) => {
    setSelectedItem(item);
  };

  const swapCategory = useCallback(
    (item: CategorizedExpenseItem, destinationCategory: CategoryKey) => {
      dispatch({
        type: SWAP_CATEGORIZED_EXPENSE,
        payload: {
          originCategory: item.category || CATEGORY_NAMES.Unknown,
          newCategory: destinationCategory,
          expense: item,
        },
      });
    },
    [dispatch]
  );

  const handleCategoryClick = useCallback(
    (destinationCategory: string) => {
      const item = selectedItem;
      setSelectedItem(null);

      // if applyToAll is true, we grab all other items in the Unknown category with the same
      // normalized description and move them to the destination category.
      if (item?.applyToAll) {
        const normalizedSelectedDesc = normalizeString(
          item.rawItem.description
        );
        const itemsUpdatedCount = applyCategorySwapToAll(
          expenses.categorizedItems,
          normalizedSelectedDesc,
          destinationCategory,
          swapCategory
        );
        setItemsUpdated(itemsUpdatedCount);
        setTimeout(() => {
          setItemsUpdated(0);
        }, 2000);
      } else if (item && item.category !== destinationCategory) {
        swapCategory(item, destinationCategory);
      }
    },
    [expenses.categorizedItems, selectedItem, swapCategory]
  );

  const handleSubmit = () => {
    const newMapper = populateCategoryMapper(expenses);

    dispatch({
      type: UPDATE_CATEGORY_MAPPER,
      payload: newMapper,
    });
  };

  const handleApplyToAllClick = () => {
    if (!selectedItem) {
      return;
    }

    const item = {
      ...selectedItem,
      applyToAll: !selectedItem.applyToAll,
    };

    setSelectedItem(item);
    dispatch({
      type: UPDATE_CATEGORIZED_EXPENSE,
      payload: item,
    });
  };

  return (
    <section className="categorization-wrapper">
      <h2>Categorize Your Expenses</h2>
      <div className="transition-container">
        <div className={`card-flip-container ${selectedItem ? "flipped" : ""}`}>
          <div className="card-front">
            <NextStepButton
              currentStep={WIZARD_STEP_KEYS.CATEGORIZATION}
              isDisabled={
                (expenses.categorizedItems.get(CATEGORY_NAMES.Unknown)?.size ??
                  0) > 0
              }
              onClick={handleSubmit}
            />
          </div>
          <div className="card-back">
            <SelectedExpenseCard
              selectedItem={selectedItem}
              itemsUpdated={itemsUpdated}
              handleApplyToAllClick={handleApplyToAllClick}
            />
          </div>
        </div>
      </div>
      <div className="categorized-items">
        <div className={`category-wrapper ${selectedItem ? "selected" : ""}`}>
          {Object.values(CATEGORY_NAMES).map((category) => (
            <CategoryItem
              category={category}
              expenses={expenses}
              handleCategoryClick={handleCategoryClick}
              handleItemClick={handleItemClick}
              showEmptyCategory={!!selectedItem}
              key={category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
