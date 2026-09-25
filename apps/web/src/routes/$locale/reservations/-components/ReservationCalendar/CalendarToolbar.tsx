import type dayjs from 'dayjs';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useReducer, useRef, useState } from 'react';
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
    // 모바일은 날짜 조작과 예약하기를 두 줄로 — [오늘]이 나타났다 사라져도 예약하기가 움직이지 않게.
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <SelectDayButton date={selectedDate} />
        <ChangeDateButton direction="prev" />
        <ChangeDateButton direction="next" />
        {todayButtonVisible && <TodayButton />}
      </div>
      <LoginVisible allow={['ROLE_STAFF', 'ROLE_RESERVE', 'ROLE_LABMASTER']}>
        <div className="flex justify-end">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            예약하기
          </Button>
        </div>
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
      <Button variant="secondary" onClick={toggleCalendar}>
        {isDateToday ? (
          '날짜 선택'
        ) : (
          <>
            <CalendarIcon />
            {date.format('YY.MM.DD.')}
          </>
        )}
      </Button>
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
    <Button
      variant="secondary"
      iconOnly
      onClick={handleClick}
      ariaLabel={direction === 'prev' ? '이전 날짜' : '다음 날짜'}
    >
      {direction === 'prev' ? (
        <ChevronLeft className="size-5" />
      ) : (
        <ChevronRight className="size-5" />
      )}
    </Button>
  );
}

function TodayButton() {
  const { setSelectedDate } = useSelectedDate();
  const handleClick = () => setSelectedDate(kstDayjs());

  return (
    <Button variant="secondary" onClick={handleClick}>
      오늘
    </Button>
  );
}
