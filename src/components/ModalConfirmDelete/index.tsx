import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import {
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  IconButton,
  ButtonContainer,
  Button,
} from "./styles";
import { useNavigate } from "react-router";

interface ConfirmDeleteModalProps {
  itemName: string;
  onConfirm: () => Promise<void> | void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invalidateQueryKeys?: QueryKey[];
  location?: string;
}

export function ModalConfirmDelete({
  itemName,
  onConfirm,
  open,
  onOpenChange,
  location,
  invalidateQueryKeys = [],
}: ConfirmDeleteModalProps) {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const handleConfirm = async () => {
    try {
      setIsPending(true);

      // 1) executa ação (delete)
      await onConfirm();

      // 2) invalida queries pedidas
      await Promise.all(
        invalidateQueryKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ),
      );
      if (location) {
        navigate(location);
      }
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o item: <strong>{itemName}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </DialogDescription>

          <ButtonContainer>
            <Dialog.Close asChild>
              <Button variant="secondary" disabled={isPending}>
                Cancelar
              </Button>
            </Dialog.Close>

            <Button
              variant="danger"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Excluindo..." : "Sim, Excluir"}
            </Button>
          </ButtonContainer>

          <Dialog.Close asChild>
            <IconButton aria-label="Fechar" disabled={isPending}>
              <X size={18} />
            </IconButton>
          </Dialog.Close>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
