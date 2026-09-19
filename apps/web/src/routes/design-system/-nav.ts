import type { LinkProps } from '@tanstack/react-router';

/**
 * 좌측 내비와 첫 화면 목차가 같은 목록을 본다. 절을 더하면 여기 한 줄과 라우트 파일 하나다.
 * `to` 를 조립하지 않고 그대로 적는 이유는 라우터가 경로를 타입으로 검사하게 두려는 것이다.
 */
export const SECTIONS: {
  to: NonNullable<LinkProps['to']>;
  title: string;
  summary: string;
}[] = [
  {
    to: '/design-system/visual-language',
    title: '시각 언어',
    summary: '메인 그래픽과 연결선, 접힌 모서리가 무엇을 뜻하는지.',
  },
  {
    to: '/design-system/color',
    title: '색상',
    summary: '주황 둘, 중립색 열셋, 셸 넷. 무엇을 칠하는지로 고릅니다.',
  },
  {
    to: '/design-system/typography',
    title: '타이포그래피',
    summary: '크기 여덟 단계와 굵기 셋. 크기를 고르면 행간이 따라옵니다.',
  },
  {
    to: '/design-system/icon',
    title: '아이콘',
    summary: 'lucide 한 벌. 크기는 옆 글자가 정합니다.',
  },
  {
    to: '/design-system/layout',
    title: '레이아웃',
    summary: '어두운 탐색과 밝은 본문, 정렬과 작은 화면.',
  },
  {
    to: '/design-system/components',
    title: '컴포넌트',
    summary: '버튼·태그·입력처럼 화면을 이루는 공통 요소.',
  },
  {
    to: '/design-system/accessibility',
    title: '접근성',
    summary: '대비와 초점, 이름과 대체 설명.',
  },
  {
    to: '/design-system/writing',
    title: '문구',
    summary: '제목·버튼·안내를 쓰는 기준.',
  },
];
