import clsx from 'clsx';
import type { ReactNode } from 'react';
import Node from '@/components/ui/Nodes';

// 페이지 틀은 화면 전체라 여기서는 div 도식으로 그린다. 실제는 PageLayout·PageBand·SelectionTitle.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

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

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-sm border border-neutral-300">{children}</div>
  );
}

export function PageSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="틀 — 두 가지">
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <p className="type-label">기본</p>
            <Frame>
              <Title />
              <Band tone="white" top="위 32 / 48" bottom="아래 64 / 128">
                본문 한 덩어리
              </Band>
            </Frame>
          </div>
          <div className="space-y-2">
            <p className="type-label">띠</p>
            <Frame>
              <Title />
              <Band tone="white" top="위 32 / 48" bottom="아래 48">
                띠 1(선택 탭 등)
              </Band>
              <Band tone="gray" top="위 32 / 48" bottom="아래 64 / 128">
                띠 2(마지막 띠)
              </Band>
            </Frame>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>기본</b>: 본문이 한 덩어리인 화면. 위 32/48(모바일/데스크톱),
            아래 64/128(페이지 끝, 간격 절).
          </li>
          <li>
            <b>띠</b>: 본문을 흰·neutral-100 띠로 나누는 화면(학부 소개·진로·
            연구 스트림·연구 센터·연락처·연혁). 띠마다 위 32/48·아래 48, 마지막
            띠만 아래 64/128. <code>PageLayout bands</code> 안에{' '}
            <code>PageBand tone</code>을 쌓는다.
          </li>
          <li>
            <code>PageLayout</code>에 여백을 바꾸는 속성은 없다. 띠 틀은{' '}
            <code>bands</code> 하나다.
          </li>
        </ul>
      </Sub>

      <Sub title="선택 탭으로 시작하는 화면">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            선택 탭(<code>SelectionList</code>)은 위 여백을 갖지 않는다 — 탭으로
            시작하는 화면도 위 여백은 틀이 준다. 관리 버튼이 탭 위에 있으면 버튼
            아래 32.
          </li>
        </ul>
      </Sub>

      <Sub title="페이지 제목">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            제목 영역 안 제목 글자 아래는 모바일 24·데스크톱 48 하나다. 화면마다
            바꾸지 않고, 바꾸는 속성도 두지 않는다.
          </li>
          <li>
            긴 제목은 줄을 바꾼다(<code>overflow-wrap: anywhere</code>) — 한
            단어로 이어진 영어 제목("Participants(Professors)")도 390에서 넘치지
            않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="선택형 상세 제목 — 한 부품">
        <div className="w-fit">
          <h4 className="flex items-baseline gap-2 px-3 type-section">
            시스템 스트림
            <span className="type-meta">부제</span>
          </h4>
          <Node variant="straight" />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            선택 탭 아래 고른 항목의 제목은 <code>SelectionTitle</code> 하나로:
            20/700 + 아래 주황 직선(그래픽 절). 부제·외부 링크 아이콘은 선택으로
            넣는다.
          </li>
          <li>
            관리 버튼(편집·삭제)은 <code>actions</code>로 넘긴다. 제목 옆에
            서고, 자리가 모자라면 다음 줄 오른쪽으로 내려간다.
          </li>
          <li>
            게시물 상세(공지·새 소식·세미나)의 틀은 게시물 상세 절에 있다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
