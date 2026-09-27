import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';
import {
  DocSection,
  DoDont,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 게시물 상세의 짜임을 도식으로 그린다. 실제는 community/-components/PostDetail·PostFooter.
// 띠 여백·묶음 간격·첨부 상자는 PostDetail 이 정한다. 짜는 사람이 넘기는 것만 적는다.

function Gap({ label }: { label: string }) {
  return (
    <div className="flex h-6 items-center justify-end border-y border-dashed border-main-orange/60 pr-2 type-meta text-main-orange">
      {label}
    </div>
  );
}

function Band({
  tone,
  children,
}: {
  tone: 'white' | 'subtle';
  children: ReactNode;
}) {
  return (
    <div
      className={clsx('px-6', tone === 'white' ? 'bg-white' : 'bg-neutral-50')}
    >
      {children}
    </div>
  );
}

function Neighbor({
  up,
  label,
  title,
}: {
  up: boolean;
  label: string;
  title: string;
}) {
  return (
    <p className="flex w-fit items-center">
      <span className="type-label text-main-orange">
        {up ? <ChevronUp /> : <ChevronDown />}
      </span>
      <span className="mr-3 type-label text-main-orange">{label}</span>
      <span className="type-ui">{title}</span>
    </p>
  );
}

function Head({ meta }: { meta: ReactNode }) {
  return (
    <div className="w-full text-left">
      <p className="type-section">게시물 제목</p>
      <p className="mt-2 type-meta text-neutral-500">{meta}</p>
    </div>
  );
}

export function PostSection() {
  return (
    <>
      <Lead>
        공지·새 소식·세미나 상세는 <code>PostDetail</code> 한 벌로 짓습니다.
      </Lead>

      <DocSection title="짜임">
        <figure>
          <div className="max-w-2xl border border-neutral-300">
            <Band tone="white">
              <Gap label="위 32" />
              <p className="py-2 type-section">게시물 제목</p>
              <p className="type-meta text-neutral-500">
                Mock · 2024/1/10 (수) 오전 08:59 · 조회 1,081
              </p>
              <Gap label="아래 32" />
            </Band>
            <Band tone="subtle">
              <Gap label="위 32" />
              <p className="py-2">첨부</p>
              <Gap label="32 / 48" />
              <p className="py-2">본문(읽기 폭 640)</p>
              <Gap label="48" />
              <Node variant="straight" />
              <div className="mt-3 ml-6 flex flex-wrap gap-2">
                <Tag label="장학" />
                <Tag label="학부" />
              </div>
              <Gap label="48" />
              <div className="space-y-2">
                <Neighbor up label="다음글" title="학사 일정 안내" />
                <Neighbor up={false} label="이전글" title="스크롤표본 02" />
              </div>
              <Gap label="48" />
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="secondary">삭제</Button>
                <Button variant="secondary">편집</Button>
                <Button variant="secondary">목록</Button>
              </div>
              <Gap label="아래 64 / 128" />
            </Band>
          </div>
          <figcaption className="mt-2 type-meta text-neutral-500">
            흰 머리 띠(제목·정보 줄) + 옅은 회색 본문 띠(첨부 → 본문 → 주황 선 →
            태그 → 다음·이전 글 → 버튼 줄). 버튼 줄은 PostFooter입니다.
          </figcaption>
        </figure>
      </DocSection>

      <DocSection title="규칙">
        <RuleList
          items={[
            '세미나는 언제·어디서·누가 여는지를 정보 줄에 씁니다. 공지·새 소식의 "작성자 · 날짜 · 조회" 자리입니다.',
            '세미나 본문의 연사·요약·연사 소개는 같은 소제목(16/700, 아래 8) + 본문이고, 묶음 사이는 48입니다.',
            '세미나 대표 이미지는 폭 240으로 본문 오른쪽에 띄웁니다. 놓이는 모양은 읽는 본문·이미지 페이지를 따릅니다.',
            '다음글·이전글 두 줄 사이는 8입니다. 더 붙이면 한 덩어리로 보입니다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않기">
        <DoDont
          good={{
            example: (
              <Head meta="Mock · 2024/1/10 (수) 오전 08:59 · 조회 1,081" />
            ),
            caption: '정보 줄은 값만 가운뎃점으로 잇습니다.',
          }}
          bad={{
            example: (
              <Head meta="작성자: Mock · 작성 날짜: 2024/1/10 (수) 오전 08:59 · 조회수: 1,081" />
            ),
            caption: '"작성자:"·"작성 날짜:" 같은 이름표를 붙입니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <div className="w-full text-left">
                <p className="mb-2 type-item">연사</p>
                <p className="type-body">김연사 · 교수 · 서울대학교</p>
              </div>
            ),
            caption: '연사는 소제목 + 본문 한 줄.',
          }}
          bad={{
            example: (
              <div className="w-full text-left type-body">
                <p>이름: 김연사</p>
                <p>직함: 교수</p>
                <p>소속: 서울대학교</p>
              </div>
            ),
            caption: '"이름: / 직함: / 소속:"처럼 줄마다 나눕니다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['page', '페이지 틀'],
            ['reading', '읽는 본문·이미지'],
            ['graphic', '그래픽'],
            ['button', '버튼'],
            ['selection', '선택·태그'],
          ]}
        />
      </DocSection>
    </>
  );
}
