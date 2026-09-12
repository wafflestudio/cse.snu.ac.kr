import type dayjs from 'dayjs';
import type { ReservationPreview } from '@/types/api';
import { kstDayjs } from '@/utils/date';
import styles from './cellstyle.module.css';

const UNIT_HEIGHT_IN_REM = 1.5;
const UNIT_HEIGHT_TAILWIND = 'h-[1.5rem]';

export default function CalendarColumn({
  date,
  selected,
  reservations,
  onSelectReservation,
}: {
  date: dayjs.Dayjs;
  selected: boolean;
  reservations: ReservationPreview[];
  onSelectReservation: (reservationId: number) => void;
}) {
  return (
    <div className="flex w-25 flex-col items-stretch">
      <ColumnIndex selected={selected} date={date} />
      <div className="relative">
        <ColumnBackground selected={selected} />
        {reservations.map((reservation) => (
          <CalendarCell
            key={reservation.id}
            reservation={reservation}
            onSelectReservation={onSelectReservation}
          />
        ))}
      </div>
    </div>
  );
}

const ColumnIndex = ({
  selected,
  date,
}: {
  selected: boolean;
  date: dayjs.Dayjs;
}) => {
  return (
    <div
      className={`
        flex h-16.25 flex-col
        justify-between border-b border-r
        border-t border-neutral-200 px-3 py-[0.62rem] 
        ${selected ? 'bg-neutral-200' : 'bg-neutral-100'}
        `}
    >
      <p className="text-xs font-medium text-neutral-800">
        {weekdayStrArr[date.day()]}
      </p>
      {/* RowIndex의 시간 셀과 동일하게 <time>. 날짜 칼럼을 값으로 특정할 수 있게 dateTime을 준다
          (E2E가 "며칠 주가 그려졌는가"를 행 인덱스 숫자와 헷갈리지 않고 assert). */}
      <time
        dateTime={date.format('YYYY-MM-DD')}
        className="text-base font-bold leading-4 text-neutral-800"
      >
        {date.date()}
      </time>
    </div>
  );
};

const ColumnBackground = ({ selected }: { selected: boolean }) => {
  return Array(30)
    .fill(0)
    .map((_, i) => (
      <div
        key={i}
        className={`box-border ${styles.cell} ${
          selected ? 'bg-neutral-100' : ''
        } ${UNIT_HEIGHT_TAILWIND}`}
      />
    ));
};

const CalendarCell = ({
  reservation,
  onSelectReservation,
}: {
  reservation: ReservationPreview;
  onSelectReservation: (reservationId: number) => void;
}) => {
  const startTime = kstDayjs(reservation.startTime);
  const endTime = kstDayjs(reservation.endTime);

  const { topOffset, unitCnt } = getReservationCellLayout(startTime, endTime);

  return (
    <button
      type="button"
      className="absolute flex w-full flex-col items-center bg-[#ff6914cc]"
      onClick={() => onSelectReservation(reservation.id)}
      // TODO: 더 나은 방법
      ref={(ref) => {
        if (ref) ref.style.height = `${unitCnt * UNIT_HEIGHT_IN_REM}rem`;
        if (ref) ref.style.top = `${topOffset}rem`;
      }}
    >
      {unitCnt !== 1 && (
        <CalendarCellTitle startTime={startTime} endTime={endTime} />
      )}
      <p
        className={`item-center flex text-xs font-medium ${UNIT_HEIGHT_TAILWIND}`}
      >
        {reservation.title}
      </p>
    </button>
  );
};

const CalendarCellTitle = ({
  startTime,
  endTime,
}: {
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
}) => {
  const timeText = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;

  return (
    <p
      className={`mt-[2px] flex items-center text-xs font-bold text-neutral-800 ${UNIT_HEIGHT_TAILWIND}`}
    >
      {timeText}
    </p>
  );
};

const weekdayStrArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const getReservationCellLayout = (
  startTime: dayjs.Dayjs,
  endTime: dayjs.Dayjs,
) => {
  const unitCnt = endTime.diff(startTime, 'minute') / 30;

  const topTime = startTime.hour(8).minute(0).second(0).millisecond(0);
  const topOffset =
    (startTime.diff(topTime, 'minute') / 30) * UNIT_HEIGHT_IN_REM;

  return { topOffset, unitCnt };
};
