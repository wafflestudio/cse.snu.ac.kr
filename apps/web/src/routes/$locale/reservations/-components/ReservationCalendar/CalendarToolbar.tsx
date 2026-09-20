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
      {/* 격자 칸이 버튼을 늘린다 — `Button` 에 폭 프롭이 없어도 된다. */}
      <div className="grid h-full w-24">
        <Button variant="secondary" size="sm" onClick={toggleCalendar}>
          {isDateToday ? (
            '날짜 선택'
          ) : (
            <>
              <CalendarIcon className="size-3" />
              {date.format('YY.MM.DD.')}
            </>
          )}
        </Button>
      </div>
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
    <div className="grid w-7.5">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClick}
        ariaLabel={direction === 'prev' ? '이전 날짜' : '다음 날짜'}
      >
        {direction === 'prev' ? (
          <ChevronLeft className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
      </Button>
    </div>
  );
}

function TodayButton() {
  const { setSelectedDate } = useSelectedDate();
  const handleClick = () => setSelectedDate(kstDayjs());

  return (
    <div className="grid w-10.75">
      <Button variant="secondary" size="sm" onClick={handleClick}>
        {'오늘'}
      </Button>
    </div>
  );
}
