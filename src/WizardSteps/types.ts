export type WizardStep = {
  url: string;
  title: string;
  description: string;
  showStepHeader: boolean;
  order: number;
  icon: string;
};

export type WizardStepKey =
  | "SETUP"
  | "FILE_UPLOAD"
  | "FILE_HEADERS"
  | "LOADING_CATEGORIES"
  | "CATEGORIZATION"
  | "LOADING_RESULTS"
  | "OUTPUT";
