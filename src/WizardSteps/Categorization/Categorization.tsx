import React, { useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses } from "../../store";
import { UPDATE_CATEGORIZED_EXPENSES } from "../../reducers/actions";
import { convertToRawExpenses, categorizeItems } from "./utils";

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
    [rawExpenses, expenses]
  );

  useEffect(() => {
    if (categorizedItems.size > 0) {
      dispatch({
        type: UPDATE_CATEGORIZED_EXPENSES,
        payload: categorizedItems,
      });
    }
  }, [categorizedItems, dispatch]);

  console.log({ rawExpenses });
  console.log({ categorizedItems });

  const onComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingTransition onComplete={onComplete} />;
  }

  return (
    <div>
      <h2>Categorization</h2>
      <div className="categorized-items">
        {Array.from(categorizedItems.entries()).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3>{category}</h3>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="expense-item">
                  <div className="expense-details">
                    <span className="amount">${item.expense_amount}</span>
                    <span className="description">{item.description}</span>
                    {item.categoryUnknown && (
                      <span className="unknown-category">
                        (Unknown category: {item.category})
                      </span>
                    )}
                  </div>
                  {item.rebate_amount && (
                    <div className="rebate">Rebate: ${item.rebate_amount}</div>
                  )}
                  {item.card && <div className="card">Card: {item.card}</div>}
                  {item.date && <div className="date">Date: {item.date}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
