import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Search } from 'lucide-react';
import type { ReactElement } from 'react';
import Button from './Button';

// 스토리는 실사용 역할(kind)만 노출한다. 과거 variant×tone 곱집합(무효 조합 다수)을
// 8개 역할로 수렴 → Storybook 컨트롤에서 깨진 조합을 만들 수 없다.
//   primary/action/secondary = solid·outline 버튼, quiet/link/nav = 텍스트 버튼,
//   toggle = pill 칩, segmented = 정렬 세그먼트 토글.
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { as: 'button', children: '버튼', kind: 'primary' },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'primary',
        'action',
        'secondary',
        'quiet',
        'link',
        'nav',
        'toggle',
        'segmented',
      ],
      description:
        '역할. primary=강조 CTA · action=폼/다이얼로그 커밋 · secondary=보조 · quiet=저강조 텍스트 · link=인라인 링크 · nav=다크 헤더 유틸 · toggle=pill 칩 · segmented=세그먼트 토글.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '크기(toggle은 size 영향 없음).',
    },
    selected: {
      control: 'boolean',
      description: 'toggle·segmented 선택 상태(aria-pressed).',
    },
    disabled: { control: 'boolean', description: 'as="button"에서만 적용.' },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

// 다크 표면 위에서만 의미 있는 kind(nav)를 위한 데코레이터.
const onDark = (Story: () => ReactElement) => (
  <div className="rounded bg-neutral-800 p-6">
    <Story />
  </div>
);

// --- 역할별 (실사용) ---
export const Primary: Story = { args: { kind: 'primary', children: '추가' } };
export const Action: Story = { args: { kind: 'action', children: '저장' } };
export const Secondary: Story = {
  args: { kind: 'secondary', children: '취소' },
};
export const Quiet: Story = { args: { kind: 'quiet', children: '더보기' } };
export const Link: Story = { args: { kind: 'link', children: '바로가기' } };

/** nav = 다크 헤더 유틸 버튼(흰 글자). 다크 표면에서만 의미 있어 배경을 깔아 보여준다. */
export const Nav: Story = {
  args: { kind: 'nav', size: 'sm', children: '로그인' },
  decorators: [onDark],
};

// --- 토글 ---
export const Toggle: Story = {
  args: { kind: 'toggle', selected: false, children: '전체' },
};
export const ToggleSelected: Story = {
  args: { kind: 'toggle', selected: true, children: '전체' },
};

/** segmented = 정렬 세그먼트 토글(선택 dark / 비선택 gray). faculty 가나다순/소속순. */
export const Segmented: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button {...args} kind="segmented" selected>
        가나다순
      </Button>
      <Button {...args} kind="segmented" selected={false}>
        소속순
      </Button>
    </div>
  ),
};

// --- size (xs/lg 소수, sm/md 다수) ---
export const SizeSm: Story = { args: { kind: 'primary', size: 'sm' } };
export const SizeLg: Story = { args: { kind: 'primary', size: 'lg' } };

// --- state ---
export const Disabled: Story = { args: { kind: 'primary', disabled: true } };

/** 아이콘 + 텍스트 (MobileNav 검색 버튼 등). */
export const WithIcon: Story = {
  args: { kind: 'primary', iconLeft: <Search size={16} />, children: '검색' },
};

/** 아이콘 전용 (Header 검색 submit — quiet/sm, ariaLabel 필수). */
export const IconOnly: Story = {
  args: {
    kind: 'quiet',
    size: 'sm',
    iconLeft: <Search className="h-5 w-5" strokeWidth={1.5} />,
    children: undefined,
    ariaLabel: '통합검색',
  },
};
