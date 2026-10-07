import type { ReactNode } from 'react';
import Tabs from '@/components/ui/Tabs';

export type Language = 'ko' | 'en';

const OPTIONS = [
  { value: 'ko', label: '한글' },
  { value: 'en', label: 'English' },
] as const satisfies readonly { value: Language; label: string }[];

// 편집 언어 전환은 값을 저장하지 않고 같은 자리의 입력란을 바꾸니 탭이다(/design-system/selection).
// children 은 고른 언어의 입력란 — 탭 패널(tabpanel) 안에 그려져 탭과 이어진다.
export default function LanguagePicker({
  selected,
  onChange,
  children,
}: {
  selected: Language;
  onChange: (language: Language) => void;
  children: ReactNode;
}) {
  return (
    <Tabs
      tabs={OPTIONS}
      value={selected}
      onChange={onChange}
      ariaLabel="편집 언어"
    >
      {children}
    </Tabs>
  );
}
