import { useState } from "react";
import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Loader2, X } from "lucide-react";
import type { QueryKey } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import {
  Button,
  ButtonContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogIcon,
  DialogOverlay,
  DialogTitle,
  IconButton,
} from "./styles";

interface ConfirmDeleteModalProps {
  itemName: string;
  onConfirm: () => Promise<void> | void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invalidateQueryKeys?: QueryKey[];
  location?: string;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
}

export function ModalConfirmDelete({
  itemName,
  onConfirm,
  open,
  onOpenChange,
  location,
  title = "Confirmar exclusão",
  description,
  confirmLabel = "Sim, excluir",
  pendingLabel = "Excluindo...",
  invalidateQueryKeys = [],
}: ConfirmDeleteModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsPending(true);
      await onConfirm();
      await Promise.all(
        invalidateQueryKeys.map((key) =>
          queryClient.invalidateQueries({ queryKey: key }),
        ),
      );

      if (location) navigate(location);
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogIcon>
              <AlertTriangle size={22} />
            </DialogIcon>

            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {description ?? (
                  <>
                    Tem certeza que deseja excluir <strong>{itemName}</strong>?
                    <br />
                    Esta ação não pode ser desfeita.
                  </>
                )}
              </DialogDescription>
            </div>
          </DialogHeader>

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
              {isPending ? (
                <>
                  <Loader2 className="spin" size={16} />
                  {pendingLabel}
                </>
              ) : (
                confirmLabel
              )}
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
