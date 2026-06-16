import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { Search } from 'lucide-react';
import Button from './Button';

// 스토리는 실제 서비스에서 쓰는 조합만 보여준다.
// variant: solid/outline/text/pill (ghost는 미사용 → CLAUDE.md §④ 합의 대기에 정리)
// tone: brand/neutral/inverse/muted/inherit · size: xs/sm/md/lg 모두 사용처 존재.
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: { as: 'button', children: '버튼', variant: 'solid', tone: 'brand' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'text', 'pill'],
      description: '시각 스타일. pill은 토글(aria-pressed) 용도.',
    },
    tone: {
      control: 'select',
      options: ['brand', 'neutral', 'inverse', 'muted', 'inherit'],
      description: '색 톤.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: '크기(pill·text 변형은 size 영향 적음).',
    },
    selected: { control: 'boolean', description: 'pill 토글 선택 상태.' },
    disabled: { control: 'boolean', description: 'as="button"에서만 적용.' },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

// --- variant (실사용) ---
export const Solid: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Text: Story = { args: { variant: 'text' } };

// --- tone (실사용: inverse=저장/삭제, neutral=취소, muted) ---
export const Neutral: Story = { args: { variant: 'outline', tone: 'neutral' } };
export const Inverse: Story = { args: { variant: 'solid', tone: 'inverse' } };

// --- pill 토글 (NoticeSection 카테고리 칩) ---
export const Pill: Story = { args: { variant: 'pill', selected: false } };
export const PillSelected: Story = {
  args: { variant: 'pill', selected: true },
};

// --- size (xs/lg 각 1곳, sm/md 다수) ---
export const SizeSm: Story = { args: { size: 'sm' } };
export const SizeLg: Story = { args: { size: 'lg' } };

// --- state ---
export const Disabled: Story = { args: { disabled: true } };

/** 아이콘 + 텍스트 (MobileNav 검색 버튼 등). */
export const WithIcon: Story = {
  args: { iconLeft: <Search size={16} />, children: '검색' },
};

/** 아이콘 전용 (Header 검색 submit — text/neutral/sm, ariaLabel 필수). */
export const IconOnly: Story = {
  args: {
    variant: 'text',
    tone: 'neutral',
    size: 'sm',
    iconLeft: <Search className="h-5 w-5" strokeWidth={1.5} />,
    children: undefined,
    ariaLabel: '통합검색',
  },
};
