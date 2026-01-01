import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useEffect, useRef } from 'react';
import Button from './Button';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  confirmText?: string;
  onConfirm: () => void;
}

export default function AlertDialog({
  open,
  onOpenChange,
  title = '확인',
  description,
  confirmText = '확인',
  onConfirm,
}: AlertDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmButtonRef.current?.focus();
    }
  }, [open]);

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white px-10 py-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <VisuallyHidden.Root>
            <AlertDialogPrimitive.Title>{title}</AlertDialogPrimitive.Title>
          </VisuallyHidden.Root>
          <AlertDialogPrimitive.Description className="mb-6 mt-1 text-neutral-800">
            {description}
          </AlertDialogPrimitive.Description>
          <div className="flex justify-end gap-3">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="outline" tone="neutral">
                취소
              </Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                ref={confirmButtonRef}
                variant="solid"
                tone="inverse"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
