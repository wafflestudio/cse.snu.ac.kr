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
      {/* [삭제] ……… [오류] [취소] [저장] — 삭제는 저장과 멀리 왼쪽 끝에 둔다.
          위는 마지막 필드의 24 + 여기 24 = 48(묶음 사이) — 버튼 줄이 필드 하나처럼 붙어 보이지 않게. */}
      <div className="mt-6 mb-6 flex items-center gap-3">
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
    }

    return messages;
  };

  // 문장은 필드 바로 아래에 있고, 여기에는 개수만 둔다 — 긴 폼에서 위쪽 오류를 놓치지 않게.
  const count = flattenErrors(errors).length || Object.keys(errors).length;

  if (count === 0) {
    return null;
  }

  return (
    <p className="type-meta text-red-600">확인할 항목이 {count}개 있습니다.</p>
  );
};
