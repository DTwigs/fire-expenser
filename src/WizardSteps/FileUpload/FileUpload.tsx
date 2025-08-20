import React, { useState, useRef, useCallback, useEffect } from "react";
import { parseCSV } from "../../utils/fileManagement";
import { useFile, useWizard, type FileDataItem } from "../../store";
import DragAndDropFileInput from "../../components/DragAndDropFileInput/DragAndDropFileInput";
import NextStepButton from "../../components/NextStepButton";
import { WIZARD_STEP_KEYS } from "../constants";
import "./FileUpload.css";
import { withWizard, type WithWizardProps } from "../withWizard";

const FileUploadStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
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
    <section className="file-upload-container">
      <h2>{step.title}</h2>
      <p>{step.description}</p>
      <DragAndDropFileInput
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        handleFileProcessing={handleFileProcessing}
        handleRemoveFile={handleRemoveFile}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
      />
      <NextStepButton
        onClick={handleNextStep}
        isDisabled={!selectedFile && !isLoading}
      />
    </section>
  );
};

export const FileUpload = withWizard(
  FileUploadStep,
  WIZARD_STEP_KEYS.FILE_UPLOAD
);
