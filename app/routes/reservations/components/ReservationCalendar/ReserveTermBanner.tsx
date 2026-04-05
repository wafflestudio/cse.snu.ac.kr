import dayjs from 'dayjs';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '~/hooks/useLanguage';
import type { ReserveTerm } from '~/types/api/v2/reservation';

const translations = {
  '세미나실 예약은 정기예약과 상시예약으로 운영됩니다. 정기예약 기간에는 랩대표만 예약할 수 있으며, 그 외 기간에는 누구나 예약 가능합니다. 다음 예약 기간은 등록 후 이곳에 공지됩니다.':
    'Seminar room reservations operate as regular and open booking. During the regular booking period, only lab representatives can reserve. Otherwise, anyone can book. The next reservation period will be announced here once registered.',
  '현재 정기예약 신청 기간입니다.': 'Regular reservation period is open.',
  '신청 마감': 'Deadline',
  '예약 대상': 'Target period',
  '다음 정기예약 신청': 'Next regular reservation',
  시작: 'starts',
};

const PROFESSOR_ROOM_ID = 8;

export default function ReserveTermBanner({
  reserveTerms,
  roomId,
}: {
  reserveTerms: ReserveTerm[];
  roomId: number;
}) {
  const { t } = useLanguage(translations);

  if (roomId === PROFESSOR_ROOM_ID) return null;

  const now = dayjs();

  const activeTerm = reserveTerms.find(
    (term) =>
      now.isAfter(dayjs(term.applyStartTime)) &&
      now.isBefore(dayjs(term.applyEndTime)),
  );

  const upcomingTerm = !activeTerm
    ? reserveTerms
        .filter((term) => now.isBefore(dayjs(term.applyStartTime)))
        .sort(
          (a, b) =>
            dayjs(a.applyStartTime).unix() - dayjs(b.applyStartTime).unix(),
        )[0]
    : null;

  return (
    <div className="mb-4 flex flex-col gap-1 text-sm text-neutral-400">
      <div className="flex items-center gap-1">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <p className="font-normal">
          {t(
            '세미나실 예약은 정기예약과 상시예약으로 운영됩니다. 정기예약 기간에는 랩대표만 예약할 수 있으며, 그 외 기간에는 누구나 예약 가능합니다. 다음 예약 기간은 등록 후 이곳에 공지됩니다.',
          )}
        </p>
      </div>
      {activeTerm && (
        <p className="ml-5 font-normal text-main-orange">
          {t('현재 정기예약 신청 기간입니다.')} ({t('신청 마감')}:{' '}
          {dayjs(activeTerm.applyEndTime).format('M/D HH:mm')}, {t('예약 대상')}
          : {dayjs(activeTerm.termStartTime).format('M/D')}~
          {dayjs(activeTerm.termEndTime).format('M/D')})
        </p>
      )}
      {upcomingTerm && (
        <p className="ml-5 font-normal">
          {t('다음 정기예약 신청')}:{' '}
          {dayjs(upcomingTerm.applyStartTime).format('M/D HH:mm')} {t('시작')} (
          {t('예약 대상')}: {dayjs(upcomingTerm.termStartTime).format('M/D')}~
          {dayjs(upcomingTerm.termEndTime).format('M/D')})
        </p>
      )}
    </div>
  );
}
