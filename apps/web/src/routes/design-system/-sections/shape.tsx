import type { ReactNode } from 'react';

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
  style,
}: {
  label: string;
  note: string;
  className: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="flex w-40 flex-col gap-2">
      <div className={`h-16 w-full bg-white ${className}`} style={style} />
      <p className="type-label">{label}</p>
      <p className="type-meta text-neutral-500">{note}</p>
    </div>
  );
}

export function ShapeSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="모서리">
        <p>
          이 사이트는 각진 선과 면이 기본이다. 모서리는 세 가지만 쓴다: 없음,
          컨트롤의 작은 모서리, 알약·원.
        </p>
        <div className="flex flex-wrap gap-8">
          <Sample
            label="없음"
            note="카드·목록·면·사진·모달 판"
            className="border border-neutral-300"
          />
          <Sample
            label="컨트롤 2px (rounded-xs)"
            note="버튼·입력·드롭다운·검색창·파일 선택"
            className="rounded-xs border border-neutral-300"
          />
          <Sample
            label="알약·원 (rounded-full)"
            note="태그·필터 알약·단일 선택 알약·원 그래픽"
            className="rounded-full border border-neutral-300"
          />
        </div>
      </Sub>

      <Sub title="그림자">
        <p>
          그림자는 화면 위에 떠 있는 것(모달·드롭다운 목록·날짜 선택)에만 쓴다.
          한 가지 값이다. 카드·목록은 그림자 대신 면 색과 선으로 구분한다.
        </p>
        <div className="flex flex-wrap gap-8">
          <Sample
            label="없음"
            note="카드·목록·면"
            className="border border-neutral-200"
          />
          <Sample
            label="떠 있는 층 (shadow-overlay)"
            note="모달·드롭다운·날짜 선택"
            className="shadow-overlay"
          />
        </div>
        <p className="type-meta text-neutral-500">
          메인 뉴스 카드와 교과목 카드 뒤집기의 그림자는 그 화면 고유의 표현이라{' '}
          <a
            href="/design-system/main"
            className="underline underline-offset-2"
          >
            메인·카테고리
          </a>
          ,{' '}
          <a
            href="/design-system/unique"
            className="underline underline-offset-2"
          >
            고유 화면
          </a>{' '}
          절에서 정한다.
        </p>
      </Sub>

      <Sub title="선">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>1px</b> — 기본. 목록·카드 구분선, 입력 테두리(색은{' '}
            <a
              href="/design-system/color"
              className="underline underline-offset-2"
            >
              색 절
            </a>
            ).
          </li>
          <li>
            <b>2px</b> — 강조. 선택된 탭 밑줄, 목록을 크게 나누는 제목 밑줄.
          </li>
          <li>
            3px·5px 같은 굵은 선(모달 위 주황 선, 메인 링크 행 왼쪽 바)은
            컴포넌트 고유 표현이라{' '}
            <a
              href="/design-system/dialog"
              className="underline underline-offset-2"
            >
              모달
            </a>
            ,{' '}
            <a
              href="/design-system/main"
              className="underline underline-offset-2"
            >
              메인·카테고리
            </a>{' '}
            절에서 정한다. 같은 값은 한 가지로 적는다(
            <code>border-t-3</code>, <code>border-t-[3px]</code> 아님).
          </li>
        </ul>
      </Sub>
    </div>
  );
}
