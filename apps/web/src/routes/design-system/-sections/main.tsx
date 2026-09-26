import clsx from 'clsx';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 메인·카테고리 페이지 — 화면 페이지 틀(짜임 그림 → 규칙 → 이렇게·하지 않는다 → 관련).
// 그림은 같은 값의 div 다. 실제는 CategoryPage·CategoryGrid·메인 섹션(routes/$locale/-components).

type CardState = 'idle' | 'hover' | 'selected' | 'leaf' | 'wrongSelected';

const CARD_TONE: Record<CardState, string> = {
  idle: 'bg-neutral-100 text-neutral-950',
  hover: 'bg-neutral-200 text-neutral-950',
  selected: 'bg-main-orange-dark text-white',
  leaf: 'bg-neutral-400 text-neutral-950',
  // 쓰지 않는 모양: 선택을 호버와 같은 색으로 칠한다.
  wrongSelected: 'bg-neutral-200 text-neutral-950',
};

function Card({
  title,
  state,
  mark,
  label,
  small = false,
}: {
  title: string;
  state: CardState;
  mark: 'go' | 'expand' | 'collapse';
  label?: string;
  small?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div
        className={clsx(
          'flex flex-col justify-between',
          small ? 'h-24 w-26 p-3' : 'h-32 w-36 p-4',
          CARD_TONE[state],
        )}
      >
        <p className="type-item">{title}</p>
        <div className="flex justify-end">
          {mark === 'go' ? (
            <ArrowRight
              className={clsx('size-6', state === 'hover' && 'translate-x-2.5')}
            />
          ) : mark === 'expand' ? (
            <ChevronDown className="size-6" />
          ) : (
            <ChevronUp className="size-6" />
          )}
        </div>
      </div>
      {label && <p className="type-meta text-neutral-500">{label}</p>}
    </div>
  );
}

function More() {
  return (
    <span className="flex items-center gap-1 type-ui text-main-orange-dark">
      더보기 <ArrowRight />
    </span>
  );
}

export function MainSection() {
  return (
    <>
      <Lead>메인과 카테고리 페이지는 이 사이트에만 있는 화면이다.</Lead>

      <DocSection title="카테고리 머리">
        <Example
          tone="dark"
          caption="영어 부제 위, 큰 제목 아래. 설명 문구는 데스크톱은 제목 아래, 모바일은 카드 띠 아래."
        >
          <div className="px-2 py-4">
            <p className="mb-2 type-section font-normal text-neutral-500">
              Meet CSE
            </p>
            <p className="type-display text-white">소개</p>
          </div>
        </Example>
        <RuleList
          items={[
            '큰 제목 글자(type-display)는 카테고리 머리에만 쓴다.',
            '영어 부제는 큰 제목 위에 흐린 회색으로 둔다.',
            '설명 문구는 데스크톱에서 제목 아래, 모바일에서 카드 띠 아래에 둔다.',
          ]}
        />
      </DocSection>

      <DocSection title="카테고리 카드">
        <Example
          tone="dark"
          caption="기본 · 호버 · 펼치는 카드 · 펼침 · 하위 카드"
        >
          <Card title="학부 소개" state="idle" mark="go" label="기본" />
          <Card title="학부 소개" state="hover" mark="go" label="호버" />
          <Card title="학부" state="idle" mark="expand" label="펼치는 카드" />
          <Card title="학부" state="selected" mark="collapse" label="펼침" />
          <Card title="학사 일정" state="leaf" mark="go" label="하위 카드" />
        </Example>
        <RuleList
          items={[
            '오른쪽 아래 표시로 누르면 무엇이 되는지 보인다 — 페이지로 가면 →, 하위 카드를 펼치면 ⌄, 펼친 카드는 ⌃.',
            '호버는 바탕이 한 단계 진해지고 화살표가 오른쪽으로 민다. 펼친 카드는 짙은 주황에 흰 글자.',
            '펼친 하위 카드는 더 짙은 회색으로 위 카드 줄 아래에 같은 간격으로 잇는다.',
            '제목 아래에 영어 이름을 둔다.',
            '모바일은 두 칸이 폭을 똑같이 나눈다. 띄어쓰기 없는 긴 제목은 "(" 앞에서 줄을 바꾼다.',
          ]}
        />
      </DocSection>

      <DocSection title="메인 — 더보기">
        <Example caption="밝은 띠와 어두운 판에서 같은 모양.">
          <More />
          <span className="bg-neutral-850 p-3">
            <More />
          </span>
        </Example>
        <RuleList
          items={[
            '새 소식·공지의 "더보기"는 한 모양이다 — 글자 뒤 오른쪽 화살표, 짙은 주황 글자.',
            '다른 화면에서 목록·모음으로 보내는 글자 링크도 이 모양을 쓴다(연구실 상세의 스트림 링크).',
          ]}
        />
      </DocSection>

      <DocSection title="메인 — 슬로건">
        <RuleList
          items={[
            '슬로건은 네 줄이다. 데스크톱은 네 줄을 다 보이고, 모바일은 첫 줄을 빼고 세 줄만 보인다.',
            '문구를 바꿀 때는 첫 줄이 빠져도 문장이 되고, 한 줄이 모바일 폭에 들어가게 고른다(영어는 약 24자).',
          ]}
        />
      </DocSection>

      <DocSection title="메인 — 간격">
        <RuleList
          items={[
            '히어로 문구·원과 막대 그래픽·공지 판 뒤 그래픽의 크기와 자리는 그래픽이라 자기 값을 쓴다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <div className="flex gap-3 bg-neutral-900 p-3">
                <Card title="학부" state="selected" mark="collapse" small />
                <Card title="대학원" state="hover" mark="expand" small />
              </div>
            ),
            caption: '펼친 카드는 짙은 주황 — 호버와 한눈에 구분된다.',
          }}
          bad={{
            example: (
              <div className="flex gap-3 bg-neutral-900 p-3">
                <Card
                  title="학부"
                  state="wrongSelected"
                  mark="collapse"
                  small
                />
                <Card title="대학원" state="hover" mark="expand" small />
              </div>
            ),
            caption:
              '펼친 카드를 호버와 같은 색으로 칠한다 — 무엇을 골랐는지 모른다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['unique', '고유 화면'],
            ['page', '페이지 틀'],
            ['spacing', '간격'],
            ['graphic', '그래픽'],
          ]}
        />
      </DocSection>
    </>
  );
}
