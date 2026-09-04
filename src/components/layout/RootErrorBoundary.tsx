import { HeadContent, Scripts, useNavigate } from '@tanstack/react-router';
import Header from '@/components/layout/Header';
import ErrorState from '@/components/ui/ErrorState';
import { useLanguage } from '@/hooks/useLanguage';

/** 던져진 Response류({ status, statusText }) 판별. */
function isErrorResponse(
  error: unknown,
): error is { status: number; statusText: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'status' in error &&
    'statusText' in error
  );
}

export default function RootErrorBoundary({ error }: { error: unknown }) {
  const { t, localizedPath } = useLanguage({
    '메인으로 이동': 'Go to home',
    '문제가 생겼습니다. 잠시 후 다시 시도해 주세요.':
      'Something went wrong. Please try again shortly.',
  });
  const navigate = useNavigate();
  // 예외 메시지는 내부 경로·쿼리를 드러내므로 화면에 싣지 않는다. 상태 코드만 남긴다.
  const message = isErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : t('문제가 생겼습니다. 잠시 후 다시 시도해 주세요.');
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body className="sm:min-w-[1200px] bg-neutral-900 font-normal text-neutral-950">
        <Header />
        <ErrorState
          title="500"
          message={`Error: ${message}`}
          action={{
            label: t('메인으로 이동'),
            onClick: () => navigate({ to: localizedPath('/') }),
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
