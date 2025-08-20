import React from "react";
import "../App.css";

type NextStepButtonProps = {
  isDisabled: boolean;
  className?: string;
  onClick?: () => void;
};

const NextStepButton: React.FC<NextStepButtonProps> = ({
  isDisabled,
  className,
  onClick,
}) => {
  return (
    <div className={`submit-container ${className ?? ""}`}>
      <button
        type="button"
        className="submit-button"
        onClick={onClick}
        disabled={isDisabled}
      >
        Next Step
      </button>
    </div>
  );
};

export default NextStepButton;
