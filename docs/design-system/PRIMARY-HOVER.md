# 주황 버튼의 호버 — PH-Q1 검토

[비교 견본](primary-hover.html) · [현재 DS](index.html) · [진행 현황](PLAN.md)

**제안 · 앱 미적용.** 기본 주황 `#ff6914`와 흰 글씨는 유지하고, 포인터를 올렸을 때의 바탕색만 비교한다.

## 현재 상태와 변경 이유

공용 [Button](../../apps/web/src/components/ui/Button.tsx)의 `primary`는 `bg-main-orange text-white`이며 별도 호버 배경색이 없다. 기본과 호버 모두 `#ff6914`다.

실제 사용처는 [공지 목록 편집/완료](../../apps/web/src/routes/$locale/community/notice/-components/AdminFeatures.tsx)와 [오류 화면의 행동 버튼](../../apps/web/src/components/ui/ErrorState.tsx)이다. 포인터를 올려도 바탕색이 같아, 버튼 자체의 색으로는 호버 상태를 구분할 수 없다.

[Tag](../../apps/web/src/components/ui/Tag.tsx)의 상호작용 가능한 `solid` 변형에는 이미 `hover:bg-main-orange-dark`가 있다. 새 색을 만들기보다 이 패턴을 재사용해 주황 바탕의 포인터 반응을 맞추는 것을 추천한다.

## 제안

| 상태 | 현재 | 제안 |
| --- | --- | --- |
| 기본 | `main-orange` · `#ff6914` + 흰 글씨 | 그대로 유지 |
| 포인터 호버 | `#ff6914` + 흰 글씨 | 기존 `main-orange-dark` · `#e65817` + 흰 글씨 |
| 포인터 이탈 | `#ff6914` + 흰 글씨 | 기존 기본색으로 복귀 |

버튼의 문구·글자 크기·패딩·모서리·기본 주황·흰 글씨·클릭 동작은 유지한다. 새로운 눌림색이나 비활성색을 정하는 제안이 아니다. 밝은 공지 목록과 어두운 오류 화면에서 같은 호버색을 비교한다.

DS-014는 주요 실행 역할에 짙은 중립색을 적용한 결정이다. **`primary`라는 코드 이름을 이유로 이번 버튼의 기본색을 중립색으로 바꾸는 결정이 아니다.** 이번 질문은 현재 주황 버튼의 호버 한 상태에 한정된다. ImageModal의 별도 주황 버튼도 적용 대상이 아니다.

## 비교 자료와 적용 경계

- 공지 목록: [현재](primary-hover-comparison/notice-before.png) / [호버 제안](primary-hover-comparison/notice-hover-proposal.png).
- 오류 화면: [현재](primary-hover-comparison/error-before.png) / [호버 제안](primary-hover-comparison/error-hover-proposal.png).

제안 이미지는 비교용이며 앱 적용 완료를 뜻하지 않는다. 승인 후 공용 `Button primary`에 기존 호버 토큰을 연결하고, 두 사용처의 기본·호버·이탈과 크기 보존을 확인한다. 클릭을 실행하거나 오류 처리·편집 동작을 바꾸지 않는다.

## 질문 PH-Q1

**호버에 기존 진한 주황 `#e65817`을 연결할까?**

적용을 추천한다. 기본 인상은 유지하면서 포인터 반응을 제공하고, 기존 주황 태그의 호버색을 재사용할 수 있다.
