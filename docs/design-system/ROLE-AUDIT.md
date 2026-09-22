# 역할과 사용 맥락 조사

[진행 현황](PLAN.md) · [화면 지도](INVENTORY.md) · [변경 전 화면](BASELINE.md)

## 이 기록의 범위

1-3의 결과다. **현재 쓰이는 값과 역할을 연결한 관찰표이며 새 디자인 규칙은 아니다.**
앱 소스 기준은 `d1baf83c`, 이번 조사 시작 HEAD는 `4534063a`다. 앱 코드와 이전 기준 이미지는 변경하지 않았다.

- 생성 라우트 트리와 타입 파일을 제외한 TS/TSX 273개에서 문자열·템플릿 조각을 수집했다.
- 공용 UI·폼·페이지 틀, 대표 화면의 전용 구현, 본문/에디터 CSS와 SVG를 직접 읽어 역할을 연결했다.
- 기존 1-2의 화면 자료에 더해 프로덕션 빌드의 21개 요소·상태에서 계산된 CSS, 실제 폰트, 요소 크기를 측정했다.
- 문구는 버튼·안내·오류·확인·결과의 대표 사용처를 조사했다. 모든 번역 키와 운영 본문을 교정한 것은 아니다.

[정적 원자료](measurements/static.json)는 **선언 횟수**다. 선택한 패턴에 맞는 utility 후보만 세며,
반응형·상태 접두사를 다른 후보로 센다. 색 112개, 타이포 71개, 간격 297개라는 후보 수를 실제 색상 수나
필요한 토큰 수로 해석하지 않는다. CSS, SVG, 런타임 조합, 서드파티 규칙은 이 집계와 분리했다.
각 영역 상위 30개에는 출처가 있다. [실측 원자료](measurements/runtime.json)는 특정 시드·환경의 표본이다.

## 색: 값은 있으나 역할의 경계는 더 정해야 한다

현재 [app.css](../../apps/web/src/app.css)에 neutral 계열, 주황 2개, 링크 파랑이 있다.
흔한 선언은 `text-neutral-500` 55회/40파일, `text-main-orange` 28회/23파일이다.
이 빈도만으로 중요도나 적합성을 정하지 않는다.

| 현재 역할 | 값·표현 | 사용처와 관찰 |
| --- | --- | --- |
| 사이트의 어두운 큰 면 | `neutral-900 #171717`, `neutral-850 #1e1e1e` | 일반 제목 영역과 카테고리의 큰 면. [PageLayout](../../apps/web/src/components/layout/PageLayout/index.tsx), [CategoryPage](../../apps/web/src/components/feature/category/CategoryPage.tsx) |
| 모바일 헤더·푸터와 메인 섹션 | `#2D2D30`, `#262728`, `#202020`, `#212121` 등 | 팔레트 밖의 가까운 어두운 값도 존재. 같은 역할인지 확인 후 판단할 대상이지 곧바로 병합할 대상은 아님 |
| 읽기 면·보조 면 | 흰색, `neutral-50 #fafafa`, `75 #f8f8f8`, `100 #f5f5f5` | 본문, 표의 띠, 선택 영역, 입력 주변의 배경. 작성자 HTML의 배경색은 별도 범위 |
| 본문·제목·보조 정보 | `950 #0a0a0a`, `800 #262626`, `700 #404040`, `500 #737373`, `400 #a3a3a3` | 숫자가 같아도 본문·날짜·설명·메뉴 등 맥락이 다름. 작은 글자와 밝은 배경의 조합을 함께 봐야 함 |
| 경계·입력 예시 | `200 #e5e5e5`, `300 #d4d4d4` | 선과 placeholder가 같은 회색 단계에 기대는 사용처가 있음. 선과 읽어야 할 글자는 역할이 다름 |
| 주요 행동·선택·필수·장식 | `main-orange #ff6914` | 추가 버튼, Tag, 선택 카드, 라디오, 필수 별표, Nodes, 메인 그래픽에 함께 사용 |
| 주황의 다른 사용 | `main-orange-dark #e65817` | 메인 공지 필터, 캘린더 강조, Tag의 solid hover. 단순히 모든 주황의 hover 색은 아님 |
| 본문 밖 정보 링크 | `link #3c7be4` | 연락처·홈페이지·세미나 링크. HTMLViewer 속 링크는 서드파티/본문 CSS도 관여하므로 이 토큰 하나가 전부를 통제하지 않음 |
| 오류·비활성 | 오류 `red-600`, 비활성 opacity 30/40/60% 등 | Form.Action의 오류와 각 컨트롤의 비활성. 토스트는 로컬 Sonner 스타일도 별도로 보유 |

