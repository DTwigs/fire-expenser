import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiFileUpload, mdiTagMultiple, mdiChartLine } from "@mdi/js";

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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
      }}
    >
      {steps.map((step, index) => {
        const isCurrentStep = index === currentStepIndex;
        const isPreviousStep = index < currentStepIndex;
        const isClickable = index <= currentStepIndex;

        return (
          <div
            key={step.path}
            onClick={() => handleStepClick(index)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: isClickable ? "pointer" : "default",
              backgroundColor: isCurrentStep ? "#e3f2fd" : "transparent",
              border: isCurrentStep
                ? "2px solid #2196F3"
                : "1px solid transparent",
              opacity: isClickable ? 1 : 0.6,
              transition: "all 0.2s ease",
              ...(isClickable && {
                ":hover": {
                  backgroundColor: "#e3f2fd",
                  transform: "translateY(-1px)",
                },
              }),
            }}
          >
            <Icon
              path={step.icon}
              size={1.2}
              color={isCurrentStep ? "#2196F3" : step.color}
            />
            <span
              style={{
                fontWeight: isCurrentStep ? "bold" : "normal",
                color: isCurrentStep ? "#2196F3" : "#333",
              }}
            >
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: "20px",
                  height: "2px",
                  backgroundColor: isPreviousStep ? "#4CAF50" : "#ddd",
                  marginLeft: "10px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepHeader;
