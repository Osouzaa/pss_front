import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import {
  Container,
  HiddenInput,
  UploadButton,
  PreviewRow,
  PreviewItem,
  PreviewImg,
  RemoveButton,
  Label,
} from "./styles";

type PhotoInputProps = {
  label?: string;
  onChange?: (files: File[]) => void;
};

type Preview = {
  file: File;
  url: string;
};

export function PhotoInput({
  label = "Fotos da vistoria",
  onChange,
}: PhotoInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<Preview[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files) return;

    const incoming = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setItems((prev) => {
      const next = [...prev, ...incoming];
      onChange?.(next.map((x) => x.file));
      return next;
    });

    // permite selecionar a mesma foto de novo (alguns browsers não disparam change)
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    setItems((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);

      const next = prev.filter((_, i) => i !== index);
      onChange?.(next.map((x) => x.file));
      return next;
    });
  }

  // cleanup geral ao desmontar
  useEffect(() => {
    return () => {
      items.forEach((x) => URL.revokeObjectURL(x.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      {label && <Label>{label}</Label>}

      <UploadButton type="button" onClick={() => inputRef.current?.click()}>
        <Camera size={20} />
        Tirar foto agora
      </UploadButton>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
      />

      {items.length > 0 && (
        <PreviewRow>
          {items.map((item, index) => (
            <PreviewItem key={item.url}>
              <PreviewImg src={item.url} alt={`Foto ${index + 1}`} />

              <RemoveButton
                type="button"
                onClick={() => removeAt(index)}
                aria-label={`Remover foto ${index + 1}`}
                title="Remover"
              >
                <Trash2 size={16} />
              </RemoveButton>
            </PreviewItem>
          ))}
        </PreviewRow>
      )}
    </Container>
  );
}
