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
  Pin,
  Plus,
  Search,
  User,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 아이콘 페이지. 크기·선 굵기는 app.css 의 svg.lucide 공통 규칙이 정한다.

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

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function IconScale() {
  return (
    <div className="space-y-3">
      {ROLES.map((r) => (
        <div
          key={r.cls}
          className="flex flex-wrap items-center gap-x-4 gap-y-1"
        >
          <span className="w-28 shrink-0 type-meta text-neutral-500">
            {r.label}
          </span>
          <span className={`flex items-center gap-1 ${r.cls}`}>
            <Search />
            <Calendar />
            <Paperclip />
            <span>{r.text}</span>
            <ArrowRight />
          </span>
        </div>
      ))}
    </div>
  );
}

export function IconSection() {
  return (
    <>
      <Lead>아이콘은 lucide 한 벌에서 그림만 고릅니다.</Lead>

      <DocSection title="값">
        <Sub title="크기·선 굵기">
          <Example caption="틀은 옆 글자의 1.2배라 그림 높이가 글자와 같아지고, 선은 크기에 비례해 글자 획과 비슷한 무게가 됩니다(13px 옆 약 16, 20px 옆 24).">
            <IconScale />
          </Example>
        </Sub>
        <Sub title="자주 쓰는 아이콘">
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
        </Sub>
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '브랜드 로고(유튜브 등), 학교 로고, 메인 그래픽처럼 lucide에 없는 것만 따로 그린 그림을 씁니다.',
            '아이콘 크기와 선 굵기는 옆 글자를 따릅니다. 예외: 옆에 글자가 없는 아이콘만 있는 버튼(닫기·메뉴·검색 실행)은 20px입니다.',
            '그래픽처럼 쓰는 큰 화살표(교과목 카드 넘기기 등)는 메인·카테고리, 고유 화면이 정합니다.',
            '아이콘 색은 옆 글자색과 같습니다.',
            '아이콘과 글자는 세로 가운데로 맞춥니다. 아이콘만 위아래로 조금 옮기지 않습니다.',
            '아이콘만 있는 버튼은 클릭 영역을 24×24 이상으로 두고(그림 크기는 그대로) 읽어 줄 이름을 붙입니다.',
            '채운 모양은 고정·북마크·재생·정지만 씁니다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않기">
        <DoDont
          good={{
            example: (
              <span className="flex items-center gap-1 type-meta text-neutral-500">
                <Calendar />
                2026/09/25
              </span>
            ),
            caption: '아이콘이 옆 글자 크기에 맞습니다.',
          }}
          bad={{
            example: (
              <span className="flex items-center gap-1 type-meta text-neutral-500">
                <Calendar className="size-6" />
                2026/09/25
              </span>
            ),
            caption: '아이콘만 옆 글자보다 커서 튑니다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['button', '버튼'],
            ['type', '글자'],
            ['graphic', '그래픽'],
          ]}
        />
      </DocSection>
    </>
  );
}
