import "./App.css";

import "altcha";
import type {} from "altcha/types/react";
import "altcha/themes/aqua.css";
import AppRoutes from "./routes/AppRoutes";
import { useApiLoading } from "./hooks/useApiLoading";
import LoadingPill from "./components/ui/LoadingPill";

function App() {
  const isLoading = useApiLoading();
  return (
    <>
      {isLoading && <LoadingPill />}
      <AppRoutes />
    </>
  );
}

export default App;
