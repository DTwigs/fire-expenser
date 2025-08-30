import { getMappedHeader, isRequiredRole } from "./utils";
import type { FileHeaderRole, FileDatum } from "../../store/types";
import { capitalizeString } from "../../utils/common";

type HeaderRoleProps = {
  file: FileDatum;
  role: keyof FileHeaderRole;
  dragOverRole: keyof FileHeaderRole | null;
  handleRemoveMapping: (role: keyof FileHeaderRole) => void;
};

export const HeaderRole = ({
  file,
  role,
  dragOverRole,
  handleRemoveMapping,
}: HeaderRoleProps) => (
  <div
    className={`header-role ${isRequiredRole(role) ? "required" : "optional"} ${
      dragOverRole === role ? "drag-over" : ""
    }`}
  >
    <div className="role-label">
      {role.split("_").map(capitalizeString).join(" ")}
      {isRequiredRole(role) && <span className="required-mark">*</span>}
    </div>
    <div className="mapped-header">
      {getMappedHeader(file, role) ? (
        <div className="mapped-header-content">
          <span>{getMappedHeader(file, role)}</span>
          <button
            className="remove-mapping"
            onClick={() => handleRemoveMapping(role)}
          >
            ×
          </button>
        </div>
      ) : (
        <div
          className={`drop-zone ${dragOverRole === role ? "drag-over" : ""}`}
        >
          Drop header here
        </div>
      )}
    </div>
  </div>
);
