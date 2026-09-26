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

// 버튼 페이지 — 문서 틀(-components/doc.tsx)의 기준 페이지. 실제 Button 을 그린다.
// 크기·여백·호버 색처럼 Button 이 정하는 값은 적지 않는다(예시가 보여 주고, 값은 소스에 있다).

// 쓰지 않는 모양을 보여 주려고만 그리는 가짜 버튼(주황 채움). 앱에는 없다.
function OrangeFilled({ children }: { children: string }) {
  return (
    <span className="inline-flex h-8.5 items-center rounded-xs bg-main-orange px-4 type-label text-white">
      {children}
    </span>
  );
}

function Spacer() {
  return <span className="w-24 border-b border-dashed border-neutral-300" />;
}

export function ButtonSection() {
  return (
    <>
      <Lead>
        버튼은 누르면 이 화면에서 무언가를 하는 것이다. 모양은 행동의 종류로
        고르고, 강조는 주황이 아니라 회색의 짙기로 한다.
      </Lead>

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
              use: '편집·취소·목록·해제, 폼·상세의 삭제(확인창을 연다).',
            },
            {
              name: '텍스트',
              sample: <Button variant="text">더보기</Button>,
              use: '밝은 면의 글자·아이콘 버튼 — 더보기, 검색 실행 아이콘, 파일 지우기.',
            },
            {
              name: '텍스트(어두운 면)',
              sample: <Button variant="textInverse">로그인</Button>,
              use: '헤더·모바일 메뉴의 글자 버튼.',
              dark: true,
            },
          ]}
        />
        <RuleList
          items={[
            '표·목록 안의 일괄 버튼만 작게 쓴다.',
            '처리 중 문구는 누른 동사 + " 중…" — 저장 중…, 게시 중…, 삭제 중….',
          ]}
        />
      </DocSection>

      <DocSection title="버튼 대신 쓰는 것">
        <RuleList
          items={[
            '여러 개 중 하나를 고른다 → 알약·라디오(선택·태그).',
            '보기를 바꾼다(목록형·카드형) → 글자 토글(선택·태그).',
            '본문 속에서 다른 페이지로 간다 → 글자 링크(읽는 본문).',
            '날짜·파일을 고른다 → 입력 칸(입력·폼).',
          ]}
        />
      </DocSection>

      <DocSection title="여러 버튼을 둘 때">
        <RuleList
          items={[
            '오른쪽 끝에 모으고 주요 버튼을 맨 오른쪽에 둔다.',
            '폼 아래의 삭제만 왼쪽 끝으로 떼어 놓는다.',
            '상세의 관리 버튼은 [삭제] [편집] 순서, 게시물은 그 뒤에 [목록].',
            '목록의 추가·새 글 버튼은 목록 오른쪽 위에 둔다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
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
            caption: '삭제는 저장과 멀리 떼어 놓는다.',
          }}
          bad={{
            example: (
              <>
                <Button variant="secondary">취소</Button>
                <Button variant="primary">저장</Button>
                <Button variant="secondary">삭제</Button>
              </>
            ),
            caption: '삭제를 저장 옆에 붙인다 — 잘못 누르기 쉽다.',
          }}
        />
        <DoDont
          good={{
            example: <Button variant="primary">저장</Button>,
            caption: '주요 버튼은 짙은 회색 채움.',
          }}
          bad={{
            example: <OrangeFilled>저장</OrangeFilled>,
            caption: '주황으로 채운다 — 주황은 현재 위치·강조의 색이다.',
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
            caption: '"확인"으로 대신한다 — 무엇이 일어나는지 모른다.',
          }}
        />
        <DoDont
          good={{
            example: <Button variant="primary">교수 추가</Button>,
            caption: '짧은 행동명, 대상이 필요하면 앞에.',
          }}
          bad={{
            example: <Button variant="primary">추가하기</Button>,
            caption: '"-하기"를 붙인다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['selection', '선택·태그'],
            ['dialog', '모달'],
            ['form', '입력·폼'],
            ['writing', '문구'],
          ]}
        />
      </DocSection>
    </>
  );
}
