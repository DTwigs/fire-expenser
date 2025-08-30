import Icon from "@mdi/react";
import { mdiFileDocument, mdiTrashCan } from "@mdi/js";
import type { FileDatum } from "../../store/types";

type FileItemProps = {
  file: FileDatum;
  isLoading: boolean;
  handleRemoveFile: (fileName: string) => void;
};

export const FileItem: React.FC<FileItemProps> = ({
  file,
  isLoading,
  handleRemoveFile,
}) => {
  return (
    <div className="file-item">
      <div className="file-icon">
        <Icon path={mdiFileDocument} size={1} />
      </div>
      <div className="file-details">
        <h4>{file.fileName}</h4>
        {isLoading && <p className="loading">Processing...</p>}
      </div>
      <button
        type="button"
        className="remove-button button file-icon"
        onClick={() => handleRemoveFile(file.fileName)}
        disabled={isLoading}
      >
        <Icon path={mdiTrashCan} size={1} />
      </button>
    </div>
  );
};
