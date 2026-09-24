# 예약 행동 용어·좁은 확인창 — RC-Q1·2 검토

[한·영 비교 견본](reservation-copy.html) · [현재 DS](index.html) · [진행 현황](PLAN.md)

먼저 적용한 내용: [DS-037 주황 버튼 호버](primary-hover.html) · [DS-005 확인창 문구의 실제 적용](confirmation-copy.html).

**RC-Q1·RC-Q2는 제안이며 앱 미적용이다.** RC-Q1은 예약의 현재 ‘삭제’를 이용자가 하는 일인 ‘예약 취소’로 표현할지 비교한다. 실제 작은 확인창에서 기존 버튼 글자도 세로로 갈라지는 문제가 확인돼, RC-Q2는 공용 확인창의 모바일 폭과 버튼 줄바꿈을 별도로 비교한다.

## 현재 구현과 제안 이유

[ReservationDetailModal](../../apps/web/src/routes/$locale/reservations/-components/ReservationCalendar/ReservationDetailModal.tsx)은 단건에 `deleteReservation`, 반복 예약에 `deleteRecurringReservation`을 호출한다. 현재 버튼·확인·완료 안내도 ‘삭제’로 표현한다.

이용자가 하려는 일은 예약을 취소하는 것이므로, 화면에서도 ‘예약 취소’를 쓰는 안을 추천한다. DS-005의 실제 행동·대상이 드러나는 문구 방향을 이 사용처에 적용하는 비교다. 데이터 보존·취소 이력·복구 기능을 새로 약속하는 문구가 아니다.

‘취소’만 쓰면 **예약을 취소하는 행동**과 **확인창을 닫고 예약을 그대로 두는 행동**이 혼동될 수 있다. 따라서 반대 버튼은 한국어 ‘예약 유지’, 영어 단건 ‘Keep reservation’·반복 ‘Keep reservations’로 표시한다. 기존 확인창 취소 버튼과 같은 동작이다.

## 한국어 비교

| 위치 | 현재 | 제안 |
| --- | --- | --- |
| 단건 행동 | 해당 예약만 삭제 | 이 예약만 취소 |
| 반복 행동 | 반복 예약 전체 삭제 | 반복 예약 전체 취소 |
| 단건 확인 | 해당 예약을 삭제하시겠습니까? | 이 예약만 취소할까요? |
| 반복 확인 | 반복 예약을 모두 삭제하시겠습니까? | 반복 예약을 모두 취소할까요? |
| 확인창의 반대 버튼 | 취소 | 예약 유지 |
| 단건 실행 | 삭제 | 예약 취소 |
| 반복 실행 | 삭제 | 전체 취소 |
| 완료 안내 | 예약을 삭제했습니다. | 예약을 취소했습니다. |

## 영어 비교

| 위치 | 현재 | 제안 |
| --- | --- | --- |
| 단건 행동 | Delete this reservation | Cancel this reservation |
| 반복 행동 | Delete all recurring reservations | Cancel all recurring reservations |
| 단건 확인 | Delete this reservation? | Cancel only this reservation? |
| 반복 확인 | Delete all recurring reservations? | Cancel all recurring reservations? |
| 단건 반대 버튼 | Cancel | Keep reservation |
| 반복 반대 버튼 | Cancel | Keep reservations |
| 단건 실행 | Delete | Cancel reservation |
| 반복 실행 | Delete | Cancel all |
| 완료 안내 | 예약을 삭제했습니다. (현재 한국어 고정) | Reservation canceled. |

반복 예약의 적용 범위는 현재 구현 그대로다. ‘앞으로의 예약만’ 등 다른 범위를 뜻하는 말을 추가하지 않는다. 완료 문구는 기존 요청이 성공한 뒤에만 표시한다.

## RC-Q1 문구만 바꾼 비교 — 좁은 폭 문제 해결 전

- 한국어 행동: [현재](reservation-copy-comparison/actions-before-ko.png) / [제안](reservation-copy-comparison/actions-after-ko.png).
- 한국어 확인창: [현재](reservation-copy-comparison/confirm-before-ko.png) / [제안](reservation-copy-comparison/confirm-after-ko.png).
- 영어 행동: [현재](reservation-copy-comparison/actions-before-en.png) / [제안](reservation-copy-comparison/actions-after-en.png).
- 영어 확인창: [현재](reservation-copy-comparison/confirm-before-en.png) / [제안](reservation-copy-comparison/confirm-after-en.png).

