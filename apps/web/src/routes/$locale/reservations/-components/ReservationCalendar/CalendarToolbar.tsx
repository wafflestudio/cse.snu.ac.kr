import type dayjs from 'dayjs';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  useReducer,
  useRef,
  useState,
} from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import Button from '@/components/ui/Button';
import Calendar from '@/components/ui/Calendar';
import { useClickOutside } from '@/hooks/useClickOutside';
import { isMobileViewport } from '@/hooks/useResponsive';
import {
  DESKTOP_COLUMN_COUNT,
  MOBILE_COLUMN_COUNT,
} from '@/routes/$locale/reservations/-constants';
import useSelectedDate from '@/routes/$locale/reservations/-hooks/useSelectedDate';
import { kstDayjs } from '@/utils/date';
import AddReservationModal from './AddReservationModal';

export default function CalendarToolbar({ roomId }: { roomId: number }) {
  const { selectedDate } = useSelectedDate();
  const todayButtonVisible = !kstDayjs().isSame(selectedDate, 'day');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="mb-6 flex h-7.5 items-stretch justify-between">
      <div className="flex items-stretch gap-2">
        <SelectDayButton date={selectedDate} />
        <ChangeDateButton direction="prev" />
        <ChangeDateButton direction="next" />
        {todayButtonVisible && <TodayButton />}
      </div>
      <LoginVisible allow={['ROLE_STAFF', 'ROLE_RESERVE', 'ROLE_LABMASTER']}>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
        >
          예약하기
        </Button>
      </LoginVisible>
      <AddReservationModal
        roomId={roomId}
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}

function SelectDayButton({ date }: { date: dayjs.Dayjs }) {
  const { setSelectedDate } = useSelectedDate();
  const [showCalendar, toggleCalendar] = useReducer((x) => !x, false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const isDateToday = kstDayjs().isSame(date, 'day');

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
            <CalendarIcon className="size-3" />
            {date.format('YY.MM.DD.')}
          </>
        )}
      </SquareButton>
      {showCalendar && (
        <div className="relative" ref={calendarRef}>
          <div className="absolute top-2 z-10">
            <Calendar
              selected={date.toDate()}
              onSelect={(selectedDate) => {
                setSelectedDate(kstDayjs(selectedDate));
                toggleCalendar();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ChangeDateButton({ direction }: { direction: 'prev' | 'next' }) {
  const { selectedDate, setSelectedDate } = useSelectedDate();

  const handleClick = () => {
    const step = isMobileViewport()
      ? MOBILE_COLUMN_COUNT
      : DESKTOP_COLUMN_COUNT;
    setSelectedDate(
      selectedDate.add(direction === 'prev' ? -step : step, 'day'),
    );
  };

  return (
    <SquareButton
      className="w-7.5"
      onClick={handleClick}
      aria-label={direction === 'prev' ? '이전 날짜' : '다음 날짜'}
    >
      {direction === 'prev' ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </SquareButton>
  );
}

function TodayButton() {
  const { setSelectedDate } = useSelectedDate();
  const handleClick = () => setSelectedDate(kstDayjs());

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
      className={`rounded-sm border border-neutral-200 bg-white text-xs text-neutral-800 enabled:hover:bg-neutral-100 disabled:text-neutral-300 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
