import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import 'react-day-picker/style.css';

// d1baf83c 의 apps/web/src/components/ui/Calendar.tsx 와 calendar.css 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 지금 calendar.css 가 .custom-calendar 에 걸려 있어, 예전 calendar.css 값은 그 클래스 대신 변수·인라인 스타일로 직접 준다
// (rdp 기본 CSS 가 층 밖이라 Tailwind 유틸리티로는 덮이지 않는다).
// 예전 값: 오늘과 고른 날이 모두 주황(--rdp-today-color 가 기본값 = 강조색), 달 넘김 화살표도 주황(rdp 기본),
// 고른 날 600, 요일 12px·500, 그림자 작게.
export function LegacyCalendar({ initial }: { initial: Date }) {
  const [selected, setSelected] = useState(initial);
  return (
    <DayPicker
      locale={ko}
      mode="single"
      selected={selected}
      onSelect={(date) => date && setSelected(date)}
      className="rounded-[.125rem] border border-neutral-300 bg-white p-4 text-[.875rem] leading-[1.25rem] shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]"
      style={
        {
          '--rdp-accent-color': '#e65817',
          '--rdp-accent-background-color': '#fff5f0',
          '--rdp-day-height': '2rem',
          '--rdp-day-width': '2rem',
          '--rdp-day_button-height': '1.875rem',
          '--rdp-day_button-width': '1.875rem',
          '--rdp-day_button-border-radius': '0.125rem',
          '--rdp-nav_button-height': '1.75rem',
          '--rdp-nav_button-width': '1.75rem',
          '--rdp-nav-height': '2rem',
        } as React.CSSProperties
      }
      styles={{
        month_caption: { fontSize: '.875rem', fontWeight: 600 },
        weekday: { fontSize: '.75rem', fontWeight: 500 },
        day_button: { fontSize: '.875rem' },
      }}
      modifiersStyles={{ selected: { fontWeight: 600 } }}
    />
  );
}
