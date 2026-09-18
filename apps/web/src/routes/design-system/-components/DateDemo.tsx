import { useState } from 'react';
import Calendar from '@/components/ui/Calendar';
import { useLanguage } from '@/hooks/useLanguage';

export function DateDemo() {
  const { locale } = useLanguage();
  const [date, setDate] = useState(new Date(2026, 8, 14));
  return (
    <div className="leading-[1.2] max-w-[560px] flex flex-wrap items-center gap-7.5 [&_output]:text-xs/[inherit] [&_output]:text-neutral-600 [&_output_strong]:mt-3 [&_output_strong]:block [&_output_strong]:text-[15px] [&_output_strong]:font-medium [&_output_strong]:text-neutral-900 max-sm:gap-5 max-sm:[&>div]:p-2.5 max-sm:[&>div]:[--rdp-day-width:30px]">
      <Calendar selected={date} onSelect={setDate} />
      <output>
        선택한 날짜
        <strong>
          {date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </strong>
      </output>
    </div>
  );
}
