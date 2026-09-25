import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';

interface Props {
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: () => Promise<void>;
  submitLabel?: string;
}

export default function Action({
  onCancel,
  onDelete,
  onSubmit,
  submitLabel,
}: Props) {
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const label = submitLabel ?? '저장하기';

  return (
    <>
      {/* [삭제] ……… [오류] [취소] [저장] — 삭제는 저장과 멀리 왼쪽 끝에 둔다. */}
      <div className="mb-6 flex items-center gap-3">
        {onDelete && (
          <Button
            variant="secondary"
            disabled={isSubmitting}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setShowDeleteDialog(true);
            }}
          >
            삭제
          </Button>
        )}
        <div className="ml-auto flex items-center justify-end gap-3">
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
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            pending={isSubmitting}
            pendingLabel={pendingLabelOf(label)}
            onClick={onSubmit}
          >
            {label}
          </Button>
        </div>
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

const PENDING_LABELS: Record<string, string> = {
  저장하기: '저장 중…',
  게시하기: '게시 중…',
  등록하기: '등록 중…',
};

const pendingLabelOf = (label: string) => PENDING_LABELS[label] ?? '처리 중…';

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
    <ul className="type-meta text-red-600 space-y-1">
      {errorMessages.map((message, idx) => (
        <li key={idx}>{message}</li>
      ))}
    </ul>
  );
};
