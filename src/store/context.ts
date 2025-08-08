import { createContext } from "react";
import type { AppState, AppAction } from "./types";

// Create the store context
interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);
