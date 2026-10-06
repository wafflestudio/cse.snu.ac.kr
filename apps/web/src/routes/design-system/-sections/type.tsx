import { ArrowRight } from 'lucide-react';
import {
  DocSection,
  DoDont,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';

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
    use: '피드형 목록·카드·인물 이름·목록을 나누는 소제목·폼 묶음 제목',
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

// Do · Don't 견본: 모바일 메인 화면 아래 바로가기 묶음(LinkSection, LinkRow).
// 예전 값(d1baf83c): 묶음 제목 14·500 회색, 링크 16·500 흰색, 영어 부제 12·500, 화살표 30·선 1.5.
const SHORTCUTS = [
  { title: 'Top Conference List' },
  { title: '신임교수초빙', subtitle: 'Faculty Recruitment' },
  { title: '구성원', subtitle: 'Faculty' },
];

function LinkGroup({ old }: { old: boolean }) {
  return (
    <div className="w-full max-w-[342px] bg-neutral-900 px-3 py-10 sm:px-4">
      <div className={old ? 'flex flex-col gap-[22px]' : 'flex flex-col gap-6'}>
        <p
          className={
            old
              ? 'text-sm font-medium text-neutral-400'
              : 'type-section text-neutral-400'
          }
        >
          바로가기
        </p>
        <div className="flex flex-col gap-5">
          {SHORTCUTS.map((l) => (
            <div
              key={l.title}
              className={
                old
                  ? 'flex h-10 items-center justify-between border-l-[5px] border-main-orange-dark pl-7'
                  : 'flex h-10 items-center justify-between border-l-[5px] border-main-orange-dark pl-6'
              }
            >
              <div className="flex items-end gap-3 text-white">
                <p className={old ? 'text-base font-medium' : 'type-item'}>
                  {l.title}
                </p>
                {l.subtitle && (
                  <p
                    className={
                      old
                        ? 'whitespace-nowrap text-xs font-medium'
                        : 'whitespace-nowrap type-meta'
                    }
                  >
                    {l.subtitle}
                  </p>
                )}
              </div>
              <ArrowRight
                className="size-7.5 shrink-0 text-white"
                strokeWidth={old ? 1.5 : 2}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Do · Don't 견본: 새 소식 목록 한 줄. 예전 요약에는 break-all 이 붙어 있었다(NewsListRow).
function NewsRow({ old }: { old: boolean }) {
  return (
    <div className="w-56 border-b border-neutral-200 pb-6">
      <p className="type-item">
        컴퓨터공학부 연구팀, 국제 학술대회 최우수 논문상
      </p>
      <p
        className="mt-2 type-body text-neutral-500"
        style={old ? { wordBreak: 'break-all' } : undefined}
      >
        컴퓨터공학부 연구팀이 대규모 언어 모델의 추론 효율을 높이는 방법을
        제안해 국제 학술대회에서 최우수 논문상을 받았습니다.
      </p>
      <p className="mt-2 type-meta text-neutral-500">2026/9/24</p>
    </div>
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
            '안에 든 것이 그것을 묶는 제목보다 크거나 굵지 않게 고릅니다. 위계가 뒤집히면 무엇이 무엇을 묶는지 읽히지 않습니다.',
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
            example: <LinkGroup old={false} />,
            caption:
              '묶음 제목은 섹션 제목(20·700), 링크는 항목 제목(16·700)이라 제목이 링크 셋을 묶는 것이 먼저 읽힙니다.',
          }}
          bad={{
            example: <LinkGroup old />,
            caption:
              '예전 모바일 메인의 묶음 제목은 14·500 회색이라 그 아래 16 흰색 링크보다 약해서 제목이 링크 사이에 묻혔습니다.',
          }}
        />
        <DoDont
          good={{
            example: <NewsRow old={false} />,
            caption: '어절 단위로 줄을 바꿔 낱말이 온전히 읽힙니다.',
          }}
          bad={{
            example: <NewsRow old />,
            caption:
              '예전 새 소식 목록의 요약은 글자 단위로 줄을 바꿔 "국/제", "받았습/니다"처럼 낱말 중간에서 끊겼습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
