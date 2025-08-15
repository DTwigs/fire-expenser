import React, { useRef } from "react";
import SlotMachine, { type SlotMachineRef } from "./SlotMachine";

const SlotMachineDemo: React.FC = () => {
  const slotMachineRef = useRef<SlotMachineRef>(null);

  // Example items for the slot machine
  const items = [
    "Housing",
    "Phone",
    "Electric",
    "Internet",
    "Insurance",
    "Groceries",
    "Eating Out",
    "Gas Car",
    "Rideshare",
    "Public Transit",
  ];

  const handleCycleNext = () => {
    slotMachineRef.current?.cycleNext();
  };

  const handleCyclePrevious = () => {
    slotMachineRef.current?.cyclePrevious();
  };

  const handleGoToRandom = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    slotMachineRef.current?.goToIndex(randomIndex);
  };

  const handleGetCurrentIndex = () => {
    const currentIndex = slotMachineRef.current?.getCurrentIndex();
    console.log("Current index:", currentIndex);
    alert(`Current index: ${currentIndex}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "var(--color-text)",
        }}
      >
        Slot Machine Demo
      </h2>

      <SlotMachine
        ref={slotMachineRef}
        items={items}
        height={100}
        itemHeight={60}
        speed={400}
        className="demo-slot-machine"
      />

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleCyclePrevious}
          style={{
            backgroundColor: "var(--color-secondary)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Previous
        </button>

        <button
          onClick={handleCycleNext}
          style={{
            backgroundColor: "var(--color-primary)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Next
        </button>

        <button
          onClick={handleGoToRandom}
          style={{
            backgroundColor: "var(--color-tertiary)",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Random
        </button>

        <button
          onClick={handleGetCurrentIndex}
          style={{
            backgroundColor: "var(--color-background-tint)",
            color: "var(--color-text)",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Get Index
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "var(--color-lightText)",
        }}
      >
        <p>Use the buttons above to control the slot machine</p>
        <p>Or call the methods programmatically:</p>
        <code
          style={{
            display: "block",
            background: "var(--color-background-tint)",
            padding: "8px",
            borderRadius: "4px",
            marginTop: "8px",
            fontSize: "12px",
          }}
        >
          slotMachineRef.current?.cycleNext()
        </code>
      </div>
    </div>
  );
};

export default SlotMachineDemo;
