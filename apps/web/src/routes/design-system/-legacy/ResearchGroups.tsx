import LegacyButton from './Button';

// d1baf83c 의 apps/web/src/routes/$locale/research/groups/index.tsx 에서 고른 스트림의 머리(관리 버튼 줄 + 제목)를
// 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다). 버튼 줄이 제목 위에 따로 오른쪽 정렬로 있었다.
// 회색 판의 page-gutter-x·pt/pb 는 견본 칸에 맞춰 p-6 으로 줄였다. 예전 sm 은 640 이라 min-[40rem]: 으로 옮겼다.
// 로그인 확인(LoginVisible)은 빼고 늘 보이게 했고, 편집 링크는 이동하지 않는 <a href="#"> 다.
export function LegacyResearchGroupHead({ title }: { title: string }) {
  return (
    <div className="flex w-full flex-col bg-neutral-100 p-6">
      <div className="mb-7 flex justify-end gap-3">
        <LegacyButton as="button" variant="secondary" size="md">
          삭제
        </LegacyButton>
        <LegacyButton as="a" variant="secondary" size="md">
          편집
        </LegacyButton>
      </div>
      <h2 className="mb-6 ml-1 whitespace-nowrap text-base font-bold leading-loose min-[40rem]:mx-0 min-[40rem]:mb-[18px] min-[40rem]:text-[24px]">
        {title}
      </h2>
    </div>
  );
}
