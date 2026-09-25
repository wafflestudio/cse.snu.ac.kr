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

function Decision({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 border-2 border-main-orange p-5">
      <p className="type-label">{title}</p>
      {children}
    </div>
  );
}

export function ShapeSection() {
  return (
    <div className="space-y-12 type-body">
      <div className="border-l-4 border-main-orange bg-neutral-50 px-4 py-3 type-meta">
        <p className="type-label">제안(미적용). 결정할 것 2개</p>
        <ol className="mt-1 list-decimal pl-5">
          <li>컨트롤 모서리를 2px과 4px 중 하나로</li>
          <li>인물 사진 그림자를 둘지</li>
        </ol>
      </div>

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
            label="컨트롤 (결정 1)"
            note="버튼·입력·드롭다운·검색창·파일 선택"
            className="rounded-xs border border-neutral-300"
          />
          <Sample
            label="알약·원"
            note="태그·필터 알약·단일 선택 알약·원 그래픽"
            className="rounded-full border border-neutral-300"
          />
        </div>
        <p className="type-meta text-neutral-500">
          정리 전: 1px(버튼) · 2px(입력) · 4px(드롭다운·파일·검색창 등 19곳) ·
          6·8·12·16px 각 한 곳씩 · 알약 30px 3곳 · 원.
        </p>
      </Sub>

      <Decision title="결정 1 — 컨트롤 모서리">
        <div className="flex flex-wrap gap-10">
          {[
            [
              'A. 2px (추천)',
              'rounded-xs',
              '버튼 1→2, 입력 2 그대로, 드롭다운 등 4→2. 사이트의 각진 인상에 맞다.',
            ],
            [
              'B. 4px',
              'rounded-sm',
              '버튼 1→4, 입력 2→4, 드롭다운 등 4 그대로. 조금 부드럽다.',
            ],
          ].map(([label, cls, note]) => (
            <div key={label} className="flex w-72 flex-col gap-3">
              <p className="type-label">{label}</p>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-8.5 items-center bg-neutral-700 px-4 type-label text-white ${cls}`}
                >
                  저장
                </span>
                <span
                  className={`inline-flex h-8.5 items-center border border-neutral-200 bg-neutral-100 px-4 type-label text-neutral-600 ${cls}`}
                >
                  취소
                </span>
              </div>
              <div
                className={`h-8 border border-neutral-300 bg-white px-3 type-ui leading-8 text-neutral-500 ${cls}`}
              >
                제목을 입력해 주세요
              </div>
              <p className="type-meta text-neutral-500">{note}</p>
            </div>
          ))}
        </div>
      </Decision>

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
            label="떠 있는 층"
            note="모달·드롭다운·날짜 선택"
            className=""
            style={{ boxShadow: '0 4px 20px 0 rgba(0,0,0,.15)' }}
          />
        </div>
        <p className="type-meta text-neutral-500">
          정리 전: 떠 있는 층에 shadow-lg·임의값 두 가지가 섞여 있다. 메인 뉴스
          카드 그림자와 교과목 카드 뒤집기 그림자는 그 화면 고유의 표현이라
          3-6·3-7에서 본다.
        </p>
      </Sub>

      <Decision title="결정 2 — 인물 사진 그림자">
        <p>
          교수진·교직원 사진에만 옅은 그림자(drop-shadow)가 있다. 규칙대로면
          없앤다.
        </p>
        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-2">
            <div className="h-28 w-24 bg-neutral-200 drop-shadow-[0_0_4px_rgba(0,0,0,.15)]" />
            <p className="type-meta">A. 지금(그림자)</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-28 w-24 bg-neutral-200" />
            <p className="type-meta">B. 없앰 (추천 — 다른 사진·카드와 같게)</p>
          </div>
        </div>
      </Decision>

      <Sub title="선">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>1px</b> — 기본. 목록·카드 구분선(neutral-200), 입력
            테두리(neutral-300).
          </li>
          <li>
            <b>2px</b> — 강조. 선택된 탭 밑줄, 목록을 크게 나누는 제목 밑줄.
          </li>
          <li>
            3px·5px 같은 굵은 선(모달 위 주황 선, 메인 링크 행 왼쪽 바)은
            컴포넌트 고유 표현이라 2-4 모달·3-6 메인에서 정한다.
          </li>
          <li>
            같은 값을 다르게 적은 것(<code>border-t-3</code>·
            <code>border-t-[3px]</code>)과 오기(
            <code>-top-[48%]</code> 중복, <code>sm: hrink-0</code>)는 고친다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
