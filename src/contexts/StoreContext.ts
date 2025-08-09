import { createContext } from "react";
import type { AppState } from "../store/types";
import type { AppAction } from "../reducers/types";

// Create the store context
interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);
