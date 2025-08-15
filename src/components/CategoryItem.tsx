import React from "react";
import {
  type CategorizedExpenseItem,
  type CategorizedExpenseItems,
  type ExpensesState,
} from "../store";
import { CategoryListHeader } from "./CategoryListHeader";
import { ExpenseItem } from "./ExpenseItem";
import "../WizardSteps/Categorization/Categorization.css";

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
