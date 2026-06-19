import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const kstDayjs = (input?: dayjs.ConfigType) =>
  dayjs(input).tz('Asia/Seoul');
