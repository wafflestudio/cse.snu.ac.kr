import type dayjs from 'dayjs';
import type {
  ReservationPostBody,
  ReservationPreview,
  ReserveTerm,
} from '@/types/api';
import { api } from '@/utils/api';

export const fetchReserveTerms = async () => {
  return api.get(`v2/reservation/terms`).json<ReserveTerm[]>();
};

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

  return api
    .get(`v2/reservation/week?${params.toString()}`)
    .json<ReservationPreview[]>();
};

// 실패는 HTTPError 그대로 던진다 — 사유(RESERVE-xx·SYS-xx 코드)는 toastError가 사전으로 바꾼다.
export const postReservation = async (body: ReservationPostBody) => {
  await api.post('v2/reservation', { json: body });
};

export const deleteReservation = async (reservationId: number) => {
  await api.delete(`v2/reservation/${reservationId}`);
};

export const deleteRecurringReservation = async (recurrenceId: string) => {
  await api.delete(`v2/reservation/recurring/${recurrenceId}`);
};
