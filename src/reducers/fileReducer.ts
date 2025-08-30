import type { FileState } from "../store/types";
import type { FileAction } from "./types";
import { ADD_FILE, REMOVE_FILE, UPDATE_SINGLE_HEADER_ROLE } from "./actions";

export const initialFileState: FileState = {};

// File reducer
export const fileReducer = (
  state: FileState,
  action: FileAction
): FileState => {
  switch (action.type) {
    case ADD_FILE: {
      const file = action.payload;
      const files = { ...state };
      files[file.fileName] = file;

      return {
        ...files,
      };
    }
    case REMOVE_FILE: {
      const files = { ...state };
      delete files[action.payload];
      return {
        ...files,
      };
    }
    case UPDATE_SINGLE_HEADER_ROLE: {
      const { fileName, role, header } = action.payload;
      const files = { ...state };
      if (fileName in files) {
        files[fileName] = {
          ...files[fileName],
          fileHeaderRoles: {
            ...files[fileName].fileHeaderRoles,
            [role]: header,
          },
        };
      }
      return {
        ...files,
      };
    }
    default:
      return state;
  }
};
