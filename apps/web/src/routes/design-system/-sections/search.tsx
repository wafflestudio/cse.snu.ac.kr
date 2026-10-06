import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import {
  DocSection,
  DoDont,
  Example,
  KnownGap,
  Lead,
  RuleList,
} from '../-components/doc';

// 검색 입력 페이지. 실제 SearchInput 을 그린다. 칸의 높이·테두리·폭은 부품이 정하므로 적지 않는다.

// 견본은 제출하지 않는다.
function SampleForm({ children }: { children: ReactNode }) {
  return (
    <form className="w-full max-w-80" onSubmit={(e) => e.preventDefault()}>
      {children}
    </form>
  );
}

// 모바일 메뉴의 밑줄 검색 칸 견본.
function UnderlineSearch() {
  return (
    <div className="flex w-56 items-center border-b border-neutral-400">
      <span className="h-8 flex-1 type-ui leading-8 text-neutral-500">
        검색어를 입력해 주세요
      </span>
      <Search className="size-5 text-white" />
    </div>
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
            example: (
              <div className="flex h-8.5 w-60 items-center rounded-xs bg-neutral-100 px-3 type-ui text-neutral-500">
                <span className="flex-1">검색어</span>
                <Search />
              </div>
            ),
            caption:
              '예전 세미나 검색은 회색 채움 칸이라 공지·새 소식의 흰 검색 칸과 모양이 달랐습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
