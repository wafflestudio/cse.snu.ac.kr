import { DocSection, Lead, RuleList } from '../-components/doc';

// 문구 규칙. 예시는 앱에 실제로 있는 문구에서 골랐다.

// 규칙을 어긴 문구와 지킨 문구를 나란히 둔다.
function Pairs({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid max-w-3xl grid-cols-2 border-y border-neutral-200 type-ui">
      <div className="col-span-full grid h-11 grid-cols-subgrid items-center border-b border-neutral-200 type-label">
        <span className="px-3 text-red-600">사용하지 않음</span>
        <span className="px-3">사용</span>
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
      <Lead>문구는 무엇을 했는지·할지를 차분한 존댓말로 짧게 작성합니다.</Lead>

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
            '누르면 일어나는 일을 동사 명사 하나로 씁니다(저장·삭제, 교과목 추가). "확인"이나 "-하기"를 쓰지 않습니다. 버튼만 보고 무엇이 일어날지 알 수 있어야 합니다.',
            '처리 중에는 같은 동사에 "중…"을 붙입니다(저장 중…).',
          ]}
        />
        <Pairs
          rows={[
            ['저장하기', '저장'],
            ['게시하기', '게시'],
            ['추가하기', '<대상> 추가(예: 교과목 추가)'],
            ['예약하기', '예약'],
            ['새 게시글', '새 게시물'],
          ]}
        />
      </DocSection>

      <DocSection title="성공 토스트">
        <RuleList
          items={[
            '"<대상>을(를) <동사>했습니다." 한 문장입니다. 동사는 누른 버튼과 같은 말, 대상은 화면의 이름 그대로 써서 무엇을 했는지 남깁니다("~에 성공했습니다"는 그것이 빠집니다).',
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
            '"<이름> <종류>을(를) <동사>하시겠습니까?"로 쓰고, 되돌릴 수 없으면 둘째 줄에 결과를 적습니다(삭제는 "되돌릴 수 없습니다.", 이탈은 사라지는 것). 누르기 전에 무엇이 어떻게 되는지 알 수 있어야 합니다.',
            '느낌표나 "정말" 같은 꾸밈말은 쓰지 않습니다. 결과를 적는 것으로 충분합니다.',
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

      <DocSection title="예약은 삭제 대신 취소">
        <RuleList
          items={[
            '예약은 방문자에게 익숙한 말인 "취소"로 씁니다. 반복 예약은 "이 예약만 취소"와 "반복 예약 전체 취소"로 나눠 어디까지 취소되는지 버튼에 적습니다.',
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
            '"<칸 이름>을(를) 입력해 주세요."처럼 해야 할 일을 씁니다(고르는 칸은 "선택해 주세요"). 칸 이름만으로는 무엇을 고칠지 알 수 없습니다.',
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
            '방문자가 보는 문구는 영어로도 씁니다. 관리 문구는 편집을 한국어 사용자만 하므로 번역하지 않아도 됩니다.',
            '서버 오류는 종류마다 정해 둔 한 문구를 씁니다. 화면마다 쓰면 같은 오류가 다른 말이 됩니다.',
          ]}
        />
      </DocSection>
    </>
  );
}
