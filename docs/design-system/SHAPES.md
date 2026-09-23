# 모서리·크기·그림자 — 3-6 소스 조사

[누적 DS](index.html) · [배치·간격](LAYOUT.md) · [진행 현황](PLAN.md)

## 상태와 조사 범위

2026-09-24 현재 프론트 소스를 대조했다. **기존 구현의 역할과 예외를 기록한 조사이며, 새 형태 규칙 승인·앱 변경·렌더 검증 완료를 뜻하지 않는다.**
DS-016에 따라 명확한 문제가 확인되기 전에는 기존값을 유지한다. 크기·반경이 다르다는 사실만으로 모두 같은 값으로 바꾸지 않는다.

| 구분 | 현재 상태 |
| --- | --- |
| 확정된 판단 기준 | DS-001 정체성 보존, DS-003 공개 모바일·관리 데스크톱, DS-016 근거 없는 변경 금지 |
| 이미 적용된 관련 규칙 | DS-018 검색 조작 영역, DS-019 교과목 화살표 표시, DS-020 공통 초점. 각 결정의 검증 범위는 원문을 따름 |
| 이번에 확인한 것 | 아래 모서리·크기·그림자의 소스 선언, 사용처와 로컬 변형 |
| 미확정 | 새 의미 토큰 이름·추가 여부, 모달별 크기 정책, 컴포넌트 전체 상태의 규칙 |
| 렌더 미검증 | 이번 조사에서 새 스크린샷·계산 스타일·조작 영역 측정은 수행하지 않음. 기존 기록이 있어도 이번 표 전체를 검증한 것으로 확대하지 않음 |

공용 `ui`·`form`, 페이지 전용 카드·이미지·모달·검색·선택 패턴을 포함했다. SunEditor 내부·CSP·에디터 서체 차이·Sonner는 제외한다.
`ui`와 `form`은 독립 구현을 유지한다. 이 조사는 Button API 확장이나 두 구현의 통합을 제안하지 않는다.

## 토큰의 실제 출처

[`app.css`](../../apps/web/src/app.css)는 Tailwind `theme.css`를 가져오며, 자체 `@theme`에는 모서리·그림자·간격 단위 재정의가 없다.
설치된 `apps/web/node_modules/tailwindcss/theme.css` 기준으로 `--spacing: .25rem`, `--radius-xs: .125rem`, `sm: .25rem`, `md: .375rem`, `lg: .5rem`, `xl: .75rem`, `2xl: 1rem`이다.
아래 px 환산은 기본 1rem=16px 전제의 **선언값**이며 브라우저에서 실측한 치수가 아니다.

현재 구성은 Tailwind 기본 토큰과 로컬 임의값·CSS 모듈을 함께 쓴다. 모든 기본 토큰을 사이트의 승인된 크기 스케일로 선언하거나, 모든 로컬 값을 전역 토큰으로 승격할 근거는 아직 없다.
기존 CSS와 픽셀이 같은 토큰화는 기술적으로 가능하지만 재사용 이유가 있을 때만 한다. `.62/.625rem`·기타 미세 보정과 `#202020`은 별도 합의 없이 정규화하지 않는다.

## 모서리 — 역할별 기존 기준

