import React, { useCallback, useState } from "react";
import NextStepButton from "../../components/NextStepButton";
import { useFile, useSettings } from "../../store";
import "./MapFileHeaders.css";
import {
  allRoles,
  getMappedHeader,
  isNextStepDisabled,
  isRequiredRole,
  isRoleMapped,
} from "./utils";
import type { FileHeaderRole } from "../../store/types";
import { WIZARD_STEP_KEYS } from "../constants";

const MapFileHeaders: React.FC = () => {
  const { file } = useFile();
  const { settings, dispatch } = useSettings();
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
    (e: React.DragEvent, role: keyof typeof settings.fileHeaderRoles) => {
      e.preventDefault();
      setDragOverRole(role);
    },
    [settings]
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
    (e: React.DragEvent, role: keyof typeof settings.fileHeaderRoles) => {
      e.preventDefault();
      setDragOverRole(null);
      const header = e.dataTransfer.getData("text/plain");

      // Check if this header is already mapped to another role
      const isAlreadyMapped = Object.values(settings.fileHeaderRoles).includes(
        header
      );
      console.log({
        fileHeaderRole: settings.fileHeaderRoles,
      });

      if (!isAlreadyMapped) {
        dispatch({
          type: "UPDATE_SINGLE_HEADER_ROLE",
          payload: { role, header },
        });
      }
    },
    [dispatch, settings]
  );

  const handleRemoveMapping = useCallback(
    (role: keyof typeof settings.fileHeaderRoles) => {
      dispatch({
        type: "UPDATE_SINGLE_HEADER_ROLE",
        payload: { role, header: null },
      });
    },
    [dispatch, settings]
  );

  return (
    <div className="file-upload-container">
      <h2>Match your csv headers to their roles!</h2>

      {/* File Header Roles */}
      <div className="header-roles-section">
        <h3>File Header Roles</h3>
        <div className="header-roles-container">
          {allRoles.map((role) => (
            <div
              key={role}
              className={`header-role ${
                isRequiredRole(role) ? "required" : "optional"
              } ${dragOverRole === role ? "drag-over" : ""}`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, role)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, role)}
            >
              <div className="role-label">
                {role.charAt(0).toUpperCase() + role.slice(1)}
                {isRequiredRole(role) && (
                  <span className="required-mark">*</span>
                )}
              </div>
              <div className="mapped-header">
                {getMappedHeader(settings, role) ? (
                  <div className="mapped-header-content">
                    <span>{getMappedHeader(settings, role)}</span>
                    <button
                      className="remove-mapping"
                      onClick={() => handleRemoveMapping(role)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className={`drop-zone ${
                      dragOverRole === role ? "drag-over" : ""
                    }`}
                  >
                    Drop header here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSV Headers */}

      <div className="csv-headers-section">
        <h3>CSV Headers</h3>
        <p>
          We've detected the following headers in your csv file. Please drag
          them to their corresponding function. The fields marked with * are
          required.
        </p>
        <div className="csv-headers-container">
          {file.headers.map((header, index) => {
            const isMapped = isRoleMapped(settings, header);
            return (
              <div
                key={index}
                className={`csv-header ${isMapped ? "mapped" : ""}`}
                draggable={!isMapped}
                onDragStart={(e) => handleDragStart(e, header)}
              >
                {header}
              </div>
            );
          })}
        </div>
      </div>

      <NextStepButton
        currentStep={WIZARD_STEP_KEYS.FILE_HEADERS}
        isDisabled={isNextStepDisabled(settings)}
      />
    </div>
  );
};

export default MapFileHeaders;
