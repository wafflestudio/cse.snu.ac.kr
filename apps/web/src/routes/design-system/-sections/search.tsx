import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
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
      <Lead>검색 칸은 놓일 면에 맞는 모양 하나를 고릅니다.</Lead>

      <DocSection title="예시">
        <Example caption="검색 상자(공지 등)는 이름을 칸 위에 둡니다.">
          <SampleForm>
            <SearchInput label="검색" ariaLabel="검색" />
          </SampleForm>
        </Example>
        <Example caption="세미나처럼 태그 없이 검색만 있는 곳은 이름 없이 자리표시로 알립니다.">
          <SampleForm>
            <SearchInput ariaLabel="검색" placeholder="검색어" />
          </SampleForm>
        </Example>
        <Example
          tone="dark"
          caption="헤더는 어두운 막대 위라 어두운 면 칸을 씁니다."
        >
          <SampleForm>
            <SearchInput tone="dark" ariaLabel="통합검색" />
          </SampleForm>
        </Example>
      </DocSection>

      <DocSection title="검색 상자 안">
        <RuleList
          items={[
            '태그 고르기는 체크박스(입력·폼), 고른 태그 줄은 지우기가 붙은 태그(선택·태그)를 그대로 씁니다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않기">
        <DoDont
          good={{
            example: (
              <div className="bg-neutral-850 p-4">
                <UnderlineSearch />
              </div>
            ),
            caption:
              '모바일 메뉴의 검색은 전체 화면을 덮는 어두운 면이라 밑줄 칸입니다.',
          }}
          bad={{
            example: (
              <div className="bg-neutral-850 p-4">
                <SampleForm>
                  <SearchInput tone="dark" ariaLabel="검색" />
                </SampleForm>
              </div>
            ),
            caption:
              '모바일 메뉴에 헤더의 채움 칸을 쓰면 메뉴의 모양과 맞지 않습니다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['form', '입력·폼'],
            ['selection', '선택·태그'],
            ['navigation', '내비게이션·셸'],
          ]}
        />
      </DocSection>
    </>
  );
}
