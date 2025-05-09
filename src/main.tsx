import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/index.ts";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "./common/env.ts";
import { SocketProvider } from "./context/SocketProvider.tsx";
import { ToastProvider } from "./components/common/Toast/ToastifyV1.tsx";

const clientId = String(env.CLIENT_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId={clientId}>
            <ToastProvider>
          <SocketProvider>
            <App />
            </SocketProvider>
            </ToastProvider>
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
