import type dayjs from 'dayjs';
import { isHTTPError } from 'ky';
import type {
  ReservationPostBody,
  ReservationPreview,
  ReserveTerm,
} from '@/types/api/v2/reservation';
import { api } from '@/utils/api';

export class ReservationError extends Error {
  constructor(
    public status: number,
    public code: string | null,
    public serverMessage: string | null,
  ) {
    super(serverMessage ?? `HTTP ${status}`);
  }
}

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

export const postReservation = async (body: ReservationPostBody) => {
  try {
    await api.post('v2/reservation', { json: body });
  } catch (error) {
    if (isHTTPError(error)) {
      // 백엔드가 준 code·message를 사용자 안내로 쓴다(중복 예약 409 등).
      const data = error.data as
        | { code?: string; message?: string }
        | undefined;
      throw new ReservationError(
        error.response.status,
        data?.code ?? null,
        data?.message ?? null,
      );
    }
    throw error;
  }
};

export const deleteReservation = async (reservationId: number) => {
  await api.delete(`v2/reservation/${reservationId}`);
};

export const deleteRecurringReservation = async (recurrenceId: string) => {
  await api.delete(`v2/reservation/recurring/${recurrenceId}`);
};
