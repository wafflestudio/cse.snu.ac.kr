import clsx from 'clsx';
import type { ReactNode } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import {
  DeviceToggle,
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
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

// 모바일 표: 칸 틀을 풀고 행이 카드처럼 쌓인다 — 머리 행 없이 제목 한 줄, 그 아래 날짜·조회.
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
        목록은 표와 점 링크 목록 두 모양이고, 비었을 때·실패했을 때도 같은
        자리에 둔다.
      </Lead>

      <DocSection title="짜임">
        <DeviceToggle
          caption="표: 위아래 선, 흰 머리 행 + 아래 선, 행 44(머리 행도 44), 한 줄 걸러 옅은 줄무늬. 모바일은 머리 행을 숨기고 행이 카드처럼 쌓인다."
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
        <Example caption="오류 화면: 다른 페이지와 같은 기본 틀 — 상태 코드·제목, 이유 한 줄·요청 주소·주요 버튼.">
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

      <DocSection title="규칙">
        <RuleList
          items={[
            '표형 목록(공지·연구실·학회·창업 기업·교과목·관리자)은 모두 위 표 모양이다. 행 사이에 선을 긋지 않는다.',
            '줄무늬는 첫 행부터 neutral-50. 고른 행은 neutral-100, 비공개 글은 neutral-200.',
            '칸 폭을 적지 않는다. 칸 틀은 표에 한 번 적고 머리 행·행이 subgrid로 같이 쓴다 — 칸은 내용만큼, 제목처럼 긴 칸 하나만 남는 자리.',
            '칸 사이는 표에 한 번 준다 — 표의 간격 24, 또는 칸마다 같은 안 여백 12 중 하나.',
            '행이 모바일 카드용 간격을 따로 가지면 데스크톱에서 표와 같은 값으로 되돌린다 — 안 그러면 머리 행과 칸이 어긋난다.',
            '행이 한 곳으로만 가는 표(공지·교과목)는 행 전체를 누른다 — 링크는 제목 하나로 두고 누르는 영역만 행으로 넓힌다. 호버는 행 바탕 한 단계 진하게 + 제목 주황, 초점 링은 행 안쪽. 한 행에 링크가 여럿이면(연구실) 넓히지 않는다.',
            '편집 중에는 페이지 넘김을 비활성으로 둔다.',
            '빈 상태는 검색 결과 없음·검색어가 짧음·연도 자료 없음 모두 EmptyState 한 줄이다. 그림을 넣지 않는다.',
            '불러오는 중 문구는 "불러오는 중…". 검색 결과를 더 불러올 때는 목록 아래 도는 아이콘 하나.',
            '404: "페이지를 찾을 수 없습니다" / 요청 주소 / [메인으로 이동]. 제목과 같은 말을 본문에 되풀이하지 않는다.',
            '500: "문제가 생겼습니다" / "잠시 후 다시 시도해 주세요." / [다시 시도](보조) [메인으로 이동](주요).',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <Edge>
                <SampleTable />
              </Edge>
            ),
            caption:
              '표는 본문 폭을 다 쓰고 본문 왼쪽 끝에서 시작한다. 표 위아래 줄(총 개수·일괄 버튼·정렬)도 같은 끝에 맞춘다.',
          }}
          bad={{
            example: (
              <Edge>
                <SampleTable indent />
              </Edge>
            ),
            caption:
              '표를 좌우로 들여 쓴다 — 본문의 다른 덩어리와 끝이 어긋난다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['page', '페이지 틀'],
            ['search', '검색 입력'],
            ['button', '버튼'],
            ['writing', '문구'],
          ]}
        />
      </DocSection>
    </>
  );
}
