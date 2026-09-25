import type { ReactNode } from 'react';

// 제안 단계: 새 variant 가 아직 Button 에 없어 같은 값을 클래스로 그린다. 승인되면 Button 으로 옮긴다.
const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xs type-label transition duration-200';
const SIZE = { md: 'h-8.5 px-4', sm: 'h-6 px-3' };
const V = {
  primary:
    'bg-neutral-700 text-white hover:bg-neutral-600 active:bg-neutral-500',
  secondary:
    'border border-neutral-200 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 active:bg-neutral-300',
  text: 'text-neutral-600 hover:text-main-orange active:text-main-orange-dark',
  textInverse: 'text-white hover:text-main-orange active:text-main-orange-dark',
};

function B({
  v,
  size = 'md',
  children,
  disabled,
}: {
  v: keyof typeof V;
  size?: 'md' | 'sm';
  children: ReactNode;
  disabled?: boolean;
}) {
  const pad = v === 'text' || v === 'textInverse' ? '' : SIZE[size];
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${BASE} ${pad} ${V[v]} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

const ROLES: [string, keyof typeof V, string, string][] = [
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
      <div className="border-l-4 border-main-orange bg-neutral-50 px-4 py-3 type-meta">
        <p className="type-label">제안(미적용)</p>
      </div>

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
                <B v={v}>{label}</B>
              </div>
              <p className="type-meta text-neutral-500">{use}</p>
            </div>
          ))}
          <div className="grid items-center gap-2 py-4 sm:grid-cols-[120px_120px_1fr] sm:gap-6">
            <p className="type-label">텍스트(어두운 면)</p>
            <div className="bg-neutral-900 px-3 py-2">
              <B v="textInverse">로그인</B>
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
          <B v="primary">기본</B>
          <span className="type-meta text-neutral-500">
            → 호버 600, 누름 500
          </span>
          <B v="primary" disabled>
            비활성
          </B>
          <B v="primary" disabled>
            저장 중…
          </B>
          <B v="secondary" size="sm">
            작게
          </B>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            호버·누름은 버튼마다 중간 회색 쪽으로 한 단계씩 간다: 주요
            700→600→500(밝아짐), 보조 100→200→300(진해짐). 짙은 버튼이 더
            진해지면 변화가 보이지 않는다. 누름 상태는 지금 하나도 없다.
          </li>
          <li>
            처리 중에는 버튼 글자를 "저장 중… / 게시 중… / 삭제 중…"으로 바꾸고
            누를 수 없게 한다. 지금은 흐려지기만 하거나 아무 표시가 없다.
          </li>
          <li>
            크기는 보통(34px)과 작게(24px, 표·목록 안의 일괄 버튼) 둘. 쓰이지
            않는 xs·lg는 없앤다.
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

      <Sub title="함께 정리">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            버튼을 직접 만든 곳을 Button으로: 목록 입력의 추가·삭제, 태그
            제안받기, 예약 달력 이전·다음·오늘, 학사 연혁 연도 추가, 페이지
            제목의 현재 경로 버튼.
          </li>
          <li>
            교수 정렬 알약과 필터 알약은 선택 컨트롤이라 2-3, 이미지 팝업 버튼은
            2-4, 날짜·파일 선택은 입력이라 2-2에서 본다.
          </li>
          <li>
            헤더 검색에 임시로 붙인 <code>className</code> 덮어쓰기를 없애고
            텍스트 버튼으로 바꾼다.
          </li>
          <li>오류 화면의 "메인으로 이동"(주황·큰 크기)은 주요·보통으로.</li>
        </ul>
      </Sub>
    </div>
  );
}
