import type { SettingsState } from "../../store/types";
import type { FileHeaderRole } from "../../store/types";

export const requiredRoles: (keyof FileHeaderRole)[] = [
  "expense amount",
  "category",
  "description",
];

export const allRoles: (keyof FileHeaderRole)[] = [
  "date",
  "expense amount",
  "category",
  "description",
  "rebate amount",
  "card",
];

export const isRoleMapped = (settings: SettingsState, header: string) => {
  return Object.values(settings.fileHeaderRoles).includes(header);
};

export const getMappedHeader = (
  settings: SettingsState,
  role: keyof FileHeaderRole
) => {
  return settings.fileHeaderRoles[role];
};

export const isRequiredRole = (role: keyof FileHeaderRole) => {
  return requiredRoles.includes(role);
};

export const isNextStepDisabled = (settings: SettingsState) => {
  return requiredRoles.some((role) => settings.fileHeaderRoles[role] === null);
};
