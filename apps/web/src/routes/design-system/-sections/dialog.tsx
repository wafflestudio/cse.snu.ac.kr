import clsx from 'clsx';
import { Square, X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
  VariantTable,
} from '../-components/doc';

// 모달 페이지. 판은 화면 위에 뜨는 것이라 여기서는 같은 모양을 div 로 그린다.
// 판의 값(테두리·그림자·여백·가림막)은 ui/dialogStyle.ts 가 정하므로 적지 않는다.

function Stage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex w-full justify-center bg-neutral-900/60 p-4 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Panel({
  title,
  width,
  children,
  close = true,
}: {
  title?: string;
  width: string;
  children: ReactNode;
  close?: boolean;
}) {
  return (
    <div
      className={clsx(
        'relative w-full border-t-3 border-main-orange bg-white p-6 shadow-overlay sm:p-8',
        width,
      )}
    >
      {title && <p className="mb-6 pr-8 type-section">{title}</p>}
      {close && (
        <span className="absolute top-4 right-4 text-neutral-600">
          <X className="size-5" />
        </span>
      )}
      {children}
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 type-label">{label}</p>
      <div className="h-8.5 rounded-xs border border-neutral-300" />
    </div>
  );
}

function Actions({ ok }: { ok: string }) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      <Button variant="secondary">취소</Button>
      <Button variant="primary">{ok}</Button>
    </div>
  );
}

// 크기 견본 — 폭 비율만 보여 주는 작은 판(400 : 560 : 768).
function Mini({ width }: { width: string }) {
  return (
    <span
      className={clsx(
        'block h-10 border-t-3 border-main-orange bg-white shadow-overlay',
        width,
      )}
    />
  );
}

const IMG_BTN =
  'flex h-11.5 flex-1 items-center justify-center type-label transition-colors';

// 이미지 팝업 견본 — 모양은 ui/ImageModal.tsx 와 같다.
function ImageSample() {
  return (
    <Stage className="pb-12">
      <div className="relative w-60">
        <div className="bg-white shadow-overlay">
          <div className="flex aspect-[4/5] items-center justify-center bg-neutral-200 type-meta text-neutral-500">
            포스터 이미지
          </div>
          <div className="flex">
            <span className={clsx(IMG_BTN, 'bg-neutral-100 text-neutral-600')}>
              닫기
            </span>
            <span className={clsx(IMG_BTN, 'bg-neutral-700 text-white')}>
              자세히 보기
            </span>
          </div>
        </div>
        <span className="absolute -bottom-8 left-0 flex items-center gap-1 type-label text-white">
          <Square /> 다시 보지 않기
        </span>
      </div>
    </Stage>
  );
}

export function DialogSection() {
  return (
    <>
      <Lead>
        모달은 지금 화면 위에 판을 띄워 짧은 일을 끝내게 한다. 판의 모양은
        부품(Dialog·확인창·이미지 팝업)이 정하고, 쓰는 사람은 크기와 제목,
        확인창의 실행 버튼 이름만 정한다.
      </Lead>

      <DocSection title="예시">
        <Example caption="판은 화면 위에 뜨므로 여기서는 같은 모양을 그려 보인다.">
          <Stage>
            <Panel title="교과목 추가" width="max-w-[560px]">
              <Field label="교과목명" />
              <Field label="(영문) Course Name" />
              <Actions ok="추가" />
            </Panel>
          </Stage>
        </Example>
      </DocSection>

      <DocSection title="종류">
        <VariantTable
          rows={[
            {
              name: '확인창',
              sample: <Mini width="w-[83px]" />,
              use: '삭제·나가기처럼 되돌리기 어려운 일을 확인한다. 크기는 하나.',
            },
            {
              name: '폼(기본)',
              sample: <Mini width="w-[117px]" />,
              use: '짧은 입력 — 교과목 추가, 시설 예약.',
            },
            {
              name: '넓게',
              sample: <Mini width="w-[160px]" />,
              use: '긴 내용 — 교과목 상세, 예약 상세, 팀 소개.',
            },
            {
              name: '이미지 팝업',
              sample: <Mini width="w-[60px]" />,
              use: '메인의 포스터 공지. 모양은 부품이 정한다.',
            },
          ]}
        />
        <RuleList
          items={[
            '폭은 내용으로 골라 size로만 정한다. 판 폭을 따로 적지 않는다.',
            '제목은 title로 넘기면 판이 그린다. 모달 안에서 제목을 따로 그리지 않는다.',
            '내용이 자기 제목을 가진 판(교과목·예약 상세, 팀 소개)은 hideTitle로 화면 읽기용 제목만 둔다.',
          ]}
        />
      </DocSection>

      <DocSection title="확인창">
        <Example caption="실행 버튼은 하는 일을 적는다 — 삭제·해제·나가기. 버튼 순서는 버튼 페이지, 문장은 문구 페이지를 따른다.">
          <Stage>
            <Panel width="max-w-[400px]" close={false}>
              <p>
                게시물을 삭제하시겠습니까?
                <br />
                되돌릴 수 없습니다.
              </p>
              <Actions ok="삭제" />
            </Panel>
          </Stage>
        </Example>
      </DocSection>

      <DocSection title="이미지 팝업">
        <Example caption="메인의 포스터 공지. 포스터 색이 매번 달라 버튼은 회색이고, 다시 보지 않기는 판 밖에 둔다.">
          <ImageSample />
        </Example>
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <Panel title="교과목 추가" width="max-w-[260px]">
                <Field label="교과목명" />
              </Panel>
            ),
            caption: '제목은 판이 그린다.',
          }}
          bad={{
            example: (
              <Panel title="교과목 추가" width="max-w-[260px]">
                <p className="mb-4 type-item">교과목 추가</p>
                <Field label="교과목명" />
              </Panel>
            ),
            caption: '모달 안에서 제목을 또 그린다 — 제목이 두 번 나온다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <>
                <Button variant="secondary">취소</Button>
                <Button variant="primary">삭제</Button>
              </>
            ),
            caption: '확인창의 실행 버튼은 하는 일을 적는다.',
          }}
          bad={{
            example: (
              <>
                <Button variant="secondary">취소</Button>
                <Button variant="primary">확인</Button>
              </>
            ),
            caption: '"확인"으로 둔다 — 무엇이 일어나는지 모른다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['button', '버튼'],
            ['form', '입력·폼'],
            ['writing', '문구'],
            ['shape', '모서리·그림자·선'],
          ]}
        />
      </DocSection>
    </>
  );
}
