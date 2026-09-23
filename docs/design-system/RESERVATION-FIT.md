# 예약창 입력 폭 — DS-026 적용

[누적 DS](index.html) · [실제 견본](reservation-fit.html) · [계획](PLAN.md)

2026-09-24, S-Q1을 승인해 예약 전용 Fieldset에 `w-88 max-w-full`을 적용했다. 기존352px는 유지하되 좁은 부모 안쪽 폭을 넘지 않는다. 공용 Dialog·입력의 크기 API와 예약 로직은 변경하지 않았다.

## 적용 결과

- 한·영 390px에서 네 입력이352→295px, 모달 내부 scrollWidth가380→351px가 되어 가로 잘림을 해결했다.
- 한·영 1280px 실제 이미지가 승인안과 바이트까지 동일하다. 모달408px·입력352px 유지.
- 모바일390px·날짜 펼침의 내용 영역은 승인안과 동일하다. 전체 이미지에는 오른쪽 네이티브 스크롤바/바깥 경계 및 하단1px 렌더 차이가 있어 전체 바이트 일치로 표시하지 않는다. [이미지 비교](reservation-fit-implementation/image-comparison.json).
- 한·영320/360/390/639/640/1280px와390×600px, 총14개 기본 상태에서 필드 끝이 안쪽에 들어오며 취소 버튼을 스크롤해 누를 수 있었다. 날짜 펼침10상태도 추가 확인했다. [실측](reservation-fit-implementation/measurements.json).
- 320·360px의 날짜 팝오버는 별도로 가로 넘침이 남았다. 입력 폭 수정 실패와 구분해 [다음 검토](reservation-boundary.html)에 연결한다. 저장·예약 규칙 검증은 이번 스타일 변경 범위가 아니다.

## 유지한 기준과 범위

현재 모달은 작은 화면90vw, 예약 좌우패딩28px다. 입력의 기존352px를 제한하여 390px에서 가용295px에 맞춘다. 글자·색·높이·간격·주요 동작은 그대로다. 최소 지원 폭이나 전체 모달 상태의 완료를 선언하지 않는다.

승인 전 임시 비교는 [비교 기록](reservation-fit-comparison/measurements.json)에 보존했다. 최신 실제 캡처는 `reservation-fit-implementation/`이다.
