import { ChevronRight } from 'lucide-react';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/reservations/-components/ReservationCalendar/AddReservationModal.tsx 안
// 개인정보 동의 옆 "보러가기" 링크만 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 새 탭 라우터 링크는 이동하지 않는 <a href="#"> 로 바꿨다. 글자 14px 은 모달 본문에서 물려받던 값이다.
// 화살표는 16px 고정에 3px 내림, 선은 lucide 기본 2(지금 전역 규칙 1.5 를 stroke-2 로 되돌린다).

export function LegacyPrivacyPolicyLink() {
  return (
    <a href="#" onClick={stay} className="text-[14px] text-neutral-400">
      보러가기
      <ChevronRight className="h-4 w-4 translate-y-[3px] stroke-2" />
    </a>
  );
}
