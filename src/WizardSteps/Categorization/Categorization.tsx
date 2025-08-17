import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useExpenses,
  type CategorizedExpenseItem,
  type CategoryKey,
} from "../../store";
import {
  SWAP_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORIZED_EXPENSE,
  UPDATE_CATEGORY_MAPPER,
} from "../../reducers/actions";
import {
  populateCategoryMapper,
  applyCategorySwapToAll,
  sortByNormalizedDescription,
} from "./utils";
import { WIZARD_STEP_KEYS } from "../constants";
import NextStepButton from "../../components/NextStepButton";
import { CATEGORY_NAMES } from "./constants";
import { CategoryItem } from "../../components/CategoryItem";
import { SelectedExpenseCard } from "../../components/SelectedExpenseCard";
import type { SlotMachineRef } from "../../components/SlotMachine";
import {
  AnimatedItemsUpdated,
  type AnimatedItemsUpdatedRef,
} from "../../components/AnimatedItemsUpdated";
import "./Categorization.css";

export const Categorization: React.FC = () => {
  const carouselRef = useRef<SlotMachineRef>(null);
  const itemsUpdatedRef = useRef<AnimatedItemsUpdatedRef>(null);
  const { expenses, dispatch } = useExpenses();
  const [selectedItem, setSelectedItem] =
    useState<CategorizedExpenseItem | null>(null);

  const unknownCategoryItems = useMemo(
    () =>
      Array.from(
        expenses.categorizedItems.get(CATEGORY_NAMES.Unknown)?.values() ?? []
      ).sort(sortByNormalizedDescription),
    [expenses.categorizedItems]
  );

  const isCategorizingUnknown = useMemo(
    () =>
      (expenses.categorizedItems.get(CATEGORY_NAMES.Unknown)?.size ?? 0) >= 1,
    [expenses.categorizedItems]
  );

  useEffect(() => {
    if (isCategorizingUnknown) {
      setSelectedItem(unknownCategoryItems[0]);
      return;
    }
  }, [isCategorizingUnknown, unknownCategoryItems]);

  const handleItemClick = (item: CategorizedExpenseItem) => {
    setSelectedItem(item);
  };

  const swapCategory = useCallback(
    (item: CategorizedExpenseItem, destinationCategory: CategoryKey) => {
      dispatch({
        type: SWAP_CATEGORIZED_EXPENSE,
        payload: {
          originCategory: item.category || CATEGORY_NAMES.Unknown,
          newCategory: destinationCategory,
          expense: item,
        },
      });
    },
    [dispatch]
  );

  const handleCategoryClick = useCallback(
    (destinationCategory: string) => {
      const item = selectedItem;

      let itemsUpdatedCount = 1;
      // if applyToAll is true, we grab all other items in the Unknown category with the same
      // normalized description and move them to the destination category.
      if (item?.applyToAll) {
        itemsUpdatedCount = applyCategorySwapToAll(
          expenses.categorizedItems,
          item.normalizedDescription ?? "",
          destinationCategory,
          swapCategory
        );
        itemsUpdatedRef.current?.add(itemsUpdatedCount);
      } else if (item && item.category !== destinationCategory) {
        swapCategory(item, destinationCategory);
        itemsUpdatedRef.current?.add(1);
      }

      if (isCategorizingUnknown) {
        const currentIndex = carouselRef.current?.getCurrentIndex();
        const newIndex = (currentIndex || 0) + itemsUpdatedCount;
        const carouseItemsCount = carouselRef.current?.getItemsCount() ?? 0;
        carouselRef.current?.goToIndex(newIndex);

        if (newIndex >= carouseItemsCount) {
          // when we have removed all items from the carousel,
          // we set the selected item to null to trigger the next step
          setSelectedItem(null);
        }
        return;
      }
      setSelectedItem(null);
    },
    [
      expenses.categorizedItems,
      selectedItem,
      swapCategory,
      isCategorizingUnknown,
    ]
  );

  const handleSubmit = () => {
    const newMapper = populateCategoryMapper(expenses);

    dispatch({
      type: UPDATE_CATEGORY_MAPPER,
      payload: newMapper,
    });
  };

  const handleApplyToAllClick = () => {
    if (!selectedItem) {
      return;
    }

    const item = {
      ...selectedItem,
      applyToAll: !selectedItem.applyToAll,
    };

    setSelectedItem(item);
    dispatch({
      type: UPDATE_CATEGORIZED_EXPENSE,
      payload: item,
    });
  };

  return (
    <section className="categorization-wrapper">
      <h2>Categorize Your Expenses</h2>

      <div className="transition-container">
        <div className="flex-item-single"></div>
        <div
          className={`card-flip-container ${selectedItem ? "flipped" : ""} ${
            isCategorizingUnknown ? "categorizing-unknown" : ""
          }`}
        >
          <div className="card-front">
            <NextStepButton
              currentStep={WIZARD_STEP_KEYS.CATEGORIZATION}
              isDisabled={
                (expenses.categorizedItems.get(CATEGORY_NAMES.Unknown)?.size ??
                  0) > 0
              }
              onClick={handleSubmit}
            />
          </div>
          <div className="card-back">
            <SelectedExpenseCard
              carouselItems={unknownCategoryItems}
              showCarousel={isCategorizingUnknown}
              selectedItem={selectedItem}
              handleApplyToAllClick={handleApplyToAllClick}
              carouselRef={carouselRef}
            />
          </div>
        </div>
        <div className="flex-item-single">
          <AnimatedItemsUpdated ref={itemsUpdatedRef} />
        </div>
      </div>
      <div className="categorized-items">
        <div className={`category-wrapper ${selectedItem ? "selected" : ""}`}>
          {Object.values(CATEGORY_NAMES).map((category) => {
            if (selectedItem && category === CATEGORY_NAMES.Unknown) {
              return null;
            }
            return (
              <CategoryItem
                category={category}
                expenses={expenses}
                handleCategoryClick={handleCategoryClick}
                handleItemClick={handleItemClick}
                showEmptyCategory={!!selectedItem}
                key={category}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
