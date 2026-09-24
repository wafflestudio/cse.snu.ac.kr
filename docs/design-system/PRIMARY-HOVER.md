# 주황 버튼 호버 — DS-037 적용

[실제 견본](primary-hover.html) · [현재 DS](index.html) · [계획](PLAN.md)

사용자 “ㅇㅇ 좋아”로 PH-Q1 승인. 공용 Button primary의 호버에 기존 main-orange-dark를 연결했다.

| 상태 | 적용값 |
| --- | --- |
| 기본·포인터 이탈 | #ff6914 / 흰 글씨 |
| 호버 | #e65817 / 흰 글씨 |

기본과 호버의 색이 같던 버튼에 포인터 반응을 제공하고, 기존 주황 Tag의 호버색을 재사용한다. 새 색은 만들지 않았다. 기본색·크기·문구·반경·클릭 동작은 유지하며 ImageModal의 별도 주황 버튼은 변경하지 않는다. disabled 버튼은 호버에도 기본색을 유지한다.

새 프로덕션 빌드에서 공지 목록 편집과404 화면의 실제 기본·호버·이탈, 흰 글자·동일 크기를 확인했다. [측정](primary-hover-implementation/measurements.json). 현재 실제 disabled primary 사용처는 없어 해당 분기는 소스로만 확인했다. 클릭·초점 검증으로 범위를 넓히지 않았다.

이전 비교는 primary-hover-comparison에 보존했다. 현재 페이지는 실제 적용 캡처를 보여준다.