| 역할 | 선언값 | 실제 소유·사용처 | 해석·예외 |
| --- | --- | --- | --- |
| 실행 버튼·교수 정렬 선택 | `.0625rem` = 1px | [Button](../../apps/web/src/components/ui/Button.tsx)의 primary·neutral·secondary, [교수 정렬](../../apps/web/src/routes/$locale/people/faculty/index.tsx) | 거의 각진 실행·선택 형태. quiet·nav는 바탕·반경을 따로 주지 않는 텍스트형 |
| 헤더 검색 | 1px | [HeaderSearchBar](../../apps/web/src/components/layout/Header/HeaderSearchBar.tsx) | 어두운 헤더 안 중립색 검색 바탕. 본문 검색과 같은 반경이라고 가정하지 않음 |
| 기본 텍스트 입력 | `rounded-xs` = 2px | [Text](../../apps/web/src/components/form/Text.tsx), [TextArea](../../apps/web/src/components/form/TextArea.tsx), 관리 숫자 입력 | 라인 입력 경계. DS-012의 추가 초점 외곽선 제거는 유지 |
| 드롭다운 | ui 트리거 2px / form 트리거 4px / 목록 아래 4px | [ui/Dropdown](../../apps/web/src/components/ui/Dropdown.tsx), [form/Dropdown](../../apps/web/src/components/form/Dropdown.tsx) | form은 펼침 시 위쪽만 둥글게 함. 서로 다른 구현의 값 차이만으로 통합하지 않음 |
| 파일·이미지·날짜·입력 보조 | `rounded-sm` = 4px | [File](../../apps/web/src/components/form/File.tsx), [Image](../../apps/web/src/components/form/Image.tsx), [DatePicker](../../apps/web/src/components/form/DatePicker.tsx), [TextList](../../apps/web/src/components/form/TextList.tsx) | 버튼·미리보기·묶음 상자가 포함된 보조 입력 패턴 |
| 본문 검색·첨부·연혁 패널 | 4px | [SearchBox](../../apps/web/src/components/feature/SearchBox/index.tsx), [Attachments](../../apps/web/src/components/ui/Attachments.tsx), [TimelineViewer](../../apps/web/src/routes/$locale/academics/-components/timeline/TimelineViewer.tsx) | 패널·묶음 경계. 세미나 검색도 4px이며 헤더 검색과 구분 |
| 분류 태그 | `1.875rem` = 30px 반경 / 높이 26px | [Tag](../../apps/web/src/components/ui/Tag.tsx), [CourseCard](../../apps/web/src/routes/$locale/academics/-components/courses/CourseCard.tsx) | 실제 모양은 양끝이 둥근 pill. 반경 30px를 버튼 높이로 혼동하지 않음 |
| 날짜 팝오버·날짜 셀 | `.125rem` = 2px | [calendar.css](../../apps/web/src/components/ui/calendar.css) | 날짜 선택 표의 경계. 날짜 트리거 4px와 역할이 다름 |
| 교과목 카드 면 | `.25rem` = 4px | [courses/style.module.css](../../apps/web/src/routes/$locale/academics/-components/courses/style.module.css) | 뒤집히는 카드 앞·뒷면 공유 |
| 종이 접힘 | 바탕 2px, 접힌 끝 2px; 펼침 애니메이션 정의 4px | [CornerFoldedRectangle](../../apps/web/src/components/ui/CornerFoldedRectangle/style.module.css) | 직사각형과 삼각형의 접합. 숫자만 묶어 단일 모서리로 바꾸지 않음 |
| 내용·확인 모달 | 별도 radius 없음 | [Dialog](../../apps/web/src/components/ui/Dialog.tsx), [AlertDialog](../../apps/web/src/components/ui/AlertDialog.tsx) | 각진 화면 상자. 이벤트 모달 4px는 별도 패턴 |
| 이벤트 이미지 모달 | 4px | [ImageModal](../../apps/web/src/components/ui/ImageModal.tsx) | 이미지·하단 행동을 함께 잘라내는 컨테이너 |
| 페이지 고유 예외 | 시설 편집 URL 입력 6px, 지도 8px, CSEREAL 멤버 묶음 12px | [시설 편집](../../apps/web/src/routes/$locale/about/facilities/edit.tsx), [KakaoMap](../../apps/web/src/routes/$locale/about/directions/-components/KakaoMap.tsx), [Footer](../../apps/web/src/components/layout/Footer/index.tsx) | 빈도가 적거나 커 보인다는 이유만으로 변경하지 않음. 동일 역할의 정합성 판단은 실제 나란한 배치에서 확인 |
| 원형·완전 둥근 장식 | `rounded-full`, 스크롤 손잡이 9999px | Radio, Nodes, 연혁 점, 캐러셀 진행 막대, 스크롤바 | 선택점·선 연결·진행 표시. 사각 컨트롤 반경 스케일과 분리 |

## 크기 — 고정 높이와 내용 기반 크기의 구분

