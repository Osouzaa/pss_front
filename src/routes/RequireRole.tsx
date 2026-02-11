import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";
import { TokenSistems } from "../constants/env.constantes";

type JwtPayload = {
  role?: string;
};

type Props = {
  allowedRoles: string[];
};

export function RequireRole({ allowedRoles }: Props) {
  const token = localStorage.getItem(TokenSistems.TOKEN_PSS);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.role || !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/processos" replace />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
