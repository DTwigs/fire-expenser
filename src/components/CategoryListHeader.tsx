import React from "react";
import { mdiTag } from "@mdi/js";
import Icon from "@mdi/react";

type CategoryListHeaderProps = {
  category: string;
  handleCategoryClick: (category: string) => void;
  total?: number;
};

export const CategoryListHeader: React.FC<CategoryListHeaderProps> = ({
  category,
  handleCategoryClick,
  total,
}) => {
  return (
    <div className="category" onClick={() => handleCategoryClick(category)}>
      <div className="category-header">
        <Icon path={mdiTag} size={0.68} className="category-icon" />
        {category}
      </div>
      {total && (
        <div className={`category-total ${total < 0 ? "rebate" : ""}`}>
          {total.toFixed(2)}
        </div>
      )}
    </div>
  );
};
