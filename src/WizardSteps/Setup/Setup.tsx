import React, { useState } from "react";
import { CategoryCreator } from "./CategoryCreator";
import NextStepButton from "../../components/NextStepButton";
import { withWizard, type WithWizardProps } from "../withWizard";
import { useSettings } from "../../store/hooks";
import { SET_CATEGORIES } from "../../reducers/actions";
import "./Setup.css";

const SetupComponent: React.FC<WithWizardProps> = ({ handleNextStep }) => {
  const { settings, dispatch } = useSettings();
  const [categories, setCategories] = useState<string[]>(
    Object.values(settings.categories)
  );

  const handleCategoriesChange = (newCategories: string[]) => {
    setCategories(newCategories);
  };

  const handleSetupNextStep = () => {
    // Convert array to object where key and value are the same
    const categoriesObject = categories.reduce(
      (acc: Record<string, string>, category: string) => {
        acc[category] = category;
        return acc;
      },
      {}
    );

    // Save categories to store
    dispatch({
      type: SET_CATEGORIES,
      payload: categoriesObject,
    });

    // Use the handleNextStep from withWizard HOC
    handleNextStep();
  };

  const isNextDisabled = categories.length === 0;

  return (
    <section className="step-container">
      <div className="setup-content">
        <div className="setup-header">
          <h2>Setup Your Categories</h2>
          <p>
            Before we start processing your expenses, let's set up your expense
            categories.
          </p>
        </div>
        <NextStepButton
          isDisabled={isNextDisabled}
          onClick={handleSetupNextStep}
          className="setup-next-button"
        />
        <div className="setup-main">
          <CategoryCreator
            categories={categories}
            onCategoriesChange={handleCategoriesChange}
          />
        </div>
      </div>
    </section>
  );
};

export const Setup = withWizard(SetupComponent, "SETUP");