| 역할 | 현재 선언·소유 | 사용 기준과 검증 경계 |
| --- | --- | --- |
| Button | xs: 세로·가로 패딩 0 / sm: 가로 10·세로 4px / md: 가로 14·세로 5px·행간 24px / lg: 가로 16·세로 8px | 고정 높이 API가 아님. md 바탕형은 한 줄 기준 34px, 1px 경계가 있는 secondary는 36px의 계산 구조. 실제 높이는 내용·행간·경계에 따라 달라짐. quiet/nav는 크기별 글자만 바뀌며 패딩 없음 |
| Text·TextArea | 기본 높이 32·80px | 사용처가 `className`으로 변형. 예약은 Text 28px·TextArea 56px를 지정하므로 전체 입력을 32px로 통일하면 기존 밀도가 바뀜 |
| 파일·이미지 선택 | 파일 높이 32px / 이미지 높이 30px | 같은 폼 보조 컨트롤이지만 현재 값 유지. 실제 문제 없이 2px 차이만 제거하지 않음 |
| 날짜·시간 선택 | 기본 트리거·시간 입력 30px, 예약 날짜 트리거 28px | 입력 묶음의 높이 변형. `.62/.625rem` 가로 패딩 조정과 분리해서 판단 |
| 드롭다운 | 기본 세로 5px 패딩·내용 기반, 사용처 `height` 가능 / 옵션 28px / 목록 최대 168px | 목록 길이는 내부 스크롤. ui/form의 독립 구현과 상태별 모서리를 유지 |
| 검색 | 헤더·본문·세미나 검색 바탕 30px | 바탕 높이와 아이콘 그림·클릭 영역은 다름. 검색 클릭 영역은 [DS-018](ICON-TARGETS.md) 결정 및 실측을 따름 |
| 체크·라디오 | 체크 그림 18px·라벨 행 20px / 라디오 입력 14px | 그림만으로 전체 클릭 영역 적합성을 판단하지 않음. 체크 라벨·간격·초점은 4단계에서 확인 |
| 달력 | 날짜 셀 32px / 날짜 버튼 30px / 탐색 버튼 28px | 예약 주간 표와 별개인 날짜 선택 팝오버. 라이브러리에 전달한 사이트 CSS 변수를 기록 |
| 내용 Dialog | 모바일 너비 90vw, 640px부터 auto, 최대 768px·최대 높이 90vh·내부 overflow auto·패딩 24px | 예약·교과목 등의 실제 자식 폭과 함께 봐야 함. Q-10 모바일 예약 넘침은 이 선언만으로 해결했다고 판단하지 않음 |
| 확인 AlertDialog | 최대 32rem, 가로 40·세로 24px 패딩 | 내용 Dialog와 사용 목적이 다름. 현재 별도 최대 높이·내부 스크롤 선언 없음. 긴 내용·작은 화면 적합성은 렌더 미검증 |
| 이벤트 ImageModal | 너비 90vw·최대 320px·최대 70vh; 640px부터 최대 400px·90vh | 이미지와 행동 버튼을 담는 독립 패턴. 모달 명칭만 같다고 768px로 통일하지 않음 |
| 콘텐츠 카드·그림 | 교과목 면 높이 176px; 메인 뉴스 높이 304px·폭 13.8rem; 인물 격자 이미지 144×192px | 콘텐츠 분량·캐러셀·인물 비율에 따른 페이지 패턴. 공용 컨트롤 크기 스케일에 포함하지 않음 |

크기 출처는 위 컴포넌트와 [AddReservationModal](../../apps/web/src/routes/$locale/reservations/-components/ReservationCalendar/AddReservationModal.tsx), [메인 NewsCard](../../apps/web/src/routes/$locale/-components/news/NewsCard.tsx), [메인 카드 상수](../../apps/web/src/routes/$locale/-components/news/constants.ts), [PeopleGrid](../../apps/web/src/routes/$locale/people/-components/PeopleGrid.tsx)다.
`max-*`는 고정 실측치가 아니다. 표를 그대로 재현한 테스트 대신 실제 긴 문구·펼침·초점·스크롤에서 읽고 조작할 수 있는지를 확인한다.

## 그림자 — 깊이·장식·상태 표시를 구분

