import {
  ArrowRight,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronRight,
  CircleX,
  Link,
  Lock,
  MapPin,
  Menu,
  Paperclip,
  Paperclip as PaperclipIcon,
  Pin,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';

const USED = [
  ['검색', Search],
  ['닫기', X],
  ['지우기', CircleX],
  ['메뉴', Menu],
  ['첨부', Paperclip],
  ['잠금', Lock],
  ['고정', Pin],
  ['날짜', Calendar],
  ['사람', User],
  ['위치', MapPin],
  ['외부 링크', Link],
  ['더보기·이동', ArrowRight],
  ['추가', Plus],
  ['펼치기', ChevronDown],
  ['경로 구분·넘기기', ChevronRight],
  ['북마크', Bookmark],
] as const;

const ROLES = [
  { cls: 'type-meta', label: '보조 13px', text: '2026/09/25 · 첨부 2개' },
  { cls: 'type-ui', label: 'UI 글자 14px', text: '세미나실 예약' },
  { cls: 'type-item', label: '항목 제목 16px', text: '입학 설명회 안내' },
  { cls: 'type-section', label: '섹션 제목 20px', text: '연구 분야' },
];

function EmCompare() {
  const variants = [
    {
      label: 'A. 글자와 같은 크기(1배), 선도 비례',
      size: 'size-[1em]',
      absolute: false,
    },
    {
      label: 'B. 글자의 1.2배, 선도 비례 — 채택',
      size: 'size-[1.2em]',
      absolute: false,
    },
  ];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {variants.map((v) => (
        <div key={v.label} className="space-y-3">
          <p className="type-label">{v.label}</p>
          {ROLES.map((r) => (
            <div key={r.cls} className="flex items-center gap-4">
              <span className="w-28 shrink-0 type-meta text-neutral-500">
                {r.label}
              </span>
              <span className={`flex items-center gap-1 ${r.cls}`}>
                <Search
                  className={v.size}
                  strokeWidth={1.5}
                  absoluteStrokeWidth={v.absolute}
                />
                <Calendar
                  className={v.size}
                  strokeWidth={1.5}
                  absoluteStrokeWidth={v.absolute}
                />
                <PaperclipIcon
                  className={v.size}
                  strokeWidth={1.5}
                  absoluteStrokeWidth={v.absolute}
                />
                <span>{r.text}</span>
                <ArrowRight
                  className={v.size}
                  strokeWidth={1.5}
                  absoluteStrokeWidth={v.absolute}
                />
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
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

export function IconSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="한 벌">
        <p>
          아이콘은 lucide 한 벌만 쓴다. 직접 그린 SVG는 쓰지 않는다. 예외:
          유튜브처럼 브랜드 로고(lucide에 없음), 로고·메인 그래픽·오각형 같은
          그래픽.
        </p>
      </Sub>

      <Sub title="크기 비교 — 글자와 같게 / 1.2배">
        <EmCompare />
      </Sub>

      <Sub title="크기 — 옆 글자의 1.2배, 자동">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            아이콘 틀은 옆 글자의 1.2배(<code>1.2em</code>)다. lucide 그림은
            틀의 약 83%(24칸 중 20칸)라, 1.2배면 그림 높이가 옆 글자와 같아진다.
            13px 글자 옆 약 16, 16px 옆 약 19, 20px 옆 24.
          </li>
          <li>
            선은 24칸 기준 1.5로 크기에 비례한다 — 13px 글자 옆 약 1px, 20px 옆
            1.5px로 옆 글자 획과 비슷한 무게가 된다. 둘 다 <code>app.css</code>
            의 공통 규칙이 정하므로 아이콘에 크기·선 굵기를 적지 않는다.
          </li>
          <li>
            예외: 옆에 글자가 없는 아이콘만 있는 버튼(닫기·메뉴·검색 실행)은{' '}
            <code>size-5</code>(20px). 그래픽처럼 쓰는 큰 화살표(교과목 카드
            넘기기 등)는 3-6·3-7에서 본다.
          </li>
        </ul>
      </Sub>

      <Sub title="선 굵기·색·정렬">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            선 굵기는 24칸 기준 1.5 하나이고 크기에 비례한다. 아이콘마다 선
            굵기를 적지 않는다.
          </li>
          <li>
            색은 글자색을 따른다(<code>currentColor</code>). 아이콘 파일에 색을
            박지 않는다.
          </li>
          <li>
            아이콘과 글자는 <code>flex items-center</code>로 세로 가운데를
            맞춘다. 지금 곳곳에 있는 위치 보정(<code>translate</code>,{' '}
            <code>pt-px</code>, <code>mt-0.5</code>)은 없앤다.
          </li>
          <li>
            아이콘만 있는 버튼은 클릭 영역을 24×24 이상으로 둔다(그림 크기는
            그대로).
          </li>
        </ul>
      </Sub>

      <Sub title="자주 쓰는 아이콘">
        <p>같은 뜻에는 같은 그림을 쓴다.</p>
        <div className="grid max-w-3xl grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
          {USED.map(([name, Icon]) => (
            <span
              key={name}
              className="flex items-center gap-2 type-ui text-neutral-700"
            >
              <Icon /> {name}
            </span>
          ))}
        </div>
        <p className="type-meta text-neutral-500">
          채운 모양은 고정(Pin)·북마크·재생·정지만(
          <code>fill="currentColor"</code>).
        </p>
      </Sub>
    </div>
  );
}
