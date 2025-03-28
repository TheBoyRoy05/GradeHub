import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "./Components/UI/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
