import React, { forwardRef, useEffect } from "react";
import type { ComponentType } from "react";
import { useWizard } from "../store";
import { WIZARD_STEPS, WIZARD_STEP_ORDER } from "./constants";
import type { WizardStepKey, WizardStep } from "./types";
import { useNavigate } from "react-router-dom";

// Define the props that the HOC will inject
export interface WithWizardProps {
  handleNextStep: () => void;
  step: WizardStep;
}

// Define the props that the step components accept
export interface StepComponentProps {
  children?: React.ReactNode;
}

export type WizardHOC = <P extends StepComponentProps>(
  WrappedComponent: ComponentType<P & WithWizardProps>,
  step: WizardStepKey
) => React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<HTMLElement>
>;

export const withWizard: WizardHOC = <P extends StepComponentProps>(
  WrappedComponent: ComponentType<P & WithWizardProps>,
  stepKey: WizardStepKey
) => {
  const EnhancedComponent = forwardRef<HTMLElement, P>((props, ref) => {
    const navigate = useNavigate();
    const { wizard, dispatch } = useWizard();
    const furthestWizardStep = WIZARD_STEPS[wizard.furthestStep];
    const step = WIZARD_STEPS[stepKey];
    const nextStepKey = WIZARD_STEP_ORDER[step.order];

    useEffect(() => {
      if (step.order > furthestWizardStep.order) {
        navigate(furthestWizardStep.url);
        return;
      }
    }, [dispatch, furthestWizardStep, navigate, step.order]);

    const handleNextStep = () => {
      dispatch({
        type: "SET_CURRENT_STEP",
        payload: nextStepKey,
      });
      navigate(WIZARD_STEPS[nextStepKey].url);
    };

    const wizardProps: WithWizardProps = {
      handleNextStep,
      step: WIZARD_STEPS[stepKey],
    };

    const combinedProps = {
      ...props,
      ...wizardProps,
    };

    return (
      <WrappedComponent {...(combinedProps as P & WithWizardProps)} ref={ref} />
    );
  });

  // Set display name for better debugging
  EnhancedComponent.displayName = `withWizard(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return EnhancedComponent;
};

export default withWizard;
