import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, FileText, Info, Plus, X } from "lucide-react";
import { useState } from "react";

import {
  Overlay,
  Content,
  Header,
  HeaderLeft,
  IconWrap,
  HeaderText,
  Title,
  Subtitle,
  CloseBtn,
  Body,
  InfoBanner,
  DocList,
  DocCard,
  DocCardTop,
  DocIconWrap,
  DocInfo,
  DocName,
  DocContext,
  DocCardBottom,
  AddBtn,
  Footer,
  DismissBtn,
} from "./styles";

import { ModalAddAnexo } from "../../../../pages/Perfil/components/ModalAddAnexo";
import { type DocFaltando } from "../../useInscricaoActions";

export type { DocFaltando };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  docs: DocFaltando[];
}

export function ModalDocsFaltando({ open, onOpenChange, docs }: Props) {
  const [anexoTipo, setAnexoTipo] = useState<string | undefined>(undefined);
  const [anexoOpen, setAnexoOpen] = useState(false);

  function abrirAnexo(tipo: string) {
    setAnexoTipo(tipo);
    setAnexoOpen(true);
  }

  const pendentes = docs.filter((d) => !d.anexado);
  const count = pendentes.length;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Overlay />
          <Content
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Header>
              <HeaderLeft>
                <IconWrap>
                  <AlertCircle size={20} />
                </IconWrap>
                <HeaderText>
                  <Title>
                    {count === 1
                      ? "1 documento pendente"
                      : `${count} documentos pendentes`}
                  </Title>
                  <Subtitle>
                    Anexe {count === 1 ? "o arquivo abaixo" : "os arquivos abaixo"}{" "}
                    para finalizar sua inscrição.
                  </Subtitle>
                </HeaderText>
              </HeaderLeft>

              <CloseBtn type="button" onClick={() => onOpenChange(false)} aria-label="Fechar">
                <X size={15} />
              </CloseBtn>
            </Header>

            <Body>
              <InfoBanner>
                <Info size={15} />
                <span>
                  Clique em <strong>Adicionar documento</strong> em cada item,
                  envie o arquivo e tente finalizar a inscrição novamente.
                </span>
              </InfoBanner>

              <DocList>
                {pendentes.map((doc) => (
                  <DocCard key={doc.id_pergunta}>
                    <DocCardTop>
                      <DocIconWrap>
                        <FileText size={17} />
                      </DocIconWrap>
                      <DocInfo>
                        <DocName>{doc.label_comprovante}</DocName>
                        <DocContext title={`Exigido pela pergunta: ${doc.pergunta}`}>
                          Exigido pela pergunta: "{doc.pergunta}"
                        </DocContext>
                      </DocInfo>
                    </DocCardTop>

                    <DocCardBottom>
                      <AddBtn
                        type="button"
                        onClick={() => abrirAnexo(doc.label_comprovante)}
                      >
                        <Plus size={14} />
                        Adicionar documento
                      </AddBtn>
                    </DocCardBottom>
                  </DocCard>
                ))}
              </DocList>
            </Body>

            <Footer>
              <DismissBtn type="button" onClick={() => onOpenChange(false)}>
                Entendido, vou anexar
              </DismissBtn>
            </Footer>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ModalAddAnexo
        open={anexoOpen}
        onOpenChange={setAnexoOpen}
        defaultTipo={anexoTipo}
      />
    </>
  );
}
