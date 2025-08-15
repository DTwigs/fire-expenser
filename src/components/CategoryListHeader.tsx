import React from "react";
import { mdiTag } from "@mdi/js";
import { Colors } from "../constants/colors";
import Icon from "@mdi/react";

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
