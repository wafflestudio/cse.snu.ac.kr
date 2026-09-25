import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from './Button';
import { OVERLAY_CLASS, PANEL_CLASS, PANEL_SIZE } from './dialogStyle';

// 제목은 판이 20/700 으로 그린다. 내용이 자기 제목을 가진 판(상세·팀 소개)만 hideTitle.
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  hideTitle?: boolean;
  size?: 'md' | 'lg';
  children: ReactNode;
}

export default function Dialog({
  open,
  onOpenChange,
  title,
  hideTitle = false,
  size = 'md',
  children,
}: DialogProps) {
  const titleNode = (
    <DialogPrimitive.Title className="mb-6 pr-8 type-section">
      {title}
    </DialogPrimitive.Title>
  );
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={OVERLAY_CLASS} />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={clsx(PANEL_CLASS, PANEL_SIZE[size])}
        >
          {hideTitle ? (
            <VisuallyHidden.Root>{titleNode}</VisuallyHidden.Root>
          ) : (
            titleNode
          )}
          <div className="absolute top-4 right-4">
            <DialogPrimitive.Close asChild>
              <Button variant="text" ariaLabel="닫기">
                <X className="size-5" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
