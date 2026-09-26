import clsx from 'clsx';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

// 목록 조각. 빈 상태·오류는 실제 부품, 머리 행은 같은 값의 div(열 폭은 목록마다 다르다).

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

// 표 한 모양(공지사항 모양): 목록 위아래 선, 흰 머리 행 + 아래 선, 행 44, 옅은 줄무늬.
const SAMPLE_ROWS = [
  ['2026학년도 전기 대학원 입학 안내', '2026/09/27'],
  ['세미나실 예약 기간 변경', '2026/09/26'],
  ['학부 장학금 신청 안내', '2026/09/25'],
  ['연구실 안전 교육', '2026/09/24'],
];

type TableStyle = {
  name: string;
  wrap: string;
  header: string;
  row: (i: number) => string;
  rows?: string;
};

const TABLE: TableStyle = {
  name: '표',
  wrap: 'border-y border-neutral-200',
  header: 'h-11 border-b border-neutral-200 type-label text-neutral-950',
  row: (i) => clsx('h-11', i % 2 === 0 && 'bg-neutral-50'),
};

function SampleTable({ style }: { style: TableStyle }) {
  return (
    <div className="space-y-2">
      <div className={style.wrap}>
        <div className={clsx('flex items-center px-3', style.header)}>
          <span className="flex-1">제목</span>
          <span className="w-28">날짜</span>
        </div>
        <div className={style.rows}>
          {SAMPLE_ROWS.map(([title, date], i) => (
            <div
              key={title}
              className={clsx('flex items-center px-3 type-ui', style.row(i))}
            >
              <span className="flex-1">{title}</span>
              <span className="w-28 text-neutral-500">{date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="표 — 한 모양">
        <div className="max-w-xl">
          <SampleTable style={TABLE} />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            표형 목록(공지·연구실·학회·창업 기업·교과목·관리자)은 모두 이
            모양이다: 목록 위아래 neutral-200 선, 머리 행은 흰 바탕에 아래 선
            하나(14/500 neutral-950), 행 높이 44 — 머리 행도 행과 같은 44.
          </li>
          <li>
            행 사이에는 선을 긋지 않고 첫 행부터 한 줄 걸러 neutral-50을 칠한다.
            고른 행은 neutral-100, 비공개 글은 neutral-200.
          </li>
          <li>
            여섯 목록에서 공지사항 모양을 골랐다(머리 행만 맞췄을 때 행 높이·
            줄무늬·점선이 목록마다 달라 표 전체가 맞지 않았다).
          </li>
          <li>
            칸 폭을 적지 않는다. 칸 틀(<code>grid-template-columns</code>)을
            목록에 한 번만 적고 머리 행·행이 <code>subgrid</code>로 같이 쓴다 —
            칸은 내용만큼(<code>auto</code>), 제목처럼 긴 칸 하나만 남는 자리(
            <code>minmax(0,1fr)</code>). 글자·번역·데이터가 바뀌어도 머리 행과
            행이 어긋나지 않는다.
          </li>
          <li>모바일에서는 칸 틀을 풀고 행이 카드처럼 쌓인다(머리 행 숨김).</li>
          <li>
            표는 본문 폭을 다 쓰고 본문 왼쪽 끝에서 시작한다 — 표에{' '}
            <code>mx-3</code>·<code>ml-6</code> 같은 들여쓰기를 두지 않는다. 표
            위아래 줄(총 개수·일괄 버튼·정렬)도 같은 끝에 맞춘다.
          </li>
          <li>
            칸 간격은 표에 한 번(데스크톱 24)만 적는다. 행에 <code>gap</code>을
            다시 적으면 subgrid 간격을 덮어 머리 행과 칸이 어긋난다.
          </li>
        </ul>
      </Sub>

      <Sub title="빈 상태·불러오는 중 — 같은 자리, 같은 모양">
        <div className="grid gap-6 sm:grid-cols-2">
          <EmptyState>검색 결과가 존재하지 않습니다.</EmptyState>
          <EmptyState>검색어를 두글자 이상 입력해주세요</EmptyState>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            목록이 비면 목록 자리에 <code>EmptyState</code> 한 줄: 14
            neutral-500 가운데, 위아래 64, 목록처럼 위아래 선. 문장은 짧게 한
            줄(DS-035 "문구를 늘리면 장황해 보인다").
          </li>
          <li>
            검색 결과 없음·검색어가 짧음·연도 자료 없음이 모두 이 모양이다.
            그림을 넣지 않는다.
          </li>
          <li>
            불러오는 중 문구는 "불러오는 중…"으로 적는다. 검색 결과를 더 불러올
            때는 목록 아래 도는 아이콘 하나.
          </li>
        </ul>
      </Sub>

      <Sub title="페이지 넘김">
        <ul className="list-disc space-y-1 pl-5">
          <li>쪽이 하나뿐이면 페이지 넘김을 그리지 않는다.</li>
          <li>나머지(고른 쪽 주황 굵게+밑줄, 편집 중 비활성)는 그대로.</li>
        </ul>
      </Sub>

      <Sub title="점 링크 목록">
        <div className="space-y-2">
          {['컴퓨터 구조 연구실', '지능형 데이터 시스템 연구실'].map((x) => (
            <p key={x} className="flex items-center gap-2 type-ui">
              <span className="size-2.5 rounded-full border border-main-orange" />
              {x}
            </p>
          ))}
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            주황 원 + 링크 목록은 <code>DotLinkList</code> 하나(연구 스트림의
            연구실, 장학 목록). 항목 높이 약 34, 좌우 12.
          </li>
        </ul>
      </Sub>

      <Sub title="오류 화면 — 다른 페이지와 같은 틀">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">전</p>
            <div className="flex h-72 flex-col items-center justify-center bg-neutral-900 text-center">
              <p className="mb-4 text-[64px] font-bold leading-none text-main-orange">
                404
              </p>
              <p className="mb-6 type-item text-white">
                존재하지 않는 경로입니다: /ko/없는페이지
              </p>
              <Button variant="primary">메인으로 이동</Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">지금</p>
            <div className="flex border border-neutral-200">
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
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            오류 화면도 다른 페이지와 같은 틀(3-1 기본 틀)이다. 어두운 제목
            영역에 상태 코드(경로 자리, 13px)와 제목(페이지 제목 단계), 흰
            본문에 이유 한 줄·요청 주소·주요 버튼.
          </li>
          <li>
            404: "페이지를 찾을 수 없습니다" / 요청 주소 / [메인으로 이동].
            제목과 같은 말을 본문에 되풀이하지 않는다.
          </li>
          <li>
            500: "문제가 생겼습니다" / "잠시 후 다시 시도해 주세요." / [다시
            시도](보조) [메인으로 이동](주요).
          </li>
        </ul>
      </Sub>
    </div>
  );
}
