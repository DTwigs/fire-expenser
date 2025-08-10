import { mdiChartLine, mdiFileUpload, mdiTagMultiple } from "@mdi/js";
import type { WizardStep, WizardStepKey } from "./types";

export const WIZARD_STEP_KEYS: Record<WizardStepKey, WizardStepKey> = {
  FILE_UPLOAD: "FILE_UPLOAD",
  FILE_HEADERS: "FILE_HEADERS",
  CATEGORIZATION: "CATEGORIZATION",
  OUTPUT: "OUTPUT",
};

export const WIZARD_STEP_ORDER: WizardStepKey[] = [
  WIZARD_STEP_KEYS.FILE_UPLOAD,
  WIZARD_STEP_KEYS.FILE_HEADERS,
  WIZARD_STEP_KEYS.CATEGORIZATION,
  WIZARD_STEP_KEYS.OUTPUT,
];

export const WIZARD_STEPS: Record<WizardStepKey, WizardStep> = {
  FILE_UPLOAD: {
    url: "/file-upload",
    title: "File Upload",
    description: "Upload your CSV file to get started",
    showStepHeader: true,
    hasLoadingTransition: false,
    order: 1,
    icon: mdiFileUpload,
    color: "#FF9800",
  },
  FILE_HEADERS: {
    url: "/file-headers",
    title: "File Headers",
    description: "Map your file headers to the correct fields",
    showStepHeader: true,
    hasLoadingTransition: true,
    order: 2,
    icon: mdiTagMultiple,
    color: "#2196F3",
  },
  CATEGORIZATION: {
    url: "/categorization",
    title: "Categorization",
    description: "Categorize your expenses",
    showStepHeader: true,
    hasLoadingTransition: true,
    order: 3,
    icon: mdiTagMultiple,
    color: "#2196F3",
  },
  OUTPUT: {
    url: "/output",
    title: "Results",
    description: "View your categorized expenses",
    showStepHeader: true,
    hasLoadingTransition: false,
    order: 4,
    icon: mdiChartLine,
    color: "#2196F3",
  },
};
