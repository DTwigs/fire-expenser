import { type SettingsState } from "../store/types";
import { initialSettingsState } from "../reducers/settingsReducer";

const SETTINGS_KEY = "fire-expenser-settings";

// Convert Map to serializable format for localStorage
const serializeSettings = (settings: SettingsState): string => {
  return JSON.stringify(settings);
};

// Convert serialized data back to Map
const deserializeSettings = (serialized: string): SettingsState => {
  try {
    return JSON.parse(serialized);
  } catch (error) {
    console.warn("Failed to deserialize settings from localStorage:", error);
    return initialSettingsState;
  }
};

// Save settings to localStorage
export const setSettings = (settings: SettingsState): void => {
  try {
    const serialized = serializeSettings(settings);
    localStorage.setItem(SETTINGS_KEY, serialized);
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

// Get settings from localStorage
export const getSettings = (): SettingsState => {
  try {
    const serialized = localStorage.getItem(SETTINGS_KEY);
    if (!serialized) {
      return initialSettingsState;
    }
    return deserializeSettings(serialized);
  } catch (error) {
    console.error("Failed to get settings from localStorage:", error);
    return initialSettingsState;
  }
};

// Clear settings from localStorage
export const clearSettings = (): void => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error("Failed to clear settings from localStorage:", error);
  }
};
