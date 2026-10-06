import type { ReactNode } from 'react';
import Image from '@/components/ui/Image';
import {
  DocSection,
  DoDont,
  Example,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyNewsCard } from '../-legacy/NewsCard';

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

// 메인 새 소식 카드. 지금의 NewsCard 와 같은 클래스로 다시 그린 것이다(실제 카드는 상세 경로로 가는
// 링크라 호버만 해도 그 페이지를 미리 불러온다). 초점 페이지도 이 카드를 쓴다.
export const SAMPLE_NEWS = {
  title: '컴퓨터공학부 연구팀, 국제 학술대회 최우수 논문상',
  date: '2026/9/24',
  description:
    '컴퓨터공학부 연구팀이 대규모 언어 모델의 추론 효율을 높이는 방법을 제안해 최우수 논문상을 받았습니다.',
};

export function SampleNewsCard() {
  return (
    <a
      href="#"
      onClick={stay}
      className="flex h-76 w-[13.8rem] shrink-0 flex-col bg-white"
    >
      <div className="relative h-25 w-full">
        <Image
          src={null}
          alt=""
          sizes="240px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="px-4 pt-4">
        <h3 className="line-clamp-2 type-item text-neutral-950">
          {SAMPLE_NEWS.title}
        </h3>
        <time className="mt-3 block type-meta text-neutral-500">
          {SAMPLE_NEWS.date}
        </time>
        <p className="mt-3 line-clamp-4 type-meta leading-normal text-neutral-500">
          {SAMPLE_NEWS.description}
        </p>
      </div>
    </a>
  );
}

export function ShapeSection() {
  return (
    <>
      <Lead>이 사이트는 각진 선과 면이 기본입니다.</Lead>

      <DocSection title="값">
        <Sub title="모서리">
          <Example>
            <Sample
              label="없음"
              note="카드·목록·면·사진·모달 판"
              className="border border-neutral-300"
            />
            <Sample
              label="2px"
              note="컨트롤(버튼·입력·드롭다운·검색창·파일 선택)"
              className="rounded-xs border border-neutral-300"
            />
            <Sample
              label="알약·원"
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
              label="떠 있는 층"
              note="모달·드롭다운 목록·날짜 선택"
              className="shadow-overlay"
            />
          </Example>
        </Sub>
        <Sub title="선">
          <Example>
            <Line
              label="1px(기본)"
              note="목록·카드 구분선, 입력 테두리"
              className="border-t border-neutral-300"
            />
            <Line
              label="2px(강조)"
              note="목록을 크게 나누는 제목 밑줄(세미나 연도), 푸터 윗선"
              className="border-t-2 border-neutral-700"
            />
          </Example>
        </Sub>
      </DocSection>

      <DocSection title="원칙">
        <RuleList
          items={[
            '둥근 모서리는 누르는 것(컨트롤·태그·알약)에만 둡니다. 판·카드·사진은 각지게 두어 둥근 모양이 누를 수 있다는 단서가 되게 합니다.',
            '그림자는 화면 위에 떠 있는 층(모달·드롭다운·날짜 선택)에만 씁니다. 카드에 그림자가 있으면 떠 있는 층처럼 보이므로 면 색과 선으로 구분합니다.',
            '선은 1px이 기본이고, 목록을 크게 나누는 제목 밑줄처럼 구분이 큰 곳에만 2px입니다.',
          ]}
        />
        <KnownGap>
          접힌 모서리의 옅은 그림자, 모달 위 주황 3px 선, 메인 링크 행의 5px
          막대는 그 부품의 모양이라 값 밖입니다.
        </KnownGap>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <div className="bg-neutral-100 p-4">
                <SampleNewsCard />
              </div>
            ),
            caption: '회색 띠 위 카드는 흰 바탕만으로 띠와 구분합니다.',
          }}
          bad={{
            example: (
              <div className="bg-neutral-100 p-4">
                <LegacyNewsCard news={SAMPLE_NEWS} />
              </div>
            ),
            caption:
              '예전 메인 새 소식 카드는 그림자 때문에 띠 위에 떠 있는 층처럼 보였습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
