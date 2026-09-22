# 오류 글자 사용 기준 — DS-013 확정

[현재 DS](index.html) · [오류 견본](state-colors.html) · [진행 현황](PLAN.md)

**흰색·neutral-50 바탕의 오류 문장은 기존 red-600을 유지한다.**
검색 외곽선 제안은 DS-012로 철회했고 Text·TextArea에 추가했던 외곽선도 제거했다.

## 현재 문제 → 유지 이유 → 기대 효과

[Form.Action](../../apps/web/src/components/form/Action.tsx)은 오류를 문장으로 나열하고 `text-red-600`을 사용한다.
기존 색 자체의 교체보다 어떤 바탕에서 사용할지를 명시할 필요가 있었다.
CSS 값은 `oklch(57.7% .245 27.325)`이며 Chromium의 sRGB 변환은 약 #e7000b다.
흰색에서 약 4.77:1, neutral-50(#fafafa)에서 4.57:1로
[일반 글자 대비 기준 4.5:1](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)을 넘으므로 이 조합을 유지한다.
기존 인상을 보존하면서 새 화면에서 같은 기준으로 오류 글자색을 선택할 수 있다.

| 역할 | 확정 규칙 | 범위와 예외 |
| --- | --- | --- |
| 밝은 바탕 오류 글자 | 기존 red-600, 오류 설명 문장과 함께 | 흰색·neutral-50. 기존 Form.Action과 일치해 코드 변경 없음 |
| 다른 바탕의 오류 글자 | 미확정 | neutral-100 대비 약 4.38:1. 회색·어두운 면에 자동 확대하지 않음 |
| 위험 행동 버튼 | 별도 검토 | 오류 글자색 결정으로 버튼을 빨갛게 만들지 않음 |

색만 바꿔 오류 의미를 전달하지 않는다. 숫자는 Chromium sRGB 변환값의 계산이며 전체 접근성의 보증이 아니다.
오류 발생·필드 연결·초점 이동 등 검증 로직은 이번 색 결정과 별도다. 에디터·Sonner는 변경하지 않는다.

## 근거와 확인 범위

앱 소스의 red-600 선언과 [앱 CSS 측정](link-comparison/measurements.json)의 errorColor를 대조했다.
HTML 견본은 Form.Action의 글자색·크기를 참고했으며 실제 오류 검증 흐름의 캡처가 아니다.
기존 선언을 유지하므로 이번 결정에 따른 앱 스타일 변경은 없다.

## 검색 초점 제안 — DS-012로 철회한 기록

[당시 비교와 실제 검색 캡처](state-colors.html#archive)는 접힌 기록으로 보존한다. 현재 적용할 규칙이 아니다.
[WCAG 2.4.7 AA](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)는 초점이 보일 것을 요구하며 특정 외곽선을 강제하지 않는다.
[1.4.11 예시](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)처럼 충분히 보이는 캐럿도 초점 표시가 될 수 있다.
2px 외곽선·2px 간격은 당시 디자인 제안이었으며 필수 형태가 아니다.
[2.4.13 AAA](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)의 면적 기준도 특정 형태·간격을 요구하지 않는다.
`outline:none`만으로 현재 입력을 접근성 위반이라고 판정하지 않는다.

당시 HeaderSearchBar, SearchBox/Input, SeminarSearchBar를 로컬 프로덕션 프론트·기존 로컬 API에서 비교했다.
한국어 헤더 1280px, 공지·세미나 검색 각각 1280·390px의 5장면이며 전후 바 크기는 같았다.
[원자료](search-focus-comparison/measurements.json). 캡처의 기본 설정은 캐럿을 숨기므로 기존 이미지가 비어 보이는 것을 초점 표시가 전혀 없다는 증거로 사용하지 않는다.
제안은 같은 DOM에 외곽선만 임시 지정한 것으로 앱 구현이 아니며 이후 철회했다.
Text·TextArea의 추가 외곽선 제거는 [DS-012 적용 기록](input-focus-removal/measurements.json)에서 별도로 확인했다.
기본 입력 경계와 다른 컨트롤의 상태 규칙은 남아 있다.
