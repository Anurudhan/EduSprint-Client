import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/index.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "./common/env.ts";

const clientId = String(env.CLIENT_ID);
console.log(clientId);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store} >
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
