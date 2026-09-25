import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

const ROLES: [string, 'primary' | 'secondary' | 'text', string, string][] = [
  [
    '주요',
    'primary',
    '저장',
    '추가·새 글·저장·게시·등록·예약, 확인창의 실행(확인·삭제)',
  ],
  [
    '보조',
    'secondary',
    '취소',
    '편집·취소·목록·해제, 폼·상세의 삭제(확인창을 연다)',
  ],
  [
    '텍스트',
    'text',
    '더보기',
    '밝은 면의 글자 버튼(더보기·검색 실행 아이콘·파일 지우기)',
  ],
];

export function ButtonSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="역할">
        <p>
          행동은 회색이다(1-2 강조 규칙). 주황 채움 버튼은 쓰지 않는다. 어떤
          버튼을 쓸지는 행동의 종류로 정한다. 글자로 된 누를 수 있는
          것(링크·텍스트 버튼·아이콘 버튼)은 호버하면 주황, 누르면 짙은
          주황이다. 채운 버튼은 면 색이 바뀐다. 현재 위치·선택은 주황에 굵게를
          더해 호버와 구분한다.
        </p>
        <div className="max-w-3xl divide-y divide-neutral-200 border-y border-neutral-200">
          {ROLES.map(([name, v, label, use]) => (
            <div
              key={name}
              className="grid items-center gap-2 py-4 sm:grid-cols-[120px_120px_1fr] sm:gap-6"
            >
              <p className="type-label">{name}</p>
              <div>
                <Button variant={v}>{label}</Button>
              </div>
              <p className="type-meta text-neutral-500">{use}</p>
            </div>
          ))}
          <div className="grid items-center gap-2 py-4 sm:grid-cols-[120px_120px_1fr] sm:gap-6">
            <p className="type-label">텍스트(어두운 면)</p>
            <div className="bg-neutral-900 px-3 py-2">
              <Button variant="textInverse">로그인</Button>
            </div>
            <p className="type-meta text-neutral-500">
              헤더·모바일 메뉴의 글자 버튼
            </p>
          </div>
        </div>
        <p className="type-meta text-neutral-500">
          정리 전: "추가"가 주황 9·짙은 회색 7·연한 회색 1곳, 폼의 삭제가 저장과
          같은 짙은 색, 목록이 짙은 색.
        </p>
      </Sub>

      <Sub title="상태·크기">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">기본</Button>
          <span className="type-meta text-neutral-500">
            → 호버 600, 누름 500
          </span>
          <Button variant="primary" disabled>
            비활성
          </Button>
          <Button variant="primary" pending pendingLabel="저장 중…">
            저장
          </Button>
          <Button variant="secondary" size="sm">
            작게
          </Button>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            호버·누름은 버튼마다 중간 회색 쪽으로 한 단계씩 간다: 주요
            700→600→500(밝아짐), 보조 100→200→300(진해짐). 짙은 버튼이 더
            진해지면 변화가 보이지 않는다.
          </li>
          <li>
            처리 중에는 버튼 글자를 "저장 중… / 게시 중… / 삭제 중…"으로 바꾸고
            누를 수 없게 한다(<code>pending</code>·<code>pendingLabel</code>).
            평소엔 원래 폭이고, 처리 중 글자가 더 길면 그때만 늘어난다.
          </li>
          <li>크기는 보통(34px)과 작게(24px, 표·목록 안의 일괄 버튼) 둘.</li>
          <li>
            버튼 글자는 줄바꿈하지 않고, 버튼은 줄어들지 않는다. 자리가 모자라면
            버튼 줄이 통째로 다음 줄로 내려간다(오른쪽 정렬 유지).
          </li>
          <li>
            아이콘만 든 채운 버튼은 <code>iconOnly</code>로 높이와 같은 폭의
            정사각형이 된다. <code>ariaLabel</code>이 필수다.
          </li>
        </ul>
      </Sub>

      <Sub title="버튼 줄">
        <ul className="list-disc space-y-1 pl-5">
          <li>오른쪽 정렬, 버튼 사이 12px. 주요 버튼이 맨 오른쪽이다.</li>
          <li>
            폼 하단 줄에서 삭제는 왼쪽 끝으로 떼어 놓는다: [삭제] ……… [취소]
            [저장]. 저장과 멀리 두어 잘못 누르지 않게 한다.
          </li>
          <li>
            상세의 관리 버튼은 [삭제] [편집] 순서로 모두 보조. 게시물은 그 뒤에
            [목록](보조).
          </li>
          <li>목록 위의 추가·새 글 버튼은 목록 오른쪽 위에 둔다.</li>
        </ul>
      </Sub>

      <Sub title="버튼이 아닌 것">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            누르는 모양은 Button으로만 만든다. 클래스로 버튼을 직접 그리지 않고,
            Button에 <code>className</code>을 덧붙이지 않는다.
          </li>
          <li>
            교수 정렬·필터 알약은 선택 컨트롤(2-3), 이미지 팝업 버튼은
            모달(2-4), 날짜·파일 선택은 입력(2-2)이다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
