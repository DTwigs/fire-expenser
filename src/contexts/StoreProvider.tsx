import React, { useReducer, type ReactNode } from "react";
import { appReducer } from "../reducers";
import { initialState } from "../store/initialState";
import { StoreContext } from "./StoreContext";

// Store provider component
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
