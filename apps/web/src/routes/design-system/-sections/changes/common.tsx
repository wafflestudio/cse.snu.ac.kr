import { type Area, ChangesPage } from './kit';
import { BrowserTabs, PrivacyLink } from './samples';

// v2 개선 기록: 공통(링크와 새 탭, 접근성·반응형).

const AREAS: Area[] = [
  {
    id: 'links',
    title: '링크와 새 탭',
    doc: 'links',
    items: [
      {
        title: '링크는 같은 탭에서',
        why: '링크마다 새 탭이 열려 뒤로 가기가 듣지 않고 탭이 쌓여, 예약 동의 내용 하나만 빼고 같은 탭에서 엽니다.',
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
        why: '쓰던 예약이 사라지지 않게 유일하게 새 탭으로 여는 동의 내용 링크에, 무엇이 새 탭에서 열리는지 이름과 아이콘·읽기 도구용 안내로 알립니다.',
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
      '읽어야 하는 글자를 바탕 대비 4.5:1 이상으로 맞췄고, 주황 위 흰 글자 2.88:1만 사이트 인상이라 남겼습니다.',
      '영어 화면에서 넘치던 경로·푸터·긴 제목이 좁은 폭에서 줄을 바꿉니다.',
      '같은 역할의 부품을 하나로 모아 한 곳을 고치면 사이트 전체가 바뀝니다.',
    ],
  },
];

export function ChangesCommonSection() {
  return (
    <ChangesPage
      lead="여러 영역에 걸쳐 바뀐 링크 동작과 접근성·반응형 정리를 모았습니다."
      areas={AREAS}
    />
  );
}