| 역할 | 기존 값 | 소유·설명 |
| --- | --- | --- |
| 날짜 선택 팝오버 | `0 1px 2px 0 rgb(0 0 0 / .05)` | calendar.css의 얕은 바탕 분리 |
| 확인 모달 | Tailwind `shadow-lg`: `0 10px 15px -3px .../.1, 0 4px 6px -4px .../.1` | AlertDialog. 내용 Dialog에는 같은 그림자 선언이 없음. 불일치로 단정하지 않음 |
| 이벤트 이미지 모달 | `0 4px 20px 0 rgba(0,0,0,.15)` | ImageModal의 이미지 상자 외곽 |
| 인물 사진 | `drop-shadow(0 0 4px rgba(0,0,0,.15))` | [PeopleProfileImage](../../apps/web/src/routes/$locale/people/-components/PeopleProfileImage.tsx), PeopleGrid, [검색 프로필](../../apps/web/src/routes/$locale/search/style.module.css). box-shadow와 달리 렌더된 형상에 적용 |
| 메인 뉴스 카드 | `0 0 31.9px 0 rgba(0,0,0,.07)` | NewsCard의 넓고 옅은 외곽. 31.9를 임의로 32로 반올림하지 않음 |
| 교과목 카드 앞·뒷면 | 앞: 흰색 `2 2 4 / .05` + 검정 `-2 -2 6 / .05`, 뒤: 흰색 `2 2 4 / .07` + 검정 `-2 -2 4 / .05`, 모두 inset | CourseCard의 면 안쪽 표현. 외곽 깊이 단계와 구분 |
| 고정 종이 접힘 | `drop-shadow(1px 2px 2px rgba(0,0,0,.25/.3))` | 연구실 담당 교수 카드 large/light(접힘 40px), 선택형 small/medium(접힘 20px). 바탕 전체가 아닌 접힌 삼각형에 적용 |
| 접힘 애니메이션 | folding `.2`, unfolding `.3`의 같은 1/2/2px drop-shadow | 실제 SelectionList는 folding 사용. unfolding은 정의만 발견되며 이번 소스 검색에서 호출은 없음. 애니메이션 분기는 고정 shadow prop 맵과 별도 CSS를 사용 |
| 선택 라디오 경계 | `0 0 0 1.3px #ff6914` | Radio의 checked 외곽. 높이·깊이 표현이 아니므로 일반 그림자 토큰에 통합하지 않음 |
| 밝고 어두운 경계 위 초점 | `0 0 0 2px white` + 2px outline/2px offset | app.css의 `focus-ring-boundary`, **DS-020 확정·대표 적용**. 장식 그림자와 구분하며 입력에 재도입하지 않음 |

모달의 50% 검정 overlay와 2px backdrop blur(Dialog·AlertDialog)는 배경 분리 방식이며 그림자 단계가 아니다. 이벤트 ImageModal의 overlay에는 blur 선언이 없다.

## 다음 비교 필요 여부와 대표 렌더 범위

**소스 조사만으로 새 A/B 비교가 꼭 필요한 후보는 확인하지 못했다.** 반경 1/2/4px, 입력 28/30/32px, 모달별 그림자의 차이는 현재 역할과 로컬 변형으로 설명할 수 있다.
기존의 모바일 예약 모달 넘침 Q-10은 실제 관찰이 있는 후속 검증 대상이다. 모달 폭·내부 고정 필드·스크롤의 책임을 실측한 뒤 표시 변경 범위가 명확해질 때 비교를 준비한다. 이번 조사에서 해결·재현 여부를 새로 확정하지 않았다.

대표 검증은 다음 묶음으로 제한한다. 모든 선언마다 스크린샷을 만들 필요는 없다.

1. **공개 선택·카드:** 한·영 390/1024/1280px에서 검색·태그·선택형 기본/호버/초점, 1024px 이상 교과목 앞·뒷면과 이동 버튼. 기존 DS-018~020 자료는 재활용하고 빠진 상태만 추가한다.
2. **공개 모달·팝오버:** 한·영 390/768/1280px의 예약 추가·교과목 상세, 날짜 팝오버 펼침. 상자 폭·자식 넘침·세로 스크롤·닫기/주요 행동 접근을 함께 확인한다. 예약은 Q-10을 우선한다.
3. **편집·확인:** 1280/1440px의 공지 또는 교수 편집에서 Text·TextArea·Dropdown·날짜·파일·저장/취소를 한 화면에서 확인한다. 취소 확인을 열어 긴 안내/초점/버튼 배치를 보되 저장·삭제 로직은 변경하지 않는다. 기존 데스크톱 조사와 중복 캡처를 피한다.
4. **고유 시각 표본:** 메인 뉴스, 인물 사진, 연구실 종이 접힘, 이벤트 이미지 모달 각각 한 표본. 모달 데이터가 없으면 미검증으로 남긴다. 접힘은 기본/호버, 이미지 모달은 짧고 긴 세로 이미지에서 확인한다.

