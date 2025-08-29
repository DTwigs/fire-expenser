import type { FileState } from "../store/types";
import type { FileAction } from "./types";
import {
  ADD_FILE_DATA,
  ADD_FILE_HEADERS,
  REMOVE_FILE,
  UPDATE_FILE_HEADER_ROLES,
  UPDATE_SINGLE_HEADER_ROLE,
} from "./actions";

export const initialFileState: FileState = {
  headers: [],
  data: [],
  fileHeaderRoles: {
    date: null,
    expense_amount: "",
    rebate_amount: null,
    card: null,
    category: "",
    description: "",
  },
};

// File reducer
export const fileReducer = (
  state: FileState,
  action: FileAction
): FileState => {
  switch (action.type) {
    case ADD_FILE_HEADERS:
      return {
        ...state,
        headers: action.payload,
      };
    case ADD_FILE_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case REMOVE_FILE:
      return {
        ...state,
        headers: [],
        data: [],
        fileHeaderRoles: initialFileState.fileHeaderRoles,
      };
    case UPDATE_FILE_HEADER_ROLES:
      return {
        ...state,
        fileHeaderRoles: action.payload,
      };
    case UPDATE_SINGLE_HEADER_ROLE:
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
