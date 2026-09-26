import { DocSection, Lead, Related, RuleList } from '../-components/doc';

// 문구 규칙. 예시는 앱에 실제로 있는 문구에서 골랐다.

// 규칙을 어긴 문구와 지킨 문구를 나란히 둔다.
function Pairs({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid max-w-3xl grid-cols-2 border-y border-neutral-200 type-ui">
      <div className="col-span-full grid h-11 grid-cols-subgrid items-center border-b border-neutral-200 type-label">
        <span className="px-3 text-red-600">쓰지 않는다</span>
        <span className="px-3">쓴다</span>
      </div>
      {rows.map(([bad, good]) => (
        <div
          key={bad}
          className="col-span-full grid grid-cols-subgrid items-center py-3 odd:bg-neutral-50"
        >
          <span className="px-3 text-neutral-500">{bad}</span>
          <span className="px-3 text-neutral-950">{good}</span>
        </div>
      ))}
    </div>
  );
}

export function WritingSection() {
  return (
    <>
      <Lead>
        문구는 차분한 존댓말(-습니다·-해 주세요)로, 무엇을 했는지·할지를 짧게
        쓴다. 느낌표·"정말"·"성공" 같은 꾸밈을 붙이지 않는다.
      </Lead>

      <DocSection title="같은 것은 한 이름으로">
        <Pairs
          rows={[
            ['게시글', '게시물'],
            ['새소식', '새 소식'],
            ['선택된', '선택한'],
            ['편집중', '편집 중'],
          ]}
        />
      </DocSection>

      <DocSection title="버튼">
        <RuleList
          items={[
            '동사 명사 하나 — 저장·삭제·게시. 대상이 필요하면 앞에 — 동아리 추가·교과목 추가. "-하기"를 붙이지 않는다.',
            '저장·삭제·이탈을 "확인"으로 대신하지 않는다. 확인창의 실행 버튼은 하는 일을 적는다(삭제·나가기·고정 해제).',
            '처리 중 문구는 같은 동사 + " 중…" — 저장 중….',
          ]}
        />
        <Pairs
          rows={[
            ['저장하기', '저장'],
            ['게시하기', '게시'],
            ['추가하기', '<대상> 추가 — 예: 교과목 추가'],
            ['예약하기', '예약'],
            ['새 게시글', '새 게시물'],
          ]}
        />
      </DocSection>

      <DocSection title="성공 토스트">
        <RuleList
          items={[
            '"<대상>을(를) <동사>했습니다." 한 문장. 동사는 누른 버튼과 같은 말(추가·수정·삭제·게시·해제), 대상은 화면 이름 그대로.',
            '"~에 성공했습니다"는 쓰지 않는다 — 무엇을 했는지가 빠진다.',
            '여러 개를 한꺼번에 했으면 "선택한 <대상>을(를) …".',
          ]}
        />
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
      </DocSection>

      <DocSection title="확인창">
        <RuleList
          items={[
            '"<무엇>을(를) <동사>하시겠습니까?" — 무엇에는 이름을 넣는다. 이름이 없는 대상은 종류만.',
            '삭제는 둘째 줄에 "되돌릴 수 없습니다." 이탈은 무엇이 사라지는지 쓴다.',
          ]}
        />
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
      </DocSection>

      <DocSection title="예약 — 삭제 대신 취소">
        <RuleList
          items={[
            '예약은 "삭제"가 아니라 "취소"라고 부른다.',
            '반복 예약은 "이 예약만 취소"와 "반복 예약 전체 취소" 두 버튼으로 나눈다.',
          ]}
        />
        <Pairs
          rows={[
            [
              '삭제 / 해당 예약을 삭제하시겠습니까?',
              '이 예약만 취소 / 이 예약을 취소하시겠습니까? 되돌릴 수 없습니다.',
            ],
            [
              '반복 예약을 모두 삭제하시겠습니까?',
              '반복 예약 전체 취소 / 반복 예약 전체를 취소하시겠습니까? 되돌릴 수 없습니다.',
            ],
            ['예약을 삭제했습니다.', '예약을 취소했습니다.'],
          ]}
        />
      </DocSection>

      <DocSection title="입력 오류">
        <RuleList
          items={[
            '"<칸 이름>을(를) 입력해 주세요." 고르는 칸은 "선택해 주세요". 칸 이름만 적지 않고 문장으로 쓴다.',
          ]}
        />
        <Pairs
          rows={[
            ['교과목명', '교과목명을 입력해 주세요.'],
            ['course name', '영문 교과목명을 입력해 주세요.'],
            ['제목을 입력해주세요.', '제목을 입력해 주세요.'],
          ]}
        />
      </DocSection>

      <DocSection title="번역·서버 오류">
        <RuleList
          items={[
            '방문자가 보는 문구는 영어로도 쓴다. 관리 문구(편집 폼 필드명·토스트)는 번역하지 않아도 된다 — 편집은 한국어 사용자만 한다(이미 있는 번역은 둔다).',
            '서버 오류 문구는 백엔드 오류 코드별 사전(utils/apiErrors.ts)이 정한다.',
          ]}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['button', '버튼'],
            ['toast', '토스트'],
            ['dialog', '모달'],
            ['form', '입력·폼'],
            ['list', '목록·상태 화면'],
          ]}
        />
      </DocSection>
    </>
  );
}
