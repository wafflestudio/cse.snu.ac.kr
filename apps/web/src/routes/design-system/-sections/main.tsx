import clsx from 'clsx';
import { ArrowRight, Plus } from 'lucide-react';
import type { ReactNode } from 'react';

// 카테고리·메인 조각을 같은 값의 div 로 그린다. 실제는 CategoryPage·CategoryGrid·메인 섹션(routes/$locale/-components).

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function Card({
  title,
  state,
  next,
}: {
  title: string;
  state: 'idle' | 'hover' | 'selected';
  next: boolean;
}) {
  const bg = next
    ? state === 'selected'
      ? 'bg-main-orange-dark text-white'
      : state === 'hover'
        ? 'bg-neutral-200 text-neutral-950'
        : 'bg-neutral-100 text-neutral-950'
    : state === 'idle'
      ? 'bg-neutral-100 text-neutral-950'
      : 'bg-main-orange-dark text-neutral-950';
  return (
    <div className="space-y-1">
      <div
        className={clsx(
          'flex h-40 w-44 flex-col justify-between',
          next ? 'p-6' : 'px-7 py-6',
          bg,
        )}
      >
        <p className="type-item">{title}</p>
        <ArrowRight
          className={clsx('size-8', state === 'hover' && 'translate-x-2.5')}
        />
      </div>
      <p className="type-meta text-neutral-500">
        {state === 'idle' ? '기본' : state === 'hover' ? '호버' : '선택'}
      </p>
    </div>
  );
}

export function MainSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="카테고리 머리 — 큰 제목">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">전</p>
            <div className="bg-neutral-850 px-6 py-8">
              <p className="mb-2 text-[20px] text-neutral-500">Meet CSE</p>
              <p className="text-[64px] font-semibold leading-none tracking-wide text-white">
                소개
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">지금</p>
            <div className="bg-neutral-850 px-6 py-8">
              <p className="mb-2 type-section font-normal text-neutral-500">
                Meet CSE
              </p>
              <p className="text-[64px] font-bold leading-none text-white">
                소개
              </p>
            </div>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            카테고리 머리의 큰 제목은 글자 단계 밖의 표시 크기로, 그 자리에만
            쓰는 <code>type-display</code>(모바일 32·데스크톱 64, 700)다.
          </li>
          <li>
            위의 영어 부제(Meet CSE)는 모바일 14·데스크톱 20의 400 neutral-500 —{' '}
            <code>type-ui</code> / <code>type-section</code> 크기.
          </li>
        </ul>
      </Sub>

      <Sub title="카테고리 카드 — 호버와 선택을 나눈다">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">전</p>
            <div className="flex flex-wrap gap-4 bg-neutral-900 p-6">
              <Card title="학부 소개" state="idle" next={false} />
              <Card title="학부 소개" state="hover" next={false} />
              <Card title="학부 소개" state="selected" next={false} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">지금</p>
            <div className="flex flex-wrap gap-4 bg-neutral-900 p-6">
              <Card title="학부 소개" state="idle" next />
              <Card title="학부 소개" state="hover" next />
              <Card title="학부 소개" state="selected" next />
            </div>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            호버는 바탕이 한 단계 진해지고(neutral-100 → 200) 화살표가
            오른쪽으로 민다. 선택(하위 카테고리를 펼친 카드)은 짙은 주황 바탕에
            흰 글자 — 호버와 선택이 같은 색이면 무엇을 골랐는지 구분되지 않는다.
          </li>
          <li>
            카드 사이 모바일 24·데스크톱 32, 안 여백 16/24, 카드 높이 96/160.
          </li>
        </ul>
      </Sub>

      <Sub title="메인 — 더보기">
        <div className="flex flex-wrap items-center gap-12">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">전</p>
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-1 type-ui text-main-orange-dark">
                더보기 <ArrowRight />
              </span>
              <span className="flex items-center gap-1 bg-neutral-850 p-3 type-ui text-main-orange-dark">
                <Plus /> 더보기
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">지금</p>
            <div className="flex items-center gap-8">
              <span className="flex items-center gap-1 type-ui text-main-orange-dark">
                더보기 <ArrowRight />
              </span>
              <span className="flex items-center gap-1 bg-neutral-850 p-3 type-ui text-main-orange-dark">
                더보기 <ArrowRight />
              </span>
            </div>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            새 소식·공지의 "더보기"는 한 모양: 글자 뒤 오른쪽 화살표, 짙은
            주황(공지는 "+ 더보기"였다).
          </li>
        </ul>
      </Sub>

      <Sub title="메인 — 간격">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            섹션 사이·띠 안 여백·카드 사이처럼 화면 짜임을 만드는 값은 간격
            단계(1-4)의 가장 가까운 값이다: 90·88·80·72·67·60 → 64, 125·124·120·
            150·170 → 128, 50·40 → 48, 36·28 → 32, 26·22 → 24, 18·14 → 16, 10 →
            8.
          </li>
          <li>
            히어로 문구·원과 막대 그래픽·공지 판 뒤 그래픽의 크기와 자리 (
            <code>w-[61.15rem]</code> 같은 %·rem 값)는 그래픽이라 그대로 둔다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
