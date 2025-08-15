import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import {
  useFile,
  useExpenses,
  type CategorizedExpenseItem,
  type CategoryKey,
} from "../../store";
import {
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORIZED_EXPENSES,
  UPDATE_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORY_MAPPER,
} from "../../reducers/actions";
import {
  convertToRawExpenses,
  categorizeItems,
  populateCategoryMapper,
  applyCategorySwapToAll,
} from "./utils";
import { WIZARD_STEP_KEYS } from "../constants";
import NextStepButton from "../../components/NextStepButton";
import { CATEGORY_NAMES } from "./constants";
import { CategoryItem } from "../../components/CategoryItem";
import { Checkbox } from "../../components/Checkbox";
import { normalizeString } from "../../utils/common";
import "./Categorization.css";

export const Categorization: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { file } = useFile();
  const { expenses, dispatch } = useExpenses();
  const [itemsSwapped, setItemsSwapped] = useState(0);
  const [selectedItem, setSelectedItem] =
    useState<CategorizedExpenseItem | null>(null);

  const rawExpenses = useMemo(
    () => convertToRawExpenses(file.data, file.fileHeaderRoles),
    [file.data, file.fileHeaderRoles]
  );

  const calcedCategorizedItems = useMemo(
    () => categorizeItems(rawExpenses, expenses.categoryMapper),
    [rawExpenses, expenses.categoryMapper]
  );

  useEffect(() => {
    if (calcedCategorizedItems.size > 0) {
      dispatch({
        type: UPDATE_CATEGORIZED_EXPENSES,
        payload: calcedCategorizedItems,
      });
    }
  }, [calcedCategorizedItems, dispatch]);

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
        const itemsSwapped = applyCategorySwapToAll(
          expenses.categorizedItems,
          normalizedSelectedDesc,
          destinationCategory,
          swapCategory
        );
        setItemsSwapped(itemsSwapped);
        setTimeout(() => {
          setItemsSwapped(0);
        }, 2000);
      } else {
        if (!item || item.category === destinationCategory) {
          return;
        }

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

  const handleApplyToAll = () => {
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

  const onComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingTransition onComplete={onComplete} />;
  }

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
            <div className="selected-item-wrapper">
              <div key={selectedItem?.id} className="expense-item">
                <div className="expense-details">
                  <span className="amount">
                    $
                    {selectedItem?.rawItem.expense_amount ??
                      selectedItem?.rawItem.rebate_amount ??
                      "$0.00"}
                  </span>
                  <span className="description">
                    {selectedItem?.rawItem.description}
                  </span>
                </div>
              </div>
              {itemsSwapped > 0 && (
                <div className="items-swapped-container">
                  <span>
                    {itemsSwapped} items swapped to {selectedItem?.category}
                  </span>
                </div>
              )}
              <Checkbox
                text="Apply to all"
                checked={selectedItem?.applyToAll ?? false}
                onClick={handleApplyToAll}
              />
              <span>Which category does this expense belong to?</span>
            </div>
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};
