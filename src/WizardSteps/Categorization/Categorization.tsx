import React, { useEffect, useMemo, useState } from "react";
import LoadingTransition from "../../components/LoadingTransition";
import { useFile, useExpenses, type CategorizedExpenseItem } from "../../store";
import { UPDATE_CATEGORIZED_EXPENSES } from "../../reducers/actions";
import { convertToRawExpenses, categorizeItems } from "./utils";
import "./Categorization.css";

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

  const categorizedItemsList: CategorizedExpenseItem[] = useMemo(() => {
    const categorizedItemsArray: CategorizedExpenseItem[] = [];
    Array.from(categorizedItems.entries()).forEach(([category, items]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Array.from(items.entries()).forEach(([_, item]) => {
        categorizedItemsArray.push({ ...item, category });
      });
    });
    return categorizedItemsArray;
  }, [categorizedItems]);

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
        <div className="items-list">
          <div className="expense-items-wrapper">
            {categorizedItemsList.map((item, index) => (
              <div key={index} className="expense-item">
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
                {item.category && (
                  <span className="category">{item.category}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
