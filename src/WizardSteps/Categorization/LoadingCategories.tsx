import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses } from "../../store";
import { UPDATE_CATEGORIZED_EXPENSES } from "../../reducers/actions";
import { convertToRawExpenses, categorizeItems } from "./utils";
import { WIZARD_STEP_KEYS, WIZARD_STEPS } from "../constants";
import { SET_CURRENT_STEP } from "../../reducers/actions";

export const LoadingCategories: React.FC = () => {
  const { file } = useFile();
  const { expenses, dispatch } = useExpenses();
  const navigate = useNavigate();
  const rawExpenses = useMemo(
    () => convertToRawExpenses(file.data, file.fileHeaderRoles),
    [file.data, file.fileHeaderRoles]
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

  const onComplete = () => {
    dispatch({
      type: SET_CURRENT_STEP,
      payload: WIZARD_STEP_KEYS.CATEGORIZATION,
    });
    navigate(WIZARD_STEPS.CATEGORIZATION.url);
  };

  return <LoadingTransition onComplete={onComplete} />;
};
