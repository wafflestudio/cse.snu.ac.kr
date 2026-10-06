import clsx from 'clsx';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DeviceToggle,
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
} from '../-components/doc';

// 카테고리 페이지(최상위 메뉴 화면). 그림은 같은 값의 div 다. 실제는 components/feature/category 의
// CategoryPage·CategoryGrid 이고, 머리·카드의 크기·간격·색은 그쪽이 정한다.

type CardState = 'idle' | 'hover' | 'selected' | 'leaf';

const CARD_TONE: Record<CardState, string> = {
  idle: 'bg-neutral-100 text-neutral-950',
  hover: 'bg-neutral-200 text-neutral-950',
  selected: 'bg-main-orange-dark text-white',
  leaf: 'bg-neutral-400 text-neutral-950',
};

function Card({
  title,
  tone,
  mark,
  label,
  small = false,
}: {
  title: string;
  tone: string;
  mark: 'go' | 'expand' | 'collapse' | 'none';
  label?: string;
  small?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div
        className={clsx(
          'flex flex-col justify-between',
          small ? 'h-24 w-26 p-3' : 'h-32 w-36 p-4',
          tone,
        )}
      >
        <p className="type-item">{title}</p>
        <div className="flex h-6 justify-end">
          {mark === 'go' && <ArrowRight className="size-6" />}
          {mark === 'expand' && <ChevronDown className="size-6" />}
          {mark === 'collapse' && <ChevronUp className="size-6" />}
        </div>
      </div>
      {label && <p className="type-meta text-neutral-500">{label}</p>}
    </div>
  );
}

const DESCRIPTION =
  '컴퓨터공학부는 컴퓨터 기술의 진화를 선도할 인재를 양성합니다.';

// 카드 띠 자리. 머리 그림에서는 카드 모양이 아니라 위치만 보인다.
function CardBand({ mobile }: { mobile: boolean }) {
  return (
    <div
      className={clsx(
        'grid gap-3 bg-neutral-900',
        mobile ? 'grid-cols-2 p-4' : 'grid-cols-[repeat(3,6rem)] p-6',
      )}
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-12 bg-neutral-100" />
      ))}
    </div>
  );
}

function HeadLayout({ mobile }: { mobile: boolean }) {
  const description = (
    <p
      className={clsx(
        'max-w-160 type-body',
        mobile ? 'px-4 pt-6 pb-8 text-neutral-400' : 'mt-6 text-neutral-100',
      )}
    >
      {DESCRIPTION}
    </p>
  );
  return (
    <div className="bg-neutral-850">
      <div className={mobile ? 'px-4 py-6' : 'px-6 pt-8 pb-8'}>
        <p
          className={clsx(
            'mb-2 text-neutral-500',
            mobile ? 'type-ui' : 'type-section font-normal',
          )}
        >
          Meet CSE
        </p>
        <p className="type-display text-white">소개</p>
        {!mobile && description}
      </div>
      <CardBand mobile={mobile} />
      {mobile && description}
    </div>
  );
}

const TENTEN = ['Proposal', 'Manager', 'Participants(Professors)'];

// 띄어쓰기 없는 긴 제목은 "(" 앞에서만 줄을 바꾼다.
function breakBeforeParen(text: string) {
  const i = text.indexOf('(');
  if (i <= 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <wbr />
      {text.slice(i)}
    </>
  );
}

