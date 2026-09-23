# 처리 중 버튼 문구 — DS-036 적용 기록

[실제 적용 견본](pending-feedback.html) · [현재 DS](index.html) · [다음: 주황 버튼 호버](primary-hover.html) · [계획](PLAN.md)

**PF-Q1은 A로 마감했다.** 사용자가 “A ㄱㄱ”로 승인했고 DS-036으로 적용했다. 기존 제출 상태에서 버튼 안 문구를 짧게 바꾸며, 별도 안내나 스피너는 추가하지 않는다.

## 승인 방향과 실제 앱 적용

DS-005는 행동과 대상을 구체적으로 표현하는 문구 방향이다. DS-036은 처리 중 안내 위치를 확정했다. 모든 기본 행동명이나 확인창 문구를 일괄 변경한 것은 아니다.

| 사용처 | 현재 기본 문구 | 처리 중 |
| --- | --- | --- |
| 공용 Form.Action 기본 | 저장하기 / Save | 저장 중… / Saving… |
| 공지·새 소식 작성 | 게시하기 / Publish | 게시 중… / Publishing… |
| 공지·새 소식 편집 | 변경사항 저장 / Save changes | 저장 중… / Saving… |
| 이미지 안내 관리 등록 | 등록하기 | 등록 중… |
| 이미지 안내 관리 편집 | 저장하기 | 저장 중… |
| 예약 추가 | 예약 / Reserve | 예약 중… / Reserving… |

Form.Action의 실행 문구와 취소·삭제에 영어 번역을 연결했다. 이미지 안내 관리는 한국어 관리자 경로에서 사용하며 공통 컴포넌트에는 Add/Adding…도 연결되어 있다. 공지·새 소식 편집의 기본 문구는 당시 HTML 견본의 ‘저장 / Save’가 아니라 실제 갱신 행동을 설명하는 ‘변경사항 저장 / Save changes’다.

공용 확인창의 ‘편집중인 내용이 사라집니다.’, ‘게시물을 삭제하시겠습니까?’, ‘취소 / 확인’은 그대로다. 확인창의 문구·번역까지 정리했다고 해석하지 않는다.

## 폭과 상태 기준

Form.Action은 해당 기본 실행 문구를 숨김 폭 기준으로 남기고 처리 중 문구를 같은 자리에 겹친다. 예약은 이전 ‘예약하기 / Reserve’를 최소 폭 기준으로 유지한다. 더 긴 처리 중 문구는 자연스럽게 확장한다. 모든 상태의 버튼 폭이 같다는 규칙은 아니다.

기존 isSubmitting을 사용하며 새 처리 상태·제출·취소·검증 로직과 Button API를 만들지 않았다. 기존 비활성 표현을 유지한다. 공용 폼의 취소·삭제는 제출 중 비활성이고, 예약의 취소는 기존처럼 활성이다.

## 실제 적용 검증

최종 새 프로덕션 빌드에서 한·영 공지 편집·작성과 예약 **6장면이 재통과**했다. 요청을 잠시 대기시켜 문구를 확인한 뒤 실제 로컬 API 요청을 이어 보냈고 성공을 확인했다. 응답을 모의 데이터로 대체하지 않았다. 생성한 공지·예약은 정리했다. 기존 공지·새 소식 CRUD와 예약 생성·취소 **E2E3개도 통과**했다.

[실제 캡처](pending-feedback.html#captures) · [측정·환경 기록](pending-feedback-implementation/measurements.json)

| 실제 장면 | 화면 폭 | 실행 전 → 처리 중 버튼 폭 |
| --- | --- | --- |
| 한국어 공지 편집 | 1200px | 103 → 103px |
| 영어 공지 편집 | 1200px | 119 → 119px |
| 한국어 공지 작성 | 1200px | 76 → 78px |
| 영어 공지 작성 | 1200px | 73 → 103px |
| 한국어 예약 | 320px | 76 → 78px |
| 영어 예약 | 320px | 80 → 102px |

캡처 파일의 before는 변경 전 앱이 아니라 **이번 적용 후 실행 직전 상태**다. 공지는 하단 행동 영역, 예약은 모달 행동 영역을 발췌했다. HTML에서는 원본보다 확대하지 않고 최대 폭100%로 표시한다.

Form.Action 사용 **27개 모듈**은 모두 FormProvider 내부이고 직접 또는 미리 감싼 handleSubmit에 연결됨을 소스로 확인했다. 공지·새 소식·이미지 관리의 custom submitLabel에는 각각 의미에 맞는 pendingLabel을 연결했다. 실제 처리 중 요청 검증은 대표6장면이며, 새 소식·이미지 관리와 모든 공용 폼 상태를 전수 실행한 결과는 아니다.

접근성 후속은 사용자 요청대로 나머지 DS 완료 뒤로 남긴다. 이번 검증은 일반 시각·처리 상태 범위다. Sonner 내부, SunEditor, CSP는 변경하지 않았다.

## 소스 근거

- [Form.Action](../../apps/web/src/components/form/Action.tsx): isSubmitting, pendingLabel, 번역과 기본 문구 폭 유지.
- [NoticeEditor](../../apps/web/src/routes/$locale/community/notice/-components/NoticeEditor.tsx) · [NewsEditor](../../apps/web/src/routes/$locale/community/news/-components/NewsEditor.tsx): 작성·편집 문구 구분.
- [이미지 안내 관리](../../apps/web/src/routes/admin/-components/ImageModalManagement.tsx): 등록·저장 처리 문구 구분.
- [예약 추가](../../apps/web/src/routes/$locale/reservations/-components/ReservationCalendar/AddReservationModal.tsx): 예약 문구와 이전 기본 폭 유지.

## 이전 비교와 다음 작업

[이전 A/B HTML 비교](pending-feedback.html#history)는 접힌 과거 자료로 보존했다. 앱 캡처가 아니며 당시 기본 문구 견본도 최종 구현과 다르다. A는 버튼 안 문구를 교체하고, 채택하지 않은 B는 버튼 옆에 안내를 더하는 방식이었다. 문구를 중복하지 않고 실행한 자리에서 상태를 보여주는 A를 선택했다. PF-Q1에 추가 답변은 필요하지 않다.

다음 검토는 [주황 버튼 호버](primary-hover.html)다. 현재 작업 단계와 나머지 범위는 PLAN.md를 기준으로 확인한다.
