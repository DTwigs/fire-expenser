import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiFileUpload, mdiTagMultiple, mdiChartLine } from "@mdi/js";
import "./StepHeader.css";

interface Step {
  name: string;
  path: string;
  icon: string;
  color: string;
}

const steps: Step[] = [
  {
    name: "File Upload",
    path: "/file-upload",
    icon: mdiFileUpload,
    color: "#FF9800",
  },
  {
    name: "Categorization",
    path: "/categorization",
    icon: mdiTagMultiple,
    color: "#2196F3",
  },
  {
    name: "Results",
    path: "/output",
    icon: mdiChartLine,
    color: "#4CAF50",
  },
];

const StepHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentStepIndex = (): number => {
    const currentPath = location.pathname;
    // Handle root path as File Upload step
    if (currentPath === "/") {
      return 0;
    }
    const stepIndex = steps.findIndex((step) => step.path === currentPath);
    return stepIndex >= 0 ? stepIndex : 0; // Default to first step if not found
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to previous steps
    if (stepIndex <= currentStepIndex) {
      navigate(steps[stepIndex].path);
    }
  };

  return (
    <div className="step-header-wrapper">
      <div className="step-header-container">
        {steps.map((step, index) => {
          const isCurrentStep = index === currentStepIndex;
          const isPreviousStep = index < currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <>
              <div
                key={step.path}
                onClick={() => handleStepClick(index)}
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
                  {step.name}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`step-divider ${
                    isPreviousStep
                      ? "step-divider-completed"
                      : "step-divider-pending"
                  }`}
                />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default StepHeader;
