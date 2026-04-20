import { useRef, useState } from "react";
import { FiPaperclip, FiCheck, FiAlertCircle, FiX } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { uploadDocumentoMe } from "../../api/upload-documento-me";
import * as S from "./styles";

type Phase = "idle" | "selected" | "uploading" | "success" | "error";

interface AnexoInputProps {
  tipo: string;
  label?: string;
  descricao?: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

const MAX_MB = 10;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function AnexoInput({
  tipo,
  label,
  descricao,
  disabled = false,
  onSuccess,
}: AnexoInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!picked) return;

    if (!ALLOWED_TYPES.includes(picked.type)) {
      setErrorMsg("Formato inválido. Use PDF, JPG, PNG ou WEBP.");
      setPhase("error");
      return;
    }

    if (picked.size > MAX_MB * 1024 * 1024) {
      setErrorMsg(`Arquivo muito grande. Máximo ${MAX_MB} MB.`);
      setPhase("error");
      return;
    }

    setFile(picked);
    setPhase("selected");
    setErrorMsg("");
  }

  async function handleEnviar() {
    if (!file) return;
    setPhase("uploading");
    try {
      await uploadDocumentoMe({ file, tipo, descricao });
      queryClient.invalidateQueries({ queryKey: ["me-documentos"] });
      setPhase("success");
      onSuccess?.();
    } catch {
      setErrorMsg("Erro ao enviar. Tente novamente.");
      setPhase("error");
    }
  }

  function handleReset() {
    setFile(null);
    setPhase("idle");
    setErrorMsg("");
  }

  return (
    <S.Field>
      {label && <S.Label>{label}</S.Label>}

      <S.Zone
        $phase={phase}
        $disabled={disabled || phase === "uploading"}
        onClick={() => {
          if (disabled || phase === "uploading" || phase === "success") return;
          if (phase === "idle" || phase === "error") fileRef.current?.click();
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (phase === "idle" || phase === "error") fileRef.current?.click();
          }
        }}
      >
        <input
          ref={fileRef}
          type="file"
          hidden
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          disabled={disabled}
        />

        {phase === "idle" && (
          <S.IdleContent>
            <S.IconWrap $phase="idle">
              <FiPaperclip size={16} />
            </S.IconWrap>
            <S.IdleText>Clique para anexar um arquivo</S.IdleText>
            <S.HintText>PDF, JPG, PNG ou WEBP · máx. {MAX_MB} MB</S.HintText>
          </S.IdleContent>
        )}

        {(phase === "selected" || phase === "uploading") && file && (
          <S.FileContent>
            <S.FileInfo>
              <S.IconWrap $phase="selected">
                <FiPaperclip size={15} />
              </S.IconWrap>
              <S.FileName title={file.name}>{file.name}</S.FileName>
              <S.FileSize>
                {(file.size / 1024).toFixed(0)} KB
              </S.FileSize>
            </S.FileInfo>

            <S.FileActions>
              {phase === "selected" && (
                <>
                  <S.ClearBtn
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    title="Remover"
                  >
                    <FiX size={14} />
                  </S.ClearBtn>
                  <S.SendBtn
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleEnviar(); }}
                  >
                    Enviar
                  </S.SendBtn>
                </>
              )}

              {phase === "uploading" && (
                <S.Spinner />
              )}
            </S.FileActions>
          </S.FileContent>
        )}

        {phase === "success" && (
          <S.StatusContent>
            <S.IconWrap $phase="success">
              <FiCheck size={15} />
            </S.IconWrap>
            <S.StatusText>Documento salvo com sucesso</S.StatusText>
            <S.ResetBtn
              type="button"
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
            >
              Enviar outro
            </S.ResetBtn>
          </S.StatusContent>
        )}

        {phase === "error" && (
          <S.StatusContent>
            <S.IconWrap $phase="error">
              <FiAlertCircle size={15} />
            </S.IconWrap>
            <S.StatusText $error>{errorMsg}</S.StatusText>
            <S.ResetBtn
              type="button"
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
            >
              Tentar novamente
            </S.ResetBtn>
          </S.StatusContent>
        )}
      </S.Zone>
    </S.Field>
  );
}
