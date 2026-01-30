// src/pages/Perfil/components/ModalLembrete/index.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { X, AlertTriangle, CheckCircle2, FileUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Content,
  HeaderContent,
  Overlay,
  Footer,
  Title,
  Body,
  Section,
  TextBlock,
  Muted,
  LinkInline,
  CheckRow,
  AccentBar,
  List,
  ListItem,
  Badge,
  CardsRow,
  CardInfo,
  CardTitle,
  CardDesc,
} from "./styles";
import { TokenSistems } from "../../constants/env.constantes";

const INITIAL_MINUTES = 10;
const STEP_MINUTES = 10;
const MAX_MINUTES = 120;

// Ajuste aqui se quiser outro caminho
const DOCUMENTOS_HREF_DEFAULT = "/perfil";

function nowMs() {
  return Date.now();
}

function safeGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function ModalLembrete() {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [open, setOpen] = useState(false);

  const HIDE_KEY = TokenSistems.DOC_REMINDER_HIDE;
  const NEXT_AT_KEY = TokenSistems.DOC_REMINDER_NEXT_AT;
  const INTERVAL_KEY = TokenSistems.DOC_REMINDER_INTERVAL_MIN;

  const shouldHideByStorage = useMemo(() => {
    return safeGet(HIDE_KEY) === "1";
  }, [HIDE_KEY]);

  const canShowNow = useCallback(() => {
    const raw = safeGet(NEXT_AT_KEY);
    const nextAt = raw ? Number(raw) : 0;
    if (!Number.isFinite(nextAt)) return true;
    return nowMs() >= nextAt;
  }, [NEXT_AT_KEY]);

  const scheduleNext = useCallback(() => {
    const rawInterval = safeGet(INTERVAL_KEY);
    const currentInterval = rawInterval ? Number(rawInterval) : INITIAL_MINUTES;

    const safeInterval =
      Number.isFinite(currentInterval) && currentInterval > 0
        ? currentInterval
        : INITIAL_MINUTES;

    // Próxima exibição: agora + intervalo atual
    const nextAt = nowMs() + safeInterval * 60_000;
    safeSet(NEXT_AT_KEY, String(nextAt));

    // Intervalo vai subindo: 10 -> 20 -> 30...
    const nextInterval = Math.min(safeInterval + STEP_MINUTES, MAX_MINUTES);
    safeSet(INTERVAL_KEY, String(nextInterval));
  }, [INTERVAL_KEY, NEXT_AT_KEY]);

  // ✅ Autonomia: decide abrir quando o componente aparece na página
  useEffect(() => {
    if (shouldHideByStorage) {
      setOpen(false);
      return;
    }

    if (canShowNow()) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [shouldHideByStorage, canShowNow]);

  // Ao abrir, reseta checkbox
  useEffect(() => {
    if (open) setDontShowAgain(false);
  }, [open]);

  function handleClose() {
    if (dontShowAgain) {
      safeSet(HIDE_KEY, "1");
      setOpen(false);
      return;
    }

    scheduleNext();
    setOpen(false);
  }

  // se estiver escondido pelo storage, não renderiza nada
  if (shouldHideByStorage) return null;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
    >
      <Dialog.Portal>
        <Overlay />

        <Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <AccentBar aria-hidden="true" />

          <HeaderContent>
            <div>
              <Title>Avisos importantes</Title>
              <div className="subtitle">
                Confira os pontos abaixo para evitar pendências na validação.
              </div>
            </div>

            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <Body>
            <Section>
              <TextBlock>
                <span className="icon" aria-hidden="true">
                  <AlertTriangle size={16} />
                </span>

                <div className="content">
                  <p>
                    Para manter sua inscrição válida, é importante manter seus
                    documentos atualizados e anexar os comprovantes sempre que
                    solicitado.
                  </p>

                  <CardsRow>
                    <CardInfo>
                      <CardTitle>
                        <span className="i" aria-hidden="true">
                          <FileUp size={16} />
                        </span>
                        Onde enviar
                      </CardTitle>

                      <CardDesc>
                        <List>
                          <ListItem>
                            Pelo{" "}
                            <LinkInline href={DOCUMENTOS_HREF_DEFAULT}>
                              Perfil (Documentos)
                            </LinkInline>
                          </ListItem>
                          <ListItem>
                            Durante a inscrição, na aba de anexos disponível ao
                            lado das informações.
                          </ListItem>
                        </List>
                      </CardDesc>
                    </CardInfo>

                    <CardInfo>
                      <CardTitle>
                        <span className="i" aria-hidden="true">
                          <CheckCircle2 size={16} />
                        </span>
                        Obrigatório quando…
                      </CardTitle>

                      <CardDesc>
                        <List>
                          <ListItem>
                            Você marcar <Badge>Ensino Médio</Badge>
                          </ListItem>
                          <ListItem>
                            Você marcar <Badge>Ensino Superior</Badge>
                          </ListItem>
                          <ListItem>
                            Você aceitar ou enviar <Badge>Declarações</Badge>
                          </ListItem>
                        </List>
                      </CardDesc>
                    </CardInfo>
                  </CardsRow>

                  <Muted>
                    Todos os documentos estarão disponíveis para acesso na
                    página <strong>Perfil (Documentos)</strong>.
                    <br />
                    <br />
                    Dica: se você informou alguma escolaridade ou declaração,
                    anexe o documento correspondente para evitar indeferimento
                    por falta de comprovação.
                  </Muted>
                </div>
              </TextBlock>

              <CheckRow>
                <input
                  id="dontShowAgain"
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <label htmlFor="dontShowAgain">Não mostrar novamente</label>
              </CheckRow>
            </Section>

            <Footer>
              <button type="button" className="primary" onClick={handleClose}>
                Entendi
              </button>
            </Footer>
          </Body>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
