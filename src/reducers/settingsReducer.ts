import type { SettingsState } from "../store/types";
import type { SettingsAction } from "./types";
import {
  SET_CATEGORIES,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  INITIALIZE_STORE,
} from "./actions";
import db from "../db";

export const initialSettingsState: SettingsState = {
  categories: {},
};

export const settingsReducer = (
  state: SettingsState = initialSettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case SET_CATEGORIES: {
      const newState = {
        ...state,
        categories: action.payload,
      };
      db.setSettings(newState);
      return newState;
    }

    case ADD_CATEGORY:
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload]: action.payload,
        },
      };

    case REMOVE_CATEGORY: {
      const newCategories = { ...state.categories };
      delete newCategories[action.payload];
      return {
        ...state,
        categories: newCategories,
      };
    }

    case INITIALIZE_STORE:
      return { ...action.payload.settings };

    default:
      return state;
  }
};
