import { useId, useState } from 'react';

// d1baf83c 의 apps/web/src/components/form/LanguagePicker.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 편집 언어 선택: 숨긴 라디오 + 밑줄 탭, 고르지 않은 쪽은 neutral-300.
// 견본 아래쪽 여백(mb-9)은 뺐고, 같은 페이지에 여러 개 있어도 겹치지 않게 id·name 을 useId 로 만든다.
type Language = 'ko' | 'en';

const LANGUAGE: Record<Language, string> = {
  ko: '한글',
  en: 'English',
};

export function LegacyLanguagePicker() {
  const [selected, setSelected] = useState<Language>('ko');
  const id = useId();
  return (
    <div className="flex gap-3">
      {(Object.keys(LANGUAGE) as Language[]).map((language) => (
        <span key={language}>
          <input
            id={`${id}-${language}`}
            type="radio"
            name={`${id}-language`}
            value={language}
            checked={selected === language}
            className="peer appearance-none"
            onChange={() => setSelected(language)}
          />
          <label
            htmlFor={`${id}-${language}`}
            className="cursor-pointer pb-1 font-semibold text-neutral-300 peer-checked:border-b-2 peer-checked:border-b-neutral-800 peer-checked:text-neutral-800"
          >
            {LANGUAGE[language]}
          </label>
        </span>
      ))}
    </div>
  );
}
