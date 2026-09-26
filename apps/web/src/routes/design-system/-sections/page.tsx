import clsx from 'clsx';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 페이지 틀은 화면 전체라 div 도식으로 그린다. 실제는 PageLayout·PageBand·SelectionTitle.
// 틀이 정하는 여백은 도식이 보여 주고 값은 소스에 있다 — 짜는 사람이 고르는 것만 적는다.

// 도식: 높이는 실제 여백을 1/2로 줄여 그린다.
function Gap({ label, h }: { label: string; h: string }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-end border-y border-dashed border-main-orange/60 pr-2 type-meta text-main-orange',
        h,
      )}
    >
      {label}
    </div>
  );
}

function Title() {
  return (
    <div className="bg-neutral-900 px-4 py-3 type-label text-white">
      페이지 제목 영역
    </div>
  );
}

function Band({
  tone,
  top,
  bottom,
  children,
}: {
  tone: 'white' | 'gray';
  top: string;
  bottom: string;
  children: ReactNode;
}) {
  return (
    <div className={tone === 'gray' ? 'bg-neutral-100' : 'bg-white'}>
      <Gap label={top} h="h-6" />
      <div className="px-4 py-3 type-meta text-neutral-600">{children}</div>
      <Gap label={bottom} h={bottom.includes('128') ? 'h-12' : 'h-6'} />
    </div>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="type-label">{label}</p>
      <div className="border border-neutral-300">{children}</div>
    </div>
  );
}

// 선택형 상세 제목 도식 — 실제 SelectionTitle 과 같은 값.
function SelTitle({ actions }: { actions?: boolean }) {
  return (
    <div className="flex w-full flex-wrap items-start justify-between gap-3">
      <div className="w-fit">
        <p className="px-3 type-section">시스템 스트림</p>
        <Node variant="straight" />
      </div>
      {actions && (
        <div className="ml-auto flex gap-3">
          <Button variant="secondary">삭제</Button>
          <Button variant="secondary">편집</Button>
        </div>
      )}
    </div>
  );
}

export function PageSection() {
  return (
    <>
      <Lead>
        화면은 <code>PageLayout</code> 하나로 짓는다. 여백은 틀이 준다 — 짜는
        사람은 틀(기본·띠)과 띠의 색, 관리 버튼의 자리만 고른다.
      </Lead>

      <DocSection title="짜임">
        <div className="flex flex-wrap gap-8">
          <Frame label="기본">
            <Title />
            <Band tone="white" top="위 32 / 48" bottom="아래 64 / 128">
              본문 한 덩어리
            </Band>
          </Frame>
          <Frame label="띠">
            <Title />
            <Band tone="white" top="위 32 / 48" bottom="아래 48">
              띠 1(선택 탭 등)
            </Band>
            <Band tone="gray" top="위 32 / 48" bottom="아래 64 / 128">
              띠 2(마지막 띠)
            </Band>
          </Frame>
        </div>
        <p className="type-meta text-neutral-500">
          여백은 모바일 / 데스크톱. 도식의 높이는 실제의 1/2이다.
        </p>
        <Example caption="선택 탭 아래 고른 항목의 제목(SelectionTitle).">
          <div className="w-fit">
            <p className="flex items-baseline gap-2 px-3 type-section">
              시스템 스트림
              <span className="type-meta">부제</span>
            </p>
            <Node variant="straight" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="규칙">
        <RuleList
          items={[
            '본문이 한 덩어리면 기본 틀, 흰·회색(neutral-100) 띠로 나누면 띠 틀 — PageLayout bands 안에 PageBand를 쌓는다.',
            '띠 틀은 학부 소개·진로·연구 스트림·연구 센터·연락처·연혁에 쓴다.',
            '화면에서 여백을 더하지 않는다. PageLayout에는 여백을 바꾸는 속성이 없다.',
            '선택 탭(SelectionList)으로 시작하는 화면도 위 여백은 틀이 준다. 탭 위에 관리 버튼이 있으면 버튼 아래 32.',
            '선택 탭 아래 고른 항목의 제목은 SelectionTitle 하나로 쓴다. 부제·외부 링크 아이콘은 넣을 때만.',
            '게시물 상세(공지·새 소식·세미나)의 틀은 게시물 상세 절에 있다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: <SelTitle actions />,
            caption:
              '관리 버튼(편집·삭제)은 SelectionTitle의 actions로 넘긴다 — 제목 옆에 서고, 자리가 모자라면 다음 줄 오른쪽으로 내려간다.',
          }}
          bad={{
            example: (
              <div className="w-full space-y-8">
                <div className="flex justify-end gap-3">
                  <Button variant="secondary">삭제</Button>
                  <Button variant="secondary">편집</Button>
                </div>
                <SelTitle />
              </div>
            ),
            caption:
              '제목 위에 버튼 줄을 따로 둔다 — 버튼이 무엇을 고치는지 떨어져 보인다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['layout', '레이아웃·반응형'],
            ['spacing', '간격'],
            ['navigation', '내비게이션·셸'],
            ['post', '게시물 상세'],
            ['selection', '선택·태그'],
          ]}
        />
      </DocSection>
    </>
  );
}
