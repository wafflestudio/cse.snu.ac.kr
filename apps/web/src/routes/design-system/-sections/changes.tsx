import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ExternalLink,
  FileText,
  Paperclip,
  Plus,
  Search,
  Square,
  Video,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import { Lead, RuleList, SpecTable } from '../-components/doc';

// 이번 개편(v2)에서 바뀐 것을 영역마다 전후로 모은 기록. 규칙 페이지가 아니다.
// 화면 단위 차이는 .ds-review 의 캡처를 잘라 public/design-system/changes 에 두고,
// 값(색·크기·문구) 차이는 작은 견본으로 다시 그린다. 견본의 "전"은 예전 코드의 값을 그대로 옮긴 것이다.

type Item = {
  title: string;
  why: string;
  before: ReactNode;
  after: ReactNode;
  wide?: boolean; // 넓은 캡처는 전·후를 위아래로 쌓는다
};

type Area = {
  id: string;
  title: string;
  doc?: string; // 규칙 페이지 id
  items: Item[];
  extras?: string[];
};

type Group = { title: string; areas: Area[] };

// ── 캡처 ──────────────────────────────────────────────────────────

function Shot({
  name,
  side,
  w,
  h,
  alt,
}: {
  name: string;
  side: 'before' | 'after';
  w: number;
  h: number;
  alt: string;
}) {
  const src = `/design-system/changes/${name}-${side}.webp`;
  // 좁은 화면에서는 작게 보이므로 누르면 원래 크기로 연다.
  return (
    <a href={src} className="block w-full" style={{ maxWidth: w }}>
      <img
        src={src}
        width={w}
        height={h}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </a>
  );
}

// 여러 벌이 하나로 모인 변화: 한쪽에 변형 여러 개를 이름과 함께 쌓는다. file 은 확장자 뺀 파일 이름.
type GalleryShot = {
  file: string;
  w: number;
  h: number;
  label: string;
  alt: string;
};

function Gallery({ shots: list }: { shots: GalleryShot[] }) {
  return (
    <div className="grid w-full gap-6">
      {list.map((shot) => {
        const src = `/design-system/changes/${shot.file}.webp`;
        return (
          <div key={shot.file} className="min-w-0">
            <p className="mb-2 type-meta text-neutral-500">{shot.label}</p>
            <a href={src} className="block w-full" style={{ maxWidth: shot.w }}>
              <img
                src={src}
                width={shot.w}
                height={shot.h}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full border border-neutral-100"
              />
            </a>
          </div>
        );
      })}
    </div>
  );
}

// 같은 크기의 전후 캡처 한 쌍.
function shots(
  name: string,
  w: number,
  h: number,
  alts: [before: string, after: string],
  after?: { w: number; h: number },
) {
  return {
    before: <Shot name={name} side="before" w={w} h={h} alt={alts[0]} />,
    after: (
      <Shot
        name={name}
        side="after"
        w={after?.w ?? w}
        h={after?.h ?? h}
        alt={alts[1]}
      />
    ),
  };
}

// ── 견본 ──────────────────────────────────────────────────────────

function OldButton({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'orange' | 'secondary';
}) {
  return (
    <span
      className={clsx(
        'inline-flex h-8.5 items-center rounded-[1px] px-3.5 type-ui font-medium',
        tone === 'orange'
          ? 'bg-main-orange text-white'
          : 'border border-neutral-200 bg-neutral-100 text-neutral-500',
      )}
    >
      {children}
    </span>
  );
}

function LinkSentence({ old }: { old: boolean }) {
  return (
    <span className="type-ui">
      자세한 내용은{' '}
      <span
        className={
          old ? 'text-[#3c7be4]' : 'text-link underline underline-offset-2'
        }
      >
        학사 안내
      </span>
      를 확인해 주세요.
    </span>
  );
}

function MetaRow({ old }: { old: boolean }) {
  return (
    <div className="w-56">
      <p className="type-ui">대학원 논문 심사 일정</p>
      <p
        className={clsx(
          'mt-1 type-meta',
          old ? 'text-neutral-400' : 'text-neutral-500',
        )}
      >
        2026/9/24 · 조회 198
      </p>
    </div>
  );
}

function Address({ old }: { old: boolean }) {
  return (
    <p
      className={clsx(
        'w-44 bg-neutral-100 p-3 type-meta text-neutral-600',
        old && 'break-all',
      )}
    >
      08826 서울특별시 관악구 관악로 1 서울대학교 공과대학 컴퓨터공학부
      행정실(301동 316호)
    </p>
  );
}

const SHORTCUTS = ['Top Conference List', '신임교수초빙', '구성원'];

function LinkGroup({ old }: { old: boolean }) {
  return (
    <div className="w-full max-w-64 bg-neutral-900 px-4 py-8">
      <p
        className={
          old
            ? 'mb-5 text-sm font-medium text-neutral-400'
            : 'mb-6 type-section text-neutral-400'
        }
      >
        바로가기
      </p>
      <div className="flex flex-col gap-4">
        {SHORTCUTS.map((title) => (
          <div
            key={title}
            className="flex h-9 items-center justify-between border-l-[5px] border-main-orange-dark pl-4 text-white"
          >
            <span className={old ? 'text-base font-medium' : 'type-item'}>
              {title}
            </span>
            <ArrowRight />
          </div>
        ))}
      </div>
    </div>
  );
}

const RESULTS = ['2학기 수강신청 안내', '10월 콜로키움 일정'];

