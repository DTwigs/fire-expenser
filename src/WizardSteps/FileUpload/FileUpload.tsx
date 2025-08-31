import React, { useState, useRef, useCallback } from "react";
import { parseCSV } from "../../utils/fileManagement";
import { useFile, useWizard, type FileDatumContent } from "../../store";
import DragAndDropFileInput from "../../components/DragAndDropFileInput/DragAndDropFileInput";
import NextStepButton from "../../components/NextStepButton";
import { WIZARD_STEP_KEYS } from "../constants";
import { withWizard, type WithWizardProps } from "../withWizard";
import { ADD_FILE, REMOVE_FILE } from "../../reducers/actions";
import { SET_FURTHEST_STEP } from "../../reducers/actions";
import { isEmpty } from "../../utils/common";
import "./FileUpload.css";

const FileUploadStep: React.FC<WithWizardProps> = ({
  handleNextStep,
  step,
}) => {
  const { dispatch: dispatchWizard } = useWizard();
  const { files, dispatch } = useFile();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onParseComplete = useCallback(
    (fileName: string) => (results: FileDatumContent) => {
      dispatch({
        type: ADD_FILE,
        payload: {
          fileName,
          headers: results.headers ?? [],
          data: results.data ?? [],
          fileHeaderRoles: {
            date: "",
            expense_amount: "",
            category: "",
            description: "",
            rebate_amount: "",
            card: "",
          },
        },
      });
      dispatchWizard({
        type: SET_FURTHEST_STEP,
        payload: WIZARD_STEP_KEYS.FILE_UPLOAD,
      });
    },
    [dispatch, dispatchWizard]
  );

  const onParseError = useCallback(
    (error: Papa.ParseError) => {
      console.error("Error parsing CSV:", error);
      dispatchWizard({
        type: SET_FURTHEST_STEP,
        payload: WIZARD_STEP_KEYS.FILE_UPLOAD,
      });
    },
    [dispatchWizard]
  );

  const handleFileProcessing = useCallback(
    (file: File) => {
      setIsLoading(true);
      parseCSV({
        file,
        onComplete: onParseComplete(file.name),
        onError: onParseError,
      });
      setIsLoading(false);
    },
    [onParseComplete, onParseError]
  );

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      dispatch({ type: REMOVE_FILE, payload: fileName });
      dispatchWizard({
        type: SET_FURTHEST_STEP,
        payload: WIZARD_STEP_KEYS.FILE_UPLOAD,
      });
    },
    [dispatch, dispatchWizard, fileInputRef]
  );

  return (
    <section className="step-container">
      <h2>{step.title}</h2>
      <p>{step.description}</p>
      <div className="file-upload-container">
        <DragAndDropFileInput
          files={files}
          handleFileProcessing={handleFileProcessing}
          handleRemoveFile={handleRemoveFile}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
        />
      </div>
      <NextStepButton
        onClick={handleNextStep}
        isDisabled={isEmpty(files) && !isLoading}
      />
    </section>
  );
};

export const FileUpload = withWizard(
  FileUploadStep,
  WIZARD_STEP_KEYS.FILE_UPLOAD
);