텍스트와 배경을 짝지어 계산한 [대비 원자료](measurements/contrast.json):

| 실제 사용 조합 | 대비 | 맥락 |
| --- | ---: | --- |
| 흰 글자 / 주황 `#ff6914` | 2.88:1 | 활성 primary 버튼 14px, 채워진 Tag 13px |
| 주황 / 흰색 | 2.88:1 | outline Tag 13px |
| `neutral-400` / 흰색 | 2.52:1 | 작은 보조 정보 |
| `neutral-300` / 흰색 | 1.48:1 | 입력 예시 글자 |
| `neutral-500` / `neutral-100` | 4.35:1 | 취소 등 secondary 버튼 14px |
| 링크 파랑 / 흰색 | 4.08:1 | 작은 정보 링크 |
| 흰 글자 / `neutral-700` | 10.37:1 | 폼의 게시·저장 버튼 |
| 흰 글자 / `neutral-500` | 4.74:1 | 위 버튼의 hover |

일반 크기 텍스트의 WCAG AA 기준은 4.5:1이며 큰 글자는 3:1이다. 비활성 UI·순수 장식 등에는
예외가 있다. 위 활성 버튼·태그·입력 예시는 작은 텍스트로 검토해야 한다.
[W3C의 대비 기준 설명](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
계산은 불투명한 단색 조합이며, 전체 사이트의 접근성 판정이 아니다. 배경·상태·서체 크기가 다른
사용처까지 이 결과를 확장하지 않는다. **새 색을 정하기 전에 읽기/조작에 쓰는 색과 장식색의 역할을 나눠야 한다.**

## 타이포: 정보 역할과 실제 서체를 함께 봐야 한다

[app.css](../../apps/web/src/app.css)의 명시적 글자 크기는 12·13·14·16·18·22·24·30px이다.
20·24·28·28.8·32·64px 등의 직접 지정도 있다. `text-sm` 84회/61파일, `text-md` 68회/50파일처럼
작은 정보 글자가 널리 쓰인다. 굵기·행간·자간을 떼고 크기만으로 단계 수를 결정하지 않는다.

| 정보 역할 | 현재 크기·굵기·행간 | 출처 또는 실측 |
| --- | --- | --- |
| 카테고리 진입 제목 | 모바일 32 / 데스크톱 64px, 600. 데스크톱 행간 76.8px | CategoryPage / `category-title-desktop` |
| 일반 페이지 제목 | 모바일 24 / 데스크톱 32px. 이번 공지 표본은 700, 행간 28.8 / 38.4px | [PageTitle](../../apps/web/src/components/layout/PageLayout/PageTitle.tsx) / `page-title-*` |
| 게시물 고유 제목 | 이번 공지 모바일 20px, 600, 행간 28px | `post-title`. 페이지의 종류를 나타내는 제목과 구분 |
| 선택된 대상 제목 | 모바일 16 / 데스크톱 24px, 700, `leading-loose` | [SelectionTitle](../../apps/web/src/components/feature/selection/SelectionTitle.tsx) |
| 프로필 이름 | 18px, 700 | [PeopleGrid](../../apps/web/src/routes/$locale/people/-components/PeopleGrid.tsx) |
| 읽는 본문 | 기본 14px, 400, 행간 28px, 문단 양쪽 정렬 | [본문 override](../../apps/web/src/components/ui/assets/suneditor-contents.override.css) / `viewer-body` |
| 폼 라벨·입력 | 라벨 14px/500/16.8px, 입력 13px/400/15.6px | Fieldset·Form.Text / `form-label`, `form-text-default` |
| 행동 버튼·Tag | 기본 md 버튼 14px/500/24px, Tag 13px/500/15.6px | `form-commit`, `primary-action`, `tag-default` |
| 메인 슬로건 | 28.8px/400/34.56px, Gowun Batang | [GraphicSection](../../apps/web/src/routes/$locale/-components/GraphicSection.tsx) / `slogan` |

**실제 서체 차이를 확인했다.** 일반 UI는 웹폰트 `Pretendard Variable`, 슬로건은 `Gowun Batang`이다.
본문 뷰어와 편집기는 `Pretendard`부터 찾는 CSS를 쓰지만 등록된 웹폰트 이름은 `Pretendard Variable`이다.
Linux 컨테이너에서 본문 표본과 한영 편집 표본은 시스템 폰트 **WenQuanYi Zen Hei**로 렌더됐다.
계산된 `font-family`만 읽은 추측이 아니라 Chrome의 실제 사용 폰트 응답으로 확인했다.
다른 OS의 대체 서체는 달라질 수 있다. 기존 스크린샷의 본문 모양을 의도한 Pretendard라고 가정하면 안 된다.

## 배치·간격: 공통 틀과 콘텐츠별 밀도를 구분한다

| 층위 | 현재 사용 맥락과 수치 | 검토할 경계 |
| --- | --- | --- |
| 화면 전체 | 640px부터 데스크톱 구성이 켜지며 루트 최소 폭 1200px. 좌측 내비 자리도 추가됨 | 전환 기준과 최소 지원 폭은 다른 규칙. [B-01](BASELINE.md) 참조 |
| 일반 본문 가로 | 모바일 좌우 20px, 데스크톱 왼쪽 100/오른쪽 360px | 오른쪽 값에는 보조 내비 공간의 의미가 있음. 모든 페이지의 ‘큰 여백’으로 합치지 않기 |
| 일반 본문 세로 | 모바일 위 28/아래 64px, 데스크톱 위 44/아래 150px | PageLayout의 `none/noTop/noBottom`과 내부 섹션의 소유 범위를 함께 기록 |
| 제목·보조 내비 | 제목 상단 54px, 보조 내비 오른쪽 80px·sticky top 52px | [PageTitle](../../apps/web/src/components/layout/PageLayout/PageTitle.tsx), [SubNavbar](../../apps/web/src/components/layout/PageLayout/SubNavbar.tsx). 조합해서 정렬을 만드는 값 |
| 메인·카테고리 | 메인 그래픽 간격 50/75/125px 등, 카테고리는 별도 컨테이너 | 일반 본문보다 큰 표현 영역. 밀도 차이가 곧 불일치라는 뜻은 아님 |
| 폼의 필드 사이 | Fieldset 옵션 10·16·20·24·32·40·44·48px, 라벨 아래 4·8·12px | 공용 옵션은 있으나 필드 역할별 선택 기준은 사용처에 분산 |
| 요소 묶음 안 | 4·8·10·12·16·20px 등의 gap, 선언상 gap-2·gap-3가 자주 등장 | 아이콘+글자, 버튼 묶음, 목록 행을 같은 간격으로 묶을지 따로 판단 |
| 작은 보정 | `.62rem`/`.625rem`, 0.5·2.3·5.1px 등의 기하학 보정 | 비슷한 숫자만으로 병합하지 않기. 본문 간격인지 그림의 접합 보정인지 구분 |

[가로 거터](../../apps/web/src/app.css), [PageLayout](../../apps/web/src/components/layout/PageLayout/index.tsx),
[Fieldset](../../apps/web/src/components/form/Fieldset.tsx), [Nodes](../../apps/web/src/components/ui/Nodes.tsx)가
서로 다른 층위를 소유한다. 교수 폼·첨부 행의 고정 폭은 [B-03·B-07](BASELINE.md)에서 이미 가로 넘침을 확인했다.

## 아이콘·모양·그래픽: 크기뿐 아니라 기능도 기록한다

Lucide의 **런타임 import 이름 24종**과 SVG import 32건을 찾았다. SVG 건수에는 로고·그림·아이콘이
섞여 있고 같은 파일의 중복 import도 포함된다. 아이콘 32종이라는 뜻이 아니다.

| 역할 | 현재 구현 | 조사상 구분 |
| --- | --- | --- |
| 검색·닫기·이동·날짜 | Lucide Search/X/Chevron/Calendar 등. 13·16·18·20·22·24px, stroke 1.5 또는 기본값 | 그림 크기, 선 굵기, 실제 클릭 영역을 각각 기록 |
| 모바일 메뉴 | 열기 SVG 24×24px, 닫기 Lucide X 20×20px | 실제 버튼 크기도 각각 24×24, 20×20이었다. 같은 자리의 두 상태를 함께 검토 |
| 검색 버튼 | 그림 20px + padding으로 버튼 24×24px | [SearchBox/Input](../../apps/web/src/components/feature/SearchBox/Input.tsx). 그림만 재면 클릭 영역을 잘못 평가함 |
| 첨부·교과목 표시 | 클립·삭제·북마크 등 전용 SVG | Lucide로 치환할지는 별도 디자인 판단. 일부는 정보 장식이며 버튼이 아님 |
| 제목·연결 표시 | 10px 원, 직선, 45도 사선, 주황/회색 Nodes | 제목 구분·연결 관계·선택의 시각 표현. 일반 조작 아이콘과 별도 역할 |
| 접힌 모서리 | 선택 목록과 연구실 패널. 20/40px 모서리, drop-shadow | 선택 목록의 ‘선택됨’과 소개 패널의 강조가 같은 모양을 공유 |
| 일반 제어 모양 | 버튼 1px 반경, 입력 2px, Tag 30px 반경의 둥근 형태 | 목적이 다른 모양을 반경 하나로 통일할 근거는 아직 없음 |
| 팝업·피드백 | Dialog의 주황 위쪽 선, AlertDialog의 그림자, 토스트의 자체 스타일 | 모두 오버레이지만 역할·위험도·정보량이 다름 |
| 메인 표현 | Gowun 슬로건, 원·막대, 배경 패턴, 별도 이미지 | 브랜드 표현 후보. 팔레트/공용 버튼과 별도로 보존 범위를 검토 |

200/300ms transition, 모서리 접힘 300/400ms, 캐러셀 관련 700ms 등의 선언이 있다.
`animate-stretch` 같은 사용 클래스와 `@keyframes` 선언을 찾았지만, 모든 애니메이션의 실제 재생을
검증한 것은 아니다. 앱 소유 TSX/CSS에서는 reduced-motion 분기를 찾지 못했으며 서드파티 전체까지
포함한 판정은 아니다. 움직임도 역할·필요성·대체 상태를 정할 대상이다.

## 컨트롤·상태: 공통 이름과 실제 동작을 구분한다

| 패턴 | 현재 연결과 상태 | 확인한 사실 / 남은 확인 |
| --- | --- | --- |
| 주요 행동 | [Button](../../apps/web/src/components/ui/Button.tsx) primary는 추가·예약·재시도, neutral은 폼 저장·게시·확인 | md 실측 높이 34px. 주황이 모든 ‘가장 중요한 행동’을 뜻하는 구조는 아님 |
| 보조 행동 | secondary는 취소·삭제 진입·편집·페이지 이동 등 | md 실측 36px. 같은 md라도 테두리 때문에 primary/neutral과 높이가 다름 |
| 상태 없는 텍스트 행동 | quiet/nav | 헤더·모바일 내비에서 사용. 배경별 기본/hover/초점을 함께 봐야 함 |
| 선택·분류 | 메인 공지 필터와 교수 정렬은 라디오, 교과목 정렬은 Tag, 그룹/센터는 링크+선택 span | 한 가지 시각/의미 체계로 합쳐져 있지 않음. 이동과 값 선택을 구분해 검토 |
| 체크박스 | [ui](../../apps/web/src/components/ui/Checkbox.tsx)/[form](../../apps/web/src/components/form/Checkbox.tsx) 각각 독립 구현, 라벨 높이 20px·아이콘 18px | form은 색 조건에 현재 체크 여부 대신 필드 값 `tags`의 truthiness를 쓰는 부분이 있음. 배열 값 상태의 표시 차이는 추가 재현 필요 |
| 드롭다운 | [ui](../../apps/web/src/components/ui/Dropdown.tsx)/[form](../../apps/web/src/components/form/Dropdown.tsx) 별도 커스텀 구현 | ui에는 화살표·Home/End·Escape·타입 검색 처리가 있음. form은 클릭 중심이고 같은 키 처리 구현이 없음. 정적 관찰이며 모든 키보드 동작을 검증한 것은 아님 |
| 텍스트 입력 | [Form.Text](../../apps/web/src/components/form/Text.tsx) 32px 높이, 13px 글자, 별도 placeholder 색 | 공지 제목 입력의 Tab 초점은 `:focus-visible=true`였으나 outline 0/none, shadow none이며 테두리·배경은 기본과 동일 |
| 날짜·달력 | 날짜 트리거 30px, 캘린더 셀 32px/버튼 30px, 내비 버튼 28px 선언 | 예약 달력과 날짜 picker는 서로 다른 패턴. 선택·비활성·전환을 별도로 검토 |
| 검증·저장 | Form.Action은 필수 오류를 아래 모으고 제출 중 버튼을 비활성화 | 오류 필드 연결, 초점 이동, 처리 중 피드백은 미확인. 실제 API 오류 토스트와 필드 검증은 경로가 다름 |
| 위험 행동 | 삭제 확인과 편집 취소 모두 AlertDialog 사용 | 기본 확인 문구는 ‘확인’, 일부 사용처는 ‘삭제/해제’. 기본 확인 버튼으로 초점을 이동시키는 구현도 함께 검토 |
| 파일·에디터 | 직접 파일 선택, SunEditor, 사이트의 override CSS | 본문 규칙과 편집 도구의 프레임·툴바 규칙을 분리. 라이브러리 내부 수치를 전부 사이트 토큰으로 흡수하지 않기 |

입력칸은 실제 키보드로 초점을 이동해 측정했다. 별도의 시각 표시가 없는 표본은 우선 검토 대상이다.
키보드 사용자가 초점 위치를 볼 수 있어야 한다는 기준은
[W3C Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)을 참고한다.
이 표본은 전체 키보드 동선이나 스크린리더 검증을 대신하지 않는다.

## 문구: 같은 순간에 어떤 말을 쓰는지 조사한다

| 순간 | 현재 예시와 출처 | 다음에 정할 기준 |
| --- | --- | --- |
| 새 항목 시작 | ‘새 게시글’, ‘추가하기’, ‘새 교과목’ | 대상 이름을 드러낼 범위, 추가와 작성의 구분 |
| 입력 안내 | ‘제목을 입력하세요.’, ‘예: 301동 315호’, ‘미입력시 제목과 동일하게 표시됩니다.’ | 라벨·예시·지속 설명의 역할, 선택 필드의 기본 동작 설명 |
| 실행 | ‘게시하기’, ‘저장하기’, ‘등록하기’, ‘확인’ | 실제 결과를 드러내는 동사, 생성과 편집의 구분 |
| 완료 | ‘공지사항을 게시했습니다.’와 ‘추가에 성공했습니다.’가 공존 | 사용자 대상/행동을 명시할지, ‘성공’ 표현의 필요성 |
| 확인 | ‘편집중인 내용이 사라집니다.’, ‘게시물을 삭제하시겠습니까?’, ‘정말 선택된 …’ | 손실·대상·범위, 취소와 확인 버튼의 의미 |
| 오류 | 필드별 필수 문구, API 코드별 한영 사전, 연결 실패 안내 | 사용자가 복구할 방법, 코드·내부 용어의 노출 범위 |
| 처리 중 | 태그 제안의 ‘제안받는 중…’; 일반 저장은 주로 버튼 비활성 | 기다리는 이유와 완료·실패 피드백 |
| 비어 있음 | 검색 결과 없음, 데이터 없음, 권한 제한 | 서로 다른 상태에 같은 문구/그림을 쓰지 않는지 |
| 언어·정체성 | 한영 입력 탭, 영어 탐색 UI, 한국어 슬로건·일부 폼 문구 | 번역 지원 범위와 브랜드 문구의 의도. 운영 콘텐츠 번역 여부와 별도 결정 |

대표 출처: [NoticeEditor](../../apps/web/src/routes/$locale/community/notice/-components/NoticeEditor.tsx),
[공지 작성](../../apps/web/src/routes/$locale/community/notice/create.tsx),
[연도별 생성](../../apps/web/src/routes/$locale/academics/undergraduate/curriculum/create.tsx),
[Form.Action](../../apps/web/src/components/form/Action.tsx),
[API 오류 사전](../../apps/web/src/utils/apiErrors.ts).
문구와 시각언어는 여전히 조사 상태다. 이 기록의 표현을 최종 문구 가이드로 취급하지 않는다.

## 다음 분류에서 사용할 질문

| ID | 이번 조사로 생긴 질문 | 근거 |
| --- | --- | --- |
| R-01 | 주황·회색의 장식 역할을 유지하면서 작은 정보/조작 글자의 대비를 어떻게 확보할까? | 색 역할표·대비 값 |
| R-02 | 본문에서 의도한 서체는 무엇이며, 일반 UI와 같거나 달라야 할 이유는 무엇일까? | 실제 폰트 차이 |
| R-03 | 기본·hover·초점·선택·오류·비활성·처리 중을 어떤 공통 기준으로 다룰까? | 입력 초점, 두 Dropdown, Form.Action |
| R-04 | 읽기·탐색·관리의 밀도 차이 중 유지할 것과 우연한 값 차이를 어떻게 나눌까? | 글자 역할표·간격 층위 |
| R-05 | 기하학적 표시와 접힌 모서리가 장식·관계·선택 중 무엇을 전달해야 할까? | Nodes·SelectionList·연구실 패널 |
| R-06 | 버튼 동사·확인·완료·오류 문구를 어떤 어조와 구조로 맞출까? | 문구 표 |

다음 1-4에서는 이 기록과 B-01~B-07을 **반복 규칙 후보 / 이유를 확인할 차이 / 사용성 문제 /
의도된 예외 후보**로 분류한다. 관찰만으로 기존 차이를 ‘우연’ 또는 ‘의도’라고 단정하지 않는다.
1-5에서 분류 결과와 실제 화면을 함께 검토한 뒤 디자인 방향을 결정한다.

## 재현과 남은 범위

```sh
# 코드 선언과 색 조합 계산. 앱 실행이나 DB 초기화 없음
node e2e/design-survey/scan.mjs

# 브라우저 실측만 실행. 기존 E2E 규칙에 따라 로컬 테스트 DB 초기화
pnpm e2e --config design-survey.config.ts --grep '역할별'
```

[수집 코드](../../e2e/design-survey/scan.mjs) · [브라우저 실측 코드](../../e2e/design-survey/measure.spec.ts).
2026-09-22 최종 실행: 조사용 테스트 1개 통과, 21개 표본 저장. 기존 회귀 테스트 전체를 재실행한 결과는 아니다.
실측은 고정된 Linux Chromium·프로덕션 빌드·DPR 1·Asia/Seoul 환경이다. 시스템 폰트 이름과
소수점 요소 크기는 환경에 따라 달라진다. hover는 실제 `:hover` 여부를 확인하고 요소의 transition이 끝난 상태를 측정한다.

대상 TS/TSX 파일의 정적 수집과 대표 역할 조사는 마쳤지만 모든 요소의 모든 상태를 렌더한 것은 아니다.
기존 [미수집 상태](BASELINE.md)는 계속 남아 있고, 특히 키보드 동선·실패/처리 중·다량 데이터·작성자
HTML 서식·움직임은 해당 규칙을 결정하기 전에 표본을 추가한다. 이전 시각 회귀 3개 실패도 이번에
고치거나 재검증한 것으로 처리하지 않는다.
