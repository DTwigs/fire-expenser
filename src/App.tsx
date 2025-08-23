import { StoreProvider } from "./store";
import AppEntry from "./AppEntry";
import "./App.css";

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <AppEntry />
      </div>
    </StoreProvider>
  );
}

export default App;
