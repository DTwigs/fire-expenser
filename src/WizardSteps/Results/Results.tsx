import React, { useMemo, useState } from "react";
import { useExpenses, useSettings } from "../../store";
import { WIZARD_STEP_KEYS } from "../constants";
import { withWizard, type WithWizardProps } from "../withWizard";
import { CategoryListHeader } from "../../components/CategoryListHeader";
import "./Results.css";
import { Icon } from "@mdi/react";
import { mdiContentCopy, mdiStar } from "@mdi/js";

const ResultsStep: React.FC<WithWizardProps> = ({ step }) => {
  const { expenses } = useExpenses();
  const { settings } = useSettings();
  const { expenseTotal, rebateTotal, totalsByCategory } = expenses.totals;
  const [copied, setCopied] = useState(false);

  const getListForClipboard = useMemo(() => {
    return Object.values(settings.categories)
      .map((category) =>
        totalsByCategory[category] ? totalsByCategory[category] : 0
      )
      .join("\t");
  }, [totalsByCategory, settings.categories]);

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
    <section className="step-container">
      <h2>{step.title}</h2>
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
          Copy category totals to be pasted into your spreadsheet
        </small>
      </div>

      <div className="category-totals">
        {Object.values(settings.categories).map((category) => (
          <>
            {totalsByCategory[category] !== undefined && (
              <div key={category} className="category-group">
                <CategoryListHeader
                  category={category}
                  handleCategoryClick={() => {}}
                  total={totalsByCategory[category]}
                />
              </div>
            )}
          </>
        ))}
      </div>
    </section>
  );
};

export const Results = withWizard(ResultsStep, WIZARD_STEP_KEYS.OUTPUT);
