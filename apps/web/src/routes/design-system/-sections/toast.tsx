import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/sonner';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

export function ToastSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="띄워 보기">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => toast.success('게시물을 저장했습니다.')}
          >
            성공
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.error('저장하지 못했습니다.', {
                description: '잠시 후 다시 시도해 주세요.',
              })
            }
          >
            실패
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info('로그인이 필요합니다.')}
          >
            안내
          </Button>
        </div>
        <p className="type-meta text-neutral-500">
          화면 아래 오른쪽(모바일은 아래)에 뜬다.
        </p>
      </Sub>

      <Sub title="모양">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            판: 흰 바탕, 테두리 neutral-200, 그림자 overlay(떠 있는 층 한 값),
            모서리 없음, 안 여백 16.
          </li>
          <li>글자: 문장 14/500 neutral-950, 설명 13 neutral-600(위 4).</li>
          <li>
            아이콘: lucide — 성공 <code>CircleCheck</code> 검정, 실패{' '}
            <code>CircleAlert</code> red-600(오류 색), 안내 <code>Info</code>{' '}
            회색(<code>TOAST_ICONS</code>). 상태는 아이콘이 알리고 판 색은
            하나다.
          </li>
          <li>
            Sonner는 strict CSP 때문에 소스를 <code>ui/sonner/</code>에 복사해
            쓴다(스타일을 실행 중에 주입하지 않고 CSS 파일로 불러온다). 모양은
            그 복사본의 <code>styles.css</code>에서 고친다.
          </li>
          <li>
            API 실패는 <code>toast.error</code> 대신 <code>toastError</code>
            (문구를 오류 사전이 정한다). 성공 문구는 문구 절을 따른다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
