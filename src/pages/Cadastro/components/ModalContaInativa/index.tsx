import * as Dialog from "@radix-ui/react-dialog";
import { X, MailCheck } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import {
  Content,
  HeaderContent,
  Overlay,
  Title,
  Body,
  EmailBox,
  Footer,
  IconWrap,
  Subtitle,
} from "./styles";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  mailSent?: boolean;
};

export function ModalContaInativa({ open, onOpenChange, email, mailSent = true }: Props) {
  const navigate = useNavigate();

  const safeEmail = useMemo(() => (email ?? "").trim(), [email]);

  function handleClose() {
    onOpenChange(false);
  }

  function goLogin() {
    onOpenChange(false);
    navigate("/login", { replace: true });
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <HeaderContent>
            <Title>Conta criada com sucesso!</Title>

            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <Body>
            <IconWrap aria-hidden="true">
              <MailCheck size={22} />
            </IconWrap>

            <div>
              <Subtitle>
                Sua conta foi criada com sucesso, mas ainda está <b>inativa</b>.
              </Subtitle>

              {mailSent ? (
                <>
                  <p>Para ativar, confirme o e-mail enviado para:</p>
                  <EmailBox title={safeEmail || "E-mail não informado"}>
                    {safeEmail || "—"}
                  </EmailBox>
                  <p>Depois de confirmar, volte e faça login normalmente.</p>
                </>
              ) : (
                <>
                  <p>
                    Houve um problema ao enviar o e-mail de confirmação para{" "}
                    <b>{safeEmail || "—"}</b>.
                  </p>
                  <p>
                    Na tela de login, use a opção{" "}
                    <b>"Reenviar confirmação"</b> para receber um novo link.
                  </p>
                </>
              )}
            </div>
          </Body>

          <Footer>
            <button type="button" className="secondary" onClick={handleClose}>
              Fechar
            </button>

            <button type="button" className="primary" onClick={goLogin}>
              Ir para o login
            </button>
          </Footer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
