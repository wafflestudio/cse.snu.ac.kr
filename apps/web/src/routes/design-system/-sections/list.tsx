import clsx from 'clsx';
import { MousePointer2, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import {
  DeviceToggle,
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
} from '../-components/doc';

// 목록 조각. 빈 상태·오류는 실제 부품, 표는 같은 값의 div(표는 화면마다 손으로 짠다).
// EmptyState·ErrorState·Pagination·DotLinkList 가 정하는 값은 적지 않는다.

const SAMPLE_ROWS = [
  ['2026학년도 전기 대학원 입학 안내', '2026/09/27'],
  ['세미나실 예약 기간 변경', '2026/09/26'],
  ['학부 장학금 신청 안내', '2026/09/25'],
];

function SampleTable({ indent = false }: { indent?: boolean }) {
  return (
    <div
      className={clsx(
        'min-w-0 flex-1 border-y border-neutral-200',
        indent && 'mx-6',
      )}
    >
      <div className="flex h-11 items-center gap-x-6 border-b border-neutral-200 px-3 type-label text-neutral-950">
        <span className="min-w-0 flex-1">제목</span>
        <span className="w-24">날짜</span>
      </div>
      {SAMPLE_ROWS.map(([title, date], i) => (
        <div
          key={title}
          className={clsx(
            'flex h-11 items-center gap-x-6 px-3 type-ui',
            i % 2 === 0 && 'bg-neutral-50',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{title}</span>
          <span className="w-24 text-neutral-500">{date}</span>
        </div>
      ))}
    </div>
  );
}

// 모바일 표: 칸 틀을 풀고 행이 카드처럼 쌓인다. 머리 행 없이 제목 한 줄, 그 아래 날짜·조회.
function SampleCards() {
  return (
    <div className="border-y border-neutral-200">
      {SAMPLE_ROWS.map(([title, date], i) => (
        <div
          key={title}
          className={clsx(
            'flex flex-col gap-2 px-6 py-6 type-ui',
            i % 2 === 0 && 'bg-neutral-50',
          )}
        >
          <span>{title}</span>
          <span className="flex gap-3">
            <span>{date}</span>
            <span>조회수 1,081</span>
          </span>
        </div>
      ))}
    </div>
  );
}

// Do · Don't 견본: 마우스를 행의 빈 곳(제목 글자와 날짜 사이)에 올린 상태. whole 이면 행 전체가 누르는 영역.
function RowHover({ whole = false }: { whole?: boolean }) {
  return (
    <div className="w-72 max-w-full border-y border-neutral-200 type-ui">
      <div
        className={clsx(
          'relative flex h-11 items-center gap-x-6 px-3',
          whole ? 'bg-neutral-100' : 'bg-neutral-50',
        )}
      >
        <span className={clsx('min-w-0 flex-1', whole && 'text-main-orange')}>
          세미나실 예약 기간 변경
        </span>
        <span className="text-neutral-500">2026/09/26</span>
        <MousePointer2 className="absolute top-5 left-44 fill-white text-neutral-950" />
      </div>
    </div>
  );
}

// 본문 왼쪽 끝을 보여 주는 틀.
function Edge({ children }: { children: ReactNode }) {
  return (
    // w-0 min-w-full: 줄지 않는 제목 글자 폭이 카드를 밀어 넓히지 않게.
    <div className="flex w-0 min-w-full overflow-hidden border-l-2 border-main-orange/60">
      {children}
    </div>
  );
}

export function ListSection() {
  return (
    <>
      <Lead>
        목록은 표와 점 링크 목록 두 형태이고, 비었을 때·실패했을 때도 같은
        자리에 표시합니다.
      </Lead>

      <DocSection title="구성">
        <DeviceToggle
          caption="표: 위아래 선, 흰 머리 행 + 아래 선, 행 44(머리 행도 44), 한 줄 걸러 옅은 줄무늬. 모바일은 머리 행을 숨기고 행이 카드처럼 쌓입니다."
          desktop={
            <div className="max-w-xl">
              <SampleTable />
            </div>
          }
          mobile={<SampleCards />}
        />
        <Example caption="빈 상태: 목록 자리에 EmptyState 한 줄.">
          <div className="w-full">
            <EmptyState>검색 결과가 존재하지 않습니다.</EmptyState>
          </div>
        </Example>
        <Example caption="오류 화면: 다른 페이지와 같은 기본 틀에 상태 코드·제목, 이유 한 줄·요청 주소·주요 버튼을 배치합니다.">
          <div className="flex w-full border border-neutral-200">
            <ErrorState
              code="404"
              title="페이지를 찾을 수 없습니다"
              detail="/ko/없는페이지"
              actions={[
                {
                  label: '메인으로 이동',
                  variant: 'primary',
                  onClick: () => {},
                },
              ]}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '여러 항목의 같은 값(날짜·조회·학점)을 견주는 목록은 모두 위 표 모양입니다. 목록마다 모양이 다르면 읽는 법을 다시 익혀야 합니다.',
            '행의 상태는 바탕을 한 단계씩 짙게 해서 나타냅니다(줄무늬 50, 선택 100, 비공개 200).',
            '머리 행과 모든 행의 칸은 같은 세로선에 맞추고, 긴 칸 하나(제목)만 남는 자리를 씁니다. 칸 사이 간격은 표에 한 번만 정합니다(24, 또는 칸마다 안쪽 12).',
            '행이 한 곳으로만 가는 표는 행 전체를 누를 수 있게 합니다. 링크가 여럿인 행(연구실)은 어디로 갈지 모호하므로 각 링크만 누릅니다.',
            '비었을 때는 이유와 관계없이 목록 자리에 빈 상태 한 줄을 둡니다. 늘 같은 자리·같은 모양이라 바로 알아봅니다.',
            '불러오는 중에는 "불러오는 중…", 더 불러올 때는 목록 아래에 회전 아이콘 하나를 표시합니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <Edge>
                <SampleTable />
              </Edge>
            ),
            caption:
              '표와 그 위아래 줄(총 개수·일괄 버튼)은 본문 왼쪽 끝에서 시작합니다.',
          }}
          bad={{
            example: (
              <Edge>
                <SampleTable indent />
              </Edge>
            ),
            caption:
              '예전 공지·교과목·관리자 표는 들여쓰기가 제각각이라 본문의 다른 요소와 왼쪽 끝이 어긋났습니다.',
          }}
        />
        <DoDont
          good={{
            example: <RowHover whole />,
            caption:
              '행 어디에 올려도 행 바탕이 진해지고 제목이 주황이 됩니다.',
          }}
          bad={{
            example: <RowHover />,
            caption:
              '예전 공지·교과목 표는 제목 글자 위에서만 눌려, 행의 빈 곳을 누르면 아무 일도 없었습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <div className="w-56">
                <EmptyState>검색 결과가 존재하지 않습니다.</EmptyState>
              </div>
            ),
            caption: '빈 상태는 목록 자리에 한 줄입니다.',
          }}
          bad={{
            example: (
              <div className="flex w-56 flex-col items-center gap-3 py-4 text-neutral-300">
                <p className="type-item font-medium">
                  검색 결과가 존재하지 않습니다
                </p>
                <Search className="size-12" />
              </div>
            ),
            caption:
              '예전 빈 상태는 화면마다 다섯 가지였고, 통합 검색은 흐린 글자 아래 큰 돋보기 그림을 두었습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
