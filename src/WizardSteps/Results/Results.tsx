import React, { useMemo, useState } from "react";
import { useExpenses } from "../../store";
import { WIZARD_STEP_KEYS } from "../constants";
import { withWizard, type WithWizardProps } from "../withWizard";
import { CategoryListHeader } from "../../components/CategoryListHeader";
import "./Results.css";
import { CATEGORY_NAMES } from "../Categorization/constants";
import { Icon } from "@mdi/react";
import { mdiContentCopy, mdiStar } from "@mdi/js";

const ResultsStep: React.FC<WithWizardProps> = () => {
  const { expenses } = useExpenses();
  const { expenseTotal, rebateTotal, totalsByCategory } = expenses.totals;
  const [copied, setCopied] = useState(false);

  const getListForClipboard = useMemo(() => {
    return Object.values(CATEGORY_NAMES)
      .filter((cat) => cat !== CATEGORY_NAMES.Unknown)
      .map((category) =>
        totalsByCategory[category] ? totalsByCategory[category] : 0
      )
      .join("\t");
  }, [totalsByCategory]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getListForClipboard);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div>
      <div className="results-container">
        <div className="results-item results-item-expense">
          <h3>Total Expenses</h3>
          <p>{Number(expenseTotal).toFixed(2)}</p>
        </div>
        <div className="results-item results-item-rebate">
          <h3>Total Rebates</h3>
          <p>{Number(rebateTotal).toFixed(2)}</p>
        </div>
      </div>

      <div className="copy-section">
        <button
          onClick={handleCopyToClipboard}
          className={`copy-button ${copied ? "copy-button-copied" : ""}`}
          title="Copy category totals to clipboard for spreadsheet"
        >
          <Icon path={copied ? mdiStar : mdiContentCopy} size={0.8} />
          {copied ? "Copied!" : "Copy to Spreadsheet"}
        </button>
        <small className="copy-hint">
          Copies category totals to be pasted into a spreadsheet
        </small>
      </div>

      <div className="category-totals">
        {Object.entries(totalsByCategory).map(([category, amount]) => (
          <div key={category} className="category-group">
            <CategoryListHeader
              category={category}
              handleCategoryClick={() => {}}
              total={amount}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Results = withWizard(ResultsStep, WIZARD_STEP_KEYS.OUTPUT);
