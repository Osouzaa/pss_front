import { useCallback, useEffect, useState } from "react";
import * as S from "./styles";

type VersionResponse = {
  version?: string;
};

type NoticeState =
  | { type: "available"; version: string }
  | { type: "updated"; version: string }
  | null;

const CURRENT_VERSION = __APP_VERSION__;
const LAST_SEEN_KEY = "pss:app-version:last-seen";
const DISMISSED_KEY = "pss:app-version:dismissed";
const CHECK_INTERVAL_MS = 3 * 60 * 1000;

async function fetchVersion(): Promise<string | null> {
  const response = await fetch(`/version.json?t=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as VersionResponse;
  return data.version?.trim() || null;
}

export function UpdateNotice() {
  const [notice, setNotice] = useState<NoticeState>(null);

  const checkVersion = useCallback(async () => {
    try {
      const remoteVersion = await fetchVersion();
      if (!remoteVersion) return;

      const dismissedVersion = localStorage.getItem(DISMISSED_KEY);
      if (
        remoteVersion !== CURRENT_VERSION &&
        dismissedVersion !== remoteVersion
      ) {
        setNotice({ type: "available", version: remoteVersion });
        return;
      }

      const lastSeenVersion = localStorage.getItem(LAST_SEEN_KEY);
      if (!lastSeenVersion) {
        localStorage.setItem(LAST_SEEN_KEY, CURRENT_VERSION);
        return;
      }

      if (
        lastSeenVersion !== CURRENT_VERSION &&
        dismissedVersion !== CURRENT_VERSION
      ) {
        setNotice({ type: "updated", version: CURRENT_VERSION });
        localStorage.setItem(LAST_SEEN_KEY, CURRENT_VERSION);
      }
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    void checkVersion();

    const interval = window.setInterval(() => {
      void checkVersion();
    }, CHECK_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkVersion();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [checkVersion]);

  if (!notice) return null;

  const close = () => {
    localStorage.setItem(DISMISSED_KEY, notice.version);
    setNotice(null);
  };

  const reload = () => {
    window.location.reload();
  };

  const isUpdateAvailable = notice.type === "available";

  return (
    <S.Wrap role="status" aria-live="polite">
      <div>
        <S.Title>
          {isUpdateAvailable
            ? "Nova atualização disponível"
            : "Sistema atualizado"}
        </S.Title>
        <S.Text>
          {isUpdateAvailable
            ? "Há uma versão mais recente do sistema. Atualize a página para usar as novidades."
            : "Você já está usando a versão mais recente do sistema."}
        </S.Text>
      </div>

      <S.Actions>
        <S.Button type="button" onClick={close}>
          {isUpdateAvailable ? "Depois" : "Ok"}
        </S.Button>
        {isUpdateAvailable && (
          <S.Button type="button" $variant="primary" onClick={reload}>
            Atualizar agora
          </S.Button>
        )}
      </S.Actions>
    </S.Wrap>
  );
}
