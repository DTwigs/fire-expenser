import React from "react";
import { Routes, Route } from "react-router-dom";
import Settings from "./Settings";
import FileUpload from "../WizardSteps/FileUpload/FileUpload";
import Categorization from "../WizardSteps/Categorization";
import Output from "./Output";
import LoadingTransition from "./LoadingTransition";
import MapFileHeaders from "../WizardSteps/MapFileHeaders/MapFileHeaders";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/file-headers" element={<MapFileHeaders />} />
      <Route path="/loading" element={<LoadingTransition />} />
      <Route path="/categorization" element={<Categorization />} />
      <Route path="/output" element={<Output />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