기본 상태의 렌더 확인이 끝나더라도 필수·오류·비활성·처리 중·이름·키보드 조작 전체를 완료한 것으로 표시하지 않는다. 복합 상태는 4단계와 연결한다.

## 기존 검증 재사용과 우선 확인

위 대표 범위를 처음부터 다시 캡처하지 않는다. 기존 결과로 기본 형태를 확인하고, 이번 소스 조사에서 확인하지 못한 모달 상태에만 추가 실행을 집중한다.
다음은 **기존 자료의 재사용 범위**이며, 과거 이미지의 모든 스타일이 현재 코드와 일치한다는 선언은 아니다. 이번 추가 조사에서 브라우저·Docker·서버를 실행하지 않았다.

| 재사용 대상 | 기존 근거 | 재사용할 수 있는 사실과 한계 |
| --- | --- | --- |
| 검색의 바탕·조작 영역, 태그·페이지 이동·달력 이동 | [DS-018 실제 적용](icon-target-implementation/measurements.json), [32개 상태](icon-remaining-audit/measurements.json) | 한·영 작은 화면/데스크톱의 조작 영역과 간격·초점 표본을 확인함. 바탕과 태그의 기본 형태를 다시 캡처할 필요 없음. 공용 폼 전체 상태로 확대하지 않음 |
| 교과목 카드 기본 면·화살표, 교수 정렬, 헤더 초점 경계 | [DS-019 실제 적용](course-focus-implementation/measurements.json), [DS-020 실제 적용](focus-system-implementation/measurements.json), [DS-023](middle-width-implementation/measurements.json) | 카드 기본 면과 대표 초점 2px/2px·흰 경계 그림자의 적용을 재사용. 카드 뒤집힘의 모든 내용·상태 검증은 포함하지 않음 |
| 편집의 Text·TextArea·Dropdown·파일·날짜 트리거·행동 버튼 | [데스크톱 24개 상태](DESKTOP-LAYOUT.md), [측정값](desktop-layout-audit/measurements.json), [공지 입력 견본](desktop-layout-audit/notice-filled-1280.png) | 1200/1280/1440px 기본·입력 상태에서 기존 묶음과 크기를 볼 수 있음. 날짜 팝오버 펼침·취소 확인 모달은 별도이며 기본 폼을 다시 찍지 않음 |
| 내용 Dialog·닫기 | [기존 교과목 상세](baseline/course-dialog-ko-390.png), [닫기 1280/390px 실측](icon-target-audit/measurements.json) | 기존 각진 상자와 24px 닫기 조작을 확인한 자료. 초기 기준은 후속 서체/색 변경 전이므로 최신 픽셀 기준으로 사용하지 않음. 이름 누락 Q-12는 4단계에 남음 |
| 예약 입력과 행동 버튼 | [DS-012 입력 실측](input-focus-removal/measurements.json), [DS-014 행동 실측](action-implementation/measurements.json) | 입력 캐럿과 기본 크기, 행동·비활성 표본이 있음. 390px 제목 폭 352px/목적 폭 295px라는 차이는 Q-10 원인 추정의 직접 근거. 모달 넘침 해결 증거는 아님 |
| 고유 콘텐츠의 기본 모습 | [메인 초기 기준](baseline/main-en-1280.png), [선택형 초기 기준](baseline/selection-en-390.png), DS-023의 메인·교수·연구실 페이지 측정 | 기본 패턴을 설명하는 보조 자료로 재사용. DS-023 페이지 폭 측정은 개별 그림자·호버·모서리 실측이 아니며, 초기 사진은 최신 비교 이미지가 아님. 변경 근거가 없는 장식을 위해 전수 재촬영하지 않음 |

### Q-10 예약 모달: 원인을 좁힌 근거

`AddReservationModal`의 로컬 `Fieldset`은 `fullWidth`가 아닌 네 필드(단체 이름·이메일·전화·지도교수)에 `w-88`을 붙인다. 기본 단위 기준 **352px 고정 너비**다.
공용 `Dialog`는 640px 미만에서 `90vw`이며 예약 사용처는 좌우 패딩 `px-7`(각 28px)을 지정한다. 따라서 390px 화면의 상자는 351px이고 내용 폭은 약 **295px**다.
`Form.Text`의 `w-full`은 이 고정 Fieldset을 채우므로 상자 안쪽 폭보다 **57px 넓다**. `fullWidth`인 목적 필드는 이 제한을 갖지 않는다.
이 계산은 DS-012의 제목 352px·목적 295px 실측과 일치한다. 공용 Dialog의 화면 폭보다 **자식 Fieldset의 고정 폭**을 우선 확인할 근거가 충분하다.

