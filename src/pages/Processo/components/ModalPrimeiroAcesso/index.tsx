import * as Dialog from "@radix-ui/react-dialog";
import { X, User, ArrowRight } from "lucide-react";
import { useMemo } from "react";

import {
  Content,
  HeaderContent,
  Overlay,
  Footer,
  Title,
  Body,
  Section,
  SectionTitle,
  Chip,
} from "./styles";

interface ModalPrimeiroAcessoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // ação principal (ex: navigate("/perfil"))
  onGoProfile: () => void;

  // se quiser bloquear fechar no overlay/ESC
  lockClose?: boolean;
}

export function ModalPrimeiroAcesso({
  open,
  onOpenChange,
  onGoProfile,
  lockClose = true,
}: ModalPrimeiroAcessoProps) {
  const titleText = useMemo(() => "Primeiro acesso", []);

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />

        <Content
          onPointerDownOutside={(e) => {
            if (lockClose) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (lockClose) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (lockClose) e.preventDefault();
          }}
        >
          <HeaderContent>
            <div>
              <Title>{titleText}</Title>
              <div className="subtitle">
                Antes de continuar, complete seu perfil com suas informações e
                documentos.
              </div>
            </div>

            <button type="button" onClick={handleClose} aria-label="Fechar">
              <X size={16} />
            </button>
          </HeaderContent>

          <Body>
            <Section>
              <SectionTitle>O que você precisa fazer agora</SectionTitle>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ lineHeight: 1.5, opacity: 0.9 }}>
                  Identificamos que este é seu primeiro acesso. Para validar sua
                  inscrição e facilitar análises, é importante preencher seu
                  perfil com os dados pessoais e anexar os documentos
                  necessários.
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Chip>
                    <User size={14} />
                    Atualize seu perfil
                  </Chip>
                  <Chip>
                    <ArrowRight size={14} />
                    Leva menos de 2 minutos
                  </Chip>
                </div>
              </div>
            </Section>

            <Footer>
              <button type="button" className="secondary" onClick={handleClose}>
                Agora não
              </button>

              <button
                type="button"
                className="primary"
                onClick={() => {
                  handleClose();
                  onGoProfile();
                }}
              >
                Ir para meu perfil
              </button>
            </Footer>
          </Body>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
