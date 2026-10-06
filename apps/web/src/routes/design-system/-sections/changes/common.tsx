import { type Area, ChangesPage } from './kit';
import { BrowserTabs, PrivacyLink } from './samples';

// v2 개선 기록: 공통(링크와 새 탭, 접근성·반응형).

const AREAS: Area[] = [
  {
    id: 'links',
    title: '링크와 새 탭',
    items: [
      {
        title: '링크는 같은 탭에서',
        why: '연구실 웹사이트·첨부·푸터 로고·이미지 팝업이 링크마다 새 탭을 열어 뒤로 가기가 듣지 않고 탭이 쌓였습니다. 이제 예약 동의 내용 하나를 빼고 모든 링크가 같은 탭에서 열립니다.',
        before: (
          <BrowserTabs
            tabs={['연구실 목록', '연구실 웹사이트']}
            canGoBack={false}
          />
        ),
        after: <BrowserTabs tabs={['연구실 웹사이트']} canGoBack />,
      },
      {
        title: '새 탭은 알리고 연다',
        why: '예약 폼의 개인정보 동의 내용은 같은 탭에서 열면 쓰던 예약이 사라져 사이트에서 유일하게 새 탭으로 엽니다. "보러가기"만으로는 무엇이 어디서 열리는지 몰라, 이름을 바꾸고 새 탭 아이콘과 읽기 도구용 안내를 붙였습니다.',
        before: <PrivacyLink old />,
        after: <PrivacyLink old={false} />,
      },
    ],
  },
  {
    id: 'responsive',
    title: '접근성·반응형 정리',
    items: [],
    extras: [
      '읽어야 하는 글자는 바탕 대비 4.5:1 이상으로 맞췄습니다(위 링크·보조 글자·보조 버튼·푸터·헤더 검색 카드). 주황 위 흰 글자 2.88:1만 사이트 인상이라 남겼습니다.',
      '영어 화면에서 넘치던 곳(경로, 푸터, 긴 제목)을 좁은 폭에서 줄을 바꾸게 고쳤습니다. 각각 위 카드에 있습니다.',
      '같은 역할의 부품을 하나씩으로 모아, 한 곳을 고치면 사이트 전체에 같은 개선이 퍼집니다.',
    ],
  },
];

export function ChangesCommonSection() {
  return (
    <ChangesPage
      lead="이번 개편에서 여러 영역에 걸쳐 바뀐 링크 동작과 접근성·반응형 정리를 모은 기록입니다."
      areas={AREAS}
    />
  );
}
