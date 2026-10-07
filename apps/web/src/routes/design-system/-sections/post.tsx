import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';
import { TEXT_LINK } from '@/components/ui/textLink';
import { DocSection, DoDont, Lead, RuleList } from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyNoticeDetailHead } from '../-legacy/NoticeDetail';
import { LegacySeminarSpeaker } from '../-legacy/SeminarDetail';

// 게시물 상세의 짜임을 도식으로 그린다. 실제는 community/-components/PostDetail·PostFooter.
// 띠 여백·묶음 간격·첨부 상자는 PostDetail 이 정한다. 짜는 사람이 넘기는 것만 적는다.
// PostDetail 은 page-gutter-x(오른쪽 360)를 달고 PostFooter 는 로그인·라우터에 기대므로, 조각은 같은 클래스로 다시 그린다.
// 태그·버튼은 실제 부품, 다음·이전 글은 PostFooter 의 PostNavLink 와 같은 클래스의 진짜 링크(이동만 막음).

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

// PostFooter 의 PostNavLink 와 같은 클래스. 호버하면 제목이 짙은 주황.
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
    <a href="#" onClick={stay} className="group flex w-fit items-center">
      <span className="type-label text-main-orange">
        {up ? <ChevronUp /> : <ChevronDown />}
      </span>
      <p className="mr-3 shrink-0 type-label text-main-orange">{label}</p>
      <p className="line-clamp-1 type-ui group-hover:text-main-orange-dark">
        {title}
      </p>
    </a>
  );
}

// PostDetail 머리(제목 + 정보 줄)와 같은 클래스.
function Head({ meta }: { meta: string[] }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <h2 className="type-section">2026학년도 전기 대학원 입학 안내</h2>
      <p className="type-meta text-neutral-500">{meta.join(' · ')}</p>
    </div>
  );
}

const noop = () => {};

export function PostSection() {
  return (
    <>
      <Lead>
        공지·새 소식·세미나 상세는 <code>PostDetail</code> 하나로 짭니다.
      </Lead>

      <DocSection title="구성">
        <figure>
          <div className="max-w-2xl border border-neutral-300">
            <Band tone="white">
              <Gap label="위 32" />
              <p className="py-2 type-section">게시물 제목</p>
              <p className="type-meta text-neutral-500">
                행정실 · 2026/9/27 (일) 오전 08:59 · 조회 1,081
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
                <Tag label="장학" onClick={noop} />
                <Tag label="학부" onClick={noop} />
              </div>
              <Gap label="48" />
              <div className="space-y-2">
                <Neighbor up label="다음글" title="학사 일정 안내" />
                <Neighbor
                  up={false}
                  label="이전글"
                  title="세미나실 예약 기간 변경"
                />
              </div>
              <Gap label="48" />
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="secondary" onClick={noop}>
                  삭제
                </Button>
                <Button variant="secondary" onClick={noop}>
                  편집
                </Button>
                <Button variant="secondary" onClick={noop}>
                  목록
                </Button>
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
            '정보 줄에는 글을 알아보는 값만 가운뎃점으로 잇습니다(공지·새 소식은 작성자·날짜·조회, 세미나는 언제·어디서·누가).',
            '본문 띠의 각 부분(세미나의 연사·요약·연사 소개)은 소제목 + 본문을 48 간격으로 쌓습니다. 같은 모양이 반복되어야 어디서 시작되는지 보입니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <Head
                meta={['행정실', '2026/9/27 (일) 오전 08:59', '조회 1,081']}
              />
            ),
            caption: '이름표 없이 값만 가운뎃점으로 이어 한 줄에 들어갑니다.',
          }}
          bad={{
            example: (
              <LegacyNoticeDetailHead
                title="2026학년도 전기 대학원 입학 안내"
                author="행정실"
                createdAt="2026/9/27 (일) 오전 08:59"
                viewCount="1,081"
              />
            ),
            caption:
              '예전 공지 상세는 "작성자:"·"작성 날짜:" 이름표가 값보다 먼저 눈에 들어왔습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              // 세미나 상세의 연사 단락과 같은 클래스. 이름·소속 링크는 진짜 링크(이동만 막음).
              <div className="w-full text-left">
                <div className="mb-2 type-item">연사</div>
                <p className="type-body">
                  <a href="#" onClick={stay} className={TEXT_LINK}>
                    김연사
                  </a>
                  {' · 교수 · '}
                  <a href="#" onClick={stay} className={TEXT_LINK}>
                    서울대학교
                  </a>
                </p>
              </div>
            ),
            caption: '연사는 요약·연사 소개와 같은 소제목 + 본문입니다.',
          }}
          bad={{
            example: (
              <div className="w-full text-left">
                <LegacySeminarSpeaker
                  name="김연사"
                  title="교수"
                  affiliation="서울대학교"
                />
              </div>
            ),
            caption:
              '예전 세미나 상세는 연사를 "이름: / 직함: / 소속:" 줄로 나눠 아래 소제목 단락과 모양이 달랐습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
