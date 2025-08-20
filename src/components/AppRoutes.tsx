import React from "react";
import { Routes, Route } from "react-router-dom";
import Settings from "./Settings";
import { FileUpload } from "../WizardSteps/FileUpload";
import { Categorization } from "../WizardSteps/Categorization";
import { Results } from "../WizardSteps/Results";
import { MapFileHeaders } from "../WizardSteps/MapFileHeaders";
import { LoadingCategories } from "../WizardSteps/Categorization/LoadingCategories";
import { LoadingResults } from "../WizardSteps/Results/LoadingResults";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/file-headers" element={<MapFileHeaders />} />
      <Route path="/loading-categories" element={<LoadingCategories />} />
      <Route path="/categorization" element={<Categorization />} />
      <Route path="/loading-results" element={<LoadingResults />} />
      <Route path="/output" element={<Results />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
