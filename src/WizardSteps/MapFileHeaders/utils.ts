import type { FileState } from "../../store/types";
import type { FileHeaderRole } from "../../store/types";

export const requiredRoles: (keyof FileHeaderRole)[] = [
  "expense_amount",
  "category",
  "description",
];

export const allRoles: (keyof FileHeaderRole)[] = [
  "date",
  "expense_amount",
  "category",
  "description",
  "rebate_amount",
  "card",
];

export const isRoleMapped = (file: FileState, header: string) => {
  return Object.values(file.fileHeaderRoles).includes(header);
};

export const getMappedHeader = (
  file: FileState,
  role: keyof FileHeaderRole
) => {
  return file.fileHeaderRoles[role];
};

export const isRequiredRole = (role: keyof FileHeaderRole) => {
  return requiredRoles.includes(role);
};

export const isNextStepDisabled = (file: FileState) => {
  console.log({ roles: file.fileHeaderRoles });
  return requiredRoles.some((role) => !file.fileHeaderRoles[role]);
};
