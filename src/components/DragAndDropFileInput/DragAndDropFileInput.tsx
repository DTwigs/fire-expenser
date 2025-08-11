import React, { useState, useCallback } from "react";
import Icon from "@mdi/react";
import { mdiFileUpload, mdiFileDocument } from "@mdi/js";
import "./DragAndDropFileInput.css";

type DragAndDropFileInputProps = {
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileProcessing: (file: File) => void;
  setSelectedFile: (file: File | null) => void;
  selectedFile: File | null;
  handleRemoveFile: () => void;
};

const FileUpload: React.FC<DragAndDropFileInputProps> = ({
  isLoading,
  fileInputRef,
  handleFileProcessing,
  selectedFile,
  setSelectedFile,
  handleRemoveFile,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        handleFileProcessing(file);
      } else {
        alert("Please select a valid CSV file.");
      }
    },
    [handleFileProcessing, setSelectedFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return (
    <div
      className={`upload-area ${isDragOver ? "drag-over" : ""} ${
        selectedFile ? "has-file" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />

      {!selectedFile ? (
        <div className="upload-content">
          <div className="upload-icon">
            <Icon path={mdiFileUpload} size={2} />
          </div>
          <h3>Drag & Drop your CSV file here</h3>
          <p>or</p>
          <button
            type="button"
            className="browse-button"
            onClick={handleBrowseClick}
          >
            Browse Files
          </button>
          <p className="file-types">Supports: .csv files</p>
        </div>
      ) : (
        <div className="file-info">
          <div className="file-icon">
            <Icon path={mdiFileDocument} size={1.5} />
          </div>
          <div className="file-details">
            <h4>{selectedFile.name}</h4>
            <p>{(selectedFile.size / 1024).toFixed(1)} KB</p>
            {isLoading && <p className="loading">Processing...</p>}
          </div>
          <button
            type="button"
            className="remove-button"
            onClick={handleRemoveFile}
            disabled={isLoading}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
