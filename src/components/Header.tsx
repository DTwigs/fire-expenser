import { Icon } from "@mdi/react";
import { Colors } from "../constants/colors";
import { mdiCurrencyUsd } from "@mdi/js";

export const Header: React.FC = () => {
  return (
    <h1 className="file-upload-title">
      <Icon path={mdiCurrencyUsd} size={1.25} color={Colors.primary} />
      FIRE Expensor
    </h1>
  );
};
