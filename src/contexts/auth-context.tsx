// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AxiosError } from "axios";

import { getMe, type UsuarioComCandidatoDTO } from "../api/get-me";
import { TokenSistems } from "../constants/env.constantes";

type AuthContextData = {
  user: UsuarioComCandidatoDTO | null;
  isLoading: boolean;
  hasSession: boolean; // tem token
  isAuthenticated: boolean; // tem token (e opcionalmente user)
  isAdmin: boolean;
  isCandidato: boolean;
  isAtivo: boolean;
  isPrimeiroAcesso: boolean;

  refreshMe: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function hasToken(): boolean {
  try {
    return !!localStorage.getItem(TokenSistems.TOKEN_PSS);
  } catch {
    return false;
  }
}

function isUnauthorized(err: unknown) {
  return err instanceof AxiosError && err.response?.status === 401;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioComCandidatoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasSession = useMemo(() => hasToken(), []);

  const isAuthenticated = useMemo(() => hasToken(), [user]);

  const isAdmin = useMemo(() => user?.tipo === "ADMIN", [user?.tipo]);
  const isCandidato = useMemo(() => user?.tipo === "CANDIDATO", [user?.tipo]);
  const isAtivo = useMemo(() => !!user?.ativo, [user?.ativo]);
  const isPrimeiroAcesso = useMemo(
    () => !!user?.fl_primeiro_acesso,
    [user?.fl_primeiro_acesso],
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TokenSistems.TOKEN_PSS);
    } finally {
      setUser(null);
    }
  }, []);

  const refreshMe = useCallback(async () => {
    if (!hasToken()) {
      setUser(null);
      return;
    }

    try {
      const me = (await getMe()) as UsuarioComCandidatoDTO;

      if ("senha_hash" in me) delete (me as any).senha_hash;

      setUser(me);
    } catch (err) {
      if (isUnauthorized(err)) logout();
      else setUser(null);
    }
  }, [logout]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!hasToken()) {
        if (!mounted) return;
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const me = (await getMe()) as UsuarioComCandidatoDTO;
        if ("senha_hash" in me) delete (me as any).senha_hash;

        if (!mounted) return;
        setUser(me);
      } catch (err) {
        if (!mounted) return;
        if (isUnauthorized(err)) logout();
        else setUser(null);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [logout]);

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      isLoading,
      hasSession,
      isAuthenticated,
      isAdmin,
      isCandidato,
      isAtivo,
      isPrimeiroAcesso,
      refreshMe,
      logout,
    }),
    [
      user,
      isLoading,
      hasSession,
      isAuthenticated,
      isAdmin,
      isCandidato,
      isAtivo,
      isPrimeiroAcesso,
      refreshMe,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