위 8개 이미지는 현재 화면과 **DOM 문구만 바꾼 견본**이다. 확인창의 좁은 폭을 해결한 결과가 아니다. 390px 한국어 확인창의 실제 폭은195px였고 기존 ‘취소’·‘삭제’도 ‘취/소’·‘삭/제’로 갈라졌다. 문구만 바꾸면 ‘예약 유지’도 글자별로 갈라진다. 따라서 문구 교체만으로 배치까지 해결됐다고 보지 않는다.

앱 적용·요청 동작 검증 완료를 뜻하지 않는다. 완료 안내의 제안은 위 표로 제시하며, 비교를 위해 실제 예약을 취소할 필요는 없다.

## RC-Q2 작은 확인창의 폭·버튼 줄바꿈

숫자 차이를 통일하려는 제안이 아니다. 기존 모달별 크기는 유지하되, 이번에 실제로 확인한 버튼 문구의 세로 분리를 공용 `AlertDialog`에서 해결하는 안이다.

**추천:** 640px 미만에서는 확인창 너비를90vw로 하고 기존 최대512px·좌우40px 패딩을 유지한다. 640px 이상에서는 기존 내용 기반 폭을 유지한다. 버튼 내부 글자는 줄바꿈하지 않고, 두 버튼이 한 줄에 들어가지 않으면 **버튼 단위로 다음 줄**에 놓는다. 색·글자 크기·패딩·모서리·기존 정렬과 버튼 순서는 유지한다.

- 한국어: [390px 폭·줄바꿈 제안](reservation-copy-comparison/confirm-fit-ko-390.png) / [320px 폭·줄바꿈 제안](reservation-copy-comparison/confirm-fit-ko-320.png).
- 영어: [390px 폭·줄바꿈 제안](reservation-copy-comparison/confirm-fit-en-390.png) / [320px 폭·줄바꿈 제안](reservation-copy-comparison/confirm-fit-en-320.png).

위 4개는 **제안 문구와 RC-Q2의 폭·버튼 배치를 함께 대입한 별도 견본**이다. 앞의 문구만 바꾼 8개와 구분한다. 문구가 길어 버튼이 다음 줄로 가면 확인창 높이가 늘 수 있다. 내용 모달 `Dialog`나 이미지 안내창 `ImageModal`의 크기는 이 질문으로 바꾸지 않는다.

공용 `AlertDialog`를 변경하므로 다른 확인창에도 적용된다. 승인 후 예약의 한·영320/390px와 데스크톱뿐 아니라 다른 확인창 대표에서도 폭·긴 문구·버튼 배치를 확인한다. 기존 크기 정책을 모두 다시 설계하거나 검증 전에 모든 확인창의 적합성을 선언하지 않는다.

## 적용 경계

- API·`delete` 함수·권한·단건/반복 처리 범위는 그대로다. 취소 이유·새 상태·되돌리기 기능을 추가하지 않는다.
- 화면 버튼·확인창·완료 안내의 한·영 문구만 동기화한다. Sonner 라이브러리 내부는 수정하지 않고, 예약 화면의 기존 `toast.success` 호출부에 전달하는 문자열만 맞추는 제안이다.
- 예약 유지 버튼은 현재 확인창을 닫는 경로, 실행 버튼은 기존 삭제 요청 경로를 그대로 사용한다.
- 다른 콘텐츠의 ‘삭제’를 일괄 ‘취소’로 바꾸지 않는다.
- RC-Q2는 공용 `AlertDialog`의 작은 화면 폭과 버튼 배치에만 적용한다. 데스크톱 기존 폭·동작은 유지하고 다른 확인창 영향도 대표 확인한다.
- 승인 후 실제 앱의 한·영 단건/반복 문구, 좁은 화면의 긴 버튼 배치와 기존 동작 연결을 확인한다.

## 함께 정할 두 가지

1. **RC-Q1:** 예약의 버튼·확인창·완료 안내를 위의 ‘예약 취소’ 용어 묶음으로 적용할까?
2. **RC-Q2:** 작은 공용 확인창은90vw로 하고, 글자 대신 버튼 단위로 줄바꿈할까?

둘 다 적용을 추천한다. RC-Q1은 행동과 범위를 구분하고, RC-Q2는 실제로 확인한 글자별 줄바꿈을 해결한다. 두 결정은 별개이며 아직 앱에는 적용하지 않았다.
