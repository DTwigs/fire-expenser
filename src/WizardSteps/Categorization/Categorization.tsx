import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses, type CategorizedExpenseItem } from "../../store";
import {
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORIZED_EXPENSES,
  UPDATE_CATEGORY_MAPPER,
} from "../../reducers/actions";
import {
  convertToRawExpenses,
  categorizeItems,
  populateCategoryMapper,
} from "./utils";
import { WIZARD_STEP_KEYS } from "../constants";
import NextStepButton from "../../components/NextStepButton";
import { CATEGORY_NAMES } from "./constants";
import { CategoryItem } from "../../components/CategoryItem";
import { Checkbox } from "../../components/Checkbox";
import "./Categorization.css";

export const Categorization: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { file } = useFile();
  const { expenses, dispatch } = useExpenses();
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

  const handleCategoryClick = useCallback(
    (category: string) => {
      const item = selectedItem;
      setSelectedItem(null);

      if (!item || item.category === category) {
        return;
      }

      dispatch({
        type: SWAP_CATEGORIZED_EXPENSE,
        payload: {
          originCategory: item.category ?? "",
          newCategory: category,
          expense: item,
        },
      });
    },
    [dispatch, selectedItem]
  );

  const handleSubmit = () => {
    const newMapper = populateCategoryMapper(expenses);

    dispatch({
      type: UPDATE_CATEGORY_MAPPER,
      payload: newMapper,
    });
  };

  const handleApplyToAll = () => {
    const { category = "", id = "" } = selectedItem ?? {};
    expenses.categorizedItems.get(category)?.get(id);
    // dispatch({
    //   type: UPDATE_CATEGORIZED_EXPENSE,
    //   payload: calcedCategorizedItems,
    // });
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
