import dayjs from 'dayjs';

export const parseDateParam = (value: string) => {
  return dayjs(value, 'YYYY-MM-DD', true);
};

export const formatDateParam = (date: dayjs.Dayjs) => {
  return date.format('YYYY-MM-DD');
};

export const getStartOfWeek = (date: dayjs.Dayjs) => {
  const diff = (date.day() || 7) - 1;
  return date.subtract(diff, 'day');
};
