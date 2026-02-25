import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/app/store/store.ts";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* <App /> */}
        <Dashboard />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
