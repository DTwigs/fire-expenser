import {
  type RawExpenseItem,
  type FileDataItem,
  type FileHeaderRole,
  type CategoryMapper,
  type CategorizedExpenseItems,
  type CategorizedExpenses,
  type CategorizedExpenseItem,
  type ExpensesState,
  type NormalizedExpenseDesc,
  type CategoryKey,
} from "../../store";
import { CATEGORY_KEY_WORDS, CATEGORY_NAMES } from "./constants";
import { generateGuid, normalizeString } from "../../utils/common";

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
): CategorizedExpenses => {
  const categorizedItems: CategorizedExpenses = new Map();
  let categoryName: string = CATEGORY_NAMES.Unknown;

  rawExpenses.forEach((rawExpense) => {
    const rawCategory = rawExpense.category;
    const normalizedDesc = normalizeString(rawExpense.description);

    if (rawCategory) {
      const { category } = findCategory(
        rawCategory,
        categoryMapper,
        normalizedDesc
      );
      categoryName = category;
    }

    const categoryItems: CategorizedExpenseItems =
      categorizedItems.get(categoryName) ?? new Map();
    const guid = generateGuid();
    categoryItems.set(guid, {
      id: guid,
      rawItem: rawExpense,
      category: categoryName,
      normalizedDescription: normalizedDesc,
      applyToAll: true,
    });

    categorizedItems.set(categoryName, categoryItems);
  });

  return categorizedItems;
};

const findCategory = (
  rawCategory: string,
  categoryMapper: CategoryMapper,
  normalizedDesc: NormalizedExpenseDesc = ""
): { category: string } => {
  const lowerCaseCat = rawCategory.toLowerCase();

  if (categoryMapper.has(normalizedDesc)) {
    return {
      category: categoryMapper.get(normalizedDesc) ?? CATEGORY_NAMES.Unknown,
    };
  }

  return {
    category: CATEGORY_KEY_WORDS[lowerCaseCat] ?? CATEGORY_NAMES.Unknown,
  };
};

export const normalizeExpenseItem = (
  categoryItems: CategorizedExpenseItems
): CategorizedExpenseItem[] => {
  return Array.from(categoryItems.values()).map(
    (expense: CategorizedExpenseItem) => ({
      ...expense,
      normalizedDescription: normalizeString(expense.rawItem.description),
    })
  );
};

// after a user has categorized all their expenses,
// we populate the categoryMapper with a map from a
// normalized description to the category.
export const populateCategoryMapper = (
  expenses: ExpensesState
): CategoryMapper => {
  const newMapper: CategoryMapper = new Map(expenses.categoryMapper);
  // populate the categoryMapper to help with future category predictions
  Array.from(expenses.categorizedItems.entries()).forEach(
    ([category, categoryItems]: [string, CategorizedExpenseItems]) => {
      const normalizedExpenseItems = normalizeExpenseItem(categoryItems);
      normalizedExpenseItems.forEach((expense: CategorizedExpenseItem) => {
        if (!expense.normalizedDescription || !expense.applyToAll) {
          return;
        }

        newMapper.set(expense.normalizedDescription, category);
      });
    }
  );

  return newMapper;
};

export const getAllItemsAsArray = (
  categorizedItems: CategorizedExpenses
): CategorizedExpenseItem[] => {
  return Array.from(categorizedItems.values() || new Map())
    .map((map) => Array.from(map.values()))
    .flat();
};

export const applyCategorySwapToAll = (
  categorizedItems: CategorizedExpenses,
  descriptionToMatch: NormalizedExpenseDesc,
  destinationCategory: CategoryKey,
  callback: (
    item: CategorizedExpenseItem,
    destinationCategory: CategoryKey
  ) => void
): number => {
  const allItems = getAllItemsAsArray(categorizedItems);
  let itemsSwapped = 0;
  allItems.forEach((item) => {
    if (!item.applyToAll) {
      return;
    }

    const normalizedItemDesc =
      item.normalizedDescription || normalizeString(item.rawItem.description);

    if (descriptionToMatch !== normalizedItemDesc) {
      return;
    }

    callback(item, destinationCategory);
    itemsSwapped++;
  });

  return itemsSwapped;
};

export const sortByNormalizedDescription = (
  a: CategorizedExpenseItem,
  b: CategorizedExpenseItem
): number =>
  (a.normalizedDescription || "").localeCompare(b.normalizedDescription || "");
