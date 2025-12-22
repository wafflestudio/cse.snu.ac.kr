import dayjs from 'dayjs';
import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  useReducer,
  useRef,
} from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { useClickOutside } from '~/hooks/useClickOutside';
import useSelectedDate from '~/routes/reservations/hooks/useSelectedDate';
import 'react-day-picker/style.css';

export default function CalendarToolbar({
  columnCount,
}: {
  columnCount: number;
}) {
  const { selectedDate } = useSelectedDate();
  const todayButtonVisible = !dayjs().isSame(selectedDate, 'day');

  return (
    <div className="mb-6 flex h-7.5 items-stretch justify-between">
      <div className="flex items-stretch gap-2">
        <SelectDayButton date={selectedDate} />
        <ChangeDateButton
          targetDate={selectedDate.add(-columnCount, 'day')}
          symbolName="navigate_before"
        />
        <ChangeDateButton
          targetDate={selectedDate.add(columnCount, 'day')}
          symbolName="navigate_next"
        />
        {todayButtonVisible && <TodayButton />}
      </div>
    </div>
  );
}

function SelectDayButton({ date }: { date: dayjs.Dayjs }) {
  const { setSelectedDate } = useSelectedDate();
  const [showCalendar, toggleCalendar] = useReducer((x) => !x, false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const isDateToday = dayjs().isSame(date, 'day');

  useClickOutside(calendarRef, () => {
    if (showCalendar) toggleCalendar();
  });

  return (
    <div>
      <SquareButton
        className="flex h-full w-24 items-center justify-center gap-1 px-2.5"
        onClick={toggleCalendar}
      >
        {isDateToday ? (
          '날짜 선택'
        ) : (
          <>
            <span className="material-symbols-rounded text-sm">
              calendar_month
            </span>
            {date.format('YY.MM.DD.')}
          </>
        )}
      </SquareButton>
      {showCalendar && (
        <div className="relative" ref={calendarRef}>
          <div className="absolute top-2 z-10">
            <DayPicker
              locale={ko}
              animate
              className="bg-white border rounded-sm p-4"
              classNames={{
                today: `text-main-orange`,
                chevron: `fill-main-orange`,
                selected: `rounded-full bg-main-orange text-white`,
              }}
              mode="single"
              selected={date.toDate()}
              onSelect={(date) => {
                if (!date) return;
                setSelectedDate(dayjs(date));
                toggleCalendar();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeDateButton({
  targetDate,
  symbolName,
}: {
  targetDate: dayjs.Dayjs;
  symbolName: string;
}) {
  const { setSelectedDate } = useSelectedDate();
  const handleClick = () => setSelectedDate(targetDate);

  return (
    <SquareButton className="w-7.5" onClick={handleClick}>
      <span className="material-symbols-rounded align-middle text-xl font-light">
        {symbolName}
      </span>
    </SquareButton>
  );
}

function TodayButton() {
  const { setSelectedDate } = useSelectedDate();
  const handleClick = () => setSelectedDate(dayjs());

  return (
    <SquareButton className="w-10.75" onClick={handleClick}>
      오늘
    </SquareButton>
  );
}

function SquareButton({
  className,
  children,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={`rounded-sm border border-neutral-200 bg-white text-xs text-neutral-700 enabled:hover:bg-neutral-100 disabled:text-neutral-300 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
