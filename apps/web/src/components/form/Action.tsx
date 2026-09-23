import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: () => Promise<void>;
  submitLabel?: string;
  pendingLabel?: string;
}

export default function Action({
  onCancel,
  onDelete,
  onSubmit,
  submitLabel = '저장하기',
  pendingLabel = '저장 중…',
}: Props) {
  const { t, tUnsafe } = useLanguage({
    취소: 'Cancel',
    삭제: 'Delete',
    저장하기: 'Save',
    게시하기: 'Publish',
    등록하기: 'Add',
    '변경사항 저장': 'Save changes',
    '저장 중…': 'Saving…',
    '게시 중…': 'Publishing…',
    '등록 중…': 'Adding…',
  });
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="relative mb-6 flex items-center justify-end gap-3">
        <ErrorMessages />
        <Button
          variant="secondary"
          disabled={isSubmitting}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            if (isDirty) {
              setShowCancelDialog(true);
            } else {
              onCancel();
            }
          }}
        >
          {t('취소')}
        </Button>
        {onDelete && (
          <Button
            variant="neutral"
            disabled={isSubmitting}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setShowDeleteDialog(true);
            }}
          >
            {t('삭제')}
          </Button>
        )}
        <Button
          type="submit"
          variant="neutral"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          <span className="grid">
            <span
              aria-hidden="true"
              className="invisible col-start-1 row-start-1"
            >
              {tUnsafe(submitLabel)}
            </span>
            <span className="col-start-1 row-start-1">
              {tUnsafe(isSubmitting ? pendingLabel : submitLabel)}
            </span>
          </span>
        </Button>
      </div>

      <AlertDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        description="편집중인 내용이 사라집니다."
        onConfirm={() => {
          onCancel();
          setShowCancelDialog(false);
        }}
      />

      {onDelete && (
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          description="게시물을 삭제하시겠습니까?"
          onConfirm={async () => {
            await onDelete();
            setShowDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}

const ErrorMessages = () => {
  const {
    formState: { errors },
  } = useFormContext();

  const flattenErrors = (
    errorObj: unknown,
    visited = new WeakSet<object>(),
  ): string[] => {
    const messages: string[] = [];

    if (!errorObj || typeof errorObj !== 'object') {
      return messages;
    }

    // 순환 참조 방지: 이미 방문한 객체는 건너뛰기
    if (visited.has(errorObj as object)) {
      return messages;
    }
    visited.add(errorObj as object);

    // message 속성이 있으면 메시지 추가
    if ('message' in errorObj && errorObj.message) {
      messages.push(String(errorObj.message));
    }

    // 객체의 모든 값들을 재귀적으로 순회
    for (const [key, value] of Object.entries(errorObj)) {
      // react hook form에서 ref도 관리한다
      // ref를 도는 것 방지
      if (key === 'ref') continue;
      if (value && typeof value === 'object') {
        messages.push(...flattenErrors(value, visited));
      }
      if (messages.length > 5) break;
    }

    return messages;
  };

  const errorMessages = flattenErrors(errors);

  if (errorMessages.length === 0) {
    return null;
  }

  return (
    <ul className="text-sm font-normal text-red-600 space-y-1">
      {errorMessages.map((message, idx) => (
        <li key={idx}>{message}</li>
      ))}
    </ul>
  );
};
