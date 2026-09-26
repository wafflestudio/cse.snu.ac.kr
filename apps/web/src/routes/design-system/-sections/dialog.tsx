import clsx from 'clsx';
import { Square, X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';

// 판은 화면 위에 뜨는 것이라 여기서는 같은 값을 div 로 그린다. 실제 값은 ui/dialogStyle.ts.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

// 어두운 바탕 위에 판 하나
function Stage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx('flex justify-center bg-neutral-900/60 p-6', className)}
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
        'relative border-t-3 border-main-orange bg-white p-6 shadow-overlay sm:p-8',
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

const IMG_BTN =
  'flex h-11.5 flex-1 items-center justify-center type-label transition-colors';

// 이미지 팝업 견본 — 값은 ui/ImageModal.tsx 와 같다.
function ImageSample() {
  return (
    <Stage className="pb-12">
      <div className="relative w-60">
        <div className="bg-white shadow-overlay">
          <div className="flex aspect-[4/5] items-center justify-center bg-neutral-200 type-meta text-neutral-500">
            포스터 이미지
          </div>
          <div className="flex">
            <span
              className={clsx(
                IMG_BTN,
                'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
              )}
            >
              닫기
            </span>
            <span
              className={clsx(
                IMG_BTN,
                'bg-neutral-700 text-white hover:bg-neutral-600 active:bg-neutral-500',
              )}
            >
              자세히 보기
            </span>
          </div>
        </div>
        <span className="absolute -bottom-8 left-0 flex cursor-pointer items-center gap-1 type-label text-white transition-colors hover:text-main-orange active:text-main-orange-dark">
          <Square /> 다시 보지 않기
        </span>
      </div>
    </Stage>
  );
}

export function DialogSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="판 — 한 벌">
        <Stage>
          <Panel title="교과목 추가" width="w-full max-w-[560px]">
            <Field label="교과목명" />
            <Field label="(영문) Course Name" />
            <Actions ok="추가하기" />
          </Panel>
        </Stage>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            판은 흰 바탕, 위 주황 3px, 그림자 overlay, 모서리 없음. 값은{' '}
            <code>ui/dialogStyle.ts</code> 한 곳이다.
          </li>
          <li>
            뒤 가림막은 검정 50% + 흐림 2px 하나(확인창·이미지 팝업도 같다).
          </li>
          <li>
            안 여백 모바일 24·데스크톱 32. 닫기 X는 오른쪽 위 16에 20px 텍스트
            버튼(호버 주황).
          </li>
        </ul>
      </Sub>

      <Sub title="제목 — 판이 그린다">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            제목은 <code>Dialog title</code>로 넘기면 판이 20/700
            neutral-950으로 그리고 아래 24를 둔다. 모달 안에서 제목을 따로
            그리지 않는다.
          </li>
          <li>
            내용이 자기 제목을 가진 판(교과목·예약 상세, 팀 소개)은{' '}
            <code>hideTitle</code>로 화면 읽기용 제목만 둔다. 확인창도 제목이
            화면에 없다.
          </li>
        </ul>
      </Sub>

      <Sub title="크기 — 세 가지">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ['확인', '400', '확인창'],
            ['폼', '560', '교과목 추가·시설 예약'],
            ['넓게', '768', '교과목 상세·예약 상세·팀 소개'],
          ].map(([name, px, use]) => (
            <div key={name} className="space-y-1">
              <p className="type-label">
                {name} {px}px
              </p>
              <p className="type-meta text-neutral-500">{use}</p>
            </div>
          ))}
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            모바일에서는 화면 폭에서 좌우 16씩 뺀 폭, 높이는 최대 90%이고 넘치면
            판 안에서 스크롤한다.
          </li>
          <li>
            폭은 <code>size</code>로만 고른다(확인창은 늘 400). 판 폭을 따로
            적지 않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="버튼 줄">
        <Stage>
          <Panel width="w-full max-w-[400px]" close={false}>
            <p>게시물을 삭제하시겠습니까?</p>
            <Actions ok="삭제" />
          </Panel>
        </Stage>
        <ul className="list-disc space-y-1 pl-5">
          <li>버튼 줄 규칙(버튼 절)을 따르고, 내용과 사이는 위 32다.</li>
          <li>확인창에는 닫기 X가 없다 — 취소가 닫기다.</li>
          <li>확인창의 실행 버튼은 하는 일을 적는다(삭제·해제·나가기).</li>
        </ul>
      </Sub>

      <Sub title="이미지 팝업">
        <div className="w-fit">
          <ImageSample />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            "자세히 보기"는 주요 버튼 색(neutral-700)이다. 포스터 색이 매번 달라
            주황은 이미지와 부딪히고, 시선은 포스터가 끈다.
          </li>
          <li>
            "다시 보지 않기"는 판 밖 가림막 위에 흰 글자로 둔다. 호버는 어두운
            면 글자 버튼(<code>textInverse</code>)처럼 주황, 누름 짙은 주황.
            켜지면 네모+체크.
          </li>
          <li>닫기는 보조 버튼 색(neutral-100, 호버 200).</li>
        </ul>
      </Sub>
    </div>
  );
}
