import type { ReactNode } from 'react';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function Sample({
  label,
  note,
  className,
}: {
  label: string;
  note: string;
  className: string;
}) {
  return (
    <div className="flex w-40 flex-col gap-2">
      <div className={`h-16 w-full bg-white ${className}`} />
      <p className="type-label">{label}</p>
      <p className="type-meta leading-normal text-neutral-500">{note}</p>
    </div>
  );
}

function Line({
  label,
  note,
  className,
}: {
  label: string;
  note: string;
  className: string;
}) {
  return (
    <div className="flex w-40 flex-col gap-2">
      <div className="flex h-16 items-center">
        <div className={`w-full ${className}`} />
      </div>
      <p className="type-label">{label}</p>
      <p className="type-meta leading-normal text-neutral-500">{note}</p>
    </div>
  );
}

function Card({ bad }: { bad?: boolean }) {
  return (
    <div
      className={
        bad
          ? 'w-44 rounded-lg bg-white p-4 shadow-overlay'
          : 'w-44 border border-neutral-200 bg-white p-4'
      }
    >
      <p className="type-item">입학 설명회</p>
      <p className="mt-2 type-meta text-neutral-500">2026/09/25</p>
    </div>
  );
}

export function ShapeSection() {
  return (
    <>
      <Lead>이 사이트는 각진 선과 면이 기본이다.</Lead>

      <DocSection title="값">
        <Sub title="모서리">
          <Example>
            <Sample
              label="없음"
              note="카드·목록·면·사진·모달 판"
              className="border border-neutral-300"
            />
            <Sample
              label="2px (rounded-xs)"
              note="컨트롤 — 버튼·입력·드롭다운·검색창·파일 선택"
              className="rounded-xs border border-neutral-300"
            />
            <Sample
              label="알약·원 (rounded-full)"
              note="태그·필터 알약·단일 선택 알약·원 그래픽"
              className="rounded-full border border-neutral-300"
            />
          </Example>
        </Sub>
        <Sub title="그림자">
          <Example>
            <Sample
              label="없음"
              note="카드·목록·면"
              className="border border-neutral-200"
            />
            <Sample
              label="떠 있는 층 (shadow-overlay)"
              note="모달·드롭다운 목록·날짜 선택"
              className="shadow-overlay"
            />
          </Example>
        </Sub>
        <Sub title="선">
          <Example>
            <Line
              label="1px — 기본"
              note="목록·카드 구분선, 입력 테두리"
              className="border-t border-neutral-300"
            />
            <Line
              label="2px — 강조"
              note="목록을 크게 나누는 제목 밑줄(세미나 연도), 푸터 윗선"
              className="border-t-2 border-neutral-700"
            />
          </Example>
        </Sub>
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '컨트롤이 아닌 판·카드에는 모서리를 두지 않는다.',
            '그림자는 화면 위에 떠 있는 것에만 쓴다. 카드·목록은 면 색과 선으로 구분한다.',
            '메인 뉴스 카드와 교과목 카드 뒤집기의 그림자는 그 화면 고유 표현이다(메인·카테고리, 고유 화면).',
            '3px·5px 같은 굵은 선(모달 위 주황 선, 메인 링크 행 왼쪽 바)은 그 부품 고유 표현이다(모달, 메인·카테고리).',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: <Card />,
            caption: '카드는 각진 모서리에 선으로 나눈다.',
          }}
          bad={{
            example: <Card bad />,
            caption:
              '카드에 둥근 모서리와 그림자를 준다 — 떠 있는 층(모달·드롭다운)처럼 보인다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['color', '색'],
            ['dialog', '모달'],
            ['main', '메인·카테고리'],
            ['unique', '고유 화면'],
          ]}
        />
      </DocSection>
    </>
  );
}
