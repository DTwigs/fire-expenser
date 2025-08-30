import React, { useCallback, useState } from "react";
import NextStepButton from "../../components/NextStepButton";
import { useFile } from "../../store";
import { hasAllRequiredHeaders, isNextStepDisabled } from "./utils";
import type { FileHeaderRole } from "../../store/types";
import { WIZARD_STEP_KEYS } from "../constants";
import { UPDATE_SINGLE_HEADER_ROLE } from "../../reducers/actions";
import { withWizard, type WithWizardProps } from "../withWizard";
import { MapHeadersPerFile } from "./MapHeadersPerFile";
import "./MapFileHeaders.css";

const MapFileHeadersStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
  const { files, dispatch } = useFile();
  const [fileIndex, setFileIndex] = useState<number>(0);

  const updateHeaderRole = useCallback(
    (fileName: string, role: keyof FileHeaderRole, header: string | null) => {
      dispatch({
        type: UPDATE_SINGLE_HEADER_ROLE,
        payload: { fileName, role, header },
      });
    },
    [dispatch]
  );

  const handleNextFile = useCallback(() => {
    setFileIndex((prev) => prev + 1);
  }, []);

  const fileArray = Object.values(files);

  return (
    <section className="step-container file-headers-container">
      <h2>{step.title}</h2>
      <h3>{step.description}</h3>
      <NextStepButton
        onClick={handleNextStep}
        isDisabled={isNextStepDisabled(fileArray)}
      />
      <div className="file-section">
        <div className="file-nav-container">
          {fileArray.map((file, index) => (
            <div key={file.fileName} className="file-nav-item">
              {!hasAllRequiredHeaders(fileArray[index]) && (
                <span className="required-badge" />
              )}
              <button
                onClick={() => setFileIndex(index)}
                className={`file-nav-button ${
                  fileIndex === index ? "nav-button-selected" : ""
                }`}
              >
                {file.fileName}
              </button>
            </div>
          ))}
        </div>
        <section className="file-content-container">
          <h4>{fileArray[fileIndex].fileName}</h4>
          <MapHeadersPerFile
            file={fileArray[fileIndex]}
            updateHeaderRole={updateHeaderRole}
          />
          {fileIndex < fileArray.length - 1 && (
            <button
              className="submit-button"
              onClick={handleNextFile}
              disabled={!hasAllRequiredHeaders(fileArray[fileIndex])}
            >
              Next File
            </button>
          )}
        </section>
      </div>
    </section>
  );
};

export const MapFileHeaders = withWizard(
  MapFileHeadersStep,
  WIZARD_STEP_KEYS.FILE_HEADERS
);
