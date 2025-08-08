import React from "react";
import "../App.css";

type NextStepButtonProps = {
  handleSubmit: () => void;
  isDisabled: boolean;
};

const NextStepButton: React.FC<NextStepButtonProps> = ({
  handleSubmit,
  isDisabled,
}) => (
  <div className="submit-container">
    <button
      type="button"
      className="submit-button"
      onClick={handleSubmit}
      disabled={isDisabled}
    >
      Next Step
    </button>
  </div>
);

export default NextStepButton;
