import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import Button from './Button';
import { OVERLAY_CLASS, PANEL_CLASS, PANEL_SIZE } from './dialogStyle';

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  /** 실행 버튼 — 하는 일을 적는다(삭제·나가기). "확인"으로 대신하지 않도록 기본값을 두지 않는다. */
  confirmText: string;
  onConfirm: () => void;
}

export default function AlertDialog({
  open,
  onOpenChange,
  title = '확인',
  description,
  confirmText,
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
        <AlertDialogPrimitive.Overlay className={OVERLAY_CLASS} />
        <AlertDialogPrimitive.Content
          className={clsx(PANEL_CLASS, PANEL_SIZE.sm)}
        >
          <VisuallyHidden.Root>
            <AlertDialogPrimitive.Title>{title}</AlertDialogPrimitive.Title>
          </VisuallyHidden.Root>
          {/* 둘째 문장(되돌릴 수 없습니다 등)은 \n 으로 줄을 나눈다. */}
          <AlertDialogPrimitive.Description className="whitespace-pre-line type-body text-neutral-950">
            {description}
          </AlertDialogPrimitive.Description>
          {/* 확인창에는 닫기 X 가 없다 — 취소가 닫기. 실행 버튼은 하는 일을 적는다(삭제·나가기). */}
          <div className="mt-8 flex justify-end gap-3">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="secondary">취소</Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button
                ref={confirmButtonRef}
                variant="primary"
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
