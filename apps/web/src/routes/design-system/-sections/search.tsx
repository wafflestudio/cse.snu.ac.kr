import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import SearchInput from '@/components/ui/SearchInput';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

// 견본은 제출하지 않는다.
function SampleForm({ children }: { children: ReactNode }) {
  return <form onSubmit={(e) => e.preventDefault()}>{children}</form>;
}

export function SearchSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="검색 칸 — 한 부품">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="bg-neutral-50 p-4">
              <SampleForm>
                <SearchInput label="검색" ariaLabel="검색" />
              </SampleForm>
            </div>
            <p className="type-meta text-neutral-500">
              검색 상자(공지 등) — 이름은 칸 위
            </p>
          </div>
          <div className="space-y-2">
            <SampleForm>
              <SearchInput ariaLabel="검색" placeholder="검색어" />
            </SampleForm>
            <p className="type-meta text-neutral-500">
              세미나 — 이름 없이 자리표시
            </p>
          </div>
          <div className="space-y-2">
            <div className="bg-chrome-bar p-4">
              <SampleForm>
                <SearchInput tone="dark" ariaLabel="통합검색" />
              </SampleForm>
            </div>
            <p className="type-meta text-neutral-500">헤더(어두운 면)</p>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            검색 칸은 <code>ui/SearchInput</code> 하나로 그린다. 검색 실행(주소
            바꾸기)은 감싸는 form이 맡고, 부품은 모양·돋보기 버튼·고유 id만
            맡는다. id를 직접 적지 않는다(한 화면에 헤더와 검색 상자가 같이
            있다).
          </li>
          <li>
            밝은 면은 입력 칸 한 벌(2-2): 34px, 테두리 300, 흰 바탕, 폭 320.
            돋보기는 칸 안 오른쪽의 글자 버튼(20px, 호버 주황).
          </li>
          <li>
            이름이 필요하면 칸 위 8에 둔다(폼 필드명과 같다). 태그 없이 검색만
            있는 곳은 이름 없이 자리표시로 알린다.
          </li>
          <li>
            헤더는 어두운 막대라 테두리 없는 채움 칸(<code>tone="dark"</code>,
            neutral-100, 폭 216)이다.
          </li>
        </ul>
      </Sub>

      <Sub title="모바일 메뉴의 검색">
        <div className="w-80 bg-neutral-850 p-6">
          <div className="flex items-center border-b border-neutral-400">
            <span className="h-8 flex-1 type-ui leading-8 text-neutral-500">
              검색어를 입력해주세요
            </span>
            <Search className="size-5 text-white" />
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            전체 화면을 덮는 어두운 검색이라 밑줄 칸이다. 헤더와 같은 채움 칸을
            넣어 봤으나 모바일 메뉴의 모양이 너무 달라져 그대로 둔다.
          </li>
        </ul>
      </Sub>

      <Sub title="검색 상자의 태그">
        <p>
          검색 상자 안의 태그 고르기는 2-2 체크박스, 고른 태그 줄은 2-3 태그
          그대로다.
        </p>
      </Sub>
    </div>
  );
}
