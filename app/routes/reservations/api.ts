import type dayjs from 'dayjs';
import { BASE_URL } from '~/constants/api';
import type {
  ReservationPostBody,
  ReservationPreview,
  ReserveTerm,
} from '~/types/api/v2/reservation';

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
  const response = await fetch(`${BASE_URL}/v2/reservation/terms`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reserve terms');
  }

  return (await response.json()) as ReserveTerm[];
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

  const response = await fetch(
    `${BASE_URL}/v2/reservation/week?${params.toString()}`,
    { credentials: 'include' },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch reservation data');
  }

  return (await response.json()) as ReservationPreview[];
};

export const postReservation = async (body: ReservationPostBody) => {
  const response = await fetch(`${BASE_URL}/v2/reservation`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ReservationError(response.status, body?.code, body?.message);
  }
};

export const deleteReservation = async (reservationId: number) => {
  const response = await fetch(`${BASE_URL}/v2/reservation/${reservationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(String(response.status));
  }
};

export const deleteRecurringReservation = async (recurrenceId: string) => {
  const response = await fetch(
    `${BASE_URL}/v2/reservation/recurring/${recurrenceId}`,
    { method: 'DELETE' },
  );

  if (!response.ok) {
    throw new Error(String(response.status));
  }
};
