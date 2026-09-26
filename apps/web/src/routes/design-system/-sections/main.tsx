import clsx from 'clsx';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

// 카테고리·메인 조각을 같은 값의 div 로 그린다. 실제는 CategoryPage·CategoryGrid·메인 섹션(routes/$locale/-components).

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

type CardState = 'idle' | 'hover' | 'selected' | 'leaf';

const CARD_TONE: Record<CardState, string> = {
  idle: 'bg-neutral-100 text-neutral-950',
  hover: 'bg-neutral-200 text-neutral-950',
  selected: 'bg-main-orange-dark text-white',
  leaf: 'bg-neutral-400 text-neutral-950',
};

const CARD_LABEL: Record<CardState, string> = {
  idle: '기본',
  hover: '호버',
  selected: '펼침',
  leaf: '하위 카드',
};

function Card({
  title,
  state,
  mark,
}: {
  title: string;
  state: CardState;
  mark: 'go' | 'expand' | 'collapse';
}) {
  return (
    <div className="space-y-1">
      <div
        className={clsx(
          'flex h-40 w-44 flex-col justify-between p-6',
          CARD_TONE[state],
        )}
      >
        <p className="type-item">{title}</p>
        <div className="flex justify-end">
          {mark === 'go' ? (
            <ArrowRight
              className={clsx('size-8', state === 'hover' && 'translate-x-2.5')}
            />
          ) : mark === 'expand' ? (
            <ChevronDown className="size-8" />
          ) : (
            <ChevronUp className="size-8" />
          )}
        </div>
      </div>
      <p className="type-meta text-neutral-500">{CARD_LABEL[state]}</p>
    </div>
  );
}

export function MainSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="카테고리 머리 — 큰 제목">
        <div className="max-w-xl bg-neutral-850 px-6 py-8">
          <p className="mb-2 type-section font-normal text-neutral-500">
            Meet CSE
          </p>
          <p className="type-display text-white">소개</p>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            큰 제목은 글자 단계 밖의 표시 크기로, 이 자리에만 쓰는{' '}
            <code>type-display</code>(모바일 32·데스크톱 64, 700)다.
          </li>
          <li>
            위의 영어 부제(Meet CSE)는 모바일 14·데스크톱 20의 400 neutral-500 —{' '}
            <code>type-ui</code> / <code>type-section</code> 크기.
          </li>
          <li>
            설명 문구가 있으면 데스크톱은 제목 아래(neutral-100, 폭 최대 640),
            모바일은 카드 띠 아래(neutral-400)에 둔다.
          </li>
        </ul>
      </Sub>

      <Sub title="카테고리 카드 — 호버와 선택을 나눈다">
        <div className="flex flex-wrap gap-4 bg-neutral-900 p-6">
          <Card title="학부 소개" state="idle" mark="go" />
          <Card title="학부 소개" state="hover" mark="go" />
          <Card title="학부" state="idle" mark="expand" />
          <Card title="학부" state="selected" mark="collapse" />
          <Card title="학사 일정" state="leaf" mark="go" />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            호버는 바탕이 한 단계 진해지고(neutral-100 → 200) 화살표가
            오른쪽으로 민다. 선택(하위 카테고리를 펼친 카드)은 짙은 주황 바탕에
            흰 글자 — 호버와 선택이 같은 색이면 무엇을 골랐는지 구분되지 않는다.
          </li>
          <li>
            펼친 하위 카드는 neutral-400 바탕(호버 500)으로, 위 카드 줄과 같은
            간격을 두고 이어진다.
          </li>
          <li>
            오른쪽 아래 표시로 누르면 무엇이 되는지 보인다: 페이지로 가는 카드는
            →, 아래에 하위 카드를 펼치는 카드(입학·학사의 학부·대학원)는 ⌄, 펼친
            카드는 ⌃. 표시 크기 모바일 20·데스크톱 32.
          </li>
          <li>
            카드 사이 모바일 24·데스크톱 32, 안 여백 16/24, 카드 높이 96/160.
            데스크톱 카드 폭은 300, 모바일은 두 칸이 폭을 똑같이 나눈다.
          </li>
          <li>
            제목(<code>type-item</code>) 아래에 영어 이름(<code>type-body</code>
            ). 띄어쓰기 없는 긴 제목("Participants(Professors)")은 괄호 앞에서
            줄을 바꾼다.
          </li>
        </ul>
      </Sub>

      <Sub title="메인 — 더보기">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-1 type-ui text-main-orange-dark">
            더보기 <ArrowRight />
          </span>
          <span className="flex items-center gap-1 bg-neutral-850 p-3 type-ui text-main-orange-dark">
            더보기 <ArrowRight />
          </span>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            새 소식·공지의 "더보기"는 한 모양이다: 글자 뒤 오른쪽 화살표,{' '}
            <code>type-ui</code> 짙은 주황. 밝은 띠와 어두운 판에서 같다.
          </li>
        </ul>
      </Sub>

      <Sub title="메인 — 간격">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            섹션 사이·띠 안 여백·카드 사이처럼 화면 짜임을 만드는 값은 간격
            단계(간격 절)의 값만 쓴다.
          </li>
          <li>
            히어로 문구·원과 막대 그래픽·공지 판 뒤 그래픽의 크기와 자리(
            <code>w-[61.15rem]</code> 같은 %·rem 값)는 그래픽이라 자기 값을
            쓴다(그래픽 절).
          </li>
        </ul>
      </Sub>
    </div>
  );
}
