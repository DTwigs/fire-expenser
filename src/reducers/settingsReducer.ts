import { initialState } from "../store/initialState";
import type { SettingsState } from "../store/types";
import type { SettingsAction } from "./types";

// Settings reducer
export const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case "UPDATE_FILE_HEADER_ROLES":
      return {
        ...state,
        fileHeaderRoles: action.payload,
      };
    case "UPDATE_SINGLE_HEADER_ROLE":
      return {
        ...state,
        fileHeaderRoles: {
          ...state.fileHeaderRoles,
          [action.payload.role]: action.payload.header,
        },
      };
    case "REMOVE_FILE":
      return {
        ...state,
        fileHeaderRoles: initialState.settings.fileHeaderRoles,
      };
    default:
      return state;
  }
};
