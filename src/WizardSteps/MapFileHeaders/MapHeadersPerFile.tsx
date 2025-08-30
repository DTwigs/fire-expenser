import type { FileDatum, FileHeaderRole } from "../../store/types";
import { useState, useCallback } from "react";
import { HeaderRole } from "./HeaderRole";
import { allRoles, isRoleMapped } from "./utils";

export const MapHeadersPerFile = ({
  file,
  updateHeaderRole,
}: {
  file: FileDatum;
  updateHeaderRole: (
    fileName: string,
    role: keyof FileHeaderRole,
    header: string | null
  ) => void;
}) => {
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

  const handleDrop = (e: React.DragEvent, role: keyof FileHeaderRole) => {
    e.preventDefault();
    setDragOverRole(null);
    const header = e.dataTransfer.getData("text/plain");

    // Check if this header is already mapped to another role
    const isAlreadyMapped = Object.values(file.fileHeaderRoles).includes(
      header
    );

    if (!isAlreadyMapped) {
      updateHeaderRole(file.fileName, role, header);
    }
  };

  const handleRemoveMapping = (role: keyof FileHeaderRole) => {
    updateHeaderRole(file.fileName, role, null);
  };

  return (
    <>
      <section className="map-headers-section">
        <h4>File Header Roles</h4>
        <p>
          The fields marked with <span className="required-field">*</span> are
          required.
        </p>
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
                file={file as FileDatum}
                role={role}
                dragOverRole={dragOverRole}
                handleRemoveMapping={handleRemoveMapping}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CSV Headers */}

      <section className="map-headers-section">
        <h4>CSV Headers</h4>
        <p>
          We've detected the following headers in your csv file. Please drag
          them to their corresponding function.
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
    </>
  );
};
