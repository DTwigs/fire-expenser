export type WizardStep = {
  url: string;
  title: string;
  description: string;
  showStepHeader: boolean;
  order: number;
  icon: string;
  color: string;
};

export type WizardStepKey =
  | "FILE_UPLOAD"
  | "FILE_HEADERS"
  | "CATEGORIZATION"
  | "OUTPUT";
