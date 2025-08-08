import React from "react";
import { Routes, Route } from "react-router-dom";
import Settings from "./Settings";
import FileUpload from "./FileUpload";
import Categorization from "./Categorization";
import Output from "./Output";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FileUpload />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/categorization" element={<Categorization />} />
      <Route path="/output" element={<Output />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;
