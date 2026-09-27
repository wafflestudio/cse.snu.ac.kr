import clsx from 'clsx';
import { ChevronRight, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

// 색 찾기: 색을 고르면 축소한 화면에서 그 색이 쓰인 곳만 표시된다. 화면의 부분을 누르면 그 부분의 색이 골라진다.

type Token = { id: string; hex: string; chip: string; use: string };
type Group = { title: string; tokens: Token[] };

export const COLOR_GROUPS: Group[] = [
  {
    title: '면',
    tokens: [
      {
        id: 'white',
        hex: '#ffffff',
        chip: 'bg-white',
        use: '본문 바탕, 띠 위 카드',
      },
      {
        id: 'neutral-50',
        hex: '#fafafa',
        chip: 'bg-neutral-50',
        use: '표 줄무늬, 게시물 본문 띠',
      },
      {
        id: 'neutral-100',
        hex: '#f5f5f5',
        chip: 'bg-neutral-100',
        use: '보조 버튼, 회색 띠, 헤더 검색 칸',
      },
      {
        id: 'neutral-850',
        hex: '#1e1e1e',
        chip: 'bg-neutral-850',
        use: '카테고리 머리, 메인 공지 판, 내비 펼침',
      },
      {
        id: 'neutral-900',
        hex: '#171717',
        chip: 'bg-neutral-900',
        use: '헤더, 제목 영역',
      },
      {
        id: 'chrome-menu',
        hex: '#323235',
        chip: 'bg-chrome-menu',
        use: '왼쪽 내비 막대, 모바일 메뉴 목록',
      },
      {
        id: 'chrome-bar',
        hex: '#2d2d30',
        chip: 'bg-chrome-bar',
        use: '모바일 상단 바(이 화면에는 없음)',
      },
      {
        id: 'neutral-800',
        hex: '#262626',
        chip: 'bg-neutral-800',
        use: '모바일 푸터 윗단(이 화면에는 없음)',
      },
    ],
  },
  {
    title: '글자',
    tokens: [
      {
        id: 'neutral-950',
        hex: '#0a0a0a',
        chip: 'bg-neutral-950',
        use: '본문·제목',
      },
      {
        id: 'neutral-600',
        hex: '#525252',
        chip: 'bg-neutral-600',
        use: '보조 버튼 글자, 링크 목록',
      },
      {
        id: 'neutral-500',
        hex: '#737373',
        chip: 'bg-neutral-500',
        use: '날짜·조회 같은 보조 글자',
      },
      {
        id: 'neutral-300',
        hex: '#d4d4d4',
        chip: 'bg-neutral-300',
        use: '입력 칸 테두리, 자리표시 글자',
      },
      {
        id: 'neutral-400',
        hex: '#a3a3a3',
        chip: 'bg-neutral-400',
        use: '어두운 면의 보조 글자(내비 항목)',
      },
    ],
  },
  {
    title: '행동·강조',
    tokens: [
      {
        id: 'neutral-700',
        hex: '#404040',
        chip: 'bg-neutral-700',
        use: '주요 버튼, 고른 알약',
      },
      {
        id: 'main-orange',
        hex: '#ff6914',
        chip: 'bg-main-orange',
        use: '현재 위치, 태그, 필수 표시, 원과 선',
      },
      {
        id: 'main-orange-dark',
        hex: '#e65817',
        chip: 'bg-main-orange-dark',
        use: '더보기, 호버·눌림',
      },
      { id: 'link', hex: '#2867cf', chip: 'bg-link', use: '본문 링크' },
    ],
  },
  {
    title: '선·오류',
    tokens: [
      {
        id: 'neutral-200',
        hex: '#e5e5e5',
        chip: 'bg-neutral-200',
        use: '표 위아래 선, 구분선',
      },
      {
        id: 'red-600',
        hex: '#e7000b',
        chip: 'bg-red-600',
        use: '오류 문장, 오류 칸 테두리',
      },
    ],
  },
];

const Selected = createContext<{
  sel: string | null;
  pick: (id: string) => void;
}>({
  sel: null,
  pick: () => {},
});

// 화면의 한 부분. t 는 이 부분이 쓰는 색들(첫 번째가 대표).
function Z({
  t,
  className,
  children,
  as: Tag = 'div',
}: {
  t: string[];
  className?: string;
  children?: ReactNode;
  as?: 'div' | 'span' | 'p';
}) {
  const { sel, pick } = useContext(Selected);
  const on = sel !== null && t.includes(sel);
  return (
    <Tag
      onClick={(e) => {
        e.stopPropagation();
        pick(t[0]);
      }}
      className={clsx(
        'cursor-pointer transition-[outline-color] duration-200',
        className,
        on &&
          'relative z-10 outline-3 outline-offset-2 outline-main-orange outline-dashed',
      )}
    >
      {children}
    </Tag>
  );
}

const STAGE_H = 480;
const W = 1280;
const H = 1020;

function Screen() {
  return (
    <div className="flex h-full bg-white">
      <Z
        t={['chrome-menu']}
        className="flex w-25 shrink-0 flex-col items-center gap-9 bg-chrome-menu pt-12"
      >
        <span className="size-12 rounded-full border-2 border-main-orange" />
        {['소개', '소식', '구성원', '연구·교육', '입학', '학사'].map((m, i) => (
          <Z
            key={m}
            as="span"
            t={i === 1 ? ['chrome-menu'] : ['neutral-400']}
            className={clsx(
              'type-meta',
              i === 1 ? 'text-white' : 'text-neutral-400',
            )}
          >
            {m}
          </Z>
        ))}
      </Z>
      <div className="flex min-w-0 grow flex-col">
        <Z
          t={['neutral-900']}
          className="flex h-30 items-start justify-between bg-neutral-900 px-15 pt-12"
        >
          <div>
            <p className="type-item text-white">서울대학교 컴퓨터공학부</p>
            <p className="type-meta text-neutral-300">
              Dept. of Computer Science and Engineering
            </p>
          </div>
          <Z
            t={['neutral-100']}
            as="span"
            className="flex h-8 w-54 items-center justify-end rounded-xs bg-neutral-100 px-2"
          >
            <Search className="size-4 text-neutral-700" />
          </Z>
        </Z>
        <Z t={['neutral-900']} className="bg-neutral-900 px-25 pt-10 pb-8">
          <p className="mb-2 flex items-center gap-1 type-meta text-neutral-300">
            소식 <ChevronRight className="size-3" /> 공지사항
          </p>
          <p className="type-page-title text-white">공지사항</p>
        </Z>
        <Z t={['white']} className="relative grow bg-white pt-12 pl-25">
          <div className="w-[560px] space-y-6">
            <p className="type-body text-neutral-950">
              <Z t={['neutral-950']} as="span">
                학사 일정과 장학, 행사 소식을 알립니다. 자세한 내용은{' '}
              </Z>
              <Z
                t={['link']}
                as="span"
                className="text-link underline underline-offset-2"
              >
                학사 안내
              </Z>
              <Z t={['neutral-950']} as="span">
                를 봐 주세요.
              </Z>
            </p>
            <div className="flex gap-2">
              {['장학', '학부'].map((tag) => (
                <Z
                  key={tag}
                  t={['main-orange']}
                  as="span"
                  className="inline-flex h-6 items-center rounded-full border border-main-orange px-3 type-meta text-main-orange"
                >
                  {tag}
                </Z>
              ))}
            </div>
            <Z
              t={['neutral-200']}
              className="border-y border-neutral-200 type-ui"
            >
              <div className="flex h-11 items-center border-b border-neutral-200 px-3 type-label">
                <span className="grow">제목</span>
                <span className="w-28">날짜</span>
              </div>
              {['수강신청 안내', '논문 심사 일정', '장학금 신청 공지'].map(
                (row, i) => (
                  <Z
                    key={row}
                    t={i % 2 === 0 ? ['neutral-50'] : ['white']}
                    className={clsx(
                      'flex h-11 items-center px-3',
                      i % 2 === 0 && 'bg-neutral-50',
                    )}
                  >
                    <span className="grow">{row}</span>
                    <Z
                      t={['neutral-500']}
                      as="span"
                      className="w-28 text-neutral-500"
                    >
                      2026/9/2{i}
                    </Z>
                  </Z>
                ),
              )}
            </Z>
            <Z
              t={['main-orange-dark']}
              as="p"
              className="type-ui text-main-orange-dark"
            >
              더보기 →
            </Z>
            <div className="space-y-2">
              <p className="type-label">
                제목
                <Z t={['main-orange']} as="span" className="text-main-orange">
                  *
                </Z>
              </p>
              <Z
                t={['red-600']}
                className="flex h-8.5 w-80 items-center rounded-xs border border-red-600 px-3 type-ui text-neutral-300"
              >
                제목
              </Z>
              <Z t={['red-600']} as="p" className="type-meta text-red-600">
                제목을 입력해 주세요.
              </Z>
              <Z
                t={['neutral-300']}
                className="flex h-8.5 w-80 items-center rounded-xs border border-neutral-300 px-3 type-ui text-neutral-300"
              >
                부제목
              </Z>
            </div>
            <div className="flex justify-end gap-3">
              <Z
                t={['neutral-100', 'neutral-600']}
                as="span"
                className="inline-flex h-8.5 items-center rounded-xs border border-neutral-200 bg-neutral-100 px-4 type-label text-neutral-600"
              >
                취소
              </Z>
              <Z
                t={['neutral-700']}
                as="span"
                className="inline-flex h-8.5 items-center rounded-xs bg-neutral-700 px-4 type-label text-white"
              >
                저장
              </Z>
            </div>
          </div>
          <div className="absolute top-12 left-[720px] border-l-2 border-main-orange pl-4">
            <p className="mb-4 type-item">소식</p>
            <Z
              t={['main-orange']}
              as="p"
              className="mb-3 type-ui font-bold text-main-orange"
            >
              공지사항
            </Z>
            {['새 소식', '세미나'].map((m) => (
              <p key={m} className="mb-3 type-ui text-neutral-700">
                {m}
              </p>
            ))}
          </div>
          <Z
            t={['neutral-850']}
            className="absolute right-0 bottom-0 left-0 flex h-24 items-center gap-6 bg-neutral-850 px-25"
          >
            <span className="type-section text-white">
              카테고리 머리·공지 판
            </span>
          </Z>
        </Z>
      </div>
    </div>
  );
}

export function ColorExplorer() {
  const [sel, setSel] = useState<string | null>('main-orange');
  const [box, setBox] = useState(880);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(box / W, STAGE_H / H);
  const selected = COLOR_GROUPS.flatMap((g) => g.tokens).find(
    (t) => t.id === sel,
  );

  return (
    <Selected.Provider value={{ sel, pick: setSel }}>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_200px]">
        <div className="space-y-3">
          <div
            ref={ref}
            className="relative w-full overflow-hidden bg-neutral-100"
            // 무대 높이는 상자 폭으로만 정한다. 색을 골라도 바뀌지 않는다.
            style={{ height: H * scale }}
          >
            <div
              className="absolute top-0 origin-top-left border border-neutral-300"
              style={{
                left: Math.max(0, (box - W * scale) / 2),
                width: W,
                height: H,
                transform: `scale(${scale})`,
              }}
            >
              <Screen />
            </div>
          </div>
          <p className="h-5 type-meta text-neutral-500">
            {selected
              ? `${selected.id} ${selected.hex}: ${selected.use}`
              : '색을 고르거나 화면의 부분을 누릅니다.'}
          </p>
        </div>
        <div className="space-y-4">
          {COLOR_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="mb-2 type-label">{g.title}</p>
              <div className="flex flex-wrap gap-2 sm:flex-col sm:gap-1">
                {g.tokens.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSel(t.id === sel ? null : t.id)}
                    aria-pressed={t.id === sel}
                    className={clsx(
                      'flex items-center gap-2 px-1 py-0.5 text-left type-meta',
                      t.id === sel
                        ? 'bg-neutral-100 font-bold text-neutral-950'
                        : 'text-neutral-600 hover:text-main-orange',
                    )}
                  >
                    <span
                      className={clsx(
                        'size-4 shrink-0 border border-neutral-200',
                        t.chip,
                      )}
                    />
                    {t.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Selected.Provider>
  );
}
