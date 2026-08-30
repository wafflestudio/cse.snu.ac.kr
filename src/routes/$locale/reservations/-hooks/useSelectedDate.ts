import { useNavigate, useSearch } from '@tanstack/react-router';
import type dayjs from 'dayjs';
import { kstDayjs } from '@/utils/date';
import { formatDateParam, parseDateParam } from '../-utils';

export default function useSelectedDate() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const selectedDateParam = search.selectedDate;
  const parsed = selectedDateParam
    ? parseDateParam(selectedDateParam)
    : kstDayjs();
  const selectedDate = parsed.isValid() ? parsed : kstDayjs();

  const setSelectedDate = (date: dayjs.Dayjs) => {
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, selectedDate: formatDateParam(date) }),
      resetScroll: false,
    });
  };

  return { selectedDate, setSelectedDate };
}
