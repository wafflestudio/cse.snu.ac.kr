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
import PrivacyPolicyLink from '@/routes/$locale/reservations/-components/ReservationCalendar/PrivacyPolicyLink';
import {
  DocSection,
  DoDont,
  Example,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyPrivacyPolicyLink } from '../-legacy/AddReservationModal';

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
      <Lead>아이콘은 lucide 한 벌에서 모양만 선택합니다.</Lead>

      <DocSection title="값">
        <Sub title="크기·선 굵기">
          <Example caption="틀은 옆 글자의 1.2배라 그림 높이가 글자와 같아지고, 선은 크기에 비례해 글자 획과 비슷한 무게가 됩니다(13px 옆 약 16, 20px 옆 24).">
            <IconScale />
          </Example>
        </Sub>
        <Sub title="자주 사용하는 아이콘">
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

      <DocSection title="원칙">
        <RuleList
          items={[
            '아이콘은 lucide 한 벌에서 고릅니다(없는 것은 브랜드·학교 로고와 메인 그래픽뿐). 한 벌이어야 선 굵기와 모서리가 맞습니다.',
            '크기·선 굵기·색은 옆 글자를 따르고, 세로 가운데로 정렬하며 위치를 따로 보정하지 않습니다. 크기·색이 글자와 다른 아이콘은 글자와 따로 놀아 보이고, 보정값은 글자 크기가 바뀌면 다시 어긋납니다.',
            '아이콘만 있는 버튼(닫기·메뉴·검색 실행)에는 반드시 스크린 리더가 읽을 이름을 붙이고 누르는 영역을 24×24 이상으로 두어야 합니다. 그림은 20px입니다.',
            '채운 모양은 고정·북마크·재생·정지에만 씁니다. 선 아이콘 사이에 채운 모양이 있으면 강조처럼 보입니다.',
          ]}
        />
        <KnownGap>
          카테고리 카드·교과목 카드의 큰 화살표는 그래픽이라 옆 글자를 따르지
          않습니다.
        </KnownGap>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            // 예약 모달의 실제 동의 내용 링크. 새 탭으로 열리지 않게 클릭을 막는다.
            example: (
              <div onClickCapture={stay}>
                <PrivacyPolicyLink />
              </div>
            ),
            caption:
              '아이콘은 옆 글자 크기를 따르고 글자와 세로 가운데로 정렬합니다.',
          }}
          bad={{
            example: <LegacyPrivacyPolicyLink />,
            caption:
              '예전 예약 모달의 화살표는 16px 고정 크기에 3px 내림 보정까지 넣었지만 글자 옆에 서지 못하고 아랫줄로 밀려났습니다. 크기와 위치를 따로 정한 아이콘은 글자와 따로 놉니다.',
          }}
        />
      </DocSection>
    </>
  );
}
