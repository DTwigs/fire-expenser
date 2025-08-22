import { mdiChartLine, mdiFileUpload, mdiTag, mdiArchive } from "@mdi/js";
import type { WizardStep, WizardStepKey } from "./types";

export const WIZARD_STEP_KEYS: Record<WizardStepKey, WizardStepKey> = {
  FILE_UPLOAD: "FILE_UPLOAD",
  FILE_HEADERS: "FILE_HEADERS",
  LOADING_CATEGORIES: "LOADING_CATEGORIES",
  CATEGORIZATION: "CATEGORIZATION",
  LOADING_RESULTS: "LOADING_RESULTS",
  OUTPUT: "OUTPUT",
};

export const WIZARD_STEP_ORDER: WizardStepKey[] = [
  WIZARD_STEP_KEYS.FILE_UPLOAD,
  WIZARD_STEP_KEYS.FILE_HEADERS,
  WIZARD_STEP_KEYS.LOADING_CATEGORIES,
  WIZARD_STEP_KEYS.CATEGORIZATION,
  WIZARD_STEP_KEYS.LOADING_RESULTS,
  WIZARD_STEP_KEYS.OUTPUT,
];

export const WIZARD_STEPS: Record<WizardStepKey, WizardStep> = {
  FILE_UPLOAD: {
    url: "/file-upload",
    title: "File Upload",
    description:
      "Upload your bank statement or expense CSV file to get started.",
    showStepHeader: true,
    order: 1,
    icon: mdiFileUpload,
  },
  FILE_HEADERS: {
    url: "/file-headers",
    title: "File Headers",
    description:
      "We've detected the following headers in your csv file. Please drag them to their corresponding function. The fields marked with * are required.",
    showStepHeader: true,
    order: 2,
    icon: mdiArchive,
  },
  LOADING_CATEGORIES: {
    url: "/loading-categories",
    title: "Loading Categories",
    description: "Predicting your expenses categories.",
    showStepHeader: false,
    order: 3,
    icon: mdiTag,
  },
  CATEGORIZATION: {
    url: "/categorization",
    title: "Categorize",
    description: "Categorize Your Expenses",
    showStepHeader: true,
    order: 4,
    icon: mdiTag,
  },
  LOADING_RESULTS: {
    url: "/loading-results",
    title: "Loading Results",
    description: "Calculating totals.",
    showStepHeader: false,
    order: 5,
    icon: mdiChartLine,
  },
  OUTPUT: {
    url: "/output",
    title: "Results",
    description: "Results",
    showStepHeader: true,
    order: 6,
    icon: mdiChartLine,
  },
};
