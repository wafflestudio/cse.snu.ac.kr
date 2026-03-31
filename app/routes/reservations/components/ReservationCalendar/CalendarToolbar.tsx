import dayjs from 'dayjs';
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
import LoginVisible from '~/components/feature/auth/LoginVisible';
import Button from '~/components/ui/Button';
import Calendar from '~/components/ui/Calendar';
import { useClickOutside } from '~/hooks/useClickOutside';
import useSelectedDate from '~/routes/reservations/hooks/useSelectedDate';
import { useStore } from '~/store';
import type { ReserveTerm } from '~/types/api/v2/reservation';
import AddReservationModal from './AddReservationModal';

function isInApplyPeriod(reserveTerms: ReserveTerm[]) {
  const now = dayjs();
  return reserveTerms.some(
    (term) =>
      now.isAfter(dayjs(term.applyStartTime)) &&
      now.isBefore(dayjs(term.applyEndTime)),
  );
}

export default function CalendarToolbar({
  columnCount,
  roomId,
  reserveTerms,
}: {
  columnCount: number;
  roomId: number;
  reserveTerms: ReserveTerm[];
}) {
  const { selectedDate } = useSelectedDate();
  const todayButtonVisible = !dayjs().isSame(selectedDate, 'day');
  const [showAddModal, setShowAddModal] = useState(false);
  const role = useStore((s) => s.role);

  const applyPeriodActive = isInApplyPeriod(reserveTerms);
  const allowedRoles =
    applyPeriodActive && role !== 'ROLE_STAFF'
      ? (['ROLE_STAFF', 'ROLE_LABMASTER'] as const)
      : (['ROLE_STAFF', 'ROLE_RESERVATION', 'ROLE_LABMASTER'] as const);

  return (
    <div className="mb-6 flex h-7.5 items-stretch justify-between">
      <div className="flex items-stretch gap-2">
        <SelectDayButton date={selectedDate} />
        <ChangeDateButton
          targetDate={selectedDate.add(-columnCount, 'day')}
          direction="prev"
        />
        <ChangeDateButton
          targetDate={selectedDate.add(columnCount, 'day')}
          direction="next"
        />
        {todayButtonVisible && <TodayButton />}
      </div>
      <LoginVisible allow={[...allowedRoles]}>
        <Button
          variant="solid"
          tone="brand"
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
            <CalendarIcon className="h-[13px] w-[13px]" />
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
                setSelectedDate(dayjs(selectedDate));
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
  direction,
}: {
  targetDate: dayjs.Dayjs;
  direction: 'prev' | 'next';
}) {
  const { setSelectedDate } = useSelectedDate();
  const handleClick = () => setSelectedDate(targetDate);

  return (
    <SquareButton className="w-7.5" onClick={handleClick}>
      {direction === 'prev' ? (
        <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={1.5} />
      ) : (
        <ChevronRight className="h-[22px] w-[22px]" strokeWidth={1.5} />
      )}
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
