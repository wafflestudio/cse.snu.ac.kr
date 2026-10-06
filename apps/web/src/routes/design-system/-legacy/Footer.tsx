import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/components/layout/Footer/index.tsx 안 LinkGroup 을 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 푸터 위 띠의 링크 한 열(밝은 판). 번역·열 폭(width)은 빼고, 라우터 링크는 이동하지 않는 <a href="#"> 로 바꿨다.
// 예전 값: 이름 13·500(데스크톱 15), 이름 아래 10px, 링크 13px·사이 10px, 호버해도 색이 바뀌지 않는다.

export function LegacyFooterLinkGroup({
  groupName,
  links,
}: {
  groupName: string;
  links: string[];
}) {
  return (
    <section>
      <h3 className="mb-[.625rem] text-sm font-medium tracking-[0.025rem] text-neutral-600 sm:text-[0.9375rem]">
        {groupName}
      </h3>

      <ul className="flex flex-col gap-2.5 text-sm font-normal text-neutral-500">
        {links.map((link) => (
          <li key={link}>
            <a href="#" onClick={stay} className="whitespace-nowrap">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// 같은 파일의 FooterBottomLeft(밝은 판) 앞 두 줄: 안내 링크와 주소. 아래 Powered by 줄은 뺐다.
// 예전 값: 12px(데스크톱 13), neutral-500, 링크는 굵게·호버 변화 없음, 주소 아래 22px.
// 예전에는 사이트 전체가 글자 단위 줄바꿈(word-break: normal)이라 주소가 낱말 중간에서 끊겼다.
export function LegacyFooterBottomLeft() {
  return (
    <div className="text-xs break-normal text-neutral-500 sm:text-sm">
      <div className="mb-1 flex gap-[1ch] [&>a]:font-bold">
        <a href="#" onClick={stay}>
          개인정보처리방침
        </a>
        <span>|</span>
        <a href="#" onClick={stay}>
          학부 연락처
        </a>
        <span>|</span>
        <a href="#" onClick={stay}>
          찾아오시는 길
        </a>
      </div>
      <address className="mb-[1.37rem] not-italic">
        08826 서울특별시 관악구 관악로 1 서울대학교 공과대학 컴퓨터공학부
        행정실(301동 316호)
      </address>
    </div>
  );
}
