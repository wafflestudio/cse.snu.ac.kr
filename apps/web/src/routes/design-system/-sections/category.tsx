import clsx from 'clsx';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import {
  DeviceToggle,
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
} from '../-components/doc';
import { LegacyCategoryGrid } from '../-legacy/CategoryGrid';

// 카테고리 페이지(최상위 메뉴 화면). 머리는 같은 값의 div 도식이다. 카드는 CategoryGrid 안 CategoryItem 과
// 같은 클래스의 진짜 <button> 이라 호버·초점·화살표 움직임이 그대로다(CategoryItem 은 내보내지 않고, 격자는
// 메뉴 정의·라우터 이동에 묶여 있어 다시 그린다). 누르면 펼치는 카드만 펼침 상태가 되고 이동은 하지 않는다.
// 실제 카드는 창 폭(sm:)으로 크기를 바꾸지만 여기서는 모바일·데스크톱 크기를 각각 고정해 그린다.

type Tone = 'root' | 'selected' | 'leaf';

// CategoryGrid 의 TONE_CLASS 와 같은 값.
const TONE_CLASS: Record<Tone, string> = {
  root: 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200',
  selected: 'bg-main-orange-dark text-white',
  leaf: 'bg-neutral-400 text-neutral-950 hover:bg-neutral-500',
};

// "Participants(Professors)"처럼 띄어쓰기 없는 긴 제목은 "(" 앞에서만 줄을 바꾼다.
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

function Card({
  title,
  tone,
  hasArrow,
  desktop = false,
  forceHover = false,
  className,
  onClick,
}: {
  title: string;
  tone: Tone;
  hasArrow: boolean;
  desktop?: boolean;
  // 상태 견본용: 호버 바탕을 고정해 보여 준다.
  forceHover?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={clsx(
        'group flex cursor-pointer flex-col justify-between duration-300',
        desktop ? 'h-40 p-6' : 'h-24 p-4',
        forceHover ? 'bg-neutral-200 text-neutral-950' : TONE_CLASS[tone],
        className,
      )}
      onClick={onClick}
      aria-expanded={hasArrow ? undefined : tone === 'selected'}
    >
      <div>
        <h3 className="mb-2 type-item text-start">{breakBeforeParen(title)}</h3>
      </div>
      <div className="flex justify-end">
        {hasArrow ? (
          <ArrowRight
            className={clsx(
              'duration-300 group-hover:translate-x-2.5',
              desktop ? 'size-8' : 'size-5',
            )}
          />
        ) : tone === 'selected' ? (
          <ChevronUp className={desktop ? 'size-8' : 'size-5'} />
        ) : (
          <ChevronDown className={desktop ? 'size-8' : 'size-5'} />
        )}
      </div>
    </button>
  );
}

// CategoryGrid 의 뿌리 격자(모바일 크기). 펼치는 카드(화살표 없음)를 누르면 펼침이 된다.
function MiniGrid({
  items,
  initialSelected,
}: {
  items: { title: string; hasArrow: boolean }[];
  initialSelected?: string;
}) {
  const [selected, setSelected] = useState(initialSelected);
  return (
    <div className="surface-dark w-full bg-neutral-900 p-5">
      <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-6">
        {items.map((item) => (
          <Card
            key={item.title}
            title={item.title}
            hasArrow={item.hasArrow}
            tone={selected === item.title ? 'selected' : 'root'}
            onClick={() => !item.hasArrow && setSelected(item.title)}
          />
        ))}
      </div>
    </div>
  );
}

// 상태 견본 한 칸: 모바일 카드 폭(약 160) + 아래 이름.
function CardState({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-40 flex-col gap-1 *:first:w-full">
      {children}
      <p className="type-meta text-neutral-500">{label}</p>
    </div>
  );
}

const EXPAND_ITEMS = [
  { title: '학부', hasArrow: false },
  { title: '대학원', hasArrow: false },
];

const MARK_ITEMS = [
  { title: '입학 소개', hasArrow: true },
  { title: '학부', hasArrow: false },
];

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

function CardsLayout({ mobile }: { mobile: boolean }) {
  return (
    <div
      className={clsx(
        'surface-dark bg-neutral-900',
        // 모바일 틀은 실제 폭(390)보다 좁을 수 있어 띠 여백을 줄여 그린다.
        mobile
          ? 'grid grid-cols-[repeat(2,minmax(0,1fr))] gap-6 p-4'
          : 'grid grid-cols-[repeat(auto-fill,300px)] gap-8 p-6',
      )}
    >
      {TENTEN.map((title) => (
        <Card
          key={title}
          title={title}
          tone="root"
          hasArrow
          desktop={!mobile}
          className={mobile ? 'min-w-0' : 'max-w-full'}
        />
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
          <CardState label="기본">
            <Card title="학부 소개" tone="root" hasArrow />
          </CardState>
          <CardState label="호버">
            <Card title="학부 소개" tone="root" hasArrow forceHover />
          </CardState>
          <CardState label="펼치는 카드">
            <Card title="학부" tone="root" hasArrow={false} />
          </CardState>
          <CardState label="펼침">
            <Card title="학부" tone="selected" hasArrow={false} />
          </CardState>
          <CardState label="하위 카드">
            <Card title="학사 일정" tone="leaf" hasArrow />
          </CardState>
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
            example: <MiniGrid items={EXPAND_ITEMS} initialSelected="학부" />,
            caption:
              '펼친 카드는 짙은 주황이고 호버는 한 단계 짙은 회색이라 한눈에 구분됩니다.',
          }}
          bad={{
            example: (
              <LegacyCategoryGrid items={EXPAND_ITEMS} initialSelected="학부" />
            ),
            caption:
              '예전에는 펼친 카드와 호버가 같은 짙은 주황이라 무엇을 펼쳤는지 알 수 없었습니다.',
          }}
        />
        <DoDont
          good={{
            example: <MiniGrid items={MARK_ITEMS} />,
            caption: '이동하는 카드는 →, 펼치는 카드는 ⌄로 구분합니다.',
          }}
          bad={{
            example: <LegacyCategoryGrid items={MARK_ITEMS} />,
            caption:
              '예전 입학·학사의 펼치는 카드에는 기호가 없어 누를 수 있는 카드인지 알 수 없었습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