function SearchResults({ old }: { old: boolean }) {
  return (
    <div className="w-full max-w-60 text-left">
      <div className="flex items-center gap-3 bg-neutral-50 p-4">
        <span className="type-label">검색</span>
        <span className="h-8 flex-1 border border-neutral-200 bg-white" />
      </div>
      <p
        className={
          old
            ? 'mt-9 mb-14 ml-3 type-meta text-neutral-500'
            : 'mt-12 mb-6 border-b border-neutral-200 pb-4 type-meta text-neutral-500'
        }
      >
        25개의 검색결과
      </p>
      <div className={old ? 'flex flex-col gap-7' : 'flex flex-col gap-6'}>
        {RESULTS.map((title) => (
          <div
            key={title}
            className={
              old
                ? 'flex flex-col gap-2.5'
                : 'flex flex-col gap-2 border-b border-neutral-200 pb-6'
            }
          >
            <p className="type-item">{title}</p>
            <p className="type-meta text-neutral-500">2026/9/24</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsCard({ shadow }: { shadow: boolean }) {
  return (
    <div className="bg-neutral-100 p-4">
      <div className={clsx('w-40 bg-white', shadow && 'shadow-lg')}>
        <div className="h-16 bg-neutral-300" />
        <div className="p-3">
          <p className="type-item">연구실 수상 소식</p>
          <p className="mt-1 type-meta text-neutral-500">2026/3/15</p>
        </div>
      </div>
    </div>
  );
}

function Controls({ old }: { old: boolean }) {
  const box = 'h-8.5 border border-neutral-300 bg-white px-3 type-ui';
  return (
    <div className="flex items-center gap-3">
      <span
        className={clsx(
          'flex w-28 items-center justify-between',
          box,
          old ? 'rounded-sm' : 'rounded-xs',
        )}
      >
        2024 <ChevronDown />
      </span>
      <span
        className={clsx(
          'inline-flex h-8.5 items-center bg-neutral-700 px-4 type-ui text-white',
          old ? 'rounded-[1px]' : 'rounded-xs',
        )}
      >
        저장
      </span>
    </div>
  );
}

function HeaderSearch({ old }: { old: boolean }) {
  return (
    <div className="bg-neutral-900 p-5">
      <div
        className={clsx(
          'flex h-8.5 w-48 items-center justify-end rounded-xs px-2.5',
          old ? 'bg-neutral-200 text-white' : 'bg-neutral-100 text-neutral-700',
        )}
      >
        <Search />
      </div>
    </div>
  );
}

function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 border border-neutral-200 bg-white px-4 py-3 shadow-overlay type-ui font-medium">
      <CircleCheck />
      {children}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <div className="w-56">
      <p className="mb-2 type-label">교과목명</p>
      <div className="h-8.5 rounded-xs border border-red-600 bg-white" />
      <p className="mt-2 type-meta text-red-600">{message}</p>
    </div>
  );
}

function ErrorSketch({ inline }: { inline: boolean }) {
  const field = (name: string, error: boolean) => (
    <div>
      <p className="mb-2 type-label">{name}</p>
      <div
        className={clsx(
          'h-8.5 rounded-xs border bg-white',
          error && inline ? 'border-red-600' : 'border-neutral-300',
        )}
      />
      {inline && error && (
        <p className="mt-2 type-meta text-red-600">{name}을 입력해 주세요.</p>
      )}
    </div>
  );
  return (
    <div className="w-56 space-y-4">
      {field('제목', true)}
      {field('작성자', false)}
      <div className="flex items-center justify-end gap-3">
        <p className="type-meta text-red-600">
          {inline ? '확인할 항목이 1개 있습니다.' : '제목을 입력해주세요.'}
        </p>
        <Button variant="primary">저장</Button>
      </div>
    </div>
  );
}

const WEEK = [21, 22, 23, 24, 25, 26, 27];
const TODAY = 23;
const PICKED = 25;

function MiniCalendar({ old }: { old: boolean }) {
  const arrow = old
    ? 'text-main-orange-dark'
    : 'text-neutral-600 hover:text-neutral-950';
  return (
    <div className="w-64 rounded-xs border border-neutral-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="type-label">2026년 9월</span>
        <span className={clsx('flex gap-2', arrow)}>
          <ChevronLeft />
          <ChevronRight />
        </span>
      </div>
      <div className="grid grid-cols-7 text-center type-ui">
        {WEEK.map((day) => (
          <span
            key={day}
            className={clsx(
              'relative mx-auto flex size-8 items-center justify-center rounded-xs',
              day === PICKED && 'border-2 border-main-orange-dark font-bold',
              !old && day === PICKED && 'text-main-orange-dark',
              old && day === TODAY && 'text-main-orange-dark',
            )}
          >
            {day}
            {!old && day === TODAY && (
              <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-neutral-950" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryCards({ old }: { old: boolean }) {
  const card = 'flex h-20 w-28 flex-col justify-between p-3 type-label';
  return (
    <div className="flex gap-3 bg-neutral-900 p-3">
      <div className={clsx(card, 'bg-main-orange-dark text-white')}>
        학부
        <ChevronDown className="self-end rotate-180" />
      </div>
      <div
        className={clsx(
          card,
          old
            ? 'bg-main-orange-dark text-white'
            : 'bg-neutral-200 text-neutral-950',
        )}
      >
        대학원
        <ChevronDown className="self-end" />
      </div>
    </div>
  );
}

const TABLE = [
  ['1학기', '컴퓨터의 개념 및 실습', '3', '필수'],
  ['2학기', '자료구조', '3', '필수'],
];

function WideTable({ old }: { old: boolean }) {
  // 점선 틀이 화면 폭이다. 예전에는 표가 틀 밖으로 나가 페이지를 밀었고, 지금은 틀 안에서 가로로 민다.
  const table = (
    <table className="w-96 max-w-none border-collapse type-meta">
      <tbody>
        {TABLE.map((row) => (
          <tr key={row[1]}>
            {row.map((cell) => (
              <td
                key={cell}
                className="border border-neutral-300 px-2 py-1 whitespace-nowrap"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div className="w-48 border-x border-dashed border-neutral-400 py-3">
      {old ? (
        table
      ) : (
        <div className="relative">
          <div className="overflow-x-auto">{table}</div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white" />
          <div className="mt-2 h-1 bg-neutral-100">
            <div className="h-1 w-1/2 bg-neutral-400" />
          </div>
        </div>
      )}
    </div>
  );
}

function BrowserTabs({
  tabs,
  canGoBack,
}: {
  tabs: string[];
  canGoBack: boolean;
}) {
  return (
    <div className="w-60 border border-neutral-300 bg-white">
      <div className="flex gap-1 bg-neutral-100 px-2 pt-2">
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={clsx(
              'min-w-0 truncate px-2 py-1 type-meta',
              i === tabs.length - 1
                ? 'bg-white text-neutral-950'
                : 'text-neutral-500',
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 type-meta">
        <ArrowLeft
          className={canGoBack ? 'text-neutral-950' : 'text-neutral-300'}
        />
        <span className="text-neutral-500">lab.snu.ac.kr</span>
      </div>
    </div>
  );
}

function PrivacyLink({ old }: { old: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 type-ui">
      <span className="flex items-center gap-1">
        <Square className="text-neutral-500" />
        개인정보 수집 및 이용동의
        <span className="text-main-orange">*</span>
      </span>
      <span className="flex items-center gap-1 text-neutral-500">
        {old ? '보러가기' : '동의 내용 보기'}
        {old ? <ChevronRight /> : <ExternalLink />}
      </span>
    </div>
  );
}

// 예전 섹션 제목 크기·굵기(화면마다 달랐다) 대 지금 섹션 제목 한 단계.
const OLD_SECTION_TITLES: [string, string][] = [
  ['연구 분야', 'text-base font-bold'],
  ['장학금 종류', 'text-[20px] font-bold'],
  ['공통: 졸업사정 유의사항', 'text-lg font-bold'],
  ['교과목 정보', 'text-[17px] font-bold'],
  ['학부 소개 책자', 'text-base font-semibold'],
  ['세미나실 예약', 'text-2xl font-bold text-neutral-800'],
];

function SectionTitles({ old }: { old: boolean }) {
  return (
    <ul className="grid w-full max-w-72 gap-3 text-left">
      {OLD_SECTION_TITLES.map(([title, cls]) => (
        <li key={title} className={old ? cls : 'type-section'}>
          {title}
        </li>
      ))}
    </ul>
  );
}

function SmallText({ old }: { old: boolean }) {
  return (
    <p className={clsx('text-neutral-500', old ? 'text-xs' : 'type-meta')}>
      소개 &gt; 학부장 인사말 · 2026/9/24 · 조회 198
    </p>
  );
}

// 아이콘 버튼의 누를 수 있는 영역을 점선으로 보여 준다.
function HitArea({ old }: { old: boolean }) {
  return (
    <div className="flex h-8.5 w-56 items-center justify-between rounded-xs border border-neutral-300 bg-white pl-3 type-ui text-neutral-300">
      검색어
      <span
        className={clsx(
          'flex items-center justify-center outline-1 outline-red-600 outline-dashed',
          old ? 'h-7.5 w-5' : 'mr-1 size-6',
        )}
      >
        <Search className="text-neutral-700" />
      </span>
    </div>
  );
}

function LabMaterials({ old }: { old: boolean }) {
  return (
    <div className="flex items-center gap-4 type-ui">
      <span>지능형 데이터 시스템 연구실</span>
      <span
        className={clsx(
          'flex items-center gap-3',
          old ? 'text-neutral-400' : 'text-neutral-500',
        )}
      >
        <FileText />
        <Video />
      </span>
    </div>
  );
}

const WORDING: [string, string][] = [
  ['저장하기', '저장'],
  ['입력해주세요', '입력해 주세요'],
  ['새소식', '새 소식'],
  ['게시글', '게시물'],
  ['선택된 공지', '선택한 공지'],
  ['편집중인 내용', '저장하지 않은 내용'],
];

function Wording({ old }: { old: boolean }) {
  return (
    <ul className="grid gap-2 type-ui">
      {WORDING.map(([before, after]) => (
        <li key={before}>{old ? before : after}</li>
      ))}
    </ul>
  );
}

function ButtonStates({ old }: { old: boolean }) {
  const states = old
    ? [
        ['기본', 'bg-main-orange'],
        ['호버', 'bg-main-orange'],
        ['누름', 'bg-main-orange'],
      ]
    : [
        ['기본', 'bg-neutral-700'],
        ['호버', 'bg-neutral-600'],
        ['누름', 'bg-neutral-500'],
      ];
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {states.map(([label, bg]) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <span
            className={clsx(
              'inline-flex h-8.5 items-center px-4 type-label text-white',
              old ? 'rounded-[1px]' : 'rounded-xs',
              bg,
            )}
          >
            저장
          </span>
          <span className="type-meta text-neutral-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

// 좁은 확인창의 버튼 줄. 예전에는 버튼 글자가 줄을 바꿔 한 글자씩 끊겼다.
function NarrowDialogButtons({ old }: { old: boolean }) {
  return (
    <div className="w-36 border border-neutral-200 bg-white p-3">
      <p className="mb-3 type-ui">삭제하시겠습니까?</p>
      <div className="flex flex-wrap justify-end gap-2">
        {['취소', '삭제'].map((label, i) => (
          <span
            key={label}
            className={clsx(
              'inline-flex items-center rounded-xs type-label',
              i === 1
                ? 'bg-neutral-700 text-white'
                : 'border border-neutral-200 bg-neutral-100 text-neutral-600',
              old ? 'w-6 justify-center py-1' : 'h-8.5 px-4 whitespace-nowrap',
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function FileRow({ old }: { old: boolean }) {
  return (
    <div className="flex h-8.5 w-56 items-center gap-2 rounded-xs border border-neutral-300 bg-white px-3 type-ui">
      <span className={clsx('min-w-0', old ? 'whitespace-nowrap' : 'truncate')}>
        2026학년도_전기_대학원_입학전형_안내문_최종본.pdf
      </span>
      {!old && <X className="shrink-0 text-neutral-500" />}
    </div>
  );
}

function MoreLinks({ old }: { old: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="bg-neutral-900 px-4 py-3">
        <span
          className={clsx(
            'flex items-center gap-1 type-ui text-main-orange-dark',
          )}
        >
          {old && <Plus />}
          더보기
          {!old && <ArrowRight />}
        </span>
      </div>
      <div className="bg-neutral-100 px-4 py-3">
        <span
          className={clsx(
            'flex items-center gap-1 type-ui',
            old ? 'text-[#e65615]' : 'text-main-orange-dark',
          )}
        >
          더보기 <ArrowRight />
        </span>
      </div>
    </div>
  );
}

function AttachmentHover({ old }: { old: boolean }) {
  return (
    <div className="flex w-full max-w-64 items-center gap-2 border border-neutral-200 bg-white px-3 py-2 type-ui">
      <Paperclip className="shrink-0 text-main-orange" />
      <span
        className={clsx('truncate', old ? 'underline' : 'text-main-orange')}
      >
        학부_장학_안내.pdf
      </span>
    </div>
  );
}

// 입력 칸 폭. 예전 값은 폼마다 적은 임의 폭(20rem·25rem·30rem·520px), 지금은 짧음·보통·넓음·전체 넷.
const FIELD_WIDTHS: [label: string, old: string, now: string][] = [
  ['연도', 'w-80', 'w-20'],
  ['이름', 'w-100', 'w-80'],
  ['주소', 'w-120', 'w-120'],
  ['제목', 'w-130', 'w-full'],
];

function FieldWidths({ old }: { old: boolean }) {
  return (
    <div className="grid w-full max-w-160 gap-3 text-left">
      {FIELD_WIDTHS.map(([label, before, now]) => (
        <div key={label} className="min-w-0">
          <p className="mb-1 type-label">{label}</p>
          <div
            className={clsx(
              'h-8.5 max-w-full rounded-xs border border-neutral-300 bg-white',
              old ? before : now,
            )}
          />
        </div>
      ))}
    </div>
  );
}

// 숨긴 라디오로 만든 알약에 Tab 으로 초점이 간 모습. 예전에는 표시가 없었다.
function PillFocus({ old }: { old: boolean }) {
  return (
    <div className="flex gap-3">
      {['가나다순', '소속순'].map((label, i) => (
        <span
          key={label}
          className={clsx(
            'inline-flex h-7.5 items-center rounded-full border px-3 type-ui',
            i === 0
              ? 'border-neutral-700 bg-neutral-700 text-white'
              : 'border-neutral-300 bg-white',
            !old &&
              i === 1 &&
              'outline-2 outline-offset-2 outline-neutral-700 outline-solid',
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

// ── 내용 ──────────────────────────────────────────────────────────
// 카드 기준: 여러 화면이나 핵심 화면에서 보이는 변화, 접근성·사용성 문제(대비·초점·키보드·좁은 폭 넘침·줄바꿈·누르는 영역)를 고친 것,
// 화면을 만드는 규칙을 바꾼 것, 여러 벌을 하나로 모은 것. 내부 정리이거나 차이가 너무 작은 것만 "그 밖에" 한 줄,
// 카드의 일부인 세부는 그 카드 글에 합친다.

const GROUPS: Group[] = [
  {
    title: '기반',
    areas: [
      {
        id: 'color',
        title: '색',
        doc: 'color',
        items: [
          {
            title: '링크 색과 밑줄',
            why: '예전 링크는 흰 바탕 대비 4.1:1에 마우스를 올려야 밑줄이 생겨 글 속에서 찾기 어려웠습니다. 대비 5.3:1인 파랑에 밑줄을 늘 두고 호버하면 주황으로 바꿔, 색을 구분하기 어려운 사람도 링크를 알아봅니다.',
            before: <LinkSentence old />,
            after: <LinkSentence old={false} />,
          },
          {
            title: '보조 글자 대비',
            why: '목록·검색의 날짜와 조회수가 neutral-400이라 흰 바탕 대비가 2.5:1에 그쳤습니다. 정보는 500(4.7:1), 누를 수 없는 것만 300으로 나눴습니다.',
            before: <MetaRow old />,
            after: <MetaRow old={false} />,
          },
          {
            title: '보조 버튼 글자',
            why: '편집·취소·목록 같은 보조 버튼 글자가 연한 회색 바탕 위의 500이라 흐렸습니다. 한 단계 짙은 600으로 올렸습니다.',
            before: (
              <>
                <OldButton tone="secondary">편집</OldButton>
                <OldButton tone="secondary">목록</OldButton>
              </>
            ),
            after: (
              <>
                <Button variant="secondary">편집</Button>
                <Button variant="secondary">목록</Button>
              </>
            ),
          },
        ],
        extras: [
          '주요 글자 색이 800·900·950으로 섞여 있던 것을 950 하나로 모았습니다. 나란히 놓아도 거의 구분되지 않는 차이라 한 줄로 적습니다.',
          '팔레트 밖 색 16곳(어두운 면 7종, 뉴스 더보기의 주황 오타 등)을 가까운 토큰으로 바꿨습니다. 화면은 거의 그대로이고 코드 정리입니다.',
        ],
      },
      {
        id: 'type',
        title: '글자',
        doc: 'type',
        items: [
          {
            title: '섹션 제목 한 단계',
            why: '본문 안 섹션 제목이 화면마다 16·17·18·20·24px, 굵기 600·700으로 8가지였습니다. 글자 크기 16단계와 줄높이 19종을 역할 9개로 모으고, 섹션 제목은 어느 화면이든 20px 굵게 하나입니다. 목록 제목도 표형은 본문, 피드형은 항목 제목 단계로 나눴습니다.',
            before: <SectionTitles old />,
            after: <SectionTitles old={false} />,
          },
          {
            title: '13px보다 작은 글자 없음',
            why: '경로·보조 정보 일부가 12px이라 한글이 읽기 어려웠습니다. 12px를 없애고 가장 작은 글자를 13px로 모았습니다.',
            before: <SmallText old />,
            after: <SmallText old={false} />,
          },
          {
            title: '제목과 그 아래 항목의 위계',
            why: '모바일 메인의 묶음 제목이 14px 회색이라 그 아래 16px 흰 링크보다 약해 제목이 묻혔습니다. 교수 이름이 섹션 제목보다 크던 곳처럼 안의 것이 묶는 제목보다 크던 곳을 바로잡아, 무엇이 무엇을 묶는지 먼저 읽힙니다.',
            before: <LinkGroup old />,
            after: <LinkGroup old={false} />,
          },
          {
            title: '어절 단위 줄바꿈',
            why: '본문·소개문·푸터 주소가 글자 단위로 줄을 바꿔 "컴퓨터공학/부"처럼 낱말 중간에서 끊겼습니다. 사이트 전체를 어절 단위 줄바꿈으로 바꿨습니다.',
            before: <Address old />,
            after: <Address old={false} />,
          },
        ],
      },
      {
        id: 'spacing',
        title: '간격',
        doc: 'spacing',
        items: [
          {
            title: '간격 아홉 단계',
            why: '목록 행 간격이 6종, 페이지 아래 여백이 7종, 폼 필드 간격 옵션이 8종일 만큼 간격이 제각각이었습니다. 4·8·12·16·24·32·48·64·128 아홉 단계로 모아(앱 약 110개 파일) 새 소식 목록의 구분선 위아래도 20에서 단계 값 24가 되었습니다.',
            ...shots('p3-list-row-spacing', 900, 470, [
              '예전 새 소식 목록. 구분선 위아래 여백이 조금 좁습니다.',
              '바뀐 새 소식 목록. 구분선 위아래 여백이 24로 넓어졌습니다.',
            ]),
            wide: true,
          },
          {
            title: '검색 결과의 묶음',
            why: '결과 개수가 목록보다 검색 상자에 가깝고 결과 사이에 선이 없어 한 결과가 어디서 끝나는지 흐렸습니다. 개수를 목록의 머리말로 붙이고 결과마다 선을 둡니다. 검색·필터와 결과 목록 사이도 48로 벌려 두 구역이 나뉩니다.',
            before: <SearchResults old />,
            after: <SearchResults old={false} />,
          },
          {
            title: '푸터 묶음 이름 아래',
            why: '묶음 이름 아래가 링크 사이와 거의 같아 이름이 첫 링크처럼 보였습니다. 이름 아래를 16으로 넓혀 묶음이 읽힙니다.',
            ...shots('footer-group-gap', 700, 225, [
              '예전 푸터 링크 묶음. 묶음 이름과 첫 링크 사이가 링크 사이만큼 좁습니다.',
              '바뀐 푸터 링크 묶음. 묶음 이름 아래가 링크 사이보다 넓습니다.',
            ]),
            wide: true,
          },
        ],
      },
      {
        id: 'shape',
        title: '모서리·그림자·선',
        doc: 'shape',
        items: [
          {
            title: '컨트롤 모서리',
            why: '버튼 1px, 드롭다운·검색창 4px처럼 컨트롤마다 모서리가 달랐습니다. 컨트롤은 2px 하나, 태그·알약은 완전한 원, 판·카드는 각지게 정했습니다.',
            before: <Controls old />,
            after: <Controls old={false} />,
          },
          {
            title: '카드 그림자',
            why: '메인 새 소식 카드가 그림자 때문에 모달처럼 떠 있는 층으로 보였습니다. 그림자 값 3종을 떠 있는 층용 하나로 모으고, 카드는 흰 바탕만으로 띠와 구분합니다.',
            before: <NewsCard shadow />,
            after: <NewsCard shadow={false} />,
          },
          {
            title: '인물 사진 그림자',
            why: '구성원 목록의 사진에만 그림자가 있어 사진이 카드와 다른 층에 떠 보였습니다. 그림자를 없애 사진이 다른 사진·카드와 같은 면에 놓입니다.',
            ...shots('p3-person-photo-shadow', 176, 214, [
              '예전 교수진 목록 사진 칸. 회색 사진 칸 둘레에 흐린 그림자가 있습니다.',
              '바뀐 교수진 목록 사진 칸. 그림자 없이 회색 칸만 있습니다.',
            ]),
          },
          {
            title: '교과목 카드의 테두리',
            why: '카드형 교과목 목록의 카드가 안쪽 그림자로 경계를 그려 앞뒤 모양이 달랐습니다. 그림자를 옅은 회색 선 하나로 바꿨습니다.',
            ...shots('p3-course-card-line', 300, 200, [
              '예전 교과목 카드. 테두리 없이 아래쪽에 그림자가 번져 있습니다.',
              '바뀐 교과목 카드. 네 변에 같은 옅은 회색 선이 있습니다.',
            ]),
          },
        ],
      },
      {
        id: 'icon',
        title: '아이콘',
        doc: 'icon',
        items: [
          {
            title: '아이콘 한 벌',
            why: '직접 그린 채운 아이콘과 선 아이콘이 섞여 크기와 굵기가 제각각이었습니다. 직접 그린 SVG 16개를 lucide 한 벌로 바꾸고 크기를 옆 글자에 맞췄으며, 위치를 맞추려 넣었던 보정값을 없앴습니다. 체크박스 체크가 작게 보이던 원인인 lucide 버전도 올렸습니다.',
            ...shots('seminar-icons', 600, 110, [
              '예전 세미나 목록의 연사·날짜·장소 줄. 채운 아이콘이 글자보다 진합니다.',
              '바뀐 세미나 목록의 연사·날짜·장소 줄. 선 아이콘이 글자 크기에 맞습니다.',
            ]),
          },
          {
            title: '아이콘 버튼의 누르는 영역',
            why: '입력 칸에 붙은 검색 버튼의 누르는 영역이 20×30px로 좁아 손가락이나 마우스로 맞히기 어려웠습니다. 아이콘만 있는 버튼은 24×24px 이상입니다. 점선이 누르는 영역입니다.',
            before: <HitArea old />,
            after: <HitArea old={false} />,
          },
          {
            title: '헤더 검색 버튼의 호버',
            why: '헤더 검색 칸의 돋보기가 마우스를 올리면 흰색이 되어 바탕과 대비가 1.26:1로 사라졌습니다. 이제 호버해도 짙은 회색으로 보입니다.',
            before: <HeaderSearch old />,
            after: <HeaderSearch old={false} />,
          },
          {
            title: '연구실 자료 아이콘',
            why: '연구실 목록의 소개 자료(PDF·영상) 아이콘이 neutral-400이라 흐려서 누를 수 있는지 알기 어려웠습니다. 500으로 올렸습니다.',
            before: <LabMaterials old />,
            after: <LabMaterials old={false} />,
          },
        ],
      },
      {
        id: 'focus',
        title: '초점·키보드',
        doc: 'focus',
        items: [
          {
            title: '초점 표시 한 벌',
            why: '키보드로 이동하면 브라우저 기본 파란 1px 링이 보였습니다. 사이트 한 벌인 짙은 회색 2px 링으로 바꿨습니다.',
            ...shots('focus-button', 300, 66, [
              '예전 목록 버튼의 초점. 파란 1px 링입니다.',
              '바뀐 목록 버튼의 초점. 2px 띄운 짙은 회색 링입니다.',
            ]),
          },
          {
            title: '어두운 면의 초점',
            why: '어두운 바로가기 띠와 헤더에서는 파란 1px 링이 거의 보이지 않았습니다. 어두운 면에서는 흰 2px 링으로 초점을 표시합니다.',
            ...shots('p3-focus-dark', 472, 130, [
              '예전 메인 바로가기. 초점이 간 첫 줄에 얇은 파란 선이 있습니다.',
              '바뀐 메인 바로가기. 초점이 간 첫 줄을 굵은 흰 선이 두릅니다.',
            ]),
            wide: true,
          },
          {
            title: '알약·체크박스의 초점',
            why: '알약·체크박스·라디오는 진짜 입력을 숨기고 모양만 그려서, Tab으로 옮겨도 초점이 어디 있는지 보이지 않았습니다. 감싼 모양에 같은 2px 링을 그립니다. 이미지 팝업 버튼도 지워 두었던 초점 표시를 되살렸습니다.',
            before: <PillFocus old />,
            after: <PillFocus old={false} />,
          },
          {
            title: '입력 칸의 초점',
            why: '입력 칸은 초점을 받아도 표시가 없어 지금 어디에 쓰는지 알 수 없었습니다. 테두리만 짙게 바꿔 칸이 고른 것으로 보입니다.',
            ...shots('focus-input', 400, 100, [
              '예전 공지 검색 칸에 초점이 있는 모습. 테두리가 그대로입니다.',
              '바뀐 공지 검색 칸에 초점이 있는 모습. 테두리가 짙어집니다.',
            ]),
          },
          {
            title: '캐러셀 카드의 초점',
            why: '메인 새 소식 카드의 링이 캐러셀 가장자리에서 위·왼쪽이 잘렸습니다. 영역 안쪽에 4px 여유를 두어 링이 온전히 보입니다.',
            ...shots(
              'focus-carousel',
              260,
              320,
              [
                '예전 새 소식 카드의 초점. 링 위·왼쪽이 잘렸습니다.',
                '바뀐 새 소식 카드의 초점. 링이 카드 둘레에 다 보입니다.',
              ],
              { w: 260, h: 324 },
            ),
          },
          {
            title: '표 행 전체를 누르기',
            why: '공지·교과목 표는 제목 글자 위에서만 눌려 행의 빈 곳을 누르면 아무 일도 없었습니다. 이제 행 어디를 눌러도 열리고, 호버와 초점도 행 전체에 보입니다.',
            ...shots('row-hover', 912, 129, [
              '예전 공지 표에 마우스를 올린 모습. 행에 변화가 없습니다.',
              '바뀐 공지 표에 마우스를 올린 모습. 행 바탕이 진해지고 제목이 주황입니다.',
            ]),
            wide: true,
          },
        ],
      },
      {
        id: 'writing',
        title: '문구',
        doc: 'writing',
        items: [
          {
            title: '삭제 확인창의 대상',
            why: '"동아리를 삭제하시겠습니까?"만으로는 무엇을 지우는지 알 수 없었습니다. 이름과 함께 묻고 되돌릴 수 없다는 것을 둘째 줄에 둡니다.',
            ...shots(
              'delete-confirm',
              400,
              162,
              [
                '예전 동아리 삭제 확인창. "동아리를 삭제하시겠습니까?" 한 줄입니다.',
                '바뀐 동아리 삭제 확인창. 동아리 이름과 "되돌릴 수 없습니다."가 함께 있습니다.',
              ],
              { w: 400, h: 190 },
            ),
          },
          {
            title: '버튼 이름의 "-하기"',
            why: '편집 폼의 실행 버튼이 게시하기·저장하기처럼 "-하기"로 끝나 길었습니다. 버튼 이름은 게시·저장처럼 행동 이름만 씁니다.',
            ...shots('p3-button-label', 180, 35, [
              '예전 편집 폼 버튼. 취소 옆 버튼이 게시하기입니다.',
              '바뀐 편집 폼 버튼. 취소 옆 버튼이 게시입니다.',
            ]),
          },
          {
            title: '성공 알림 문구',
            why: '"수정에 성공했습니다."처럼 무엇을 했는지 없는 문구가 11곳이었습니다. 대상과 동사로 "<대상>을 <동사>했습니다."라고 씁니다.',
            before: <Toast>수정에 성공했습니다.</Toast>,
            after: <Toast>전공 이수 표준 형태를 수정했습니다.</Toast>,
          },
          {
            title: '입력 오류 문구',
            why: '교과목 추가 폼은 오류 자리에 칸 이름만 다시 적어 무엇이 잘못됐는지 알 수 없었습니다. "<칸>을 입력해 주세요."로 고칠 일을 적습니다.',
            before: <FieldError message="교과목명" />,
            after: <FieldError message="교과목명을 입력해 주세요." />,
          },
          {
            title: '표기 맞춤',
            why: '같은 말을 화면마다 다르게 적었습니다(입력해주세요와 입력해 주세요, 새소식과 새 소식, 게시글과 게시물). 사이트 전체 105곳의 표기를 한쪽으로 맞췄습니다.',
            before: <Wording old />,
            after: <Wording old={false} />,
          },
          {
            title: '예약은 삭제가 아니라 취소',
            why: '예약 상세의 "해당 예약만 삭제"는 기록을 지우는 것처럼 들렸습니다. 방문자에게 익숙한 "이 예약만 취소", "반복 예약 전체 취소"로 바꿨습니다.',
            ...shots('reservation-cancel', 768, 110, [
              '예전 예약 상세의 아래 버튼. "반복 예약 전체 삭제"와 "해당 예약만 삭제"입니다.',
              '바뀐 예약 상세의 아래 버튼. "반복 예약 전체 취소"와 "이 예약만 취소"입니다.',
            ]),
            wide: true,
          },
        ],
      },
    ],
  },
  {
    title: '컴포넌트',
    areas: [
      {
        id: 'button',
        title: '버튼',
        doc: 'button',
        items: [
          {
            title: '추가 버튼',
            why: '"추가"가 연구실·교과목·시설·졸업생 진로에서는 주황 채움, 교수진에서는 짙은 회색이라 같은 행동이 화면마다 달라 보였습니다. 버튼 색은 행동의 종류로 정해 주요 행동은 늘 짙은 회색입니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g2-add-labs-before',
                    w: 220,
                    h: 64,
                    label: '연구실',
                    alt: '주황 채움의 연구실 추가 버튼',
                  },
                  {
                    file: 'g2-add-courses-before',
                    w: 220,
                    h: 64,
                    label: '교과과정',
                    alt: '주황 채움의 새 교과목 버튼',
                  },
                  {
                    file: 'g2-add-facilities-before',
                    w: 220,
                    h: 64,
                    label: '시설 안내',
                    alt: '주황 채움의 시설 추가 버튼',
                  },
                  {
                    file: 'g2-add-careers-before',
                    w: 360,
                    h: 64,
                    label: '졸업생 진로',
                    alt: '연도 선택 옆의 주황 연도 추가 버튼과 그 오른쪽의 편집 버튼',
                  },
                  {
                    file: 'g2-add-faculty-before',
                    w: 220,
                    h: 64,
                    label: '교수진',
                    alt: '짙은 회색 채움의 추가하기 버튼',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g2-add-labs-after',
                    w: 220,
                    h: 64,
                    label: '연구실',
                    alt: '짙은 회색 채움의 연구실 추가 버튼',
                  },
                  {
                    file: 'g2-add-courses-after',
                    w: 220,
                    h: 64,
                    label: '교과과정',
                    alt: '짙은 회색 채움의 새 교과목 버튼',
                  },
                  {
                    file: 'g2-add-facilities-after',
                    w: 220,
                    h: 64,
                    label: '시설 안내',
                    alt: '짙은 회색 채움의 시설 추가 버튼',
                  },
                  {
                    file: 'g2-add-careers-after',
                    w: 360,
                    h: 64,
                    label: '졸업생 진로',
                    alt: '편집이 왼쪽, 짙은 회색 연도 추가가 맨 오른쪽에 놓인 버튼 줄',
                  },
                  {
                    file: 'g2-add-faculty-after',
                    w: 220,
                    h: 64,
                    label: '교수진',
                    alt: '원래 모양 그대로인 짙은 회색 추가 버튼',
                  },
                ]}
              />
            ),
          },
          {
            title: '누름과 호버',
            why: '주요 버튼만 호버·누름 상태가 없어 눌렀는지 알 수 없었습니다. 회색이 한 단계씩 밝아져 마우스를 올린 것과 누른 것이 보입니다.',
            before: <ButtonStates old />,
            after: <ButtonStates old={false} />,
          },
          {
            title: '처리 중 표시',
            why: '저장을 누른 뒤 아무 표시가 없어 다시 누르거나 멈춘 줄 알았습니다. 처리하는 동안 버튼이 "저장 중…"으로 바뀌고 눌리지 않습니다.',
            before: <Button variant="primary">저장</Button>,
            after: (
              <Button variant="primary" pending pendingLabel="저장 중…">
                저장
              </Button>
            ),
          },
          {
            title: '좁은 자리의 버튼 글자',
            why: '작은 화면의 확인창에서 버튼 글자가 줄을 바꿔 "취/소"처럼 한 글자씩 끊겼습니다. 버튼 글자는 줄을 바꾸지 않고, 자리가 모자라면 버튼 줄이 내려갑니다.',
            before: <NarrowDialogButtons old />,
            after: <NarrowDialogButtons old={false} />,
          },
          {
            title: '삭제와 저장의 자리',
            why: '편집 폼의 삭제가 저장하기 바로 옆에 같은 짙은 색으로 있어 잘못 누르기 쉬웠습니다. 삭제는 보조 버튼으로 왼쪽 끝에, 저장은 맨 오른쪽에 둡니다.',
            before: (
              <div className="flex w-full justify-end gap-2">
                <Button variant="secondary">취소</Button>
                <Button variant="primary">삭제</Button>
                <Button variant="primary">저장하기</Button>
              </div>
            ),
            after: (
              <div className="flex w-full gap-3">
                <Button variant="secondary">삭제</Button>
                <span className="flex-1" />
                <Button variant="secondary">취소</Button>
                <Button variant="primary">저장</Button>
              </div>
            ),
          },
        ],
      },
      {
        id: 'form',
        title: '입력·폼',
        doc: 'form',
        items: [
          {
            title: '입력 칸 한 모양',
            why: '입력 칸마다 높이(28·30·32px)·바탕·테두리가 달랐고 라디오는 주황, 드롭다운은 작은 검정 테두리 상자였습니다. 높이 34px·흰 바탕·회색 테두리 칸 하나로 맞추고, 체크박스·라디오는 한 벌로 모아 켜진 색을 회색으로, 파일 고르기는 보조 버튼으로 바꿨습니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g2-form-select-before',
                    w: 280,
                    h: 260,
                    label: '교수진 추가 위쪽',
                    alt: '주황 라디오, 흰 테두리 업로드 버튼, 작은 검정 테두리 드롭다운',
                  },
                  {
                    file: 'g2-form-list-before',
                    w: 580,
                    h: 80,
                    label: '학력 입력',
                    alt: '회색 바탕으로 채운 학력 입력 칸과 추가 버튼',
                  },
                  {
                    file: 'g2-form-file-before',
                    w: 240,
                    h: 76,
                    label: '첨부파일',
                    alt: '흰 바탕에 테두리가 있는 파일 선택 버튼',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g2-form-select-after',
                    w: 280,
                    h: 260,
                    label: '교수진 추가 위쪽',
                    alt: '회색 라디오, 회색 보조 버튼, 입력 칸과 같은 높이의 드롭다운',
                  },
                  {
                    file: 'g2-form-list-after',
                    w: 580,
                    h: 80,
                    label: '학력 입력',
                    alt: '흰 바탕에 회색 테두리인 넓은 학력 입력 칸',
                  },
                  {
                    file: 'g2-form-file-after',
                    w: 240,
                    h: 76,
                    label: '첨부파일',
                    alt: '연한 회색 보조 버튼으로 바뀐 파일 선택',
                  },
                ]}
              />
            ),
            wide: true,
          },
          {
            title: '입력 칸 폭',
            why: '폼마다 20rem·25rem·30rem·520px처럼 칸 폭을 따로 적어 칸 오른쪽 끝이 제각각이었습니다. 폭은 짧음 80·보통 320·넓음 480·전체 넷 중에서 값의 길이로 고릅니다.',
            before: <FieldWidths old />,
            after: <FieldWidths old={false} />,
            wide: true,
          },
          {
            title: '교수 추가 폼의 모바일 넘침',
            why: '모바일에서 전화번호·팩스 줄이 고정 폭이라 화면 밖으로 넘쳐 페이지 전체가 692px로 늘어났습니다. 짝을 이루는 두 칸은 좁은 화면에서 위아래로 쌓습니다.',
            ...shots(
              'p3-faculty-form-390',
              692,
              300,
              [
                '예전 교수 추가 폼 390px. 팩스 칸이 화면 오른쪽 밖으로 나가 있습니다.',
                '바뀐 교수 추가 폼 390px. 전화번호 아래에 팩스 칸이 놓여 화면 안에 들어옵니다.',
              ],
              { w: 390, h: 370 },
            ),
            wide: true,
          },
          {
            title: '오류는 필드 아래',
            why: '오류가 버튼 줄 옆에만 모여 긴 폼에서는 어느 칸을 고칠지 찾아야 했습니다. 오류 문장은 그 칸 바로 아래에, 버튼 옆에는 개수만 둡니다.',
            before: <ErrorSketch inline={false} />,
            after: <ErrorSketch inline />,
          },
          {
            title: '긴 파일 이름',
            why: '첨부 파일 이름이 길면 칸을 넘쳐 옆 요소를 밀었습니다. 한 줄에서 말줄임으로 자르고, 지우기는 X 버튼으로 둡니다.',
            before: <FileRow old />,
            after: <FileRow old={false} />,
          },
          {
            title: '날짜 선택의 오늘과 고른 날',
            why: '오늘과 고른 날이 모두 주황이라 무엇을 골랐는지 헷갈렸고, 달을 넘기는 화살표도 주황이었습니다. 주황은 고른 날 하나에만 두고 오늘은 숫자 아래 점으로, 화살표는 회색으로 바꿨습니다.',
            before: <MiniCalendar old />,
            after: <MiniCalendar old={false} />,
          },
        ],
      },
      {
        id: 'selection',
        title: '선택·태그',
        doc: 'selection',
        items: [
          {
            title: '단일 선택 두 종류',
            why: '하나를 고르는 컨트롤이 화면마다 따로 만들어져 회색 사각 버튼, 주황 태그 버튼, 밑줄 탭이 섞여 있었습니다. 거르기와 정렬은 알약으로, 보기 바꾸기와 편집 언어는 글자 토글로 맞췄습니다. 밝은 면에서 고른 알약은 짙은 회색이고 어두운 메인 공지만 주황입니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g2-select-main-before',
                    w: 300,
                    h: 56,
                    label: '메인 공지',
                    alt: '어두운 띠 위의 주황 알약 필터: 전체, 장학, 학부, 대학원',
                  },
                  {
                    file: 'g2-select-faculty-before',
                    w: 200,
                    h: 60,
                    label: '교수진 정렬',
                    alt: '짙은 회색과 연한 회색 사각 버튼으로 된 가나다순, 소속순 정렬',
                  },
                  {
                    file: 'g2-select-sort-before',
                    w: 230,
                    h: 50,
                    label: '교과목 정렬',
                    alt: '주황 태그 모양 버튼으로 된 학년, 교과목 구분, 학점 정렬',
                  },
                  {
                    file: 'g2-select-view-before',
                    w: 150,
                    h: 50,
                    label: '교과목 보기 방식',
                    alt: '굵은 세로선으로 나뉜 목록형, 카드형 글자 토글',
                  },
                  {
                    file: 'g2-select-lang-before',
                    w: 200,
                    h: 50,
                    label: '편집 언어',
                    alt: '한글 아래 밑줄이 있는 한글, English 탭',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g2-select-main-after',
                    w: 300,
                    h: 56,
                    label: '메인 공지',
                    alt: '어두운 띠 위에서 주황을 유지한 알약 필터',
                  },
                  {
                    file: 'g2-select-faculty-after',
                    w: 200,
                    h: 60,
                    label: '교수진 정렬',
                    alt: '고른 항목이 짙은 회색인 알약 정렬',
                  },
                  {
                    file: 'g2-select-sort-after',
                    w: 230,
                    h: 50,
                    label: '교과목 정렬',
                    alt: '고른 학년이 짙은 회색이고 나머지는 흰 알약인 정렬',
                  },
                  {
                    file: 'g2-select-view-after',
                    w: 150,
                    h: 50,
                    label: '교과목 보기 방식',
                    alt: '얇은 구분선으로 나뉜 목록형, 카드형 글자 토글',
                  },
                  {
                    file: 'g2-select-lang-after',
                    w: 200,
                    h: 50,
                    label: '편집 언어',
                    alt: '밑줄 대신 글자 토글로 바뀐 한글, English',
                  },
                ]}
              />
            ),
          },
        ],
        extras: [
          '태그 구현 3벌(교과목 카드 복사본 포함)을 한 부품으로 모으고 높이를 26에서 24px로 맞췄습니다. 나란히 놓아도 거의 같아 보여 한 줄로 적습니다.',
        ],
      },
      {
        id: 'dialog',
        title: '모달',
        doc: 'dialog',
        items: [
          {
            title: '모달 판 한 벌',
            why: '모달마다 판의 바탕색·제목 크기·폭이 달랐고 확인창에는 위 주황 선이 없었으며 실행 버튼이 "확인"이었습니다. 흰 바탕에 위 주황 선이 있는 판 한 벌로 맞추고, 제목은 판이 같은 자리·같은 크기로 그리며, 폭은 확인 400·폼 560·넓게 768 셋에서 고릅니다. 확인창의 실행 버튼은 하는 일(삭제·나가기)을 적습니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g2-modal-course-before',
                    w: 540,
                    h: 220,
                    label: '교과목 추가',
                    alt: '옅은 회색 바탕에 회색 제목이 있는 교과목 추가 판',
                  },
                  {
                    file: 'g2-modal-reserve-before',
                    w: 440,
                    h: 220,
                    label: '시설 예약',
                    alt: '옅은 회색 바탕의 시설 예약 판',
                  },
                  {
                    file: 'g2-modal-detail-before',
                    w: 400,
                    h: 220,
                    label: '예약 상세',
                    alt: '좁고 옅은 회색 바탕의 예약 상세 판',
                  },
                  {
                    file: 'g2-modal-confirm-before',
                    w: 260,
                    h: 150,
                    label: '확인창',
                    alt: '위 주황 선이 없고 실행 버튼이 확인인 삭제 확인창',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g2-modal-course-after',
                    w: 600,
                    h: 220,
                    label: '교과목 추가',
                    alt: '흰 바탕에 굵은 검정 제목이 있는 교과목 추가 판',
                  },
                  {
                    file: 'g2-modal-reserve-after',
                    w: 580,
                    h: 220,
                    label: '시설 예약',
                    alt: '흰 바탕으로 바뀐 시설 예약 판',
                  },
                  {
                    file: 'g2-modal-detail-after',
                    w: 790,
                    h: 220,
                    label: '예약 상세',
                    alt: '넓은 크기의 흰 바탕 예약 상세 판',
                  },
                  {
                    file: 'g2-modal-confirm-after',
                    w: 420,
                    h: 180,
                    label: '확인창',
                    alt: '위 주황 선이 생기고 실행 버튼이 삭제로 바뀐 확인창',
                  },
                ]}
              />
            ),
            wide: true,
          },
          {
            title: '예약 모달의 모바일 넘침',
            why: '시설 예약 모달은 고정 폭 입력 칸 때문에 390px 화면에서 오른쪽이 잘려 버튼이 보이지 않았습니다. 칸이 판 폭을 따르고 날짜 이름을 칸 위로 올려 판 안에 다 들어옵니다. 320px에서 넘치던 예약 상세와 판 밖으로 나가던 날짜 팝오버도 함께 고쳤습니다.',
            ...shots('reservation-modal-390', 390, 844, [
              '예전 390px 시설 예약 모달. 입력 칸과 버튼이 화면 오른쪽 밖으로 잘립니다.',
              '바뀐 390px 시설 예약 모달. 입력 칸이 판 안에 맞게 들어옵니다.',
            ]),
          },
          {
            title: '이미지 팝업 버튼',
            why: '"자세히 보기"가 주황 채움이라 포스터 색과 부딪혔습니다. 포스터 색은 매번 달라서 짙은 회색으로 바꿨습니다.',
            ...shots('image-popup', 420, 610, [
              '예전 메인 이미지 팝업. 자세히 보기 버튼이 주황입니다.',
              '바뀐 메인 이미지 팝업. 자세히 보기 버튼이 짙은 회색입니다.',
            ]),
          },
        ],
      },
      {
        id: 'search',
        title: '검색 입력',
        doc: 'search',
        items: [
          {
            title: '검색 칸 한 부품',
            why: '헤더·검색 상자·세미나의 검색 칸이 회색 채움이나 테두리 없는 흰 칸 등 저마다 다른 모양이었습니다. 한 부품으로 모아 밝은 면은 다른 입력 칸과 같은 모양으로, 헤더는 채움 칸으로 맞췄습니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g2-search-header-before',
                    w: 260,
                    h: 56,
                    label: '헤더',
                    alt: '어두운 헤더 위의 회색 채움 검색 칸',
                  },
                  {
                    file: 'g2-search-notice-before',
                    w: 400,
                    h: 70,
                    label: '공지 검색 상자',
                    alt: '이름이 왼쪽에 있고 테두리 없는 흰 검색 칸',
                  },
                  {
                    file: 'g2-search-seminar-before',
                    w: 340,
                    h: 60,
                    label: '세미나',
                    alt: '이름이 왼쪽에 있는 회색 채움 검색 칸',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g2-search-header-after',
                    w: 260,
                    h: 56,
                    label: '헤더',
                    alt: '더 밝은 회색으로 채운 헤더 검색 칸',
                  },
                  {
                    file: 'g2-search-notice-after',
                    w: 400,
                    h: 90,
                    label: '공지 검색 상자',
                    alt: '이름이 위에 있고 테두리가 있는 흰 입력 칸',
                  },
                  {
                    file: 'g2-search-seminar-after',
                    w: 340,
                    h: 60,
                    label: '세미나',
                    alt: '자리표시 검색어가 있는 테두리 입력 칸',
                  },
                ]}
              />
            ),
          },
        ],
        extras: [
          '검색 칸 id 를 부품이 만들게 해 같은 화면에 칸이 둘이어도 겹치지 않습니다. 화면에는 보이지 않는 코드 정리입니다.',
        ],
      },
      {
        id: 'toast',
        title: '토스트',
        doc: 'toast',
        items: [
          {
            title: '토스트 모양',
            why: '둥근 판과 채운 아이콘이 사이트의 각진 면과 어울리지 않았고 실패가 성공과 같은 색이었습니다. 각진 판에 선 아이콘을 두고 실패만 빨강이며, 설명 글자의 팔레트 밖 색도 neutral-600으로 바꿨습니다.',
            ...shots('toast', 600, 327, [
              '예전 토스트 셋. 둥근 판에 검정으로 채운 아이콘입니다.',
              '바뀐 토스트 셋. 각진 판에 선 아이콘이고 실패 아이콘만 빨강입니다.',
            ]),
          },
        ],
      },
      {
        id: 'editor',
        title: '에디터',
        doc: 'editor',
        items: [],
        extras: [
          '편집기 테두리·모서리·툴바 버튼 묶음을 입력 칸과 같은 회색 300·2px로, 글꼴을 사이트 서체로 맞췄습니다. 나란히 놓아도 차이가 작아 한 줄로 적습니다.',
        ],
      },
    ],
  },
  {
    title: '패턴',
    areas: [
      {
        id: 'layout',
        title: '레이아웃·페이지 틀',
        doc: 'layout',
        items: [
          {
            title: '중간 폭의 가로 스크롤',
            why: '데스크톱 틀이 1200px 아래로 줄지 않아 태블릿 폭(640~1199px)에서 페이지가 옆으로 밀렸습니다. 데스크톱 전환을 1024px, 서브내비를 1280px로 나눠 그 아래는 모바일 틀로 바뀌고 가로 스크롤이 없습니다.',
            ...shots(
              'layout-820',
              700,
              525,
              [
                '예전 820px 화면의 인사말. 페이지가 1200px로 펼쳐져 일부만 보입니다.',
                '바뀐 820px 화면의 인사말. 모바일 틀로 폭에 맞게 보입니다.',
              ],
              { w: 700, h: 768 },
            ),
          },
          {
            title: '읽기 폭',
            why: '본문 문단이 본문 영역 끝까지 이어져 넓은 화면에서 한 줄이 너무 길었습니다. 문단·목록·제목은 640px에서 줄을 바꿉니다.',
            ...shots('p3-reading-width', 900, 340, [
              '예전 개인정보처리방침 1440px. 첫 문단 한 줄이 본문 영역 오른쪽 끝까지 이어집니다.',
              '바뀐 같은 페이지. 첫 문단이 더 짧은 폭에서 줄을 바꿔 세 줄이 됩니다.',
            ]),
            wide: true,
          },
          {
            title: '선택형 제목과 겹친 여백',
            why: '찾아오는 길은 선택 탭이 자기 위 여백을 더해 틀 여백과 겹쳤고 탭 아래 제목이 다른 화면과 달랐습니다. 페이지 틀을 기본·띠 두 가지로 줄여 여백은 틀 하나가 주고(카테고리 띠 아래 160·88도 128·64로), 탭 아래 제목은 주황 선이 붙은 한 부품입니다.',
            ...shots('directions-title', 920, 290, [
              '예전 찾아오는 길의 지도 아래. 탭 위 여백이 넓고 "대중교통" 제목에 선이 없습니다.',
              '바뀐 찾아오는 길의 지도 아래. 탭이 올라오고 "대중교통" 제목 아래에 주황 선이 있습니다.',
            ]),
            wide: true,
          },
          {
            title: '긴 제목의 줄바꿈',
            why: '모바일에서 긴 영문 페이지 제목이 줄을 바꾸지 않아 페이지가 화면보다 넓어졌습니다. 제목이 화면 폭 안에서 줄을 바꿉니다.',
            ...shots(
              'p3-long-title-390',
              412,
              205,
              [
                '예전 10-10 Project 참여 교수 페이지 390px. 제목이 한 줄로 이어져 페이지가 412px로 넓어졌습니다.',
                '바뀐 같은 페이지. 제목이 두 줄로 나뉘어 화면 폭 안에 들어옵니다.',
              ],
              { w: 390, h: 234 },
            ),
          },
          {
            title: '서브내비가 푸터를 덮음',
            why: '본문이 짧은 페이지에서 서브내비가 흰 본문 영역 밖으로 내려와 푸터 링크를 덮었습니다. 본문 영역이 서브내비 높이만큼은 늘어나 푸터가 그 아래에서 시작하고, 서브내비 왼쪽 끝을 고정해 형제 페이지를 오갈 때 좌우로 튀지 않습니다.',
            ...shots(
              'p3-subnav-footer',
              900,
              412,
              [
                '예전 연락처 페이지. 서브내비 아래쪽이 회색 푸터 위로 겹쳐 있습니다.',
                '바뀐 연락처 페이지. 서브내비가 흰 영역 안에서 끝나고 푸터는 그 아래에 있습니다.',
              ],
              { w: 900, h: 496 },
            ),
            wide: true,
          },
          {
            title: '작성 화면의 서브내비',
            why: '작성 화면 가운데 전공 이수 표준 형태 추가에만 오른쪽 서브내비가 있어 형제 작성 화면과 틀이 달랐고, 누르면 쓰던 글을 벗어났습니다. 작성·편집 화면에서는 서브내비를 빼고 같은 틀을 씁니다.',
            ...shots('p3-create-subnav', 900, 384, [
              '예전 전공 이수 표준 형태 추가 화면. 에디터 오른쪽에 학사 및 교과 서브내비가 있습니다.',
              '바뀐 같은 화면. 에디터 오른쪽이 비어 있고 서브내비가 없습니다.',
            ]),
            wide: true,
          },
        ],
      },
      {
        id: 'navigation',
        title: '내비게이션·셸',
        doc: 'navigation',
        items: [
          {
            title: '경로의 줄바꿈',
            why: '경로가 한 줄에 억지로 들어가 영어 320px에서 "세미나실 예약"이 한 글자씩 세로로 쌓였습니다. 항목 단위로 다음 줄에 넘기고 왼쪽 정렬합니다.',
            ...shots('breadcrumb-en-320', 320, 300, [
              '예전 320px 영어 예약 화면의 경로. 가운데 항목이 한 글자씩 세로로 쌓입니다.',
              '바뀐 320px 영어 예약 화면의 경로. 항목이 다음 줄로 넘어가 온전히 읽힙니다.',
            ]),
          },
          {
            title: '영어 푸터의 넘침',
            why: '푸터 링크 열 폭이 고정이라 영어 모바일에서 긴 링크가 화면 밖으로 잘렸습니다. 열은 글 길이만큼 쓰고 자리가 모자라면 다음 줄로 내려갑니다.',
            ...shots(
              'footer-en-390',
              390,
              609,
              [
                '예전 390px 영어 푸터. More 열의 긴 링크가 오른쪽에서 잘립니다.',
                '바뀐 390px 영어 푸터. More 묶음이 아래 줄로 내려가 링크가 다 보입니다.',
              ],
              { w: 390, h: 769 },
            ),
          },
          {
            title: '영어 푸터 안내 링크 이름',
            why: '영어 푸터 About 열에 학부 안내와 대학원 안내가 모두 Guide로 번역되어 같은 이름이 두 번 나왔습니다. Undergraduate Guide와 Graduate Guide로 나누고, 데스크톱에서 주소가 로고에 붙던 것도 48 띄웠습니다.',
            ...shots('p4-footer-guide', 820, 170, [
              '영어 푸터 About 열에 Guide가 두 번 나오는 화면',
              '영어 푸터 About 열에 Undergraduate Guide와 Graduate Guide가 나오는 화면',
            ]),
            wide: true,
          },
          {
            title: '푸터 글자 대비',
            why: '어두운 푸터의 데스크톱 링크와 아래쪽 글자가 바탕 대비 3.5~3.8:1로 기준(4.5:1)에 못 미쳤습니다. 한 단계씩 밝혀 6.6:1 이상으로 올리고, 회색 링크에 없던 호버 표시를 더했습니다.',
            ...shots('footer-contrast', 1000, 319, [
              '예전 어두운 푸터. 링크와 아래쪽 주소 글자가 어두운 회색입니다.',
              '바뀐 어두운 푸터. 링크와 주소 글자가 한 단계 밝습니다.',
            ]),
            wide: true,
          },
          {
            title: '제작진 소개',
            why: '역할마다 이름을 알약으로 늘어놓은 상자 세 개라 태그처럼 보였습니다. 역할과 이름을 한 줄씩 적는 목록으로 바꿨습니다.',
            ...shots('credits-modal', 800, 340, [
              '예전 Team CSEREAL 모달. 역할마다 이름 알약이 든 상자 세 개입니다.',
              '바뀐 Team CSEREAL 모달. 역할과 이름이 한 줄씩 적힌 목록입니다.',
            ]),
            wide: true,
          },
          {
            title: '선택 탭 하나일 때 폭',
            why: '선택 탭이 하나뿐이면 데스크톱에서 탭이 본문 전체 폭의 주황 막대로 늘어났습니다. 탭이 하나여도 한 칸 폭만 씁니다.',
            ...shots('p4-single-tab', 900, 147, [
              '시스템 탭 하나가 본문 전체 폭 주황 막대로 늘어난 연구·교육 스트림 화면',
              '시스템 탭 하나가 한 칸 폭으로만 그려진 화면',
            ]),
            wide: true,
          },
        ],
        extras: [
          '서브내비 높이를 항목 수마다 적어 둔 표 14종을 지워 선이 목록 높이에 맞춰 늘어납니다. 끝 몇 px만 달라 한 줄로 적습니다.',
          '내비게이션 면의 hex 색을 토큰으로 바꿨습니다. 화면은 그대로인 코드 정리입니다.',
          '언어가 붙지 않는 주소(이 문서)의 경로 링크가 /ko를 붙여 없는 페이지로 가던 것을 고쳤습니다. 이 문서에만 있던 문제입니다.',
        ],
      },
      {
        id: 'category',
        title: '카테고리',
        doc: 'category',
        items: [
          {
            title: '호버와 펼친 카드',
            why: '카드에 마우스를 올리면 펼친 카드와 같은 짙은 주황이 되어 무엇을 펼쳤는지 알 수 없었습니다. 호버는 회색으로 한 단계 진해지고, 짙은 주황은 펼친 카드에만 남습니다. 카드 사이와 안 여백도 단계 값(24·32, 16·24)으로 맞췄습니다.',
            before: <CategoryCards old />,
            after: <CategoryCards old={false} />,
          },
          {
            title: '펼치는 카드 표시',
            why: '입학과 학사의 학부·대학원 카드는 누르면 하위 카드를 펼치는데, 아무 표시가 없어 누를 수 있는 카드인지 알 수 없었습니다. 이동 카드의 화살표 자리에 아래 꺾쇠를 넣었습니다.',
            ...shots('p4-category-expand', 390, 250, [
              '학부, 대학원, International 카드에 아무 표시가 없는 모바일 입학 화면',
              '세 카드 오른쪽 아래에 아래 꺾쇠가 있는 모바일 입학 화면',
            ]),
          },
          {
            title: '카테고리 카드 이름',
            why: '모바일 카테고리 카드의 이름이 보통 굵기의 작은 글자라 카드가 무엇인지 약하게 보였습니다. 목록 항목 제목과 같은 16px 굵은 글자로 바꿨습니다.',
            ...shots('p3-category-card-title', 390, 260, [
              '예전 소개 페이지 390px. 카드 이름이 작고 가는 글자입니다.',
              '바뀐 같은 페이지. 카드 이름이 더 크고 굵은 글자입니다.',
            ]),
          },
          {
            title: '모바일 링크 카드 폭',
            why: '10-10 Project 모바일 화면에서 링크 카드 폭이 글자 길이를 따라 제각각이었습니다. 두 칸을 같은 폭으로 나누고, 긴 제목은 괄호 앞에서 줄을 바꾸고, 화살표는 카드 오른쪽 아래에 두었습니다.',
            ...shots('p4-project-cards', 390, 260, [
              '링크 카드 폭이 Proposal, Manager, Participants마다 다른 모바일 10-10 Project 화면',
              '두 칸 카드가 같은 폭이고 화살표가 오른쪽 아래에 있는 모바일 10-10 Project 화면',
            ]),
          },
        ],
      },
      {
        id: 'main',
        title: '메인',
        items: [
          {
            title: '영어 메인 슬로건',
            why: '영어 메인에서 슬로건과 바로가기 제목이 한국어로 남아 있었습니다. 영어 문장으로 바꾸고 바로가기는 영어 제목 하나만 둡니다.',
            ...shots('english-slogan', 900, 199, [
              '예전 영어 메인 첫 화면. 슬로건이 한국어입니다.',
              '바뀐 영어 메인 첫 화면. 슬로건이 영어 네 줄입니다.',
            ]),
            wide: true,
          },
          {
            title: '더보기 한 모양',
            why: '"더보기"가 공지는 앞에 더하기 표시, 뉴스는 뒤에 화살표와 다른 주황이라 같은 링크가 둘로 보였습니다. 글자 뒤 화살표, 짙은 주황 한 모양입니다.',
            before: <MoreLinks old />,
            after: <MoreLinks old={false} />,
          },
          {
            title: '메인 섹션 간격과 제목',
            why: '메인 간격이 거의 전부 임의 px였고 섹션 제목도 28/600·28/500·21/500으로 제각각이었습니다. 간격을 단계 값으로(90·88 → 64, 170 → 128), 섹션 제목을 한 단계로 맞췄습니다.',
            ...shots('p4-main-sections', 900, 696, [
              '예전 메인 화면의 배너, 공지사항, 바로가기 부분. 섹션 사이가 넓습니다.',
              '바뀐 같은 부분. 간격이 줄어 바로가기 목록까지 보입니다.',
            ]),
            wide: true,
          },
        ],
      },
      {
        id: 'list',
        title: '목록·상태 화면',
        doc: 'list',
        items: [
          {
            title: '표 한 모양',
            why: '목록마다 표 모양이 달랐습니다(머리 행이 회색이거나 흰색, 행 높이와 줄무늬, 행 사이 점선, 칸 폭, 들여쓰기가 제각각). 공지사항 표 하나를 골라 흰 머리 행과 아래 선, 같은 행 높이, 옅은 회색 줄무늬로 모든 표를 맞추고, 칸은 내용 폭에 맞추며 표는 본문 왼쪽 끝에서 시작합니다. 학회 표는 720px 고정 대신 본문 폭을 다 씁니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g1-table-notice-before',
                    w: 890,
                    h: 190,
                    label: '공지사항 (기준으로 고른 모양)',
                    alt: '공지사항 표. 흰 머리 행과 옅은 회색 줄무늬 행',
                  },
                  {
                    file: 'g1-table-labs-before',
                    w: 890,
                    h: 150,
                    label: '연구실 목록',
                    alt: '연구실 목록 표. 회색 머리 행과 행 사이 점선',
                  },
                  {
                    file: 'g1-table-conference-before',
                    w: 740,
                    h: 140,
                    label: 'Top Conference List',
                    alt: 'Top Conference 표. 연번 머리 칸이 두 줄로 꺾이고 표 폭이 좁음',
                  },
                  {
                    file: 'g1-table-career-stat-before',
                    w: 445,
                    h: 240,
                    label: '졸업생 진로 현황',
                    alt: '진로 현황 교차표. 회색 머리 행과 회색 행 제목 칸, 칸마다 선',
                  },
                  {
                    file: 'g1-table-startup-before',
                    w: 860,
                    h: 135,
                    label: '졸업생 창업 기업',
                    alt: '창업 기업 표. 회색 줄무늬 행에 삭제와 편집 버튼',
                  },
                  {
                    file: 'g1-table-courses-before',
                    w: 870,
                    h: 100,
                    label: '교과과정',
                    alt: '교과목 표. 회색 머리 행, 칸이 고르게 나뉘고 숫자 가운데 정렬',
                  },
                  {
                    file: 'g1-table-admin-before',
                    w: 870,
                    h: 95,
                    label: '관리자 메뉴',
                    alt: '관리자 슬라이드쇼 표. 흰 머리 행과 아래 선',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g1-table-notice-after',
                    w: 890,
                    h: 190,
                    label: '공지사항',
                    alt: '공지사항 표. 흰 머리 행과 옅은 회색 줄무늬 행',
                  },
                  {
                    file: 'g1-table-labs-after',
                    w: 890,
                    h: 150,
                    label: '연구실 목록',
                    alt: '연구실 목록 표. 공지사항과 같은 흰 머리 행과 줄무늬, 긴 칸만 넓게',
                  },
                  {
                    file: 'g1-table-conference-after',
                    w: 890,
                    h: 145,
                    label: 'Top Conference List',
                    alt: 'Top Conference 표. 연번이 한 줄로 들어가고 같은 머리 행과 줄무늬',
                  },
                  {
                    file: 'g1-table-career-stat-after',
                    w: 445,
                    h: 324,
                    label: '졸업생 진로 현황',
                    alt: '진로 현황 교차표. 흰 머리 행과 줄무늬, 행 제목은 굵은 글자',
                  },
                  {
                    file: 'g1-table-startup-after',
                    w: 505,
                    h: 140,
                    label: '졸업생 창업 기업',
                    alt: '창업 기업 표. 같은 머리 행과 줄무늬, 칸이 내용 폭에 맞춰짐',
                  },
                  {
                    file: 'g1-table-courses-after',
                    w: 890,
                    h: 100,
                    label: '교과과정',
                    alt: '교과목 표. 흰 머리 행, 과목명 칸만 넓고 나머지는 내용 폭',
                  },
                  {
                    file: 'g1-table-admin-after',
                    w: 890,
                    h: 105,
                    label: '관리자 메뉴',
                    alt: '관리자 슬라이드쇼 표. 같은 머리 행과 줄무늬 행',
                  },
                ]}
              />
            ),
            wide: true,
          },
          {
            title: '교과목 표 들여쓰기',
            why: '교과목 정보 제목과 목록형 토글, 표가 본문 왼쪽 끝보다 더 들어가 있었고 머리 행과 칸이 어긋났습니다. 들여쓰기를 없애고 머리 행을 칸에 맞췄습니다.',
            ...shots('p4-course-table', 900, 225, [
              '교과목 정보 제목과 표가 안쪽으로 들어가 있고 학점 머리와 값이 어긋난 화면',
              '제목과 표가 본문 왼쪽 끝에서 시작하고 머리 행과 칸이 맞는 화면',
            ]),
            wide: true,
          },
          {
            title: '빈 목록',
            why: '검색 결과가 없을 때 화면마다 다르게 보였습니다(공지와 새 소식은 왼쪽 검은 글자, 세미나는 가운데 회색 글자와 밑줄, 통합 검색은 흐린 글자와 큰 돋보기 그림). 위아래 선 사이 가운데 한 줄 문구로 맞추고, 쪽이 하나뿐이면 페이지 넘김을 숨겼습니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g1-empty-notice-before',
                    w: 890,
                    h: 140,
                    label: '공지사항',
                    alt: '왼쪽 정렬 검은 문구 아래 1쪽뿐인 페이지 넘김',
                  },
                  {
                    file: 'g1-empty-news-before',
                    w: 890,
                    h: 140,
                    label: '새 소식',
                    alt: '왼쪽 정렬 검은 문구 아래 1쪽뿐인 페이지 넘김',
                  },
                  {
                    file: 'g1-empty-seminar-before',
                    w: 890,
                    h: 195,
                    label: '세미나',
                    alt: '가운데 회색 문구와 밑줄, 그 아래 페이지 넘김',
                  },
                  {
                    file: 'g1-empty-search-before',
                    w: 890,
                    h: 315,
                    label: '통합 검색',
                    alt: '아주 흐린 문구 아래 찡그린 돋보기 그림',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g1-empty-notice-after',
                    w: 890,
                    h: 215,
                    label: '공지사항',
                    alt: '위아래 선 사이 가운데 회색 문구 한 줄, 페이지 넘김 없음',
                  },
                  {
                    file: 'g1-empty-news-after',
                    w: 890,
                    h: 216,
                    label: '새 소식',
                    alt: '위아래 선 사이 가운데 회색 문구 한 줄, 페이지 넘김 없음',
                  },
                  {
                    file: 'g1-empty-seminar-after',
                    w: 890,
                    h: 215,
                    label: '세미나',
                    alt: '위아래 선 사이 가운데 회색 문구 한 줄, 페이지 넘김 없음',
                  },
                  {
                    file: 'g1-empty-search-after',
                    w: 890,
                    h: 205,
                    label: '통합 검색',
                    alt: '위아래 선 사이 가운데 회색 문구 한 줄, 돋보기 그림 없음',
                  },
                ]}
              />
            ),
            wide: true,
          },
          {
            title: '없는 페이지',
            why: '404 화면이 큰 주황 숫자만 있는 다른 틀이라 사이트를 벗어난 것처럼 보였습니다. 다른 페이지와 같은 틀에 제목·요청 주소·메인으로 가는 버튼을 둡니다.',
            ...shots('not-found', 900, 474, [
              '예전 404 화면. 어두운 면 가운데 큰 주황 404 숫자가 있습니다.',
              '바뀐 404 화면. 다른 페이지처럼 제목 "페이지를 찾을 수 없습니다"와 메인으로 이동 버튼이 있습니다.',
            ]),
            wide: true,
          },
          {
            title: '새 소식 목록 들여쓰기와 빈 사진',
            why: '새 소식 목록만 행이 48px 들어가서 시작하고, 사진이 없으면 빈 회색 칸이 남았습니다. 들여쓰기를 없애 본문 왼쪽 끝에 맞추고, 사진이 없을 때는 세미나 목록처럼 학부 로고를 넣었습니다.',
            ...shots('p4-news-list', 900, 500, [
              '새 소식 목록 행이 안쪽으로 들어가 있고 두 번째 글의 사진 자리가 빈 회색 칸인 화면',
              '목록 행이 본문 왼쪽 끝에서 시작하고 사진 없는 글에 학부 로고가 들어간 화면',
            ]),
            wide: true,
          },
          {
            title: '통합 검색 결과 폭',
            why: '검색 결과 행과 구분선이 위 필터 상자보다 좁아서 오른쪽 끝이 맞지 않았습니다. 결과 행을 필터 상자와 같은 폭으로 늘렸습니다.',
            ...shots('p4-search-width', 900, 525, [
              '필터 상자보다 결과 행 구분선이 짧게 끝나는 통합 검색 화면',
              '결과 행 구분선이 필터 상자와 같은 오른쪽 끝에서 끝나는 통합 검색 화면',
            ]),
            wide: true,
          },
        ],
      },
      {
        id: 'post',
        title: '게시물 상세',
        doc: 'post',
        items: [
          {
            title: '게시물 상세 한 벌',
            why: '공지·새 소식·세미나 상세가 따로 만들어져 정보 줄이 서로 달랐고("작성자:", "작성 날짜:" 같은 이름표가 값보다 길었습니다), 세미나에는 정보 줄이 없었습니다. 흰 머리 띠에 제목과 가운뎃점 정보 줄, 그 아래 회색 본문 띠를 두는 한 짜임으로 세 화면을 맞추고, 이전·다음 글 사이도 4에서 8로 넓혔습니다.',
            before: (
              <Gallery
                shots={[
                  {
                    file: 'g1-detail-notice-before',
                    w: 900,
                    h: 520,
                    label: '공지사항',
                    alt: '공지 상세. 작성자, 작성 날짜, 조회수가 이름표와 함께 나열된 정보 줄',
                  },
                  {
                    file: 'g1-detail-news-before',
                    w: 900,
                    h: 520,
                    label: '새 소식',
                    alt: '새 소식 상세. 날짜와 조회수만 있는 정보 줄, 본문 오른쪽에 이미지',
                  },
                  {
                    file: 'g1-detail-seminar-before',
                    w: 900,
                    h: 520,
                    label: '세미나',
                    alt: '세미나 상세. 제목 아래 정보 줄이 없고 이름, 직함, 주최, 날짜, 위치가 본문에 한 줄씩',
                  },
                ]}
              />
            ),
            after: (
              <Gallery
                shots={[
                  {
                    file: 'g1-detail-notice-after',
                    w: 900,
                    h: 520,
                    label: '공지사항',
                    alt: '공지 상세. 작성자, 날짜, 조회를 가운뎃점으로 이은 정보 줄',
                  },
                  {
                    file: 'g1-detail-news-after',
                    w: 900,
                    h: 520,
                    label: '새 소식',
                    alt: '새 소식 상세. 날짜와 조회를 가운뎃점으로 이은 같은 정보 줄',
                  },
                  {
                    file: 'g1-detail-seminar-after',
                    w: 900,
                    h: 520,
                    label: '세미나',
                    alt: '세미나 상세. 날짜, 장소, 주최를 이은 정보 줄과 연사, 요약 소제목, 오른쪽에 뜬 이미지',
                  },
                ]}
              />
            ),
            wide: true,
          },
          {
            title: '세미나 상세 정보 줄',
            why: '연사와 일정 정보가 이름·직함·소속·주최·날짜·위치 여섯 줄로 따로 나열되어 본문 앞을 길게 차지했습니다. 일정·장소·주최를 제목 아래 한 줄로 모으고, 연사는 소제목 단락으로 묶었으며, 대표 이미지는 글이 감싸 흘러 좁은 폭에서 글이 지나치게 좁아지지 않습니다.',
            ...shots('p4-seminar-detail', 900, 560, [
              '세미나 제목 아래 이름, 직함, 소속, 주최, 날짜, 위치가 한 줄씩 나열되고 오른쪽에 대표 이미지가 있는 화면',
              '제목 아래 일정과 장소, 주최가 한 줄로 있고 연사 단락과 요약 본문이 대표 이미지 옆에 이어지는 화면',
            ]),
            wide: true,
          },
          {
            title: '첨부 파일 링크의 호버',
            why: '첨부 파일 링크만 호버하면 밑줄이 생겨 다른 링크(주황)와 반응이 달랐습니다. 마우스를 올리면 주황으로 바뀝니다. 두 견본 모두 마우스를 올린 상태입니다.',
            before: <AttachmentHover old />,
            after: <AttachmentHover old={false} />,
          },
        ],
      },
      {
        id: 'reading',
        title: '읽는 본문',
        doc: 'reading',
        items: [
          {
            title: '넓은 표',
            why: '작성자가 넣은 넓은 표가 모바일에서 페이지 전체를 옆으로 밀었습니다. 표는 본문 폭에서 멈추고 표 안에서만 가로로 스크롤하며, 옆으로 더 있으면 회색 막대와 오른쪽 끝 흐림으로 알립니다. 운영 사이트 공지 20개를 320·390·1440에서 재 본 넘침이 모두 표였고, 이제 0입니다. 점선 틀이 화면 폭입니다.',
            before: <WideTable old />,
            after: <WideTable old={false} />,
          },
        ],
        extras: [
          '본문 제목이 글 제목보다 크던 것(21 대 20)을 h1·h2 20, h3 16, 그 아래 14로 정했습니다. 1px 차이라 한 줄로 적습니다.',
          '본문 인용을 왼쪽 2px 선과 짙은 회색 글자로 정했습니다. 예전 모습을 담은 캡처가 없어 한 줄로 적습니다.',
        ],
      },
      {
        id: 'unique',
        title: '구성원·연구실·예약',
        items: [
          {
            title: '인물 상세',
            why: '교수 상세의 사진이 작고 비어 있는 연락처마다 "-"가 줄지어 보였습니다. 교수·역대 교수·직원 상세를 한 짜임으로 모아 사진 틀을 크게 고정하고 빈 연락처는 그리지 않습니다.',
            ...shots('faculty-detail', 920, 420, [
              '예전 교수 상세. 오른쪽에 작은 사진과 "-"뿐인 연락처 다섯 줄이 있습니다.',
              '바뀐 교수 상세. 왼쪽에 큰 사진 틀이 있고 빈 연락처 줄이 없습니다.',
            ]),
            wide: true,
          },
          {
            title: '역대 교수 상세 빈 값',
            why: '재직 기간 값이 없는 역대 교수 상세에 "재직 기간: null - null"이 그대로 보였습니다. 값이 없는 줄은 그리지 않습니다.',
            ...shots('p4-emeritus-empty', 900, 380, [
              '작은 사진 칸 옆에 재직 기간: null - null 이 적힌 역대 교수 상세 화면',
              '빈 값 줄 없이 로고가 든 큰 사진 틀만 있는 역대 교수 상세 화면',
            ]),
            wide: true,
          },
          {
            title: '구성원 목록의 사진 틀',
            why: '사진이 없는 교수는 빈 회색 칸이라 사진을 불러오지 못한 것처럼 보였습니다. 같은 3:4 틀에 학부 로고를 둡니다.',
            ...shots('faculty-list-photo', 620, 360, [
              '예전 교수진 목록. 사진 없는 두 교수 자리가 빈 회색 칸입니다.',
              '바뀐 교수진 목록. 사진 없는 자리에 옅은 학부 로고가 있습니다.',
            ]),
            wide: true,
          },
          {
            title: '연구 스트림 링크',
            why: '연구실 상세의 스트림 링크가 주황 테두리 상자라 실행 버튼처럼 보였습니다. 모음 페이지로 가는 링크는 화살표를 붙인 글자 링크입니다.',
            ...shots('lab-stream-link', 920, 220, [
              '예전 연구실 상세. "시스템 스트림"이 주황 테두리 상자입니다.',
              '바뀐 연구실 상세. "시스템 스트림 →" 글자 링크입니다.',
            ]),
            wide: true,
          },
          {
            title: '연구실 모바일 요약 카드',
            why: '모바일에서 연구실 요약 카드가 고정 폭에 오른쪽 정렬이라 왼쪽이 비었습니다. 요약 카드를 본문 폭 전체로 폈습니다.',
            ...shots('p4-lab-summary', 390, 320, [
              '주황 외곽선 상자 링크 아래 요약 카드가 오른쪽에 붙어 왼쪽이 빈 모바일 연구실 화면',
              '시스템 스트림 글자 링크 아래 요약 카드가 좌우 폭을 다 채운 모바일 연구실 화면',
            ]),
          },
          {
            title: '예약 달력 모바일 시간 표기',
            why: '모바일 예약 달력의 시간 칸에 오전과 오후 표시가 없어 8, 9 같은 숫자가 두 번씩 나왔습니다. 데스크톱처럼 AM과 PM을 붙였습니다.',
            ...shots('p4-reservation-ampm', 390, 360, [
              '시간 칸에 8, 9, 10처럼 숫자만 있는 모바일 예약 달력',
              '시간 칸에 8AM, 12PM, 1PM처럼 오전 오후가 붙은 모바일 예약 달력',
            ]),
          },
          {
            title: '예약 달력 주간 폭',
            why: '데스크톱 예약 달력의 7개 날짜 칸이 본문 끝에 못 미쳐 끝나 오른쪽에 빈 띠가 남았습니다. 날짜 칸이 본문 폭을 나눠 씁니다.',
            ...shots('p4-reservation-week', 900, 256, [
              '일요일 칸 오른쪽에 빈 띠가 남은 데스크톱 주간 예약 달력',
              '7개 날짜 칸이 본문 폭을 끝까지 채운 데스크톱 주간 예약 달력',
            ]),
            wide: true,
          },
          {
            title: '필수 교양 안내 상자',
            why: '위 안내 상자와 아래 연도별 본문 상자의 회색과 안쪽 여백이 서로 달랐습니다. 위 상자를 아래 상자와 같은 색과 여백으로 맞췄습니다.',
            ...shots('p4-general-studies-box', 900, 362, [
              '위 안내 상자가 아래 본문 상자보다 짙은 회색인 필수 교양 과목 화면',
              '위 안내 상자와 아래 본문 상자가 같은 회색과 여백인 화면',
            ]),
            wide: true,
          },
          {
            title: '졸업 규정 소제목',
            why: '졸업 규정 소제목은 작은 글자에 주황 밑줄이 200px로 고정되어 다른 소제목과 모양이 달랐습니다. 선택형 제목과 같은 부품으로 바꿔 글자를 키우고 밑줄을 글자 폭에 맞췄습니다.',
            ...shots('p4-degree-subtitle', 560, 150, [
              '작은 소제목 아래 글자보다 긴 주황 밑줄이 있는 졸업 규정 화면',
              '더 큰 소제목 아래 주황 밑줄이 글자 폭만큼 있는 화면',
            ]),
            wide: true,
          },
        ],
      },
    ],
  },
  {
    title: '공통',
    areas: [
      {
        id: 'links',
        title: '링크와 새 탭',
        items: [
          {
            title: '링크는 같은 탭에서',
            why: '연구실 웹사이트·첨부·푸터 로고·이미지 팝업이 링크마다 새 탭을 열어 뒤로 가기가 듣지 않고 탭이 쌓였습니다. 이제 예약 동의 내용 하나를 빼고 모든 링크가 같은 탭에서 열립니다.',
            before: (
              <BrowserTabs
                tabs={['연구실 목록', '연구실 웹사이트']}
                canGoBack={false}
              />
            ),
            after: <BrowserTabs tabs={['연구실 웹사이트']} canGoBack />,
          },
          {
            title: '새 탭은 알리고 연다',
            why: '예약 폼의 개인정보 동의 내용은 같은 탭에서 열면 쓰던 예약이 사라져 사이트에서 유일하게 새 탭으로 엽니다. "보러가기"만으로는 무엇이 어디서 열리는지 몰라, 이름을 바꾸고 새 탭 아이콘과 읽기 도구용 안내를 붙였습니다.',
            before: <PrivacyLink old />,
            after: <PrivacyLink old={false} />,
          },
        ],
      },
      {
        id: 'responsive',
        title: '접근성·반응형 정리',
        items: [],
        extras: [
          '읽어야 하는 글자는 바탕 대비 4.5:1 이상으로 맞췄습니다(위 링크·보조 글자·보조 버튼·푸터·헤더 검색 카드). 주황 위 흰 글자 2.88:1만 사이트 인상이라 남겼습니다.',
          '영어 화면에서 넘치던 곳(경로, 푸터, 긴 제목)을 좁은 폭에서 줄을 바꾸게 고쳤습니다. 각각 위 카드에 있습니다.',
          '같은 역할의 부품을 하나씩으로 모아, 한 곳을 고치면 사이트 전체에 같은 개선이 퍼집니다.',
        ],
      },
    ],
  },
];

// ── 틀 ────────────────────────────────────────────────────────────

function Pane({
  side,
  children,
}: {
  side: 'before' | 'after';
  children: ReactNode;
}) {
  const after = side === 'after';
  return (
    <figure className="flex min-w-0 flex-col">
      <figcaption
        className={clsx(
          'mb-3 border-t-3 pt-2 type-label',
          after
            ? 'border-neutral-950 text-neutral-950'
            : 'border-neutral-300 text-neutral-500',
        )}
      >
        {after ? '후' : '전'}
      </figcaption>
      <div className="flex min-h-24 flex-1 flex-wrap items-center justify-center gap-3 overflow-hidden border border-neutral-200 bg-white p-4 sm:p-6">
        {children}
      </div>
    </figure>
  );
}

function ChangeItem({ item }: { item: Item }) {
  return (
    <article className="space-y-4">
      <h4 className="type-item">{item.title}</h4>
      <p className="max-w-160 type-ui leading-normal text-neutral-700">
        {item.why}
      </p>
      <div className={clsx('grid gap-6', !item.wide && 'sm:grid-cols-2')}>
        <Pane side="before">{item.before}</Pane>
        <Pane side="after">{item.after}</Pane>
      </div>
    </article>
  );
}

function AreaBlock({ area }: { area: Area }) {
  return (
    <section id={`change-${area.id}`} className="scroll-mt-8 space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-neutral-950 pb-3">
        <h3 className="type-section">{area.title}</h3>
        {area.doc && (
          <Link
            to="/design-system/$section"
            params={{ section: area.doc }}
            className="inline-flex items-center gap-1 type-meta text-neutral-600 hover:text-main-orange"
          >
            규칙 보기 <ArrowRight />
          </Link>
        )}
      </div>
      {area.items.map((item) => (
        <ChangeItem key={item.title} item={item} />
      ))}
      {area.extras && area.extras.length > 0 && (
        <div className="max-w-160 space-y-3">
          <h4 className="type-label">
            {area.items.length > 0 ? '그 밖에' : '바뀐 것'}
          </h4>
          <p className="type-meta text-neutral-500">
            코드 정리이거나 차이가 너무 작아 전후 없이 한 줄로 적은 것입니다.
          </p>
          <RuleList items={area.extras} />
        </div>
      )}
    </section>
  );
}

function Overview() {
  const areas = GROUPS.flatMap((g) => g.areas);
  const cards = areas.reduce((n, a) => n + a.items.length, 0);
  const lines = areas.reduce((n, a) => n + (a.extras?.length ?? 0), 0);
  return (
    <section className="mb-16 space-y-6">
      <h2 className="type-section">한눈에</h2>
      <p className="max-w-160 type-ui leading-normal text-neutral-700">
        여러 화면이나 핵심 화면에서 보이는 변화, 접근성·사용성 문제를 고친 것,
        화면을 만드는 규칙을 바꾼 것, 여러 벌을 하나로 모은 것은 전후 카드로
        싣고, 코드 정리이거나 차이가 너무 작은 것만 한 줄로 적었습니다. 전후
        카드 {cards}개, 한 줄 {lines}개이며, 영역 이름을 누르면 그 자리로
        갑니다.
      </p>
      <SpecTable
        head={['영역', '전후 견본', '한 줄 개선']}
        rows={GROUPS.flatMap((group) =>
          group.areas.map((area): [ReactNode, ReactNode, ReactNode] => [
            <a
              key={area.id}
              href={`#change-${area.id}`}
              className="hover:text-main-orange"
            >
              <span className="text-neutral-500">{group.title} · </span>
              {area.title}
            </a>,
            `${area.items.length}개`,
            `${area.extras?.length ?? 0}개`,
          ]),
        )}
      />
    </section>
  );
}

export function ChangesSection() {
  return (
    <>
      <Lead>
        이번 개편에서 바뀐 것을 영역마다 고치기 전과 후로 나란히 모은
        기록입니다.
      </Lead>
      <Overview />
      {GROUPS.map((group) => (
        <section key={group.title} className="mb-16 space-y-16">
          <h2 className="type-headline">{group.title}</h2>
          {group.areas.map((area) => (
            <AreaBlock key={area.id} area={area} />
          ))}
        </section>
      ))}
    </>
  );
}
