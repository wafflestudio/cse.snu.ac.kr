# 오류 글자와 검색 입력 초점 — C-Q6 제안

[현재 DS](index.html) · [견본과 실제 화면 비교](state-colors.html) · [진행 현황](PLAN.md)

**아직 미확정이며 앱에 적용하지 않았다.** DS-011까지의 결정은 유지한다.
이번에는 오류 글자색의 사용 범위와 검색 입력의 초점 표시를 정한다.

## 현재 문제 → 변경 이유 → 기대 효과

### 접근성의 요구와 이번 디자인 제안은 구분한다

[WCAG 2.4.7 AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)는 키보드 초점이 보이도록 요구하며 외곽선 모양을 강제하지 않는다.
텍스트 입력의 캐럿(입력 위치의 세로 커서)도 초점 표시의 예시다.
[1.4.11의 입력 초점 예시](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)도 충분히 보이는 캐럿으로 초점을 표시하는 경우를 인정한다.
따라서 `outline: none` 또는 외곽선 0px만으로 현재 검색 입력이 접근성 위반이라고 판정하지 않는다.

이번 2px 외곽선·2px 간격은 검색 위치를 더 쉽게 찾고 DS-008과 일관되게 표시하려는 **사용성 개선 제안**이다.
[2.4.13 AAA](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)의 면적 기준과도 구분한다.
이 기준도 반드시 2px 외곽선 형태나 2px 간격을 요구하는 것은 아니다.
평소 입력 테두리 또한 항상 필수인 것은 아니며 입력 영역을 다른 시각적 단서로 식별할 수 있는지 따로 검토한다.

### 검색 입력: 외곽선을 추가하는 이유

현재 HeaderSearchBar, SearchBox/Input, SeminarSearchBar의 입력에 `outline-none`이 있고 대체 초점 외곽선이 없다.
기존 캐럿보다 넓은 표시를 더해 현재 조작 위치를 찾기 쉽게 하려는 제안이다. 캐럿만으로 접근성 기준을 충족할 수 있는 경우와 구분한다.
실제 앱에서 입력과 이를 감싼 바 모두 초점 외곽선이 0px인 것을 확인했다.

DS-008 입력 초점과 같은 **2px solid / 간격 2px**를 검색 바 외곽에 표시하는 안이다.
입력과 검색 아이콘이 하나의 면을 이루므로 입력의 높이가 아닌 바 전체를 따라 표시한다.
입력 자체가 `:focus-visible`일 때만 바를 표시하며 버튼으로 이동하면 바 외곽선은 사라지고 기존 버튼 초점이 남는다.

밝은 바탕의 검색은 #404040, 어두운 헤더 위 검색은 흰색을 사용한다.
같은 #404040을 어두운 면에 쓰면 잘 보이지 않으므로 **같은 초점 역할을 바탕에 맞는 명도로 표시**한다.
외곽선은 요소 크기를 차지하지 않아 기존 크기·배치를 유지할 수 있다.
검색 실행·URL·필터·포커스 이동 로직을 바꾸는 작업은 아니다.

### 오류 글자: 기존 색을 유지하는 이유

[Form.Action](../../apps/web/src/components/form/Action.tsx)은 오류를 문장으로 나열하고 `text-red-600`을 사용한다.
이번 제안은 이 빨강을 **밝은 바탕의 오류 글자 역할**로 정리하는 것이다.
기존 CSS 값은 `oklch(57.7% .245 27.325)`이며, Chromium의 sRGB 변환은 약 #e7000b다.
흰색에서 약 4.77:1, neutral-50에서 4.57:1로
[일반 글자 대비 기준 4.5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)을 넘으므로 이 조합의 색을 새로 바꿀 이유는 적다.

