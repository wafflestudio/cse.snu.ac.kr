import { Tag } from '@/components/ui/Tag';
import LinkRow from '@/routes/$locale/-components/LinkRow';
import {
  DocSection,
  DoDont,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyLinkRow } from '../-legacy/LinkRow';
import { LegacyLinkSectionColumn } from '../-legacy/LinkSection';
import { LegacyNewsListRow } from '../-legacy/NewsListRow';

// 글자 페이지. 크기·굵기·줄높이는 app.css 의 type-* 가 정본이다.

type Level = {
  role: string;
  cls: string;
  spec: string;
  sample: string;
  use: string;
  preview: string;
};

const LEVELS: Level[] = [
  {
    role: '페이지 제목',
    cls: 'type-page-title',
    spec: '32 · 700 (모바일 24)',
    sample: '학부 소개',
    use: '페이지 맨 위 어두운 제목 영역',
    preview: 'type-page-title',
  },
  {
    role: '메인 섹션 제목',
    cls: 'type-headline',
    spec: '24 · 700',
    sample: '공지사항',
    use: '메인 화면의 공지·새 소식·링크 섹션 제목만',
    preview: 'type-headline',
  },
  {
    role: '섹션 제목',
    cls: 'type-section',
    spec: '20 · 700',
    sample: '연구 분야',
    use: '본문 안 큰 구획, 게시물 상세 제목, 모달 제목',
    preview: 'type-section',
  },
  {
    role: '항목 제목',
    cls: 'type-item',
    spec: '16 · 700',
    sample: '2026학년도 후기 대학원 입학 설명회',
    use: '피드형 목록·카드·인물 이름·목록을 나누는 소제목·폼 그룹 제목',
    preview: 'type-item',
  },
  {
    role: '본문',
    cls: 'type-body',
    spec: '14 · 400 · 줄높이 28',
    sample:
      '컴퓨터공학부는 컴퓨터 과학과 공학의 기초 이론부터 응용까지 폭넓게 교육합니다.',
    use: '여러 줄로 읽는 문단, 설명 문단',
    preview: 'type-body',
  },
  {
    role: 'UI 글자',
    cls: 'type-ui',
    spec: '14 · 400',
    sample: '2026학년도 1학기 수강신청 안내',
    use: '한 줄 UI 글자(표 셀, 내비·푸터 링크, 드롭다운 항목, 입력 글자)',
    preview: 'type-ui',
  },
  {
    role: '라벨',
    cls: 'type-label',
    spec: '14 · 500',
    sample: '제목 · 작성자 · 첨부파일',
    use: '폼 필드명·검색 라벨, 표 헤더, 탭, 버튼 글자',
    preview: 'type-label',
  },
  {
    role: '보조',
    cls: 'type-meta',
    spec: '13 · 400',
    sample: '2026/09/25 · 행정실 · 조회수 1,024',
    use: '날짜·작성자·조회수, 도움말, breadcrumb, 뱃지, 달력 칸 같은 가장 작은 글자',
    preview: 'type-meta text-neutral-500',
  },
];

