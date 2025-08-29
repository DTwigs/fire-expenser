import {
  mdiChartLine,
  mdiFileUpload,
  mdiTag,
  mdiArchive,
  mdiCog,
} from "@mdi/js";
import type { WizardStep, WizardStepKey } from "./types";

export const WIZARD_STEP_KEYS: Record<WizardStepKey, WizardStepKey> = {
  SETUP: "SETUP",
  FILE_UPLOAD: "FILE_UPLOAD",
  FILE_HEADERS: "FILE_HEADERS",
  LOADING_CATEGORIES: "LOADING_CATEGORIES",
  CATEGORIZATION: "CATEGORIZATION",
  LOADING_RESULTS: "LOADING_RESULTS",
  OUTPUT: "OUTPUT",
};

export const WIZARD_STEP_ORDER: WizardStepKey[] = [
  WIZARD_STEP_KEYS.SETUP,
  WIZARD_STEP_KEYS.FILE_UPLOAD,
  WIZARD_STEP_KEYS.FILE_HEADERS,
  WIZARD_STEP_KEYS.LOADING_CATEGORIES,
  WIZARD_STEP_KEYS.CATEGORIZATION,
  WIZARD_STEP_KEYS.LOADING_RESULTS,
  WIZARD_STEP_KEYS.OUTPUT,
];

export const WIZARD_STEPS: Record<WizardStepKey, WizardStep> = {
  SETUP: {
    url: "/setup",
    title: "Setup",
    description: "Configure your expense categories before starting.",
    showStepHeader: true,
    order: 1,
    icon: mdiCog,
  },
  FILE_UPLOAD: {
    url: "/file-upload",
    title: "File Upload",
    description:
      "Upload your bank statements or expense CSV files to get started.",
    showStepHeader: true,
    order: 2,
    icon: mdiFileUpload,
  },
  FILE_HEADERS: {
    url: "/file-headers",
    title: "File Headers",
    description: "Match your csv headers to their roles",
    showStepHeader: true,
    order: 3,
    icon: mdiArchive,
  },
  LOADING_CATEGORIES: {
    url: "/loading-categories",
    title: "Loading Categories",
    description: "Predicting your expenses categories.",
    showStepHeader: false,
    order: 4,
    icon: mdiTag,
  },
  CATEGORIZATION: {
    url: "/categorization",
    title: "Categorize",
    description: "Categorize Your Expenses",
    showStepHeader: true,
    order: 5,
    icon: mdiTag,
  },
  LOADING_RESULTS: {
    url: "/loading-results",
    title: "Loading Results",
    description: "Calculating totals.",
    showStepHeader: false,
    order: 6,
    icon: mdiChartLine,
  },
  OUTPUT: {
    url: "/output",
    title: "Results",
    description: "Results",
    showStepHeader: true,
    order: 7,
    icon: mdiChartLine,
  },
};
