import { initialState } from "../store/initialState";
import type { FileState } from "../store/types";
import type { FileAction } from "./types";

// File reducer
export const fileReducer = (
  state: FileState,
  action: FileAction
): FileState => {
  switch (action.type) {
    case "ADD_FILE_HEADERS":
      return {
        ...state,
        headers: action.payload,
      };
    case "ADD_FILE_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "REMOVE_FILE":
      return {
        ...state,
        headers: [],
        data: [],
        fileHeaderRoles: initialState.file.fileHeaderRoles,
      };
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
    default:
      return state;
  }
};
