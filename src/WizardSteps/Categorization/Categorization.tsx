import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useExpenses,
  useSettings,
  type CategorizedExpenseItem,
  type CategoryKey,
} from "../../store";
import {
  REMOVE_CATEGORIZED_EXPENSE,
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
import { CATEGORY_UNKNOWN } from "./constants";
import { CategoryItem } from "../../components/CategoryItem";
import { SelectedExpenseCard } from "../../components/SelectedExpenseCard";
import type { SlotMachineRef } from "../../components/SlotMachine";
import {
  AnimatedItemsUpdated,
  type AnimatedItemsUpdatedRef,
} from "../../components/AnimatedItemsUpdated";
import "./Categorization.css";
import { withWizard, type WithWizardProps } from "../withWizard";

const CategorizationStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
  const carouselRef = useRef<SlotMachineRef>(null);
  const itemsUpdatedRef = useRef<AnimatedItemsUpdatedRef>(null);
  const { expenses, dispatch } = useExpenses();
  const { settings } = useSettings();
  const [selectedItem, setSelectedItem] =
    useState<CategorizedExpenseItem | null>(null);

  const unknownCategoryItems = useMemo(
    () =>
      Array.from(
        expenses.categorizedItems.get(CATEGORY_UNKNOWN)?.values() ?? []
      ).sort(sortByNormalizedDescription),
    [expenses.categorizedItems]
  );

  const isCategorizingUnknown = useMemo(
    () => (expenses.categorizedItems.get(CATEGORY_UNKNOWN)?.size ?? 0) >= 1,
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
          originCategory: item.category || CATEGORY_UNKNOWN,
          newCategory: destinationCategory,
          expense: item,
        },
      });
    },
    [dispatch]
  );

  const goToNextInCarousel = useCallback(
    (itemsUpdatedCount: number) => {
      const currentIndex = carouselRef.current?.getCurrentIndex();
      const newIndex = (currentIndex || 0) + itemsUpdatedCount;
      const carouseItemsCount = carouselRef.current?.getItemsCount() ?? 0;
      carouselRef.current?.goToIndex(newIndex);

      if (newIndex >= carouseItemsCount) {
        // when we have removed all items from the carousel,
        // we set the selected item to null to trigger the next step
        setSelectedItem(null);
      }
    },
    [carouselRef, setSelectedItem]
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
        goToNextInCarousel(itemsUpdatedCount);
        return;
      }
      setSelectedItem(null);
    },
    [
      expenses.categorizedItems,
      selectedItem,
      swapCategory,
      isCategorizingUnknown,
      goToNextInCarousel,
    ]
  );

  const handleDeleteItem = (item: CategorizedExpenseItem) => {
    dispatch({
      type: REMOVE_CATEGORIZED_EXPENSE,
      payload: item,
    });
    if (isCategorizingUnknown) {
      goToNextInCarousel(1);
      return;
    } else {
      setSelectedItem(null);
    }
  };

  const handleFlipItemValue = (item: CategorizedExpenseItem) => {
    dispatch({
      type: UPDATE_CATEGORIZED_EXPENSE,
      payload: { ...item, amount: item.amount * -1 },
    });
  };

  const handleSubmit = () => {
    const newMapper = populateCategoryMapper(expenses);

    dispatch({
      type: UPDATE_CATEGORY_MAPPER,
      payload: newMapper,
    });
    handleNextStep();
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
    <section className="step-container">
      <h2>{step.description}</h2>

      <div className="transition-container">
        <div className="flex-item-single"></div>
        <div
          className={`card-flip-container ${selectedItem ? "flipped" : ""} ${
            isCategorizingUnknown ? "categorizing-unknown" : ""
          }`}
        >
          <div className="card-front">
            <NextStepButton
              isDisabled={
                (expenses.categorizedItems.get(CATEGORY_UNKNOWN)?.size ?? 0) > 0
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
              deleteItem={handleDeleteItem}
              flipItemValue={handleFlipItemValue}
            />
          </div>
        </div>
        <div className="flex-item-single">
          <AnimatedItemsUpdated ref={itemsUpdatedRef} />
        </div>
      </div>
      <div className="categorized-items">
        <div className={`category-wrapper ${selectedItem ? "selected" : ""}`}>
          {Object.values(settings.categories).map((category) => {
            if (selectedItem && category === CATEGORY_UNKNOWN) {
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

export const Categorization = withWizard(
  CategorizationStep,
  WIZARD_STEP_KEYS.CATEGORIZATION
);
