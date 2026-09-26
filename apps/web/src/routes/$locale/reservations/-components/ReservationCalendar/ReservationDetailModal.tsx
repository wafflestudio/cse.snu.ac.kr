import { useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import {
  deleteRecurringReservation,
  deleteReservation,
} from '@/routes/$locale/reservations/-api';
import type { Reservation } from '@/types/api';
import { api } from '@/utils/api';
import { kstDayjs } from '@/utils/date';

interface ReservationDetailModalProps {
  reservationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  '불러오는 중…': 'Loading…',
  예약상세: 'Reservation Detail',
  '예약 취소': 'Cancel reservation',
  '이 예약만 취소': 'Cancel this reservation',
  '반복 예약 전체 취소': 'Cancel all recurring reservations',
  '이 예약을 취소하시겠습니까?\n되돌릴 수 없습니다.':
    'Cancel this reservation?\nThis cannot be undone.',
  '반복 예약 전체를 취소하시겠습니까?\n되돌릴 수 없습니다.':
    'Cancel all recurring reservations?\nThis cannot be undone.',
  '예약을 취소했습니다.': 'Reservation canceled.',
  '반복 예약 전체를 취소했습니다.': 'All recurring reservations canceled.',
};

export default function ReservationDetailModal({
  reservationId,
  open,
  onOpenChange,
}: ReservationDetailModalProps) {
  const { t } = useLanguage(translations);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteRecurringDialog, setShowDeleteRecurringDialog] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open || reservationId === null) return;
    setReservation(null);

    (async () => {
      const data = await api
        .get(`v2/reservation/${reservationId}`)
        .json<Reservation>();
      setReservation(data);
    })();
  }, [open, reservationId]);

  if (!open || reservationId === null) return null;

  const handleDelete = async () => {
    if (!reservation) return;

    try {
      await deleteReservation(reservation.id);
      toast.success(t('예약을 취소했습니다.'));
      setShowDeleteDialog(false);
      onOpenChange(false);
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  const handleDeleteRecurring = async () => {
    if (!reservation) return;

    try {
      await deleteRecurringReservation(reservation.recurrenceId);
      toast.success(t('반복 예약 전체를 취소했습니다.'));
      setShowDeleteRecurringDialog(false);
      onOpenChange(false);
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        title="예약 상세"
        hideTitle
        size="lg"
      >
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="type-section text-neutral-950">
              {reservation?.title ?? t('불러오는 중…')}
            </h2>
          </div>

          <div className="mb-8 flex flex-col gap-6">
            <p className="text-neutral-950">
              {reservation
                ? (reservation.purpose ?? t('예약 목적 미기입'))
                : '-'}
            </p>

            <div className="flex flex-col gap-2">
              <Row
                title={t('예약 날짜')}
                body={
                  reservation
                    ? kstDayjs(reservation.startTime).format('YY.MM.DD')
                    : '-'
                }
              />
              <Row
                title={t('시작 시간')}
                body={
                  reservation
                    ? kstDayjs(reservation.startTime).format('HH:mm')
                    : '-'
                }
              />
              <Row
                title={t('종료 시간')}
                body={
                  reservation
                    ? kstDayjs(reservation.endTime).format('HH:mm')
                    : '-'
                }
              />
              <Row
                title={t('매주 반복')}
                body={
                  reservation ? `${reservation.recurringWeeks}${t('회')}` : '-'
                }
              />
            </div>

            <Row
              title={t('예약 위치')}
              body={reservation?.roomLocation ?? '-'}
            />

            <div className="flex flex-col gap-2">
              <p className="type-ui text-neutral-500">{t('예약자 정보')}</p>
              <Row title={t('계정')} body={reservation?.userName ?? '-'} />
              <Row
                title={t('이메일')}
                body={reservation?.contactEmail ?? '-'}
              />
              <Row
                title={t('핸드폰')}
                body={reservation?.contactPhone ?? '-'}
              />
            </div>
          </div>
          <LoginVisible
            allow={['ROLE_STAFF', 'ROLE_RESERVE', 'ROLE_LABMASTER']}
          >
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteRecurringDialog(true)}
              >
                {t('반복 예약 전체 취소')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                {t('이 예약만 취소')}
              </Button>
            </div>
          </LoginVisible>
        </div>
      </Dialog>
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={t('이 예약을 취소하시겠습니까?\n되돌릴 수 없습니다.')}
        confirmText={t('예약 취소')}
        onConfirm={handleDelete}
      />
      <AlertDialog
        open={showDeleteRecurringDialog}
        onOpenChange={setShowDeleteRecurringDialog}
        description={t(
          '반복 예약 전체를 취소하시겠습니까?\n되돌릴 수 없습니다.',
        )}
        confirmText={t('예약 취소')}
        onConfirm={handleDeleteRecurring}
      />
    </>
  );
}

const Row = ({ title, body }: { title: string; body: string }) => {
  return (
    <div className="flex gap-3">
      <p className="w-16.25 type-ui text-neutral-500">{title}</p>
      <p className="type-ui text-neutral-950">{body}</p>
    </div>
  );
};
