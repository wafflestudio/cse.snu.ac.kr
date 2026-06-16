import type { Meta, StoryObj } from '@storybook/tanstack-react';
import { useState } from 'react';
import LanguagePicker, { type Language } from './LanguagePicker';

const meta = {
  title: 'Form/LanguagePicker',
  component: LanguagePicker,
  parameters: { layout: 'centered' },
  args: { selected: 'ko', onChange: () => {} },
} satisfies Meta<typeof LanguagePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [lang, setLang] = useState<Language>('ko');
    return <LanguagePicker {...args} selected={lang} onChange={setLang} />;
  },
};
