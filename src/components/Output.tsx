import React from "react";
import { useExpenses } from "../store";

const Output: React.FC = () => {
  const { expenses } = useExpenses();
  console.log({ mapper: expenses.categoryMapper });
  return (
    <div>
      <h2>Output</h2>
      <p>Output functionality will go here.</p>
    </div>
  );
};

export default Output;
