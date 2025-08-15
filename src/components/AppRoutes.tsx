import React from "react";
import { Routes, Route } from "react-router-dom";
import Settings from "./Settings";
import { FileUpload } from "../WizardSteps/FileUpload";
import { Categorization } from "../WizardSteps/Categorization";
import Output from "./Output";
import { MapFileHeaders } from "../WizardSteps/MapFileHeaders";
import { LoadingCategories } from "../WizardSteps/Categorization/LoadingCategories";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/file-headers" element={<MapFileHeaders />} />
      <Route path="/loading-categories" element={<LoadingCategories />} />
      <Route path="/categorization" element={<Categorization />} />
      <Route path="/output" element={<Output />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
