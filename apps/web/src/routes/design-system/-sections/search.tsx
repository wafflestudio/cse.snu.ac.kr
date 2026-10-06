import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import {
  DocSection,
  DoDont,
  Example,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';
import { LegacySeminarSearchBar } from '../-legacy/SeminarSearchBar';

// 검색 입력 페이지. 실제 SearchInput 을 그린다. 칸의 높이·테두리·폭은 부품이 정하므로 적지 않는다.

// 견본은 제출하지 않는다.
function SampleForm({ children }: { children: ReactNode }) {
  return (
    <form className="w-full max-w-80" onSubmit={(e) => e.preventDefault()}>
      {children}
    </form>
  );
}

// 모바일 메뉴의 밑줄 검색 칸 견본. MobileNavList 안의 칸은 라우터·전역 상태에 묶여 있어
// 같은 클래스로 옮겨 그린다(입력·실행 버튼은 실제로 움직이고, 실행해도 이동하지 않는다).
function UnderlineSearch() {
  return (
    <form
      className="field-focus-within flex w-56 items-center border-b border-neutral-400 [--field-focus:var(--color-white)]"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        className="h-8 w-full bg-transparent type-ui text-white outline-none placeholder:text-neutral-500"
        placeholder="검색어를 입력해 주세요"
        aria-label="검색어"
      />
      <Button variant="textInverse" type="submit" ariaLabel="검색 실행">
        <Search className="size-5" />
      </Button>
    </form>
  );
}

export function SearchSection() {
  return (
    <>
      <Lead>검색 칸은 배치되는 면에 맞는 모양을 선택해 사용합니다.</Lead>

      <DocSection title="예시">
        <Example caption="검색 상자(공지 등)는 이름을 칸 위에 표시합니다.">
          <SampleForm>
            <SearchInput label="검색" ariaLabel="검색" />
          </SampleForm>
        </Example>
        <Example caption="세미나처럼 태그 없이 검색만 있는 경우 이름 없이 자리표시로 안내합니다.">
          <SampleForm>
            <SearchInput ariaLabel="검색" placeholder="검색어" />
          </SampleForm>
        </Example>
        <Example
          tone="dark"
          caption="헤더는 어두운 막대 위에 있으므로 어두운 면 칸을 사용합니다."
        >
          <SampleForm>
            <SearchInput tone="dark" ariaLabel="통합검색" />
          </SampleForm>
        </Example>
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '검색 상자 안의 태그 선택은 체크박스, 선택한 태그 줄은 지우기 태그를 그대로 씁니다. 검색용 모양을 따로 만들면 같은 일이 두 모양이 됩니다.',
          ]}
        />
        <KnownGap>
          모바일 메뉴의 전체 화면 검색만 밑줄 칸입니다. 채움 칸을 넣어 보니
          메뉴와 너무 달라 그대로 두었습니다.
        </KnownGap>
        <Example tone="dark">
          <UnderlineSearch />
        </Example>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: (
              <SampleForm>
                <SearchInput ariaLabel="검색" placeholder="검색어" />
              </SampleForm>
            ),
            caption: '밝은 면의 검색 칸은 다른 입력 칸과 같은 모양입니다.',
          }}
          bad={{
            example: <LegacySeminarSearchBar />,
            caption:
              '예전 세미나 검색은 회색 채움 칸이라 공지·새 소식의 흰 검색 칸과 모양이 달랐습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
