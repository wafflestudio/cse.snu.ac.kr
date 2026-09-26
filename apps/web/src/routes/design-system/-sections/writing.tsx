import type { ReactNode } from 'react';

// 문구 규칙. 전 → 지금 은 앱에 실제로 있는 문구에서 골랐다.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function Pairs({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid max-w-3xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] border-y border-neutral-200 type-ui">
      <div className="col-span-full grid h-11 grid-cols-subgrid items-center border-b border-neutral-200 type-label">
        <span className="px-3">전</span>
        <span />
        <span className="px-3">지금</span>
      </div>
      {rows.map(([before, after]) => (
        <div
          key={before}
          className="col-span-full grid grid-cols-subgrid items-center py-3 odd:bg-neutral-50"
        >
          <span className="px-3 text-neutral-500">{before}</span>
          <span className="text-neutral-400">→</span>
          <span className="px-3 text-neutral-950">{after}</span>
        </div>
      ))}
    </div>
  );
}

export function WritingSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="기본">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            차분한 존댓말(-습니다·-해 주세요). 느낌표·"정말"·"성공" 같은 꾸밈을
            붙이지 않는다(DS-005·DS-035).
          </li>
          <li>
            같은 것은 한 이름으로: 게시물(게시글 X), 새 소식(새소식 X), 선택한
            (선택된 X), 편집 중(편집중 X).
          </li>
        </ul>
      </Sub>

      <Sub title="버튼 — 짧은 행동명">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            동사 명사 하나("저장"·"삭제"·"게시"), 대상이 필요하면 앞에 ("동아리
            추가"·"변경사항 저장"). "-하기"를 붙이지 않는다.
          </li>
          <li>
            저장·삭제·이탈을 "확인"으로 대신하지 않는다. 확인창의 실행 버튼은
            하는 일을 적는다(삭제·나가기·고정 해제).
          </li>
          <li>진행 중 문구는 "저장 중…"처럼 같은 동사 + " 중…".</li>
        </ul>
        <Pairs
          rows={[
            ['저장하기 (폼 기본)', '저장'],
            ['게시하기', '게시'],
            ['추가하기 (4곳)', '<대상> 추가 — 예: 교과목 추가'],
            ['예약하기', '예약'],
            ['새 게시글 · 새 교과목', '새 게시물 · 새 교과목'],
          ]}
        />
      </Sub>

      <Sub title="성공 토스트 — 무엇을 어떻게 했는지">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            "&lt;대상&gt;을(를) &lt;동사&gt;했습니다." 한 문장. 동사는 누른
            버튼과 같은 말(추가·수정·삭제·게시·해제). 대상은 화면 이름 그대로.
          </li>
          <li>
            "~에 성공했습니다"는 쓰지 않는다 — 무엇을 했는지가 빠진다(지금 "~에
            성공했습니다" 11곳).
          </li>
          <li>여러 개를 한꺼번에 했으면 "선택한 &lt;대상&gt;을(를) …".</li>
        </ul>
        <Pairs
          rows={[
            ['수정에 성공했습니다.', '졸업 규정을 수정했습니다.'],
            ['추가에 성공했습니다.', '교과목 변경 내역을 추가했습니다.'],
            ['게시글을 삭제했습니다.', '게시물을 삭제했습니다.'],
            ['새소식을 게시했습니다.', '새 소식을 게시했습니다.'],
            [
              '선택된 공지를 고정 해제했습니다.',
              '선택한 공지를 고정 해제했습니다.',
            ],
          ]}
        />
      </Sub>

      <Sub title="확인창 — 무엇을, 되돌릴 수 있는지">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            "&lt;무엇&gt;을(를) &lt;동사&gt;하시겠습니까?" — 무엇에는 이름을
            넣는다(DS-005 후속). 이름이 없는 대상은 종류만.
          </li>
          <li>
            삭제는 둘째 줄에 "되돌릴 수 없습니다." 이탈은 무엇이 사라지는지.
          </li>
        </ul>
        <Pairs
          rows={[
            [
              '삭제하시겠습니까?',
              '‘컴퓨터의 개념 및 실습’ 교과목을 삭제하시겠습니까? 되돌릴 수 없습니다.',
            ],
            [
              '동아리를 삭제하시겠습니까?',
              '‘와플스튜디오’ 동아리를 삭제하시겠습니까? 되돌릴 수 없습니다.',
            ],
            [
              '정말 선택된 슬라이드를 모두 해제하시겠습니까?',
              '선택한 슬라이드 3개를 해제하시겠습니까?',
            ],
            ['편집중인 내용이 사라집니다.', '저장하지 않은 내용이 사라집니다.'],
          ]}
        />
      </Sub>

      <Sub title="예약 — 삭제 대신 취소">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            예약은 "취소"라고 부른다(DS-038). 반복 예약은 두 버튼으로 나눈다.
          </li>
        </ul>
        <Pairs
          rows={[
            [
              '삭제 / 해당 예약을 삭제하시겠습니까?',
              '이 예약만 취소 / 이 예약을 취소하시겠습니까?',
            ],
            [
              '반복 예약을 모두 삭제하시겠습니까?',
              '반복 예약 전체 취소 / 반복 예약 전체를 취소하시겠습니까?',
            ],
            ['예약을 삭제했습니다.', '예약을 취소했습니다.'],
          ]}
        />
      </Sub>

      <Sub title="입력 오류">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            "&lt;칸 이름&gt;을(를) 입력해 주세요." 고르는 칸은 "선택해 주세요".
            칸 이름만 적힌 오류(교과목 추가·편집 폼의 "교과목명"·"course name"
            등)를 문장으로.
          </li>
        </ul>
        <Pairs
          rows={[
            ['교과목명', '교과목명을 입력해 주세요.'],
            ['course name', '영문 교과목명을 입력해 주세요.'],
            ['제목을 입력해주세요.', '제목을 입력해 주세요.'],
          ]}
        />
      </Sub>

      <Sub title="범위 밖">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            영어 화면의 관리 문구(편집 폼 필드명·토스트)는 번역하지 않는다 —
            편집은 한국어 사용자만 한다. 방문자가 보는 문구만 영어로.
          </li>
          <li>서버가 주는 오류 문구는 오류 사전(2-6)이 정한다.</li>
        </ul>
      </Sub>
    </div>
  );
}
