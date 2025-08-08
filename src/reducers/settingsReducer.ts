import type { SettingsState, SettingsAction } from "../store/types";

// Settings reducer
export const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    default:
      return state;
  }
};
