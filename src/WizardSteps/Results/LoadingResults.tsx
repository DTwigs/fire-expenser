import React, { useEffect, useMemo } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { type ExpenseTotals, useExpenses } from "../../store";
import { WIZARD_STEP_KEYS } from "../constants";
import { UPDATE_TOTALS } from "../../reducers/actions";
import { getTotals } from "./utils";
import { withWizard, type WithWizardProps } from "../withWizard";

const LoadingResultsStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
  const { expenses, dispatch } = useExpenses();

  const totals: ExpenseTotals = useMemo(
    () => getTotals(expenses.categorizedItems),
    [expenses.categorizedItems]
  );

  useEffect(() => {
    dispatch({
      type: UPDATE_TOTALS,
      payload: totals,
    });
  }, [totals, dispatch]);

  return <LoadingTransition step={step} onComplete={handleNextStep} />;
};

export const LoadingResults = withWizard(
  LoadingResultsStep,
  WIZARD_STEP_KEYS.LOADING_RESULTS
);
