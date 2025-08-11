import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import "./LoadingTransition.css";

const LoadingTransition: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1000; // 3 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigate]);

  if (progress >= 100) {
    onComplete();
  }

  return (
    <div className="loading-transition">
      <div className="loading-content">
        <div className="loading-icon">
          <Icon path={mdiLoading} size={3} className="spinning" />
        </div>
        <h2>Processing your file...</h2>
        <p>Please wait while we analyze your CSV data</p>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingTransition;
