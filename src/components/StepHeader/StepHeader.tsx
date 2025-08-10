import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { useWizard } from "../../store";
import { WIZARD_STEP_ORDER, WIZARD_STEPS } from "../../WizardSteps/constants";
import "./StepHeader.css";
import type { WizardStepKey } from "../../WizardSteps/types";

const StepHeader: React.FC = () => {
  const navigate = useNavigate();
  const { wizard, dispatch } = useWizard();
  const { currentStep, furthestStep } = wizard;

  const handleStepClick = (stepKey: WizardStepKey) => {
    // Only allow navigation to previous steps
    if (WIZARD_STEPS[stepKey].order <= WIZARD_STEPS[furthestStep].order) {
      dispatch({ type: "SET_CURRENT_STEP", payload: stepKey });
      navigate(WIZARD_STEPS[stepKey].url);
    }
  };

  return (
    <div className="step-header-wrapper">
      <div className="step-header-container">
        {Object.entries(WIZARD_STEPS).map(([key, step]) => {
          const isCurrentStep = step.order === WIZARD_STEPS[currentStep].order;
          const isPreviousStep = step.order < WIZARD_STEPS[currentStep].order;
          const isClickable = step.order <= WIZARD_STEPS[furthestStep].order;

          return (
            <React.Fragment key={key}>
              <div
                key={`${key}-step`}
                onClick={() => handleStepClick(key as WizardStepKey)}
                className={`step-item ${
                  isClickable ? "step-item-clickable" : "step-item-disabled"
                } ${isCurrentStep ? "step-item-current" : "step-item-default"}`}
              >
                <Icon
                  path={step.icon}
                  size={1.2}
                  color={isCurrentStep ? "#2196F3" : step.color}
                />
                <span
                  className={
                    isCurrentStep ? "step-text step-text-current" : "step-text"
                  }
                >
                  {step.title}
                </span>
              </div>

              {step.order < WIZARD_STEP_ORDER.length && (
                <div
                  key={`${key}-divider`}
                  className={`step-divider ${
                    isPreviousStep
                      ? "step-divider-completed"
                      : "step-divider-pending"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepHeader;
