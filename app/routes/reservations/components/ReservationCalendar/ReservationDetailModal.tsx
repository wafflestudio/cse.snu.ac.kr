import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Modal from '~/components/common/Modal';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { Reservation } from '~/types/api/v2/reservation';

interface ReservationDetailModalProps {
  reservationId: number | null;
  open: boolean;
  onClose: () => void;
}

const translations = {
  '예약 목적 미기입': 'No purpose provided',
  '예약 날짜': 'Reservation Date',
  '시작 시간': 'Start Time',
  '종료 시간': 'End Time',
  '매주 반복': 'Weekly Repeat',
  '예약 위치': 'Location',
  '예약자 정보': 'Requester Info',
  계정: 'Account',
  이메일: 'Email',
  핸드폰: 'Phone',
  회: 'times',
  불러오는중: 'Loading...',
  예약상세: 'Reservation Detail',
};

export default function ReservationDetailModal({
  reservationId,
  open,
  onClose,
}: ReservationDetailModalProps) {
  const { t } = useLanguage(translations);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (!open || reservationId === null) return;
    setReservation(null);

    (async () => {
      const response = await fetch(
        `${BASE_URL}/v2/reservation/${reservationId}`,
        { credentials: 'include' },
      );
      if (!response.ok) throw new Error('Failed to fetch reservation detail');
      const data = (await response.json()) as Reservation;
      setReservation(data);
    })();
  }, [open, reservationId]);

  if (!open || reservationId === null) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="min-w-[320px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800">
            {reservation?.title ?? t('불러오는중')}
          </h2>
        </div>

        <div className="mb-[2.19rem] flex flex-col gap-6">
          <p className="text-neutral-800">
            {reservation ? (reservation.purpose ?? t('예약 목적 미기입')) : '-'}
          </p>

          <div className="flex flex-col gap-[6px]">
            <Row
              title={t('예약 날짜')}
              body={
                reservation
                  ? dayjs(reservation.startTime).format('YY.MM.DD')
                  : '-'
              }
            />
            <Row
              title={t('시작 시간')}
              body={
                reservation ? dayjs(reservation.startTime).format('HH:mm') : '-'
              }
            />
            <Row
              title={t('종료 시간')}
              body={
                reservation ? dayjs(reservation.endTime).format('HH:mm') : '-'
              }
            />
            <Row
              title={t('매주 반복')}
              body={
                reservation ? `${reservation.recurringWeeks}${t('회')}` : '-'
              }
            />
          </div>

          <Row title={t('예약 위치')} body={reservation?.roomLocation ?? '-'} />

          <div className="flex flex-col gap-[6px]">
            <p className="text-md font-normal text-neutral-400">
              {t('예약자 정보')}
            </p>
            <Row title={t('계정')} body={reservation?.userName ?? '-'} />
            <Row title={t('이메일')} body={reservation?.contactEmail ?? '-'} />
            <Row title={t('핸드폰')} body={reservation?.contactPhone ?? '-'} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

const Row = ({ title, body }: { title: string; body: string }) => {
  return (
    <div className="flex gap-3">
      <p className="w-16.25 text-md text-neutral-500">{title}</p>
      <p className="text-md text-neutral-800">{body}</p>
    </div>
  );
};
