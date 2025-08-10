import type { WizardState } from "../store/types";
import { WIZARD_STEPS } from "../WizardSteps/constants";
import type { WizardAction } from "./types";

export const wizardReducer = (
  state: WizardState,
  action: WizardAction
): WizardState => {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      if (
        WIZARD_STEPS[action.payload].order >
        WIZARD_STEPS[state.furthestStep].order
      ) {
        return {
          ...state,
          furthestStep: action.payload,
          currentStep: action.payload,
        };
      }
      return {
        ...state,
        currentStep: action.payload,
      };
    case "SET_FURTHEST_STEP":
      return {
        ...state,
        currentStep: action.payload,
        furthestStep: action.payload,
      };
    default:
      return state;
  }
};
