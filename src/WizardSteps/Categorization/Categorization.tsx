import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import {
  useFile,
  useExpenses,
  type CategorizedExpenseItem,
  type CategorizedExpenseItems,
  type ExpensesState,
} from "../../store";
import {
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORIZED_EXPENSES,
} from "../../reducers/actions";
import { convertToRawExpenses, categorizeItems } from "./utils";
import "./Categorization.css";
import { WIZARD_STEP_KEYS } from "../constants";
import NextStepButton from "../../components/NextStepButton";
import { CATEGORY_NAMES } from "./constants";
import { mdiTag } from "@mdi/js";
import { Colors } from "../../constants/colors";
import Icon from "@mdi/react";

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
        <NextStepButton
          className={selectedItem ? "selected" : ""}
          currentStep={WIZARD_STEP_KEYS.CATEGORIZATION}
          isDisabled={
            (expenses.categorizedItems.get(CATEGORY_NAMES.Unknown)?.size ?? 0) >
            0
          }
        />

        <div
          className={`selected-item-wrapper ${selectedItem ? "selected" : ""}`}
        >
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
          <span>Which category does this expense belong to?</span>
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

type CategoryItemProps = {
  category: string;
  expenses: ExpensesState;
  handleCategoryClick: (category: string) => void;
  handleItemClick: (item: CategorizedExpenseItem) => void;
  showEmptyCategory: boolean;
};

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  expenses,
  handleCategoryClick,
  handleItemClick,
  showEmptyCategory,
}) => {
  const categoryItems: CategorizedExpenseItems | undefined =
    expenses.categorizedItems.get(category);

  if (!showEmptyCategory && (!categoryItems || categoryItems.size <= 0)) {
    return null;
  }

  const getCategoryItems = (category: string): CategorizedExpenseItem[] => {
    return Array.from(expenses.categorizedItems.get(category)?.values() ?? []);
  };

  return (
    <>
      <section className={"category-group"} key={category}>
        <CategoryListHeader
          category={category}
          handleCategoryClick={handleCategoryClick}
        />
        <div
          className="expense-items-wrapper"
          data-category={category}
          key={category}
        >
          {getCategoryItems(category).map((item) => (
            <ExpenseItem
              key={item.id}
              item={item}
              handleItemClick={handleItemClick}
            />
          ))}
        </div>
      </section>
    </>
  );
};

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

type CategoryListHeaderProps = {
  category: string;
  handleCategoryClick: (category: string) => void;
};

export const CategoryListHeader: React.FC<CategoryListHeaderProps> = ({
  category,
  handleCategoryClick,
}) => {
  return (
    <div className="category" onClick={() => handleCategoryClick(category)}>
      <Icon
        path={mdiTag}
        size={0.68}
        className="category-icon"
        color={Colors.backgroundTint}
      />
      {category}
    </div>
  );
};
