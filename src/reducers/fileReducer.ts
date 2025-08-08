import type { FileState, FileAction } from "../store/types";

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
      };
    default:
      return state;
  }
};
