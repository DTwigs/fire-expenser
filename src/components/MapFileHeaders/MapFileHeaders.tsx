import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import NextStepButton from "../NextStepButton";
import { useFile, useSettings } from "../../store";
import "./MapFileHeaders.css";

const MapFileHeaders: React.FC = () => {
  const navigate = useNavigate();
  const { file } = useFile();
  const { settings, dispatch } = useSettings();
  const [dragOverRole, setDragOverRole] = useState<
    keyof typeof settings.fileHeaderRoles | null
  >(null);

  const requiredRoles: (keyof typeof settings.fileHeaderRoles)[] = [
    "debit",
    "category",
    "description",
  ];
  const allRoles: (keyof typeof settings.fileHeaderRoles)[] = [
    "date",
    "debit",
    "category",
    "description",
    "credit",
    "card",
  ];

  const isRequiredRole = (role: keyof typeof settings.fileHeaderRoles) => {
    return requiredRoles.includes(role);
  };

  const isNextStepDisabled = () => {
    return requiredRoles.some(
      (role) => settings.fileHeaderRoles[role] === null
    );
  };

  const handleDragStart = useCallback(
    (e: React.DragEvent, headerIndex: number) => {
      e.dataTransfer.setData("text/plain", headerIndex.toString());
    },
    []
  );

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
    setDragOverRole(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, role: keyof typeof settings.fileHeaderRoles) => {
      e.preventDefault();
      setDragOverRole(null);
      const headerIndex = parseInt(e.dataTransfer.getData("text/plain"));

      // Check if this header is already mapped to another role
      const isAlreadyMapped = Object.values(settings.fileHeaderRoles).includes(
        headerIndex
      );

      if (!isAlreadyMapped) {
        dispatch({
          type: "UPDATE_SINGLE_HEADER_ROLE",
          payload: { role, headerIndex },
        });
      }
    },
    [dispatch, settings]
  );

  const handleRemoveMapping = useCallback(
    (role: keyof typeof settings.fileHeaderRoles) => {
      dispatch({
        type: "UPDATE_SINGLE_HEADER_ROLE",
        payload: { role, headerIndex: null },
      });
    },
    [dispatch, settings]
  );

  const getMappedHeader = (role: keyof typeof settings.fileHeaderRoles) => {
    const headerIndex = settings.fileHeaderRoles[role];
    return headerIndex !== null ? file.headers[headerIndex] : null;
  };

  const handleSubmit = useCallback(() => {
    navigate("/loading");
  }, [navigate]);

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
                {getMappedHeader(role) ? (
                  <div className="mapped-header-content">
                    <span>{getMappedHeader(role)}</span>
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
            const isMapped = Object.values(settings.fileHeaderRoles).includes(
              index
            );
            return (
              <div
                key={index}
                className={`csv-header ${isMapped ? "mapped" : ""}`}
                draggable={!isMapped}
                onDragStart={(e) => handleDragStart(e, index)}
              >
                {header}
              </div>
            );
          })}
        </div>
      </div>

      <NextStepButton
        handleSubmit={handleSubmit}
        isDisabled={isNextStepDisabled()}
      />
    </div>
  );
};

export default MapFileHeaders;
