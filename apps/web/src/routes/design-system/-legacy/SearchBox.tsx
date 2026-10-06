import { Search } from 'lucide-react';

// d1baf83c 의 apps/web/src/components/feature/SearchBox/index.tsx(formOnly)와 SearchBox/Input.tsx 를 옮긴 사본.
// DS 문서 전용(앱 코드에서 가져오지 않는다). 통합 검색 위 검색 상자. 견본을 작게 두려고 태그 체크박스 줄은 뺐고,
// 제출은 주소를 바꾸지 않는다. 예전 값: 상자 아래 36px(mb-9), 칸 30px·216px, 이름과 칸 사이 28px.

export function LegacySearchBox() {
  return (
    <div className="mb-9 w-full">
      <form
        className="flex flex-col gap-5 rounded-sm bg-neutral-50 p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center">
          <label
            htmlFor="legacy-search"
            className="mr-7 whitespace-nowrap text-md font-bold tracking-wide"
          >
            검색
          </label>
          <div className="relative flex h-7.5 w-54 items-center justify-between rounded-sm bg-white pr-3">
            <input
              type="text"
              id="legacy-search"
              name="keyword"
              className="autofill-bg-white w-full rounded-sm bg-transparent px-2 text-sm tracking-wide outline-none"
            />
            <button
              type="submit"
              className="-m-0.5 p-0.5 text-neutral-800 hover:text-neutral-500"
              aria-label="검색"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