최소 변경 후보는 **예약 전용 Fieldset에 `max-w-full`을 추가해 `w-88 max-w-full`로 두는 것**이다. 여유가 있을 때 352px를 유지하고 작은 화면에서만 부모 폭 이하로 제한하려는 후보이며, 실제 적용·승인안으로 확정하지 않았다.
공용 Dialog의 폭·패딩이나 공용 Text API를 바꾸거나 입력 글자 크기를 줄일 선행 근거는 없다. 데스크톱 `sm:w-auto`의 내용 기반 폭이 그대로인지, 날짜 팝오버의 별도 넘침이 남는지 확인해야 한다.
과거 실측의 입력 높이는 소스의 사용처 높이 클래스와 다를 수 있으므로 위 소스 표의 선언값을 실측값으로 바꾸어 읽지 않는다. 이번 후보는 높이·클래스 우선순위 정리를 포함하지 않는다.

### 추가로 필요한 대표 장면 — 최대 세 개

| 우선순위·장면 | 최소 확인 | 렌더 후에만 판단할 최소 변경 후보 |
| --- | --- | --- |
| 1. 예약 추가 + 날짜 팝오버 | 390px에서 네 필드·목적·버튼 끝의 가로 잘림과 Dialog `clientWidth/scrollWidth`, 날짜 팝오버 펼침. 같은 상태 1280px로 기존 폭 보존 확인. 언어에 따른 문구 차이는 같은 실행에서 확인 | 예약 로컬 Fieldset의 `max-w-full`만 우선 비교. 날짜 팝오버가 넘치면 사용처의 정렬·최대폭 책임을 별도로 측정하고, 공용 모달 전체 변경으로 확대하지 않음 |
| 2. 편집 취소 확인 AlertDialog | 기존 공지 편집 세션 1280px에서 입력 후 취소로 확인창만 열기. 문구·버튼·초점·그림자와 세로 경계 확인. 확인 버튼은 누르지 않아도 됨 | 현재 문제 근거 없음. 잘림이 재현될 때만 Content의 가용 높이·내부 스크롤 제한을 검토하며 반경·그림자 통일은 제안하지 않음 |
| 3. 이벤트 ImageModal | 현재 로컬 데이터로 열 수 있을 때 390/1280px 기본 상자·이미지 스크롤·하단 행동·다시 보지 않기 위치 확인 | 현재 문제 근거 없음. 실제 잘림이 있으면 이미지 영역과 하단 행동의 공간 분배만 검토. 데이터가 없으면 미검증으로 남겨 다음 작업을 막지 않음 |

새 비교가 바로 필요한 유일한 후보는 기존에 넘침이 관찰된 **Q-10의 로컬 너비 제한**이다. 나머지 두 장면은 미검증 상태 확인이며 디자인 변경을 미리 약속하지 않는다.
교과목 뒤집힘·종이 접힘 호버·체크/라디오 전체 상태는 변경 없이 4단계에 연결한다. 이 추가 확인을 이유로 기존 기본 화면 전수 조사나 전체 회귀를 반복하지 않는다.

## 후속 대표 확인 — 2026-09-24

위 소스 조사 후 예약 추가 Q-10을 실제 렌더로 확인했다. [S-Q1 전후 비교](reservation-fit.html)는 한·영 390/1280px와 모바일 날짜 펼침 10상태다. 390px에서 내용 폭295px/고정 필드352px의 넘침이 재현됐고, 로컬 최대폭 제한으로 필드295px·내부 scrollWidth351px가 됐다. 데스크톱 한·영 이미지는 전후 동일했다. **임시 비교이며 앱 미적용**이다.

AlertDialog·ImageModal의 역할별 크기·그림자 차이만으로 새 질문을 만들 근거는 없었다. 예약 상세의 고정 최소폭320px는 관련 소스 후보이며 아직 실제 재현하지 않았다. 초점·닫기 이름·전체 복합 상태는 4단계에 남긴다. 공지 빈 제출 오류 위치도 [검토 묶음](form-modal-review.html)에 함께 준비했다.
