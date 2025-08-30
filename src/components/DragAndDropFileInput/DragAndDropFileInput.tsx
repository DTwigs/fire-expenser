import React, { useState, useCallback } from "react";
import Icon from "@mdi/react";
import { mdiFileUpload } from "@mdi/js";
import { FileItem } from "./FileItem";
import "./DragAndDropFileInput.css";

type DragAndDropFileInputProps = {
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileProcessing: (file: File) => void;
  setSelectedFiles: (files: Array<File> | null) => void;
  selectedFiles: Array<File> | null;
  handleRemoveFile: (fileName: string) => void;
};

const FileUpload: React.FC<DragAndDropFileInputProps> = ({
  isLoading,
  fileInputRef,
  handleFileProcessing,
  selectedFiles,
  setSelectedFiles,
  handleRemoveFile,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileSelect = useCallback(
    (files: Array<File>) => {
      if (files && files.length > 0) {
        let newFiles = [...(selectedFiles ?? [])];
        Array.from(files).forEach((file) => {
          if (file.type === "text/csv" || file.name.endsWith(".csv")) {
            newFiles = [...newFiles, file];
            handleFileProcessing(file);
          } else {
            alert("Please select a valid CSV file.");
          }
        });
        setSelectedFiles(newFiles);
      }
    },
    [handleFileProcessing, setSelectedFiles, selectedFiles]
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
        handleFileSelect(files);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return (
    <>
      <div
        className={`upload-area ${isDragOver ? "drag-over" : ""} ${
          selectedFiles ? "has-file" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,text/csv"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        <section className="upload-content">
          <div className="upload-icon">
            <Icon path={mdiFileUpload} size={2} />
          </div>
          <h3>Drag & Drop your CSV files here</h3>
          <p>or</p>
          <button
            type="button"
            className="browse-button button"
            onClick={handleBrowseClick}
          >
            Browse Files
          </button>
          <p className="file-types">Supports: .csv files</p>
        </section>
      </div>
      <section className="file-info">
        <div className="file-list">
          {selectedFiles &&
            selectedFiles.map((file) => (
              <FileItem
                key={file.name}
                file={file}
                isLoading={isLoading}
                handleRemoveFile={handleRemoveFile}
              />
            ))}
        </div>
      </section>
    </>
  );
};

export default FileUpload;
