import Icon from "@mdi/react";
import { mdiFileDocument, mdiTrashCan } from "@mdi/js";

type FileItemProps = {
  file: File;
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
        <h4>{file.name}</h4>
        <p>{(file.size / 1024).toFixed(1)} KB</p>
        {isLoading && <p className="loading">Processing...</p>}
      </div>
      <button
        type="button"
        className="remove-button button file-icon"
        onClick={() => handleRemoveFile(file.name)}
        disabled={isLoading}
      >
        <Icon path={mdiTrashCan} size={1} />
      </button>
    </div>
  );
};
