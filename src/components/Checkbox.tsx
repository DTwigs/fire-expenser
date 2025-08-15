import { mdiCheckboxBlank, mdiCheckboxMarked } from "@mdi/js";
import Icon from "@mdi/react";
import { Colors } from "../constants/colors";

export const Checkbox: React.FC<{
  text: string;
  checked: boolean;
  onClick: () => void;
}> = ({ text, checked, onClick }) => {
  return (
    <div className={`checkbox ${checked ? "checked" : ""}`} onClick={onClick}>
      <Icon
        path={checked ? mdiCheckboxMarked : mdiCheckboxBlank}
        size={0.68}
        className="category-icon"
        color={Colors.lightText}
      />
      {text}
    </div>
  );
};
