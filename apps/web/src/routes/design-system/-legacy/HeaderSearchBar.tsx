import { Search } from 'lucide-react';
import LegacyButton from './Button';

// d1baf83c 의 apps/web/src/components/layout/Header/HeaderSearchBar.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 헤더 검색 칸. 번역·라우터는 빼고, 제출해도 이동하지 않는다.
// 예전 값: 칸 30px·216px·회색 200 채움·모서리 1px, 검색 버튼은 quiet sm(여백 없음)이라 누르는 영역이 아이콘 폭 20 × 칸 높이 30,
// 호버하면 돋보기가 흰색이 된다.
export function LegacyHeaderSearchBar() {
  return (
    <form
      className="flex h-7.5 w-54 justify-center rounded-[.0625rem] bg-neutral-200 pr-1 outline-none"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        aria-label="통합검색"
        type="text"
        className="autofill-bg-neutral-200 h-auto w-full border-0 bg-transparent px-2 text-xs shadow-none outline-none"
      />
      <LegacyButton variant="quiet" size="sm" ariaLabel="통합검색">
        <Search className="h-5 w-5" strokeWidth={1.5} />
      </LegacyButton>
    </form>
  );
}
