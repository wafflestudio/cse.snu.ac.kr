import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';
import { DocSection, DoDont, Lead, RuleList } from '../-components/doc';

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
        공지·새 소식·세미나 상세는 <code>PostDetail</code> 하나로 구성합니다.
      </Lead>

      <DocSection title="구성">
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

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '정보 줄에는 그 글을 알아보는 값만 가운뎃점으로 잇습니다(공지·새 소식은 작성자·날짜·조회, 세미나는 언제·어디서·누가).',
            '본문 띠 안의 묶음(세미나의 연사·요약·연사 소개)은 같은 소제목 + 본문을 48 간격으로 쌓습니다. 같은 모양이 반복되어야 어디서 무엇이 시작되는지 보입니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <Head meta="Mock · 2024/1/10 (수) 오전 08:59 · 조회 1,081" />
            ),
            caption: '값만 가운뎃점으로 이어 한 줄에 읽힙니다.',
          }}
          bad={{
            example: (
              <Head meta="작성자: Mock · 작성 날짜: 2024/1/10 (수) 오전 08:59 · 조회수 1,081" />
            ),
            caption:
              '예전 공지 상세는 "작성자:"·"작성 날짜:" 이름표를 붙여, 값보다 이름표가 먼저 읽혔습니다.',
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
            caption: '연사는 요약·연사 소개와 같은 소제목 + 본문입니다.',
          }}
          bad={{
            example: (
              <div className="w-full text-left type-body">
                <p>이름: 김연사</p>
                <p>직함: 교수</p>
                <p>소속: 서울대학교</p>
              </div>
            ),
            caption:
              '예전 세미나 상세는 연사를 "이름: / 직함: / 소속:" 줄로 나눠, 아래 소제목 묶음과 모양이 달랐습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
