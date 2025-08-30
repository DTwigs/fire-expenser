import React, { useEffect, useMemo } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses } from "../../store";
import { UPDATE_CATEGORIZED_EXPENSES } from "../../reducers/actions";
import { convertToRawExpenses, categorizeItems } from "./utils";
import { WIZARD_STEP_KEYS } from "../constants";
import { withWizard, type WithWizardProps } from "../withWizard";

const LoadingCategoriesStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
  const { files } = useFile();
  const { expenses, dispatch } = useExpenses();
  const rawExpenses = useMemo(
    () =>
      Object.values(files)
        .map((file) => convertToRawExpenses(file.data, file.fileHeaderRoles))
        .flat(),
    [files]
  );

  const calcedCategorizedItems = useMemo(
    () => categorizeItems(rawExpenses, expenses.categoryMapper),
    [rawExpenses, expenses.categoryMapper]
  );

  useEffect(() => {
    if (calcedCategorizedItems.size > 0) {
      dispatch({
        type: UPDATE_CATEGORIZED_EXPENSES,
        payload: calcedCategorizedItems,
      });
    }
  }, [calcedCategorizedItems, dispatch]);

  return <LoadingTransition step={step} onComplete={handleNextStep} />;
};

export const LoadingCategories = withWizard(
  LoadingCategoriesStep,
  WIZARD_STEP_KEYS.LOADING_CATEGORIES
);
