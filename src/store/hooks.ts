import { useContext } from "react";
import type { AppState } from "./types";
import type { AppAction } from "../reducers/types";
import { StoreContext } from "../contexts/StoreContext";

// Create the store context
interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Custom hook to use the store
export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

// Convenience hooks for specific state slices
export const useExpenses = () => {
  const { state, dispatch } = useStore();
  return {
    expenses: state.expenses,
    dispatch,
  };
};

export const useFile = () => {
  const { state, dispatch } = useStore();
  return {
    file: state.file,
    dispatch,
  };
};

export const useWizard = () => {
  const { state, dispatch } = useStore();
  return {
    wizard: state.wizard,
    dispatch,
  };
};
