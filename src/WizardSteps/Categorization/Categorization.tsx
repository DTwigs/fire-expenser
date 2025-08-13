import React, { useCallback, useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses, type CategorizedExpenseItem } from "../../store";
import {
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORIZED_EXPENSES,
} from "../../reducers/actions";
import { convertToRawExpenses, categorizeItems } from "./utils";
import { mdiTag } from "@mdi/js";
import { Icon } from "@mdi/react";
import { Colors } from "../../constants/colors";
import "./Categorization.css";
import { WIZARD_STEP_KEYS } from "../constants";
import NextStepButton from "../../components/NextStepButton";
import { CATEGORY_NAMES } from "./constants";

export const Categorization: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { file } = useFile();
  const { expenses, dispatch } = useExpenses();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);

  const rawExpenses = useMemo(
    () => convertToRawExpenses(file.data, file.fileHeaderRoles),
    [file.data, file.fileHeaderRoles]
  );

  const calcedCategorizedItems = useMemo(
    () => categorizeItems(rawExpenses, expenses.categoryMapper),
    [rawExpenses, expenses.categoryMapper]
  );

  const startRollup = (categories: string[]) => {
    categories.forEach((category) => {
      const items = document.querySelectorAll(
        `[data-category="${category}"] .expense-item`
      );
      items.forEach((item, index) => {
        (item as HTMLElement).style.setProperty("--delay", `${index * 0.02}s`);
        (item as HTMLElement).classList.add("rolling-up");
      });
    });
  };

  useEffect(() => {
    if (calcedCategorizedItems.size > 0) {
      dispatch({
        type: UPDATE_CATEGORIZED_EXPENSES,
        payload: calcedCategorizedItems,
      });
    }
  }, [calcedCategorizedItems, dispatch]);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      setIsDragging(false);
      setDragOverCategory(null);
    };

    const handleGlobalDrop = (e: DragEvent) => {
      // Only handle if the drop target is outside our component
      const target = e.target as HTMLElement;
      if (!target.closest(".categorized-items")) {
        setIsDragging(false);
        setDragOverCategory(null);
      }
    };

    document.addEventListener("dragend", handleGlobalDragEnd);
    document.addEventListener("drop", handleGlobalDrop);

    return () => {
      document.removeEventListener("dragend", handleGlobalDragEnd);
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent, item: CategorizedExpenseItem) => {
      startRollup(Array.from(expenses.categorizedItems.keys()));
      e.dataTransfer.setData("text/json", JSON.stringify(item));
      setIsDragging(true);
    },
    [expenses.categorizedItems]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, category: string) => {
      e.preventDefault();
      setDragOverCategory(category);
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    // Only clear drag state if we're actually leaving the header role
    // Check if the related target is outside our header role
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      setDragOverCategory(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, category: string) => {
      e.preventDefault();
      setIsDragging(false);
      setDragOverCategory(null);
      const item = JSON.parse(
        e.dataTransfer.getData("text/json")
      ) as CategorizedExpenseItem;

      if (item.category === category) {
        return;
      }

      dispatch({
        type: SWAP_CATEGORIZED_EXPENSE,
        payload: {
          originCategory: item.category ?? "",
          newCategory: category,
          expense: item,
        },
      });
    },
    [dispatch]
  );

  const onComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingTransition onComplete={onComplete} />;
  }

  return (
    <section>
      <h2>Categorize Your Expenses</h2>
      <div className="categorized-items">
        <div className={`category-wrapper ${isDragging ? "dragging" : ""}`}>
          {Array.from(expenses.categorizedItems.keys())
            .sort((a, b) => (a === "Unknown" ? -1 : b === "Unknown" ? 1 : 0))
            .map((category, index) => (
              <section
                className={`category-group ${
                  dragOverCategory === category ? "drag-over" : ""
                }`}
                key={category}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, category)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, category)}
              >
                <div className="category">
                  <Icon
                    path={mdiTag}
                    size={0.8}
                    className="category-icon"
                    color={Colors[`category${index}`] ?? Colors.lightText}
                  />
                  {category}
                </div>
                <div
                  className="expense-items-wrapper"
                  data-category={category}
                  key={category}
                >
                  {isDragging && (
                    <div className="drop-helper-text">Drop expense here</div>
                  )}
                  {Array.from(
                    expenses.categorizedItems.get(category)?.values() ?? []
                  ).map((item) => (
                    <div
                      key={item.id}
                      className="expense-item"
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, item)}
                    >
                      <div className="expense-details">
                        <span className="amount">
                          $
                          {item.rawItem.expense_amount ??
                            item.rawItem.rebate_amount ??
                            "$0.00"}
                        </span>
                        <span className="description">
                          {item.rawItem.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
      <NextStepButton
        currentStep={WIZARD_STEP_KEYS.CATEGORIZATION}
        isDisabled={
          (expenses.categorizedItems.get(CATEGORY_NAMES.Unknown)?.size ?? 0) > 0
        }
      />
    </section>
  );
};
