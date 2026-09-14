import type dayjs from 'dayjs';
import useSelectedDate from '@/routes/$locale/reservations/-hooks/useSelectedDate';
import type { ReservationPreview, ReserveTerm } from '@/types/api';
import CalendarContent from './CalendarContent';
import CalendarToolbar from './CalendarToolbar';
import ReserveTermBanner from './ReserveTermBanner';

export type ReservationCalendarProps = {
  reservations: ReservationPreview[];
  startDate: dayjs.Dayjs;
  roomId: number;
  reserveTerms: ReserveTerm[] | null;
};

export default function ReservationCalendar({
  reservations,
  startDate,
  roomId,
  reserveTerms,
}: ReservationCalendarProps) {
  const { selectedDate } = useSelectedDate();
  const title = selectedDate.format('YYYY MM월');

  return (
    <div className="max-w-fit">
      <h3 className="mb-7 text-2xl font-bold text-neutral-800">{title}</h3>
      <ReserveTermBanner reserveTerms={reserveTerms} roomId={roomId} />
      <CalendarToolbar roomId={roomId} />
      <CalendarContent reservations={reservations} startDate={startDate} />
    </div>
  );
}
