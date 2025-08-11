import React, { useMemo } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

import {
  WIZARD_STEP_KEYS,
  WIZARD_STEP_ORDER,
  WIZARD_STEPS,
} from "../WizardSteps/constants";
import { useWizard } from "../store";

type NextStepButtonProps = {
  currentStep: keyof typeof WIZARD_STEP_KEYS;
  isDisabled: boolean;
};

const NextStepButton: React.FC<NextStepButtonProps> = ({
  currentStep,
  isDisabled,
}) => {
  const { dispatch } = useWizard();
  const navigate = useNavigate();

  const nextStep = useMemo(() => {
    return WIZARD_STEP_ORDER[WIZARD_STEPS[currentStep].order];
  }, [currentStep]);

  return (
    <div className="submit-container">
      <button
        type="button"
        className="submit-button"
        onClick={() => {
          dispatch({ type: "SET_CURRENT_STEP", payload: nextStep });
          navigate(WIZARD_STEPS[nextStep].url);
        }}
        disabled={isDisabled}
      >
        Next Step
      </button>
    </div>
  );
};

export default NextStepButton;
