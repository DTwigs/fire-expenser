import {
  type RawExpenseItem,
  type FileDataItem,
  type FileHeaderRole,
  type CategorizedExpenseItem,
  type CategoryMapper,
  type CategorizedExpenseItems,
} from "../../store";
import { CATEGORY_KEY_WORDS, CATEGORY_NAMES } from "./constants";

export const convertToRawExpenses = (
  fileData: FileDataItem[],
  fileHeaderRoles: FileHeaderRole
): RawExpenseItem[] => {
  return fileData.map((item) => {
    const expense: RawExpenseItem = {
      expense_amount: item[fileHeaderRoles.expense_amount] ?? "",
      category: item[fileHeaderRoles.category] ?? "",
      description: item[fileHeaderRoles.description] ?? "",
    };

    if (fileHeaderRoles.rebate_amount) {
      expense.rebate_amount = item[fileHeaderRoles.rebate_amount];
    }

    if (fileHeaderRoles.card) {
      expense.card = item[fileHeaderRoles.card];
    }

    if (fileHeaderRoles.date) {
      expense.date = item[fileHeaderRoles.date];
    }

    return expense;
  });
};

export const categorizeItems = (
  rawExpenses: RawExpenseItem[],
  categoryMapper: CategoryMapper
): CategorizedExpenseItems => {
  const categorizedItems: CategorizedExpenseItems = new Map();
  let categoryName: string = CATEGORY_NAMES.Misc;
  let categoryUnknown: boolean = false;

  rawExpenses.forEach((expense) => {
    const rawCategory = expense.category;

    if (rawCategory) {
      const { category, unknown } = findCategory(rawCategory, categoryMapper);
      categoryName = category;
      categoryUnknown = unknown;
    }

    const categoryItems = categorizedItems.get(categoryName) ?? [];
    categoryItems.push({
      ...expense,
      categoryUnknown,
    } as CategorizedExpenseItem);

    categorizedItems.set(categoryName, categoryItems);
  });

  return categorizedItems;
};

const findCategory = (
  rawCategory: string,
  categoryMapper: CategoryMapper
): { category: string; unknown: boolean } => {
  const lowerCaseCat = rawCategory.toLowerCase();

  if (lowerCaseCat in categoryMapper) {
    return {
      category: categoryMapper.get(lowerCaseCat) ?? CATEGORY_NAMES.Misc,
      unknown: false,
    };
  }

  return {
    category: CATEGORY_KEY_WORDS[lowerCaseCat] ?? CATEGORY_NAMES.Misc,
    unknown: true,
  };
};
