import type { CategoryMapper } from "../store/types";

const CATEGORY_MAPPER_KEY = "fire-expenser-category-mapper";

// Convert Map to serializable format for localStorage
const serializeCategoryMapper = (categoryMapper: CategoryMapper): string => {
  return JSON.stringify(Array.from(categoryMapper.entries()));
};

// Convert serialized data back to Map
const deserializeCategoryMapper = (serialized: string): CategoryMapper => {
  try {
    const entries = JSON.parse(serialized);
    return new Map(entries);
  } catch (error) {
    console.warn(
      "Failed to deserialize category mapper from localStorage:",
      error
    );
    return new Map();
  }
};

// Save category mapper to localStorage
export const setCategoryMapper = (categoryMapper: CategoryMapper): void => {
  try {
    const serialized = serializeCategoryMapper(categoryMapper);
    localStorage.setItem(CATEGORY_MAPPER_KEY, serialized);
  } catch (error) {
    console.error("Failed to save category mapper to localStorage:", error);
  }
};

// Get category mapper from localStorage
export const getCategoryMapper = (): CategoryMapper => {
  try {
    const serialized = localStorage.getItem(CATEGORY_MAPPER_KEY);
    if (!serialized) {
      return new Map();
    }
    return deserializeCategoryMapper(serialized);
  } catch (error) {
    console.error("Failed to get category mapper from localStorage:", error);
    return new Map();
  }
};

// Clear category mapper from localStorage
export const clearCategoryMapper = (): void => {
  try {
    localStorage.removeItem(CATEGORY_MAPPER_KEY);
  } catch (error) {
    console.error("Failed to clear category mapper from localStorage:", error);
  }
};
