import clsx from 'clsx';
import { Square, SquareCheck, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
  VariantTable,
} from '../-components/doc';
import { SampleFormProvider } from '../-components/sample';
import LegacyAlertPanel from '../-legacy/AlertDialog';
import LegacyDialogPanel from '../-legacy/Dialog';
import LegacyFieldset from '../-legacy/Fieldset';
import LegacyText from '../-legacy/Text';

// 모달 페이지. 판은 화면 위에 뜨는 것이라 문서 안에서는 실제 Dialog 와 같은 클래스로 판만 그리고,
// 옆의 버튼으로 실제 판(ui/Dialog·AlertDialog)을 띄워 볼 수 있게 한다. 안의 칸·버튼은 실제 부품이다.
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

// ui/Dialog 의 판(PANEL_CLASS 에서 화면 위 위치·애니메이션만 뺀 것).
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
        <div className="absolute top-4 right-4">
          <Button variant="text" ariaLabel="닫기">
            <X className="size-5" />
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}

function Field({ label, name }: { label: string; name: string }) {
  return (
    <Fieldset title={label}>
      <Form.Text name={name} />
    </Fieldset>
  );
}

function Actions({ ok, onClose }: { ok: string; onClose?: () => void }) {
  return (
    <div className="mt-8 flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        취소
      </Button>
      <Button variant="primary" onClick={onClose}>
        {ok}
      </Button>
    </div>
  );
}

// 실제 Dialog 를 띄워 보는 버튼.
function OpenCourseDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        교과목 추가
      </Button>
      <Dialog open={open} onOpenChange={setOpen} title="교과목 추가">
        <SampleFormProvider>
          <Field label="교과목명" name="name" />
          <Field label="(영문) Course Name" name="nameEn" />
          <Actions ok="추가" onClose={() => setOpen(false)} />
        </SampleFormProvider>
      </Dialog>
    </>
  );
}

// 실제 AlertDialog 를 띄워 보는 버튼.
function OpenDeleteAlert() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        삭제
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        description={'게시물을 삭제하시겠습니까?\n되돌릴 수 없습니다.'}
        confirmText="삭제"
        onConfirm={() => setOpen(false)}
      />
    </>
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

// 이미지 팝업 견본. ui/ImageModal.tsx 는 페이지를 열면 스스로 뜨고 localStorage 를 쓰므로,
// 판 안쪽만 같은 클래스로 옮겨 그린다(버튼·다시 보지 않기는 실제처럼 호버·선택된다).
function ImageSample() {
  const [hide, setHide] = useState(false);
  return (
    <Stage className="pb-12">
      <div className="relative w-60">
        <div className="flex flex-col overflow-hidden bg-white shadow-overlay">
          <div className="flex aspect-[4/5] items-center justify-center bg-neutral-200 type-meta text-neutral-500">
            포스터 이미지
          </div>
          <div className="flex shrink-0">
            <button
              type="button"
              className="h-11.5 flex-1 bg-neutral-100 px-6 type-label text-neutral-600 transition-colors hover:bg-neutral-200 focus-visible:-outline-offset-4 active:bg-neutral-300"
            >
              닫기
            </button>
            <button
              type="button"
              className="surface-dark h-11.5 flex-1 bg-neutral-700 px-6 type-label text-white transition-colors hover:bg-neutral-600 focus-visible:-outline-offset-4 active:bg-neutral-500"
            >
              자세히 보기
            </button>
          </div>
        </div>
        <label className="surface-dark focus-proxy absolute -bottom-8 left-0 flex cursor-pointer items-center gap-1 type-label text-white transition-colors hover:text-main-orange active:text-main-orange-dark">
          {hide ? <SquareCheck /> : <Square />}
          다시 보지 않기
          <input
            type="checkbox"
            checked={hide}
            onChange={(e) => setHide(e.target.checked)}
            className="sr-only"
          />
        </label>
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
        <Example caption="판은 화면 위에 뜨므로 여기서는 같은 모양으로 표시합니다. 버튼을 누르면 실제 판이 뜹니다.">
          <Stage>
            <Panel title="교과목 추가" width="max-w-[560px]">
              <SampleFormProvider>
                <Field label="교과목명" name="name" />
                <Field label="(영문) Course Name" name="nameEn" />
              </SampleFormProvider>
              <Actions ok="추가" />
            </Panel>
          </Stage>
          <OpenCourseDialog />
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
        <Example caption="실행 버튼에는 실행할 작업을 적습니다(삭제·해제·나가기). 문장은 문구 페이지를 따릅니다. 버튼을 누르면 실제 확인창이 뜹니다.">
          <Stage>
            <Panel width="max-w-[400px]" close={false}>
              <p className="type-body text-neutral-950">
                게시물을 삭제하시겠습니까?
                <br />
                되돌릴 수 없습니다.
              </p>
              <Actions ok="삭제" />
            </Panel>
          </Stage>
          <OpenDeleteAlert />
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
              <SampleFormProvider>
                <div className="w-full max-w-65 space-y-3">
                  <Panel title="교과목 추가" width="w-full">
                    <Field label="교과목명" name="name" />
                  </Panel>
                  <Panel title="시설 예약" width="w-full">
                    <Field label="예약 제목" name="title" />
                  </Panel>
                </div>
              </SampleFormProvider>
            ),
            caption: '모든 모달의 제목을 판이 같은 자리·같은 크기로 그립니다.',
          }}
          bad={{
            example: (
              <SampleFormProvider>
                <div className="w-full max-w-65 space-y-3">
                  <LegacyDialogPanel>
                    <h4 className="mb-4 text-xl font-bold text-neutral-700">
                      교과목 추가
                    </h4>
                    <LegacyFieldset title="교과목명" required>
                      <LegacyText name="name" />
                    </LegacyFieldset>
                  </LegacyDialogPanel>
                  <LegacyDialogPanel>
                    <h2 className="mb-7 text-xl font-bold">시설 예약</h2>
                    <LegacyFieldset title="예약 제목" required>
                      <LegacyText name="title" />
                    </LegacyFieldset>
                  </LegacyDialogPanel>
                </div>
              </SampleFormProvider>
            ),
            caption:
              '예전에는 모달마다 내용 안에서 제목을 직접 그려 색·간격이 제각각이었습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <Panel width="w-full max-w-[400px]" close={false}>
                <p className="type-body text-neutral-950">
                  게시물을 삭제하시겠습니까?
                  <br />
                  되돌릴 수 없습니다.
                </p>
                <Actions ok="삭제" />
              </Panel>
            ),
            caption: '실행 버튼에 실행할 작업을 적습니다.',
          }}
          bad={{
            example: (
              <LegacyAlertPanel description="게시물을 삭제하시겠습니까?" />
            ),
            caption:
              '예전 확인창은 저장·삭제·이탈을 모두 "확인"으로 받아, 무엇이 실행되는지 버튼만 보고 알 수 없었습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
