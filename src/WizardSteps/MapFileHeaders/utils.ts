import type { FileDatum } from "../../store/types";
import type { FileHeaderRole } from "../../store/types";

export const requiredRoles: (keyof FileHeaderRole)[] = [
  "expense_amount",
  "description",
];

export const allRoles: (keyof FileHeaderRole)[] = [
  "date",
  "description",
  "expense_amount",
  "category",
  "rebate_amount",
  "card",
];

export const isRoleMapped = (file: FileDatum, header: string) => {
  return Object.values(file.fileHeaderRoles).includes(header);
};

export const getMappedHeader = (
  file: FileDatum,
  role: keyof FileHeaderRole
) => {
  return file.fileHeaderRoles[role];
};

export const isRequiredRole = (role: keyof FileHeaderRole) => {
  return requiredRoles.includes(role);
};

export const hasAllRequiredHeaders = (file: FileDatum) => {
  if (!file) return false;
  return requiredRoles.every((role) => file.fileHeaderRoles[role]);
};

export const isNextStepDisabled = (filesArray: FileDatum[]) => {
  return filesArray.some((file) => !hasAllRequiredHeaders(file));
};
