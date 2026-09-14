import { createFileRoute } from '@tanstack/react-router';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import PageLayout from '@/components/layout/PageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavItem } from '@/hooks/useNavItem';
import { useReservationsSubNav } from '@/hooks/useSubNav';
import {
  fetchReservations,
  fetchReserveTerms,
} from '@/routes/$locale/reservations/-api';
import ReservationCalendar from '@/routes/$locale/reservations/-components/ReservationCalendar';
import {
  DESKTOP_COLUMN_COUNT,
  MOBILE_COLUMN_COUNT,
  roomNameToId,
  STAFF_ONLY_ROOM_ID,
} from '@/routes/$locale/reservations/-constants';
import { kstDayjs } from '@/utils/date';
import { stringParam } from '@/utils/searchSchema';
import { formatDateParam, getStartOfWeek, parseDateParam } from '../-utils';

function RoomReservationPage() {
  const { roomId, reservations, selectedDate, reserveTerms } =
    Route.useLoaderData();

  const { t, tUnsafe } = useLanguage({
    '존재하지 않는 시설 아이디입니다.': 'Invalid room.',
    '유효하지 않은 날짜입니다.': 'Invalid date.',
    '관리자만 열람 가능합니다.': 'Only staff can view this room.',
  });

  const { activeItem } = useNavItem();
  const subNav = useReservationsSubNav();

  // loader에서 처리하므로 여기서는 처리하지 않음
  if (!activeItem) return null;

  const title = activeItem ? tUnsafe(activeItem.key) : t('시설 예약');
  const props = {
    reservations,
    startDate: parseDateParam(selectedDate),
    roomId,
    reserveTerms,
  };

  const isStaffOnlyRoom = STAFF_ONLY_ROOM_ID.includes(roomId);

  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      {isStaffOnlyRoom ? (
        <LoginVisible allow="ROLE_STAFF" fallback={<NonStaffFallback />}>
          <ReservationCalendar {...props} />
        </LoginVisible>
      ) : (
        <ReservationCalendar {...props} />
      )}
    </PageLayout>
  );
}

function NonStaffFallback() {
  const { t } = useLanguage({
    '관리자만 열람 가능합니다.': 'Only staff can view this room.',
  });
  return <div className="h-[400px]">{t('관리자만 열람 가능합니다.')}</div>;
}

export const Route = createFileRoute(
  '/$locale/reservations/$roomType/$roomName',
)({
  validateSearch: (search: Record<string, unknown>) => ({
    selectedDate: stringParam(search.selectedDate),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ params, deps }) => {
    const roomId = roomNameToId[params.roomName];
    if (roomId === undefined) throw new Error('Invalid room');

    const selectedDateParam = deps.selectedDate;
    const selectedDate = selectedDateParam
      ? parseDateParam(selectedDateParam)
      : kstDayjs();

    if (!selectedDate.isValid()) throw new Error('Invalid date');

    const isSeminarRoom = params.roomType === 'seminar-room';

    // 데스크톱은 주 월요일부터 7일, 모바일은 선택일부터 3일 — 합치면 월요일부터 최대 10일이다.
    const [reservations, reserveTerms] = await Promise.all([
      fetchReservations(
        roomId,
        getStartOfWeek(selectedDate),
        DESKTOP_COLUMN_COUNT + MOBILE_COLUMN_COUNT,
      ),
      isSeminarRoom ? fetchReserveTerms() : Promise.resolve(null),
    ]);

    return {
      roomId,
      selectedDate: formatDateParam(selectedDate),
      reservations,
      reserveTerms,
    };
  },
  component: RoomReservationPage,
});
