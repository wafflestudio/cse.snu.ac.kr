import { Search } from 'lucide-react';
import type { ReactElement } from 'react';
import preview from '../../../.storybook/preview';
import Button from './Button';

// 스토리는 실사용 역할(kind)만 노출한다. 과거 variant×tone 곱집합(무효 조합 다수)을
// 5개 역할로 수렴 → Storybook 컨트롤에서 깨진 조합을 만들 수 없다.
//   primary/action/secondary = solid·outline 버튼, quiet/nav = 텍스트 버튼.
const meta = preview.meta({
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { as: 'button', children: '버튼', kind: 'primary' },
  argTypes: {
    kind: {
      control: 'select',
      options: ['primary', 'action', 'secondary', 'quiet', 'nav'],
      description:
        '역할. primary=강조 CTA · action=폼/다이얼로그 커밋 · secondary=보조 · quiet=저강조 텍스트 · nav=다크 헤더 유틸.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '크기.',
    },
    disabled: { control: 'boolean', description: 'as="button"에서만 적용.' },
  },
});

// 다크 표면 위에서만 의미 있는 kind(nav)를 위한 데코레이터.
const onDark = (Story: () => ReactElement) => (
  <div className="rounded bg-neutral-800 p-6">
    <Story />
  </div>
);

// --- 역할별 (실사용) ---
export const Primary = meta.story({
  args: { kind: 'primary', children: '추가' },
});
export const Action = meta.story({
  args: { kind: 'action', children: '저장' },
});
export const Secondary = meta.story({
  args: { kind: 'secondary', children: '취소' },
});
export const Quiet = meta.story({
  args: { kind: 'quiet', children: '더보기' },
});

/** nav = 다크 헤더 유틸 버튼(흰 글자). 다크 표면에서만 의미 있어 배경을 깔아 보여준다. */
export const Nav = meta.story({
  args: { kind: 'nav', size: 'sm', children: '로그인' },
  decorators: [onDark],
});

// --- size (xs/lg 소수, sm/md 다수) ---
export const SizeSm = meta.story({ args: { kind: 'primary', size: 'sm' } });
export const SizeLg = meta.story({ args: { kind: 'primary', size: 'lg' } });

// --- state ---
export const Disabled = meta.story({
  args: { kind: 'primary', disabled: true },
});

/** 아이콘 + 텍스트 — 아이콘을 children에 직접 넣는다(gap-2가 간격 처리). */
export const WithIcon = meta.story({
  args: {
    kind: 'primary',
    children: (
      <>
        <Search size={16} />
        검색
      </>
    ),
  },
});

/** 아이콘 전용 (Header 검색 submit — quiet/sm, ariaLabel 필수). */
export const IconOnly = meta.story({
  args: {
    kind: 'quiet',
    size: 'sm',
    ariaLabel: '통합검색',
    children: <Search className="h-5 w-5" strokeWidth={1.5} />,
  },
});
