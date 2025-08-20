import React from "react";
import { useExpenses } from "../../store";
import { WIZARD_STEP_KEYS } from "../constants";
import { withWizard, type WithWizardProps } from "../withWizard";

const ResultsStep: React.FC<WithWizardProps> = ({ step }) => {
  const { expenses } = useExpenses();
  console.log({ totals: expenses.totals });
  return (
    <div>
      <h2>{step.description}</h2>
      <div className="results-container">
        <div className="results-item">
          <h3>Total Expenses</h3>
          <p>{Number(expenses.totals.expenseTotal).toFixed(2)}</p>
        </div>
        <div className="results-item">
          <h3>Total Rebates</h3>
          <p>{Number(expenses.totals.rebateTotal).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export const Results = withWizard(ResultsStep, WIZARD_STEP_KEYS.OUTPUT);
