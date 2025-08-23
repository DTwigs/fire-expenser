import React, { useState } from "react";
import { CategoryListHeader } from "../../components/CategoryListHeader";

type CategoryCreatorProps = {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
};

export const CategoryCreator: React.FC<CategoryCreatorProps> = ({
  categories,
  onCategoriesChange,
}) => {
  const [inputValue, setInputValue] = useState(
    categories.length > 0 ? categories.join(", ") : ""
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Parse comma or tab-separated string into categories
    const categoryList = value
      .split(/[,\t]/) // Split by comma or tab
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);

    onCategoriesChange(categoryList);
  };

  const handleCategoryClick = (category: string) => {
    // delete the category from the list
    const updatedCategories = categories.filter((cat) => cat !== category);
    onCategoriesChange(updatedCategories);

    const updatedInputValue = updatedCategories.join(", ");
    setInputValue(updatedInputValue);

    onCategoriesChange(updatedCategories);
  };

  return (
    <div className="category-creator">
      <div className="input-section">
        <label htmlFor="category-input" className="input-label">
          Enter categories (separated by commas or tabs):
        </label>
        <input
          id="category-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Category1, Category2, Category3"
          className="category-input"
        />
        <div className="input-hint">
          Copy the headers from your expense spreadsheet and paste them here.
          You can use commas or tabs to separate categories.
        </div>
      </div>

      <div className="categories-preview">
        <h3>Categories Preview ({categories.length}):</h3>
        {categories.length > 0 ? (
          <div className="categories-list">
            {categories.map((category, index) => (
              <CategoryListHeader
                key={`${category}-${index}`}
                category={category}
                handleCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        ) : (
          <div className="no-categories">
            No categories entered yet. Start typing and use commas or tabs to
            separate categories.
          </div>
        )}
      </div>
    </div>
  );
};
