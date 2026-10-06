import type { ReactNode } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import { Tag } from '@/components/ui/Tag';
import HighlightedText from '@/routes/$locale/search/-components/ui/HighlightedText';
import {
  DocSection,
  DoDont,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyFooterLinkGroup } from '../-legacy/Footer';
import { LegacySearchBox } from '../-legacy/SearchBox';
import { LegacySearchResultRow } from '../-legacy/SearchResultRow';

// 간격 단계. Tailwind 단위(1 = 4px)로 쓴다. 이 밖의 값은 쓰지 않는다.
const STEPS = [
  {
    px: 4,
    unit: '1',
    role: '붙은 요소',
    use: '버튼 밖의 아이콘–글자(버튼 안은 Button이 정합니다), 날짜 · 작성자 사이',
  },
  {
    px: 8,
    unit: '2',
    role: '붙은 요소',
    use: '라벨–값, 태그 사이, 항목 제목 아래',
  },
  {
    px: 12,
    unit: '3',
    role: '가까운 요소',
    use: '버튼 사이, 목록 항목 안의 줄 사이',
  },
  {
    px: 16,
    unit: '4',
    role: '가까운 요소',
    use: '섹션 제목 아래, 카드 안쪽 여백',
  },
  {
    px: 24,
    unit: '6',
    role: '요소 사이',
    use: '목록 항목 사이(피드형 목록은 구분선 위아래), 카드 사이, 폼 필드 사이',
  },
  {
    px: 32,
    unit: '8',
    role: '블록 사이',
    use: '목록 블록 위아래',
  },
  {
    px: 48,
    unit: '12',
    role: '섹션 사이',
    use: '본문 안 섹션 사이, 검색·필터와 결과 목록 사이, 목록과 아래 버튼 줄 사이, 폼 그룹 사이',
  },
  {
    px: 64,
    unit: '16',
    role: '섹션 사이',
    use: '큰 구역 사이, 페이지 끝 여백(모바일)',
  },
  { px: 128, unit: '32', role: '페이지 끝', use: '페이지 끝 여백(데스크톱)만' },
];

function StepScale() {
  return (
    <div className="space-y-3">
      {STEPS.map((s) => (
        <div
          key={s.px}
          className="grid gap-1 sm:grid-cols-[20rem_minmax(0,1fr)] sm:items-center sm:gap-4"
        >
          <div className="flex items-center gap-4">
            <span className="w-14 shrink-0 text-right type-meta">{s.px}</span>
            <span
              className="h-4 shrink-0 bg-main-orange"
              style={{ width: s.px * 2 }}
            />
          </div>
          <p className="pl-18 type-meta text-neutral-500 sm:pl-0">
            <span className="type-label text-neutral-950">{s.role}</span>:{' '}
            {s.use}
          </p>
        </div>
      ))}
    </div>
  );
}

// 도식의 여백 띠. 실제 px 높이로 그리고 값을 적는다.
function Gap({ px, label }: { px: number; label?: string }) {
  return (
    <div
      className="relative flex items-center bg-main-orange/15"
      style={{ height: px }}
    >
      <span className="absolute -left-12 type-meta text-main-orange">{px}</span>
      {label && (
        <span className="absolute right-0 type-meta text-neutral-500">
          {label}
        </span>
      )}
    </div>
  );
}

function Diagram({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure>
      <div className="max-w-xl border border-neutral-200 py-8 pr-6 pl-16">
        {children}
      </div>
      <figcaption className="mt-2 type-meta text-neutral-500">
        {caption}
      </figcaption>
    </figure>
  );
}

