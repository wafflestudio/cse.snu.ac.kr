import dayjs from 'dayjs';
import { useState } from 'react';
import {
  DESKTOP_COLUMN_COUNT,
  MOBILE_COLUMN_COUNT,
} from '@/routes/$locale/reservations/-constants';
import type { ReservationPreview } from '@/types/api';
import { kstDayjs } from '@/utils/date';
import { getStartOfWeek } from '../../-utils';
import CalendarColumn from './CalendarColumn';
import ReservationDetailModal from './ReservationDetailModal';

export default function CalendarContent({
  reservations,
  startDate,
}: {
  reservations: ReservationPreview[];
  startDate: dayjs.Dayjs;
}) {
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);

  return (
    <>
      <div className="flex border-b border-neutral-200">
        <RowIndex />
        {/* 서버는 뷰포트를 모르니 두 벌을 다 그리고 CSS 로 하나만 보인다.
            래퍼는 `contents` 라 칼럼이 그대로 flex 자식으로 남는다. */}
        <div className="contents sm:hidden">
          <Columns
            startDate={startDate}
            count={MOBILE_COLUMN_COUNT}
            reservations={reservations}
            onSelectReservation={setSelectedReservationId}
          />
        </div>
        <div className="hidden sm:contents">
          <Columns
            startDate={getStartOfWeek(startDate)}
            count={DESKTOP_COLUMN_COUNT}
            reservations={reservations}
            onSelectReservation={setSelectedReservationId}
          />
        </div>
      </div>
      <ReservationDetailModal
        reservationId={selectedReservationId}
        open={selectedReservationId !== null}
        onOpenChange={(open) => !open && setSelectedReservationId(null)}
      />
    </>
  );
}

const Columns = ({
  startDate,
  count,
  reservations,
  onSelectReservation,
}: {
  startDate: dayjs.Dayjs;
  count: number;
  reservations: ReservationPreview[];
  onSelectReservation: (reservationId: number) => void;
}) =>
  Array.from({ length: count }, (_, i) => startDate.add(i, 'day')).map(
    (date) => (
      <CalendarColumn
        key={date.valueOf()}
        date={date}
        selected={date.isSame(dayjs(), 'day')}
        reservations={reservations.filter(({ startTime }) =>
          kstDayjs(startTime).isSame(date, 'day'),
        )}
        onSelectReservation={onSelectReservation}
      />
    ),
  );

// 오전/오후 표기는 데스크톱만 — 모바일은 숫자만 보여 칼럼이 좁다.
const ROWS = [
  ...[8, 9, 10, 11].map((hour) => [String(hour), 'AM'] as const),
  ['12', 'PM'] as const,
  ...Array.from({ length: 10 }, (_, i) => [String(i + 1), 'PM'] as const),
];

const RowIndex = () => (
  <div>
    <div className="h-16.25 border-y border-r border-neutral-200 bg-neutral-100" />
    {ROWS.map(([hour, meridiem]) => (
      <div
        key={hour + meridiem}
        className="flex h-12 items-center justify-center border-b border-r border-neutral-200 bg-neutral-100 px-4"
      >
        <time className="text-xs font-medium text-neutral-800">
          {hour}
          <span className="hidden sm:inline">{meridiem}</span>
        </time>
      </div>
    ))}
  </div>
);
