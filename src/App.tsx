import AppRoutes from "./components/AppRoutes";
import StepHeader from "./components/StepHeader";
import { StoreProvider } from "./store";
import "./App.css";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <StepHeader />
        <AppRoutes />
      </div>
    </StoreProvider>
  );
}

export default App;
