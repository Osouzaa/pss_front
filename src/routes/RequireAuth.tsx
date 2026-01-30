import { Navigate, Outlet, useLocation } from "react-router";
import { TokenSistems } from "../constants/env.constantes";

function hasToken(): boolean {
  try {
    return !!localStorage.getItem(TokenSistems.TOKEN_PSS);
  } catch {
    return false;
  }
}

export function RequireAuth() {
  const location = useLocation();

  if (!hasToken()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
