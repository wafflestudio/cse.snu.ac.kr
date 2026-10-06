import clsx from 'clsx';
import { Square, X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
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

// 크기 견본. 폭 비율만 보여 주는 작은 판(400 : 560 : 768).
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

// 이미지 팝업 견본. 모양은 ui/ImageModal.tsx 와 같다.
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
        모달은 현재 화면 위에 판을 띄워 짧은 작업을 완료할 때 사용합니다.
      </Lead>

      <DocSection title="예시">
        <Example caption="판은 화면 위에 뜨므로 여기서는 같은 모양으로 표시합니다.">
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
              use: '삭제·나가기 확인.',
            },
            {
              name: '폼(기본)',
              sample: <Mini width="w-[117px]" />,
              use: '짧은 입력(교과목 추가, 시설 예약).',
            },
            {
              name: '넓게',
              sample: <Mini width="w-[160px]" />,
              use: '긴 내용(교과목 상세, 예약 상세, 팀 소개).',
            },
            {
              name: '이미지 팝업',
              sample: <Mini width="w-[60px]" />,
              use: '메인의 포스터 공지.',
            },
          ]}
        />
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '보던 화면을 떠나지 않고 짧은 일을 끝낼 때 사용합니다. 짧은 입력(교과목 추가), 한 항목 자세히 보기(예약 상세), 되돌리기 어려운 작업 전의 확인입니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '입력이 길거나 서식 있는 본문을 쓸 때는 편집 화면을 사용합니다. 판에서 길게 스크롤하면 위치를 잃고, 실수로 닫으면 입력이 사라집니다.',
            '결과를 알리기만 할 때는 토스트를 사용합니다. 누를 일 없는 판은 하던 일을 끊습니다.',
          ]}
        />
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '제목은 판이 그리고, 내용에 자체 제목이 있는 판(교과목·예약 상세, 팀 소개)만 판 제목을 숨깁니다. 제목이 두 번 보이지 않게 하기 위해서입니다.',
          ]}
        />
      </DocSection>

      <DocSection title="확인창">
        <Example caption="실행 버튼에는 실행할 작업을 적습니다(삭제·해제·나가기). 문장은 문구 페이지를 따릅니다.">
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
        <Example caption="메인의 포스터 공지. 포스터 색이 매번 다르므로 버튼은 회색을 사용하고, 다시 보지 않기는 판 밖에 배치합니다.">
          <ImageSample />
        </Example>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <div className="w-full max-w-65 space-y-3">
                <Panel title="교과목 추가" width="w-full">
                  <Field label="교과목명" />
                </Panel>
                <Panel title="예약하기" width="w-full">
                  <Field label="예약 제목" />
                </Panel>
              </div>
            ),
            caption: '모든 모달의 제목을 판이 같은 자리·같은 크기로 그립니다.',
          }}
          bad={{
            example: (
              <div className="w-full max-w-65 space-y-3">
                <Panel width="w-full">
                  <p className="mb-4 text-xl font-bold text-neutral-700">
                    교과목 추가
                  </p>
                  <Field label="교과목명" />
                </Panel>
                <Panel width="w-full">
                  <p className="mb-4 type-item">예약하기</p>
                  <Field label="예약 제목" />
                </Panel>
              </div>
            ),
            caption:
              '예전에는 모달마다 내용 안에서 제목을 직접 그려 크기·색·자리가 제각각이었습니다.',
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
            caption: '실행 버튼에 실행할 작업을 적습니다.',
          }}
          bad={{
            example: (
              <>
                <Button variant="secondary">취소</Button>
                <Button variant="primary">확인</Button>
              </>
            ),
            caption:
              '예전 확인창은 저장·삭제·이탈을 모두 "확인"으로 받아, 무엇이 실행되는지 버튼만 보고 알 수 없었습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
