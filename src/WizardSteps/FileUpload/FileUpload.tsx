import React, { useState, useRef, useCallback, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiCurrencyUsd } from "@mdi/js";
import { parseCSV } from "../../utils/fileManagement";
import { useFile, useWizard, type FileDataItem } from "../../store";
import DragAndDropFileInput from "../../components/DragAndDropFileInput/DragAndDropFileInput";
import NextStepButton from "../../components/NextStepButton";
import "./FileUpload.css";
import { WIZARD_STEP_KEYS } from "../constants";

const FileUpload: React.FC = () => {
  const { dispatch: dispatchWizard } = useWizard();
  const { dispatch } = useFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatchWizard({
      type: "SET_CURRENT_STEP",
      payload: WIZARD_STEP_KEYS.FILE_UPLOAD,
    });
  }, [dispatchWizard]);

  const onParseComplete = useCallback(
    (results: Papa.ParseResult<FileDataItem>) => {
      dispatch({
        type: "ADD_FILE_HEADERS",
        payload: results.meta.fields ?? [],
      });
      dispatch({ type: "ADD_FILE_DATA", payload: results.data ?? [] });
    },
    [dispatch]
  );

  const onParseError = useCallback(
    (error: Papa.ParseError) => {
      console.error("Error parsing CSV:", error);
      dispatchWizard({
        type: "SET_CURRENT_STEP",
        payload: WIZARD_STEP_KEYS.FILE_UPLOAD,
      });
    },
    [dispatchWizard]
  );

  const handleFileProcessing = useCallback(
    (file: File) => {
      setIsLoading(true);
      dispatch({ type: "REMOVE_FILE" });

      setTimeout(() => {
        setIsLoading(false);
        parseCSV({ file, onComplete: onParseComplete, onError: onParseError });
      }, 1000);
    },
    [onParseComplete, onParseError, dispatch]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    dispatch({ type: "REMOVE_FILE" });
  }, [dispatch, fileInputRef]);

  return (
    <div className="file-upload-container">
      <h1>
        <Icon path={mdiCurrencyUsd} size={1.5} color="#4CAF50" /> FIRE Expenser
      </h1>
      <h2>Upload CSV File</h2>
      <p>Upload your bank statement or expense CSV file to get started.</p>
      <DragAndDropFileInput
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleFileProcessing={handleFileProcessing}
        handleRemoveFile={handleRemoveFile}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
      />
      <NextStepButton
        currentStep={WIZARD_STEP_KEYS.FILE_UPLOAD}
        isDisabled={!selectedFile && !isLoading}
      />
    </div>
  );
};

export default FileUpload;
