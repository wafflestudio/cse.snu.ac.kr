import Button from '@/components/ui/Button';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
  VariantTable,
} from '../-components/doc';
import LegacyButton from '../-legacy/Button';

// 버튼 페이지. 문서 틀(-components/doc.tsx)의 기준 페이지. 실제 Button 을 그린다.
// 크기·여백·호버 색처럼 Button 이 정하는 값은 적지 않는다(예시가 보여 주고, 값은 소스에 있다).

// Don't 는 예전 부품 사본(-legacy)으로 그린다.

function Spacer() {
  return <span className="w-24 border-b border-dashed border-neutral-300" />;
}

export function ButtonSection() {
  return (
    <>
      <Lead>버튼은 지금 화면에서 작업을 실행합니다.</Lead>

      <DocSection title="예시">
        <Example>
          <Button variant="primary">저장</Button>
          <Button variant="secondary">취소</Button>
          <Button variant="text">더보기</Button>
          <Button variant="primary" disabled>
            저장
          </Button>
          <Button variant="primary" pending pendingLabel="저장 중…">
            저장
          </Button>
        </Example>
      </DocSection>

      <DocSection title="종류">
        <VariantTable
          rows={[
            {
              name: '주요',
              sample: <Button variant="primary">저장</Button>,
              use: '추가·새 글·저장·게시·등록·예약, 확인창의 실행(삭제·나가기). 한 줄에 하나.',
            },
            {
              name: '보조',
              sample: <Button variant="secondary">편집</Button>,
              use: '편집·취소·목록·해제, 폼·상세의 삭제(확인창을 엽니다).',
            },
            {
              name: '텍스트',
              sample: <Button variant="text">더보기</Button>,
              use: '밝은 면의 글자·아이콘 버튼(더보기, 검색 실행 아이콘, 파일 지우기).',
            },
            {
              name: '텍스트(어두운 면)',
              sample: <Button variant="textInverse">로그인</Button>,
              use: '헤더·모바일 메뉴의 글자 버튼.',
              dark: true,
            },
          ]}
        />
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '저장·삭제·예약·새 글 쓰기처럼 무언가를 실행할 때 씁니다. 누르면 일이 일어난다는 것을 모양이 알립니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '이동만 할 때는 링크를 씁니다. 버튼 모양이면 무언가 실행될 것처럼 보입니다.',
            '값을 고를 때는 알약·글자 토글이나 입력 칸을 씁니다. 고른 값이 남아 보여야 합니다.',
          ]}
        />
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '종류는 행동의 무게로 고르고, 주요 버튼은 한 줄에 하나만 둡니다. 둘이면 다음 행동을 알 수 없습니다.',
            '버튼 줄은 오른쪽 끝에 모으고 주요 버튼을 맨 오른쪽에 둡니다. 폼의 삭제만 왼쪽 끝에 두어 저장과 헷갈려 누르지 않게 합니다.',
            '상세의 관리 버튼은 [삭제] [편집] (게시물은 [목록]까지), 목록의 추가 버튼은 목록 오른쪽 위입니다. 자리가 같아야 찾지 않습니다.',
            '작은 크기는 표·목록 위의 일괄 버튼에만 씁니다. 주된 행동보다 가벼워 보여야 합니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <>
                <Button variant="secondary">삭제</Button>
                <Spacer />
                <Button variant="secondary">취소</Button>
                <Button variant="primary">저장</Button>
              </>
            ),
            caption: '폼의 삭제는 왼쪽 끝에, 저장은 맨 오른쪽에 둡니다.',
          }}
          bad={{
            example: (
              <>
                <LegacyButton variant="secondary">취소</LegacyButton>
                <LegacyButton variant="neutral">삭제</LegacyButton>
                <LegacyButton variant="neutral">저장하기</LegacyButton>
              </>
            ),
            caption:
              '예전 편집 폼은 삭제가 저장하기 옆에 같은 색으로 있어 잘못 누르기 쉬웠습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <>
                <Button variant="primary">연구실 추가</Button>
                <Button variant="primary">교수 추가</Button>
              </>
            ),
            caption: '같은 "추가"는 어느 화면에서나 같은 주요 버튼입니다.',
          }}
          bad={{
            example: (
              <>
                <LegacyButton variant="primary">연구실 추가</LegacyButton>
                <LegacyButton variant="neutral">추가하기</LegacyButton>
              </>
            ),
            caption:
              '예전에는 연구실·시설은 주황, 교수·새 소식은 짙은 회색이라 같은 행동이 화면마다 달랐습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