반면 neutral-100에서는 약 4.38:1이므로 모든 회색 면에 같은 규칙을 확대하지 않는다.
흰색·neutral-50 바탕의 오류 문장으로 범위를 한정하고 더 어둡거나 색이 있는 바탕은 개별 검토한다.
숫자는 Chromium sRGB 변환값의 계산이며 모든 디스플레이·전체 접근성의 보증이 아니다.
오류를 나타내는 문장과 함께 쓰고 색만 바꿔 오류 의미를 전달하지 않는다.

오류를 언제 발생시키거나 어디로 초점을 옮기는지, 필드별 오류 연결은 이번 색 결정과 별도다.
검증 로직·에디터·Sonner는 변경하지 않으며 위험 행동 버튼도 일괄 빨갛게 만들지 않는다.

## 제안하는 역할과 첫 적용

| 역할 | 제안 규칙 | 적용 범위 |
| --- | --- | --- |
| 밝은 바탕 오류 글자 | 기존 red-600 유지, 설명 문장과 함께 | 흰색·neutral-50의 Form.Action 오류 목록. 새 앱 색 변경 없음 |
| 밝은 구역의 검색 초점 | #404040 2px solid, offset 2px | SearchBox/Input, SeminarSearchBar의 바 외곽 |
| 어두운 헤더의 검색 초점 | 흰색 2px solid, offset 2px | HeaderSearchBar의 바 외곽 |

SearchBox/Input은 공지·새 소식·통합검색 결과에서 공유한다. 헤더 검색은 기존처럼 데스크톱에서만 보인다.
`:has(input:focus-visible)`에 해당하는 시각 스타일만 추가하는 범위다.
기본 테두리·배경·검색 아이콘 색·크기·버튼 초점·비활성·오류 표시 로직은 유지한다.

## 근거와 검증 범위

소스: [HeaderSearchBar](../../apps/web/src/components/layout/Header/HeaderSearchBar.tsx),
[SearchBox/Input](../../apps/web/src/components/feature/SearchBox/Input.tsx),
[SeminarSearchBar](../../apps/web/src/routes/$locale/community/seminar/-components/SeminarSearchBar.tsx).

DS-011 프로덕션 프론트와 기존 로컬 실 API에서 한국어 헤더 1280px,
공지·세미나 검색 각각 1280·390px의 입력에 키보드 초점을 주고 전후를 비교했다.
제안 이미지는 같은 DOM의 바 외곽선만 임시로 지정한 캡처이며 앱 초점 규칙을 구현한 결과가 아니다.
스크린샷 기본 설정은 캐럿을 숨기므로, 변경 전 이미지가 비어 보이는 것을 실제 초점 표시가 전혀 없다는 증거로 사용하지 않는다.
이 캡처는 추가 외곽선의 모양 비교이며 캐럿의 접근성 판정 자료가 아니다.
5장면 모두 전후 바 크기가 같았다. [원자료](search-focus-comparison/measurements.json).
오류 견본은 Form.Action의 글자색·크기를 참고한 HTML이며 실제 검증 흐름의 캡처가 아니다.
오류 값은 [기존 앱 CSS 측정](link-comparison/measurements.json)의 errorColor에서 확인했다.

승인 후 공유 사용처·언어·키보드 이동과 초점 해제 상태를 실제 앱에서 확인한다.
기본 입력 테두리·나머지 컨트롤 상태는 후속 비교에 남긴다. 전체 회귀와 접근성 검증을 대체하지 않는다.

## 이번 판단

**오류는 밝은 바탕에서 기존 빨강을 유지하고, 검색 입력에는 이 초점 외곽선을 적용할까?**
색을 늘리기보다 이미 정한 중립색과 흰색으로 현재 조작 위치를 드러내는 안이다.

## 비교 문서 확인

Playwright 1.57.0 Linux Chromium에서 1280·390px 문서를 확인했다.
10개 이미지 전환·로딩, 밝은/어두운 견본의 Tab 초점, 버튼으로 이동할 때 바 외곽선 해제,
초점 전후 크기 유지와 문서 링크를 확인했다. 문서의 가로 넘침은 없었다.
이는 HTML 견본 확인이며 검색 초점의 앱 적용 확인은 아니다.
