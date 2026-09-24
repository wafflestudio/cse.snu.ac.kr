# 예약 취소 용어·확인창 배치 — DS-038·039 실제 적용

[실제 적용 견본](reservation-copy.html) · [현재 DS](index.html) · [진행 현황](PLAN.md)

**RC-Q1·2 모두 승인·적용했다. 질문은 마감했고 이 묶음의 실제 검증을 완료했다.** DS-038은 예약 행동을 ‘취소’로 표현하고, DS-039는 작은 확인창의 폭과 버튼 단위 줄바꿈을 정한다.

## 실제 적용한 문구 — DS-038

| 위치 | 한국어 | 영어 |
| --- | --- | --- |
| 단건 행동 | 이 예약만 취소 | Cancel this reservation |
| 반복 행동 | 반복 예약 전체 취소 | Cancel all recurring reservations |
| 단건 확인 | 이 예약만 취소할까요? | Cancel only this reservation? |
| 반복 확인 | 반복 예약을 모두 취소할까요? | Cancel all recurring reservations? |
| 반대 버튼 · 단건 / 반복 | 예약 유지 / 예약 유지 | Keep reservation / Keep reservations |
| 실행 버튼 · 단건 / 반복 | 예약 취소 / 전체 취소 | Cancel reservation / Cancel all |
| 완료 안내 | 예약을 취소했습니다. | Reservation canceled. |

API 함수·권한·단건/반복 범위와 기존 콜백 상태는 유지한다. 예약 유지는 기존 확인창을 닫는 경로다. 성공 안내는 요청 성공 후 기존 toast.success에 전달하는 문자열만 바꿨으며 Sonner 내부는 수정하지 않았다.

## 실제 적용한 배치 — DS-039

공용 AlertDialog는640px 미만에서90vw, 최대512px을 사용한다. 640px 이상은 기존 내용 기반 폭을 유지한다. 버튼 안 글자는 한 줄로 유지하고, 한 줄에 들어가지 않으면 버튼 전체가 다음 줄로 간다. 기존 색·서체·패딩(좌우40px)·모서리·정렬·버튼 순서와 동작은 유지한다.

**데스크톱 크기가 모두 같다는 뜻은 아니다.** 같은 문구를 대입해 비교한640/1200px 표본의 폭은 기존과 같지만, 버튼 단위 줄바꿈으로 높이는 커질 수 있다. 640px 영어 단건 확인창은 이전155px에서177px로 높아졌다. 이 비교는 같은 문구를 기준으로 한 배치 변경 영향이며, 삭제 문구를 쓰던 전체 이전 화면과의 동일성을 뜻하지 않는다.

## 실제 견본과 검증 상태

[앱 캡처](reservation-copy.html#actual)는 기존 DOM 비교와 구분한다. 두 언어 × 다섯 폭(320/390/639/640/1200px) × 단건·반복의 **20개 배치**와 다른 확인창 대표인 편집 이탈의 한·영320/1200px **4개 배치** 검증이 통과했다. 한국어·영어에서 단건 취소 후 남은 반복 예약 취소와 완료 토스트도 확인했다. 전체 DS 완료를 뜻하지 않는다.

기존 예약 flow의 마지막 실행 상태 파일은 passed였다. 실행 요약 로그를 재확인할 수 없어 통과 테스트 개수는 확정하지 않는다.

- [예약 측정 기록](reservation-copy-implementation/measurements.json)
- [다른 확인창 측정 기록](reservation-copy-implementation/other-alert-measurements.json)

캡처는 원본보다 확대하지 않는다. 전체 확인창·페이지·사용처를 전수 검증한 결과는 아니다. 접근성 후속 작업은 이번에 시작하지 않았고, 사용자 요청대로 나머지 DS 완료 뒤에 남긴다.

다음 작업은 **5단계 비접근성 통합 검증·DS 문서 완성**이다. 현재 단계의 정본은 PLAN.md다.

## 이전 제안 기록

<details>
<summary>승인 전 비교와 근거 — 과거 자료</summary>

아래의 ‘현재’, ‘제안’, ‘미적용’은 승인 전 시점이다. 최종 상태는 위의 실제 적용 기록을 따른다. 비교 캡처는 실제 적용 이미지가 아닌 DOM 대입 견본을 포함한다. RC-Q1·2의 추가 답변은 필요하지 않다.

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


</details>
