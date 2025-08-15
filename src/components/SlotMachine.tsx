import React, { useState, useRef } from "react";
import "./SlotMachine.css";

interface SlotMachineProps {
  items: string[];
  height?: number;
  itemHeight?: number;
  speed?: number;
  className?: string;
}

interface SlotMachineRef {
  cycleNext: () => void;
  cyclePrevious: () => void;
  goToIndex: (index: number) => void;
  getCurrentIndex: () => number;
}

const SlotMachine = React.forwardRef<SlotMachineRef, SlotMachineProps>(
  (
    { items, height = 100, itemHeight = 60, speed = 300, className = "" },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      cycleNext: () => {
        if (!isAnimating && items.length > 0) {
          setIsAnimating(true);
          setCurrentIndex((prev) => (prev + 1) % items.length);
          setTimeout(() => {
            setIsAnimating(false);
          }, speed);
        }
      },
      cyclePrevious: () => {
        if (!isAnimating && items.length > 0) {
          setIsAnimating(true);
          setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
          setTimeout(() => {
            setIsAnimating(false);
          }, speed);
        }
      },
      goToIndex: (index: number) => {
        if (!isAnimating && index >= 0 && index < items.length) {
          setIsAnimating(true);
          setCurrentIndex(index);
          setTimeout(() => {
            setIsAnimating(false);
          }, speed);
        }
      },
      getCurrentIndex: () => currentIndex,
    }));

    // Calculate the offset to center the current item
    const getContainerOffset = () => {
      const centerPosition = height / 2 - itemHeight / 2;
      const currentItemOffset = currentIndex * itemHeight;
      return centerPosition - currentItemOffset;
    };

    return (
      <div
        ref={containerRef}
        className={`slot-machine ${className}`}
        style={
          {
            height: `${height}px`,
            "--item-height": `${itemHeight}px`,
            "--animation-speed": `${speed}ms`,
          } as React.CSSProperties
        }
      >
        <div
          className={`slot-machine-container ${
            isAnimating ? "slot-machine-container--animating" : ""
          }`}
          style={{
            transform: `translateY(${getContainerOffset()}px)`,
          }}
        >
          {items.map((item, index) => {
            const isCurrent = index === currentIndex;

            return (
              <div
                key={index}
                className={`slot-machine-item ${
                  isCurrent
                    ? "slot-machine-item--center"
                    : index < currentIndex
                    ? "slot-machine-item--above"
                    : "slot-machine-item--below"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  opacity: isCurrent ? 1 : 0.6,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>

        {/* Fade overlays */}
        <div className="slot-machine-fade slot-machine-fade--top"></div>
        <div className="slot-machine-fade slot-machine-fade--bottom"></div>
      </div>
    );
  }
);

SlotMachine.displayName = "SlotMachine";

export default SlotMachine;
export type { SlotMachineRef };
