import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import Form from '@/components/form/Form';
import Node from '@/components/ui/Nodes';
import { DocSection, DoDont, Lead, RuleList } from '../-components/doc';
import { SampleFormProvider, stay } from '../-components/sample';
import { LegacySubNavbar } from '../-legacy/SubNavbar';

// 경로는 PageTitle 의 Breadcrumb 와 같은 마크업·클래스로 다시 그린다(실제 PageTitle 은 창 폭(sm:)으로 여백·글자를
// 바꿔 390·320 틀 안에 넣으면 데스크톱 값이 나온다). 앞 항목은 진짜 링크(이동만 막음), 곡선은 실제 Node.
// 왼쪽 내비 도식은 같은 값의 div 다(실제 LeftNav 는 메뉴 정의·라우터에 묶여 있다).
// 경로의 줄바꿈·서브내비의 자리·푸터의 열은 셸이 정한다. 짜는 사람이 고르는 것만 적는다.

const CRUMBS_KO = ['시설 예약', '세미나실 예약', '301-417 (20석)'];
const CRUMBS_EN = ['Reservations', 'Seminar Room', '301-417 (20 seats)'];

function Crumbs({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-neutral-300">
      {/* 화살표는 뒤 항목에 붙여 함께 줄을 바꾼다. */}
      {items.map((x, i) => (
        <li key={x} className="flex items-center gap-1 whitespace-nowrap">
          {i > 0 && <ChevronRight className="type-meta" />}
          {i < items.length - 1 ? (
            <a
              href="#"
              onClick={stay}
              className="type-meta tracking-[.02em] hover:text-main-orange"
            >
              {x}
            </a>
          ) : (
            <span className="type-meta tracking-[.02em]">{x}</span>
          )}
        </li>
      ))}
      {/* 실제 곡선 그래픽(Node). 원·선이 남은 자리를 채우고 사선은 그대로 이어진다. */}
      <li aria-hidden className="ml-1 flex min-w-14 grow">
        <Node variant="curvedHorizontalGray" />
      </li>
    </ol>
  );
}

function Phone({ w, children }: { w: number; children: ReactNode }) {
  return (
    <div className="max-w-full space-y-1">
      <div
        className={clsx(
          'surface-dark max-w-full overflow-hidden bg-neutral-900 px-5 py-4',
          w === 390 ? 'w-[390px]' : 'w-[320px]',
        )}
      >
        {children}
      </div>
      <p className="type-meta text-neutral-500">{w}px</p>
    </div>
  );
}

// 작성 화면 도식: 실제 입력 칸(Form.Text) 두 개. subnav 면 예전 서브내비(옮긴 사본)가 오른쪽에 붙는다.
function Screen({ subnav }: { subnav: boolean }) {
  return (
    <SampleFormProvider defaultValues={{ year: '', title: '' }}>
      <div className="flex w-full max-w-96 gap-4 border border-neutral-300 bg-white p-4">
        <div className="min-w-0 flex-1 space-y-3">
          <p className="type-label">전공 이수 추가</p>
          <Form.Text name="year" placeholder="연도" size="sm" />
          <Form.Text name="title" placeholder="제목" />
        </div>
        {subnav && (
          <LegacySubNavbar
            title="학부"
            items={['교과과정', '전공 이수', '교과목 변경']}
            current="전공 이수"
          />
        )}
      </div>
    </SampleFormProvider>
  );
}

export function NavigationSection() {
  return (
    <>
      <Lead>
        헤더부터 푸터까지 셸은 <code>PageLayout</code>이 구성합니다.
      </Lead>

      <DocSection title="구성">
        <div className="flex flex-wrap gap-6">
          <Phone w={390}>
            <Crumbs items={CRUMBS_KO} />
          </Phone>
          <Phone w={320}>
            <Crumbs items={CRUMBS_EN} />
          </Phone>
        </div>
        <p className="type-meta text-neutral-500">
          경로: 줄은 항목 단위로 바뀌고, 곡선 그래픽이 마지막 항목 뒤 남은
          자리를 채웁니다.
        </p>
        <figure>
          <div className="flex h-32 w-full max-w-80">
            <div className="flex w-20 flex-col items-center gap-3 bg-chrome-menu pt-4 type-meta text-neutral-400">
              <span>소개</span>
              <span className="text-white">연구</span>
              <span>입학</span>
            </div>
            <div className="flex w-40 flex-col gap-3 bg-neutral-850 pt-4 pl-6 type-meta text-white">
              <span>연구·교육 스트림</span>
              <span>연구 센터</span>
            </div>
            <div className="flex-1 bg-neutral-900" />
          </div>
          <figcaption className="mt-2 type-meta text-neutral-500">
            왼쪽 내비의 막대와 펼침 패널. 모바일 메뉴도 같은 색이며 색 페이지의
            알려진 예외입니다.
          </figcaption>
        </figure>
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '형제 페이지가 있는 읽기 화면은 본문 오른쪽에 서브내비를 두어 같은 메뉴의 다른 페이지로 바로 가게 합니다.',
            '편집·작성 화면에는 서브내비를 두지 않습니다. 누르면 쓰던 글을 벗어납니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <Screen subnav={false} />,
            caption:
              '작성 화면에는 서브내비가 없어 쓰는 중에 벗어나지 않습니다.',
          }}
          bad={{
            example: <Screen subnav />,
            caption:
              '예전 전공 이수 추가 화면에만 서브내비가 있어 형제 작성 화면과 틀이 달랐고, 누르면 쓰던 글을 벗어났습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
