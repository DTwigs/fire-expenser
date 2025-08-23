import React, { useCallback, useState } from "react";
import NextStepButton from "../../components/NextStepButton";
import { useFile } from "../../store";
import { allRoles, isNextStepDisabled, isRoleMapped } from "./utils";
import type { FileHeaderRole } from "../../store/types";
import { WIZARD_STEP_KEYS } from "../constants";
import { HeaderRole } from "./HeaderRole";
import "./MapFileHeaders.css";
import { withWizard, type WithWizardProps } from "../withWizard";

const MapFileHeadersStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
  const { file, dispatch } = useFile();
  const [dragOverRole, setDragOverRole] = useState<keyof FileHeaderRole | null>(
    null
  );

  const handleDragStart = useCallback((e: React.DragEvent, header: string) => {
    e.dataTransfer.setData("text/plain", header);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, role: keyof FileHeaderRole) => {
      e.preventDefault();
      setDragOverRole(role);
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    // Only clear drag state if we're actually leaving the header role
    // Check if the related target is outside our header role
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      setDragOverRole(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, role: keyof FileHeaderRole) => {
      e.preventDefault();
      setDragOverRole(null);
      const header = e.dataTransfer.getData("text/plain");

      // Check if this header is already mapped to another role
      const isAlreadyMapped = Object.values(file.fileHeaderRoles).includes(
        header
      );

      if (!isAlreadyMapped) {
        dispatch({
          type: "UPDATE_SINGLE_HEADER_ROLE",
          payload: { role, header },
        });
      }
    },
    [dispatch, file]
  );

  const handleRemoveMapping = useCallback(
    (role: keyof FileHeaderRole) => {
      dispatch({
        type: "UPDATE_SINGLE_HEADER_ROLE",
        payload: { role, header: null },
      });
    },
    [dispatch]
  );

  return (
    <section className="step-container file-headers-container">
      <h2>{step.title}</h2>
      <h3>{step.description}</h3>

      {/* File Header Roles */}
      <section className="header-roles-section">
        <h4>File Header Roles</h4>
        <div className="header-roles-container">
          {allRoles.map((role) => (
            <div
              key={role}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, role)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, role)}
            >
              <HeaderRole
                file={file}
                role={role}
                dragOverRole={dragOverRole}
                handleRemoveMapping={handleRemoveMapping}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CSV Headers */}

      <section className="csv-headers-section">
        <h4>CSV Headers</h4>
        <p>
          We've detected the following headers in your csv file. Please drag
          them to their corresponding function. The fields marked with{" "}
          <span className="required-field">*</span> are required.
        </p>
        <div className="csv-headers-container">
          {file.headers.map((header, index) => {
            const isMapped = isRoleMapped(file, header);
            return (
              <div
                key={index}
                className={`button csv-header ${isMapped ? "mapped" : ""}`}
                draggable={!isMapped}
                onDragStart={(e) => handleDragStart(e, header)}
              >
                {header}
              </div>
            );
          })}
        </div>
      </section>

      <NextStepButton
        onClick={handleNextStep}
        isDisabled={isNextStepDisabled(file)}
      />
    </section>
  );
};

export const MapFileHeaders = withWizard(
  MapFileHeadersStep,
  WIZARD_STEP_KEYS.FILE_HEADERS
);
