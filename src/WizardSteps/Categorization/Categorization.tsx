import React, { useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses } from "../../store";
import { UPDATE_CATEGORIZED_EXPENSES } from "../../reducers/actions";
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

  const rawExpenses = useMemo(
    () => convertToRawExpenses(file.data, file.fileHeaderRoles),
    [file.data, file.fileHeaderRoles]
  );

  const categorizedItems = useMemo(
    () => categorizeItems(rawExpenses, expenses.categoryMapper),
    [rawExpenses, expenses.categoryMapper]
  );

  useEffect(() => {
    if (categorizedItems.size > 0) {
      dispatch({
        type: UPDATE_CATEGORIZED_EXPENSES,
        payload: categorizedItems,
      });
    }
  }, [categorizedItems, dispatch]);

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
        <div className="category-wrapper">
          {Array.from(categorizedItems.keys())
            .sort((a, b) => (a === "Unknown" ? -1 : b === "Unknown" ? 1 : 0))
            .map((key, index) => (
              <section className="category-group">
                <div className="category">
                  <Icon
                    path={mdiTag}
                    size={0.8}
                    className="category-icon"
                    color={Colors[`category${index}`] ?? Colors.lightText}
                  />
                  {key}
                </div>
                <div className="expense-items-wrapper" key={key}>
                  {Array.from(categorizedItems.get(key)?.values() ?? []).map(
                    (item) => (
                      <div key={item.id} className="expense-item">
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
                    )
                  )}
                </div>
              </section>
            ))}
        </div>
      </div>
      <NextStepButton
        currentStep={WIZARD_STEP_KEYS.CATEGORIZATION}
        isDisabled={
          (categorizedItems.get(CATEGORY_NAMES.Unknown)?.size ?? 0) > 0
        }
      />
    </section>
  );
};
