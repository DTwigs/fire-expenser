import AppRoutes from "./components/AppRoutes";
import StepHeader from "./components/StepHeader";
import Icon from "@mdi/react";
import { mdiCurrencyUsd } from "@mdi/js";
import { StoreProvider } from "./store";
import "./App.css";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <StepHeader />
        <h1>
          <Icon path={mdiCurrencyUsd} size={1.5} color="#4CAF50" /> FIRE
          Expenser
        </h1>

        <AppRoutes />
      </div>
    </StoreProvider>
  );
}

export default App;
