import Button from './Button';

// 오류 화면(/design-system/list): 다른 페이지와 같은 틀 — 어두운 제목 영역(상태 코드·제목) + 흰 본문.
interface ErrorAction {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface ErrorStateProps {
  code: string;
  title: string;
  message?: string; // 제목과 겹치면 쓰지 않는다
  detail?: string; // 요청 주소·상태 문구(13px)
  actions: ErrorAction[];
}

export default function ErrorState({
  code,
  title,
  message,
  detail,
  actions,
}: ErrorStateProps) {
  return (
    <div className="surface-dark flex grow flex-col bg-neutral-900">
      <div className="px-5 pt-12 sm:px-25">
        <div className="mb-6 sm:mb-12">
          <p className="mb-2 type-meta text-neutral-300">{code}</p>
          <h1 className="type-page-title wrap-anywhere text-white">{title}</h1>
        </div>
      </div>
      <div className="grow bg-white page-gutter-x pt-8 pb-16 sm:pt-12 sm:pb-32">
        {message && <p className="type-body">{message}</p>}
        {detail && (
          <p className="type-meta wrap-anywhere text-neutral-500">{detail}</p>
        )}
        <div className="mt-6 flex gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