function Scale() {
  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {LEVELS.map((l) => (
        <div
          key={l.role}
          className="grid gap-2 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
        >
          <div className="space-y-1">
            <p className="type-label">{l.role}</p>
            <p className="type-meta text-neutral-500">{l.spec}</p>
          </div>
          <div className="space-y-2">
            <p className={l.preview}>{l.sample}</p>
            <p className="type-meta text-neutral-500">{l.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Do · Don't 견본: 모바일 메인 화면 아래 바로가기 한 열(LinkSection, LinkRow).
// 지금은 실제 LinkRow 를, 예전은 d1baf83c 사본(-legacy)을 그린다. 링크는 이 페이지를 떠나지 않는다.
const SHORTCUTS = [
  { title: 'Top Conference List' },
  { title: '신임교수초빙', subtitle: 'Faculty Recruitment' },
  { title: '구성원', subtitle: 'Faculty' },
];

function Shortcuts() {
  return (
    <div
      className="w-full max-w-[342px] bg-neutral-900 px-3 py-10 sm:px-4"
      onClickCapture={stay}
    >
      {/* LinkSection 의 한 열과 같은 클래스(앱 LinkSection 은 번역·경로에 묶여 있어 열만 옮겼다). */}
      <div className="flex flex-1 flex-col gap-6 sm:gap-8">
        <h3 className="type-section text-neutral-400">바로가기</h3>
        <div className="flex flex-col gap-5">
          {SHORTCUTS.map((l) => (
            <LinkRow key={l.title} to="/design-system/type" {...l} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LegacyShortcuts() {
  return (
    <div className="w-full max-w-[342px] bg-neutral-900 px-3 py-10 sm:px-4">
      <LegacyLinkSectionColumn title="바로가기">
        {SHORTCUTS.map((l) => (
          <LegacyLinkRow key={l.title} {...l} />
        ))}
      </LegacyLinkSectionColumn>
    </div>
  );
}

// Do · Don't 견본: 새 소식 목록 한 줄. 예전 요약에는 break-all 이 붙어 있었다(NewsListRow).
const NEWS = {
  title: '컴퓨터공학부 연구팀, 국제 학술대회 최우수 논문상',
  description:
    '컴퓨터공학부 연구팀이 대규모 언어 모델의 추론 효율을 높이는 방법을 제안해 국제 학술대회에서 최우수 논문상을 받았습니다',
  date: '2026/9/24 (목)',
  viewCount: 198,
  tags: ['연구'],
};

// 지금의 NewsListRow 와 같은 클래스로 다시 그린 것. 실제 부품은 상세 경로로 가는 링크라
// 호버만 해도 그 페이지를 미리 불러와(서버 요청) 견본에 쓰지 않는다. 사진 자리는 뺐다.
function NewsRow() {
  return (
    <article className="flex w-full max-w-80 flex-col-reverse gap-4 border-b border-neutral-200 pb-6 text-left sm:flex-row sm:gap-8">
      <div className="flex flex-1 flex-col justify-between">
        <p className="mb-2 flex items-center gap-2 type-meta text-neutral-950 sm:hidden">
          <time>{NEWS.date}</time>
          <span>조회수 {NEWS.viewCount}</span>
        </p>
        <div className="flex flex-col items-start">
          <a href="#" onClick={stay} className="hover:underline">
            <h3 className="mb-2 type-item">{NEWS.title}</h3>
          </a>
          <a
            href="#"
            onClick={stay}
            className="mb-3 line-clamp-3 type-body text-neutral-500 hover:cursor-pointer sm:mb-8"
          >
            {NEWS.description}...
          </a>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {NEWS.tags.map((tag) => (
              <Tag key={tag} label={tag} onClick={() => undefined} />
            ))}
          </div>
          <p className="hidden items-center gap-2 self-end whitespace-nowrap type-meta text-neutral-950 sm:flex">
            <time>{NEWS.date}</time>
            <span>조회수 {NEWS.viewCount}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

export function TypeSection() {
  return (
    <>
      <Lead>
        제목·본문·보조 글처럼 글자의 역할마다 정해 둔 크기와 굵기입니다.
      </Lead>

      <DocSection title="값">
        <Scale />
      </DocSection>

      <DocSection title="원칙">
        <RuleList
          items={[
            '역할 하나가 크기·굵기·줄높이를 함께 정하고, 색만 따로 고릅니다. 크기만 골라 쓰면 같은 역할이 화면마다 달라 보입니다.',
            '안에 든 것이 그것을 묶는 제목보다 크거나 굵지 않게 고릅니다. 위계가 뒤집히면 무엇이 무엇에 속하는지 알기 어렵습니다.',
            '항목 하나가 글 하나면 항목 제목(피드형 목록, 모바일에서 카드처럼 쌓인 표 행), 표의 한 칸이면 UI 글자입니다.',
            '줄간격은 본문 역할에만 있습니다. 한 줄 글자에 주면 카드·목록이 부풉니다. 여러 줄이 되는 작은 보조 글(카드 설명)만 줄높이 1.5를 더합니다.',
            '13px보다 작은 글자는 사용하지 않습니다. 한글은 12px에서 읽기 어렵습니다.',
            '줄은 어절 단위로 바뀝니다. 긴 URL·메일 주소가 좁은 칸을 넘칠 때만 그 칸에서 글자 중간 줄바꿈을 허용합니다. 전체에 허용하면 한국어 낱말이 끊깁니다.',
          ]}
        />
        <KnownGap>
          카테고리 대제목, 메인 슬로건, 404 숫자는 그 자리에서만 쓰는 그래픽
          글자라 단계 밖입니다.
        </KnownGap>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <Shortcuts />,
            caption:
              '그룹 제목은 섹션 제목(20·700), 링크는 항목 제목(16·700)이라 제목이 먼저 눈에 들어오고, 아래 링크 셋이 그 제목에 속한다는 것을 알 수 있습니다.',
          }}
          bad={{
            example: <LegacyShortcuts />,
            caption:
              '예전 모바일 메인의 그룹 제목은 14·500 회색이라 그 아래 16 흰색 링크보다 약해서 제목이 링크 사이에 묻혔습니다.',
          }}
        />
        <DoDont
          good={{
            example: <NewsRow />,
            caption: '어절 단위로 줄을 바꿔 낱말이 중간에서 끊기지 않습니다.',
          }}
          bad={{
            example: (
              <div className="w-full max-w-80 text-left">
                <LegacyNewsListRow post={NEWS} />
              </div>
            ),
            caption:
              '예전 새 소식 목록의 요약은 글자 단위로 줄을 바꿔 낱말이 중간에서 끊겼습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
