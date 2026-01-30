import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./AppProviders";
import { AuthProvider } from "./contexts/auth-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppProviders />
    </AuthProvider>
  </StrictMode>,
);
