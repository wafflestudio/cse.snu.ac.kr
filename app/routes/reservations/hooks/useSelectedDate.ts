import type dayjs from 'dayjs';
import { useSearchParams } from 'react-router';
import { kstDayjs } from '~/lib/kstDayjs';
import { formatDateParam, parseDateParam } from '~/utils/reservation';

export default function useSelectedDate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDateParam = searchParams.get('selectedDate');
  const parsed = selectedDateParam
    ? parseDateParam(selectedDateParam)
    : kstDayjs();
  const selectedDate = parsed.isValid() ? parsed : kstDayjs();

  const setSelectedDate = (date: dayjs.Dayjs) => {
    const next = new URLSearchParams(searchParams);
    next.set('selectedDate', formatDateParam(date));
    setSearchParams(next, { preventScrollReset: true });
  };

  return { selectedDate, setSelectedDate };
}
