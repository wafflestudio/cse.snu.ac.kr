import {
  ArrowRight,
  Bookmark,
  Calendar,
  CircleX,
  Link,
  Lock,
  MapPin,
  Menu,
  Paperclip,
  Paperclip as PaperclipIcon,
  Pause,
  Pin,
  Play,
  Plus,
  Search,
  User,
} from 'lucide-react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import ClearIcon from '@/components/form/assets/clear_icon.svg?react';
import MenuSvg from '@/components/layout/Header/assets/menu.svg?react';
import MobileSearch from '@/components/layout/MobileNav/assets/search.svg?react';
import SmallRightArrow from '@/components/ui/assets/small_right_arrow.svg?react';
import PauseSvg from '@/routes/$locale/-components/news/assets/pause.svg?react';
import PlaySvg from '@/routes/$locale/-components/news/assets/play.svg?react';
import BookmarkSvg from '@/routes/$locale/academics/-components/courses/assets/bookmark_icon.svg?react';
import ImportantArrow from '@/routes/$locale/assets/important_arrow.svg?react';
import PlusSvg from '@/routes/$locale/assets/plus.svg?react';
import ClipSvg from '@/routes/$locale/community/notice/assets/clip.svg?react';
import LockSvg from '@/routes/$locale/community/notice/assets/lock.svg?react';
import PinSvg from '@/routes/$locale/community/notice/assets/pin.svg?react';
import CalendarSvg from '@/routes/$locale/community/seminar/assets/calendar.svg?react';
import DistanceSvg from '@/routes/$locale/community/seminar/assets/distance.svg?react';
import PersonSvg from '@/routes/$locale/community/seminar/assets/person.svg?react';
import LinkSvg from '@/routes/$locale/research/centers/assets/link_icon.svg?react';

type Svg = ComponentType<SVGProps<SVGSVGElement>>;

// 직접 만든 SVG → 바꿀 lucide 아이콘. 어두운 바탕에서 쓰는 것은 dark 로 그린다.
const REPLACEMENTS: {
  what: string;
  where: string;
  from: Svg;
  to: Svg;
  dark?: boolean;
  fill?: boolean;
}[] = [
  {
    what: '검색',
    where: '모바일 메뉴',
    from: MobileSearch,
    to: Search,
    dark: true,
  },
  {
    what: '메뉴',
    where: '모바일 상단 바',
    from: MenuSvg,
    to: Menu,
    dark: true,
  },
  { what: '지우기', where: '편집 폼 파일 목록', from: ClearIcon, to: CircleX },
  { what: '첨부', where: '공지 목록', from: ClipSvg, to: Paperclip },
  { what: '잠금', where: '공지 목록(비공개)', from: LockSvg, to: Lock },
  { what: '고정', where: '공지 목록(고정)', from: PinSvg, to: Pin, fill: true },
  { what: '날짜', where: '세미나 목록', from: CalendarSvg, to: Calendar },
  { what: '사람', where: '세미나 목록', from: PersonSvg, to: User },
  { what: '위치', where: '세미나 목록·시설', from: DistanceSvg, to: MapPin },
  { what: '더보기', where: '메인 공지', from: PlusSvg, to: Plus },
  {
    what: '더보기',
    where: '메인 새 소식',
    from: SmallRightArrow,
    to: ArrowRight,
  },
  {
    what: '바로가기',
    where: '메인 중요 안내 카드',
    from: ImportantArrow,
    to: ArrowRight,
  },
  { what: '외부 링크', where: '연구 센터', from: LinkSvg, to: Link },
  {
    what: '북마크',
    where: '교과목 상세',
    from: BookmarkSvg,
    to: Bookmark,
    fill: true,
  },
  {
    what: '재생',
    where: '메인 뉴스 캐러셀',
    from: PlaySvg,
    to: Play,
    fill: true,
  },
  {
    what: '정지',
    where: '메인 뉴스 캐러셀',
    from: PauseSvg,
    to: Pause,
    fill: true,
  },
];

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
      label: 'B. 글자의 1.2배, 선은 1.5px 고정 (추천)',
      size: 'size-[1.2em]',
      absolute: true,
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
      <div className="border-l-4 border-main-orange bg-neutral-50 px-4 py-3 type-meta">
        <p className="type-label">제안(미적용)</p>
        <p>
          아래 "직접 만든 SVG → lucide" 표에서 그림이 바뀌는 16개를 봐 주세요.
          그림 모양이 바뀌는 것은 이것뿐이고, 나머지는 크기·선 굵기·색 정리다.
        </p>
      </div>

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
            선은 크기와 관계없이 1.5px이다. 둘 다 <code>app.css</code>의 공통
            규칙이 정하므로 아이콘에 크기·선 굵기를 적지 않는다.
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
            선 굵기는 1.5 하나다. 지금은 1.5와 기본값 2가 섞여 있다(같은 줄
            안에서도).
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

      <Sub title="직접 만든 SVG → lucide">
        <table className="w-full max-w-3xl text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-2 type-label">뜻</th>
              <th className="py-2 type-label">쓰는 곳</th>
              <th className="py-2 type-label">지금</th>
              <th className="py-2 type-label">lucide</th>
            </tr>
          </thead>
          <tbody>
            {REPLACEMENTS.map((r) => {
              const From = r.from;
              const To = r.to;
              const cell = r.dark
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-700';
              return (
                <tr
                  key={r.what + r.where}
                  className="border-b border-neutral-100"
                >
                  <td className="py-2 pr-4 type-ui">{r.what}</td>
                  <td className="py-2 pr-4 type-meta text-neutral-500">
                    {r.where}
                  </td>
                  <td className="py-2 pr-4">
                    <span
                      className={`inline-flex size-10 items-center justify-center ${cell}`}
                    >
                      <From className="size-6" />
                    </span>
                  </td>
                  <td className="py-2">
                    <span
                      className={`inline-flex size-10 items-center justify-center ${cell}`}
                    >
                      <To
                        className="size-6"
                        fill={r.fill ? 'currentColor' : 'none'}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="type-meta text-neutral-500">
          고정·북마크·재생·정지는 지금처럼 채운 모양으로 둔다. 쓰이지 않는 사본
          SVG 3개와 보이지 않는 메인 아래 화살표는 지운다.
        </p>
      </Sub>

      <Sub title="함께 고치는 것">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            헤더 검색 버튼: 밝은 바(#e5e5e5) 위에서 호버하면 흰색으로 흐려진다 →
            호버 neutral-700.
          </li>
          <li>
            연구실 자료 아이콘(PDF·유튜브): 기본 neutral-400(흐림) → 500, 호버
            950·800 → 950 하나로.
          </li>
          <li>
            이미지 팝업의 체크박스: 다른 곳에서 가져온 그림 → 사이트의
            체크박스와 같은 lucide 그림.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
