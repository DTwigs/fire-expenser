import AppRoutes from "./components/AppRoutes";
import StepHeader from "./components/StepHeader/StepHeader";
import { Header } from "./components/Header";
import { useStore } from "./store";
import { useEffect } from "react";
import db from "./db";

function AppEntry() {
  const { dispatch } = useStore();

  useEffect(() => {
    dispatch({
      type: "INITIALIZE_STORE",
      payload: {
        categoryMapper: db.getCategoryMapper(),
        settings: db.getSettings(),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <StepHeader />
      <AppRoutes />
    </>
  );
}

export default AppEntry;