function RhythmDiagram() {
  return (
    <Diagram caption="읽는 화면의 리듬. 주황 띠가 여백이고 왼쪽 숫자가 px입니다.">
      <div className="type-section">연구 분야</div>
      <Gap px={16} label="섹션 제목 아래" />
      <div className="type-body text-neutral-700">
        시스템, 이론, 인공지능, 응용의 네 영역에서 연구합니다.
      </div>
      <Gap px={32} label="블록 사이" />
      {['시스템 소프트웨어', '인공지능과 기계학습'].map((name, i) => (
        <div key={name}>
          {i > 0 && <Gap px={24} label="목록 항목 사이" />}
          <div className="type-item">{name}</div>
          <Gap px={8} label="항목 제목 아래" />
          <div className="type-meta text-neutral-500">
            연구실 6곳 · 교수 8명
          </div>
        </div>
      ))}
      <Gap px={48} label="섹션 사이" />
      <div className="type-section">연구실 목록</div>
      <Gap px={16} />
      <div className="type-ui text-neutral-500">…</div>
    </Diagram>
  );
}

function FormDiagram() {
  return (
    <Diagram caption="폼의 리듬.">
      <div className="type-item">기본 정보</div>
      <Gap px={16} label="그룹 제목 아래" />
      {['제목', '작성자'].map((f, i) => (
        <div key={f}>
          {i > 0 && <Gap px={24} label="필드 사이" />}
          <div className="type-label">{f}</div>
          <Gap px={8} label="필드명 아래" />
          <div className="h-8 border border-neutral-300 bg-white" />
        </div>
      ))}
      <Gap px={48} label="그룹 사이" />
      <div className="type-item">첨부파일</div>
    </Diagram>
  );
}

// Do · Don't 견본: 통합 검색 결과. 간격은 실제 px 로 그린다.
// 예전: 검색 상자 아래 36, 개수 아래 56(모바일 44), 결과 사이 28·선 없음, 결과 안 10.
// 지금: 검색 상자 아래 48, 개수 아래 16 + 선 + 24, 결과마다 아래 24 + 선, 결과 사이 24, 결과 안 8.
const RESULTS = [
  {
    title: '2026학년도 후기 대학원 입학 설명회',
    preview: [
      { text: '대학원 ', hit: true },
      { text: '입학 설명회 일정과 장소를 안내합니다.', hit: false },
    ],
  },
  {
    title: '대학원 수강신청 안내',
    preview: [
      { text: '대학원 ', hit: true },
      { text: '수강신청 기간과 유의 사항을 안내합니다.', hit: false },
    ],
  },
];
const RESULT_TYPE = '공지사항';
const RESULT_DATE = '2026년 9월 24일 목요일';

