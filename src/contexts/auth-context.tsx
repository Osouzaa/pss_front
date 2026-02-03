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

  token: string | null;
  hasSession: boolean;
  isAuthenticated: boolean;

  isAdmin: boolean;
  isCandidato: boolean;
  isAtivo: boolean;
  isPrimeiroAcesso: boolean;

  isPerfilCandidatoCompleto: boolean;

  setSession: (token: string) => void; // 👈 login chama isso
  refreshMe: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function isUnauthorized(err: unknown) {
  return err instanceof AxiosError && err.response?.status === 401;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TokenSistems.TOKEN_PSS);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UsuarioComCandidatoDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ token reativo
  const [token, setToken] = useState<string | null>(() => readToken());

  const hasSession = !!token;
  const isAuthenticated = !!token && !!user; // ou só !!token, você escolhe

  const isAdmin = user?.tipo === "ADMIN";
  const isCandidato = user?.tipo === "CANDIDATO";
  const isAtivo = !!user?.ativo;
  const isPrimeiroAcesso = !!user?.fl_primeiro_acesso;

  const isPerfilCandidatoCompleto = !isCandidato || !!user?.id_candidato;

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TokenSistems.TOKEN_PSS);
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  const setSession = useCallback((newToken: string) => {
    localStorage.setItem(TokenSistems.TOKEN_PSS, newToken);
    setToken(newToken); // ✅ isso dispara re-render e efeitos
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) {
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
  }, [token, logout]);

  // ✅ quando token muda (login/logout), busca /me automaticamente
  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);

      if (!token) {
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
  }, [token, logout]);

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      isLoading,
      token,
      hasSession,
      isAuthenticated,
      isAdmin,
      isCandidato,
      isAtivo,
      isPrimeiroAcesso,

      isPerfilCandidatoCompleto,

      setSession,
      refreshMe,
      logout,
    }),
    [
      user,
      isLoading,
      token,
      hasSession,
      isAuthenticated,
      isAdmin,
      isCandidato,
      isAtivo,
      isPrimeiroAcesso,
      isPerfilCandidatoCompleto,
      setSession,
      refreshMe,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
