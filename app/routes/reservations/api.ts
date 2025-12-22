import type dayjs from 'dayjs';
import { BASE_URL } from '~/constants/api';
import type { ReservationPreview } from '~/types/api/v2/reservation';

export const fetchWeeklyReservation = async (
  roomId: number,
  date: dayjs.Dayjs,
) => {
  const params = new URLSearchParams({
    roomId: `${roomId}`,
    year: `${date.year()}`,
    month: `${date.month() + 1}`,
    day: `${date.date()}`,
  });

  const response = await fetch(
    `${BASE_URL}/v2/reservation/week?${params.toString()}`,
    {
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch reservation data');
  }

  return (await response.json()) as ReservationPreview[];
};
