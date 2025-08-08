import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NextStepButton from "../NextStepButton";
import "./MapFileHeaders.css";

const MapFileHeaders: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    navigate("/loading");
  }, [navigate]);

  return (
    <div className="file-upload-container">
      <h2>Match your csv headers to their function!</h2>
      <p>
        We've detected the following headers in your csv file. Please match them
        to their corresponding function.
      </p>
      <NextStepButton
        handleSubmit={handleSubmit}
        isDisabled={!selectedFile && !isLoading}
      />
    </div>
  );
};

export default MapFileHeaders;