// 지금의 검색 상자(실제 SearchInput)와 결과 줄. 결과 줄은 search/index.tsx·SearchResultRow 와 같은 클래스로
// 다시 그렸다(실제 줄은 결과 경로로 가는 링크라 호버만 해도 그 페이지를 미리 불러온다). 미리보기는 실제 HighlightedText.
function SearchResults() {
  return (
    <div className="w-full max-w-80 text-left">
      <form
        className="mb-12 flex flex-col gap-6 bg-neutral-50 p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <SearchInput label="검색" ariaLabel="검색" defaultValue="대학원" />
      </form>
      <p className="mb-6 border-b border-neutral-200 pb-4 type-meta text-neutral-500">
        25개의 검색결과
      </p>
      <div className="flex flex-col gap-6">
        {RESULTS.map((r) => (
          <article key={r.title} className="border-b border-neutral-200 pb-6">
            <a href="#" onClick={stay} className="group flex gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="type-item tracking-wide text-neutral-950 group-hover:underline">
                  {r.title}
                </span>
                <HighlightedText segments={r.preview} />
                <div className="flex items-center gap-2">
                  <Tag label={RESULT_TYPE} />
                  <time className="type-meta tracking-wide text-neutral-500">
                    {RESULT_DATE}
                  </time>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

// 예전 검색 상자·결과 줄은 d1baf83c 사본(-legacy). 개수 줄(search/index.tsx)과 결과 사이(SearchResultList)는 그 값 그대로.
function LegacySearchResults() {
  return (
    <div className="w-full max-w-80 text-left">
      <LegacySearchBox />
      <p className="mb-11 ml-3 text-md text-neutral-500 sm:mb-14">
        25개의 검색결과
      </p>
      <div className="flex flex-col gap-7">
        {RESULTS.map((r) => (
          <LegacySearchResultRow
            key={r.title}
            item={{ ...r, type: RESULT_TYPE, date: RESULT_DATE }}
          />
        ))}
      </div>
    </div>
  );
}

// Do · Don't 견본: 푸터 링크 열. 예전 이름 아래 10·링크 사이 10, 지금 16·12.
// 셋째 값은 예전 열 폭(linkGroups.ts 의 width).
const FOOTER_GROUPS: [string, string[], string][] = [
  ['About', ['학부 소개', '교수진', '학부 안내', '대학원 안내'], 'w-[7.5rem]'],
  ['Resources', ['공지사항', '세미나', '시설 예약 안내'], 'w-[8.25rem]'],
];

// 지금 Footer 의 LinkGroup(밝은 판)과 같은 클래스로 다시 그린 것. 앱의 LinkGroup 은 파일 밖으로 내보내지 않는다.
function FooterLinks() {
  return (
    <div className="surface-light flex w-fit flex-wrap gap-x-6 gap-y-8 bg-neutral-50 p-6 text-left">
      {FOOTER_GROUPS.map(([name, links]) => (
        <section key={name}>
          <h3 className="mb-4 type-label tracking-[0.025rem] text-neutral-600">
            {name}
          </h3>
          <ul className="flex flex-col gap-3 type-ui text-neutral-500">
            {links.map((l) => (
              <li key={l}>
                <a href="#" onClick={stay} className="hover:text-neutral-950">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function LegacyFooterLinks() {
  return (
    <div className="flex w-fit flex-wrap gap-y-8 bg-neutral-50 p-6 text-left">
      {FOOTER_GROUPS.map(([name, links, width]) => (
        <div key={name} className={width}>
          <LegacyFooterLinkGroup groupName={name} links={links} />
        </div>
      ))}
    </div>
  );
}

export function SpacingSection() {
  return (
    <>
      <Lead>
        붙은 요소부터 페이지 끝까지, 요소 사이의 관계마다 정해 둔 간격입니다.
      </Lead>

      <DocSection title="값">
        <StepScale />
        <p className="type-meta text-neutral-500">단위는 px입니다.</p>
        <RhythmDiagram />
        <FormDiagram />
      </DocSection>

      <DocSection title="원칙">
        <RuleList
          items={[
            '간격은 위 아홉 단계에서 선택하고, 관계가 가까울수록 작게, 멀수록 크게 둡니다. 사용자는 간격의 크기를 보고 무엇이 같은 내용인지 알아봅니다.',
            '하는 일이 다른 구역 사이(검색·필터와 결과 목록, 목록과 그 아래 버튼 줄)는 섹션 사이 간격을 둡니다. 가까이 두면 한 구역처럼 보입니다.',
          ]}
        />
        <KnownGap>
          메인 그래픽과 원·선의 접합 보정값은 그림에 맞춘 값이라 단계 밖입니다.
        </KnownGap>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <SearchResults />,
            caption:
              '결과 개수는 선 위에 붙어 목록의 머리말이 되고, 결과마다 아래에 24와 선을 두어 결과 하나하나가 구분됩니다.',
          }}
          bad={{
            example: <LegacySearchResults />,
            caption:
              '예전 통합 검색은 결과 개수가 목록(56)보다 검색 상자(36)에 가깝고, 결과 사이에 선 없이 28만 두어 한 결과가 어디서 끝나는지 흐렸습니다.',
          }}
        />
        <DoDont
          good={{
            example: <FooterLinks />,
            caption:
              '그룹 이름 아래(16)를 링크 사이(12)보다 넓혀 이름이 아래 링크들의 제목으로 보입니다.',
          }}
          bad={{
            example: <LegacyFooterLinks />,
            caption:
              '예전 푸터는 그룹 이름 아래와 링크 사이가 똑같이 10이라 이름이 첫 번째 링크처럼 보였습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