function CardsLayout({ mobile }: { mobile: boolean }) {
  return (
    <div
      className={clsx(
        'bg-neutral-900',
        // 모바일 틀은 실제 폭(390)보다 좁을 수 있어 띠 여백·간격을 줄여 그린다.
        mobile ? 'grid grid-cols-2 gap-3 p-3' : 'flex flex-wrap gap-8 p-6',
      )}
    >
      {TENTEN.map((title) => (
        <div
          key={title}
          className={clsx(
            'flex flex-col justify-between bg-neutral-100 text-neutral-950',
            mobile ? 'min-h-24 min-w-0 p-3' : 'h-40 w-75 max-w-full p-6',
          )}
        >
          <p className="type-item">{breakBeforeParen(title)}</p>
          <div className="flex justify-end">
            <ArrowRight className={mobile ? 'size-5' : 'size-8'} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategorySection() {
  return (
    <>
      <Lead>
        카테고리 페이지는 최상위 메뉴(소개·구성원·연구 등)의 하위 페이지를
        카드로 펼쳐 보여 줍니다.
      </Lead>

      <DocSection title="머리">
        <DeviceToggle
          caption="영어 부제 위에 큰 제목. 설명 문구는 데스크톱에서 제목 아래, 모바일에서 카드 아래에 놓입니다."
          desktop={<HeadLayout mobile={false} />}
          mobile={<HeadLayout mobile />}
        />
      </DocSection>

      <DocSection title="카드">
        <Example
          tone="dark"
          caption="기본 · 호버 · 펼치는 카드 · 펼침 · 하위 카드"
        >
          <Card
            title="학부 소개"
            tone={CARD_TONE.idle}
            mark="go"
            label="기본"
          />
          <Card
            title="학부 소개"
            tone={CARD_TONE.hover}
            mark="go"
            label="호버"
          />
          <Card
            title="학부"
            tone={CARD_TONE.idle}
            mark="expand"
            label="펼치는 카드"
          />
          <Card
            title="학부"
            tone={CARD_TONE.selected}
            mark="collapse"
            label="펼침"
          />
          <Card
            title="학사 일정"
            tone={CARD_TONE.leaf}
            mark="go"
            label="하위 카드"
          />
        </Example>
        <DeviceToggle
          caption="데스크톱은 폭 300 카드가 줄을 채우고, 모바일은 두 칸이 폭을 똑같이 나눕니다. 띄어쓰기 없는 긴 제목은 “(” 앞에서 줄을 바꿉니다."
          desktop={<CardsLayout mobile={false} />}
          mobile={<CardsLayout mobile />}
        />
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '카드 오른쪽 아래 기호가 누르면 일어날 일을 알립니다(이동 →, 펼치기 ⌄, 펼침 ⌃). 기호가 없으면 누를 수 있는 카드인지 알 수 없습니다.',
            '가장 큰 제목은 카테고리 머리에만 씁니다. 메뉴의 맨 위라는 표시라 다른 화면에서 쓰면 위계가 흐려집니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <div className="flex gap-3 bg-neutral-900 p-3">
                <Card
                  title="학부"
                  tone={CARD_TONE.selected}
                  mark="collapse"
                  small
                />
                <Card
                  title="대학원"
                  tone={CARD_TONE.hover}
                  mark="expand"
                  small
                />
              </div>
            ),
            caption: '펼친 카드는 짙은 주황이라 호버와 한눈에 구분됩니다.',
          }}
          bad={{
            example: (
              <div className="flex gap-3 bg-neutral-900 p-3">
                <Card
                  title="학부"
                  tone={CARD_TONE.hover}
                  mark="collapse"
                  small
                />
                <Card
                  title="대학원"
                  tone={CARD_TONE.hover}
                  mark="expand"
                  small
                />
              </div>
            ),
            caption:
              '예전에는 펼친 카드와 호버가 같은 색이라 무엇을 펼쳤는지 알 수 없었습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <div className="flex gap-3 bg-neutral-900 p-3">
                <Card title="입학 소개" tone={CARD_TONE.idle} mark="go" small />
                <Card title="학부" tone={CARD_TONE.idle} mark="expand" small />
              </div>
            ),
            caption: '이동하는 카드는 →, 펼치는 카드는 ⌄로 구분합니다.',
          }}
          bad={{
            example: (
              <div className="flex gap-3 bg-neutral-900 p-3">
                <Card title="입학 소개" tone={CARD_TONE.idle} mark="go" small />
                <Card title="학부" tone={CARD_TONE.idle} mark="none" small />
              </div>
            ),
            caption:
              '예전 입학·학사의 펼치는 카드에는 기호가 없어 누를 수 있는 카드인지 알 수 없었습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
