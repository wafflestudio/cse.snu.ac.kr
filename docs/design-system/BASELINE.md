# 변경 전 기준 화면

[진행 현황](PLAN.md) · [화면 지도](INVENTORY.md)

## 자료의 성격

이 자료는 디자인 변경 전의 관찰 기록이다. 보기 좋은 모양으로 승인한 디자인이나, 모든 화면이
정상이라는 보증이 아니다. 앱 소스 기준은 `d1baf83c`이며 조사 시작 HEAD는 `da082c44`다.
앱의 스타일·레이아웃·문구는 이번 수집에서 변경하지 않았다.

기존 E2E 기준 PNG 116장과 추가 조사 캡처를 함께 사용한다. 기존 파일은 `e2e/tests`에 있고,
추가 캡처 41장은 [전체 캡처 목록](baseline/README.md)에 있다. 같은 이름의 JSON에 경로, 상태, 뷰포트, 문서 크기,
보이는 제목·달력 날짜를 기록한다. 언어는 URL과 캡처 이름으로 구분한다.

## 재현 환경과 명령

- 수집일: 2026-09-22.
- 브라우저: 저장소에 고정된 Playwright 1.57.0 Chromium, Linux 컨테이너.
- 앱: 현재 소스의 프로덕션 빌드, 컨테이너 안 `localhost:3000`.
- API: 같은 소스의 로컬 Docker API. 기존 시더로 DB를 초기화한다.
- 추가 캡처: DPR 1, 높이 844px, 시간대 `Asia/Seoul`, 폭 360·390·639·640·768·1023·1024·1280·1920px.
- 예약 화면은 `selectedDate=2024-03-15`. 편집 폼의 브라우저 현재 시각은 2026-09-22 12:00 KST로 고정한다.
- 캡처 전에 웹폰트와 이미지 디코딩을 기다린다. CSS 애니메이션은 캡처에서 비활성화한다.
- 조회수와 메인 뉴스 이미지는 기존 테스트처럼 마스크 처리한다. 자홍색은 디자인 색상이 아니다.

```sh
# 기존 한국어 데스크톱·모바일 기준과 비교
pnpm e2e --project=read --project=read-mobile

# 조사용 추가 캡처를 다시 수집 — 기존 E2E 기준 이미지는 변경하지 않음
pnpm e2e --config design-survey.config.ts
```

두 명령 모두 기존 E2E 실행 규칙대로 **로컬 테스트 DB를 초기화**한다. 동시에 실행하지 않는다.
추가 캡처는 [전용 설정](../../e2e/design-survey.config.ts)과
[수집 스크립트](../../e2e/design-survey/capture.spec.ts)로 재현한다. 기본 CI 테스트 목록에 추가하지 않았다.
기준을 다시 수집할 때는 원본 커밋과 새 커밋을 구분해 기록한다.

긴 본문은 로컬 API로 생성한 조사 전용 공지다. 캡처 후 삭제한다. 실제 `HTMLViewer`를 통과하며,
운영 콘텐츠를 가져오거나 DOM에 가짜 본문을 주입하지 않는다. 편집 폼의 입력·첨부는 저장하지 않는다.

이미지는 전체 문서 캡처다. 가로로 넘치는 페이지의 PNG는 뷰포트보다 넓다. 예를 들어 768px에서
문서가 1200px이면 PNG도 1200px이다. 이미지 폭만 보고 1200px 화면에서 찍었다고 판단하지 않는다.
모달의 고정 오버레이는 실제 뷰포트 높이까지만 표시된다. 전체 문서 PNG의 아래쪽 배경이 밝은 것은
이 캡처 방식의 특성이므로 오버레이 결함으로 해석하지 않는다.

## 확보한 대표 자료

| 묶음 | 추가 자료 | 볼 지점 |
| --- | --- | --- |
| 메인·카테고리 | [메인 영어 390](baseline/main-en-390.png), [학사 영어 390](baseline/category-en-390.png), [768](baseline/category-en-768.png), [1920](baseline/category-en-1920.png) | 어두운 면, 그래픽, 카드, 긴 영문 |
| 본문·선택형·인물 | [인사말](baseline/prose-en-390.png), [연구 스트림](baseline/selection-en-390.png), [교수 목록](baseline/people-en-390.png) | 페이지 제목, 본문, 선택 모양, 프로필 |
| 학사·복합 소개 | [교과목 영어](baseline/courses-en-390.png), [카드형](baseline/courses-card-ko-1280.png), [상세 모달](baseline/course-dialog-ko-390.png), [연도별](baseline/timeline-en-390.png), [진로](baseline/careers-en-768.png) | 표·카드·모달, 정보 밀도 |
| 모바일 탐색·빈 상태 | [메뉴 열림](baseline/navigation-open-ko-390.png), [검색 결과 없음](baseline/search-empty-en-390.png) | 내비게이션 상태, 피드백 표현 |
| 예약 | [639](baseline/reservation-ko-639.png), [640](baseline/reservation-ko-640.png), [날짜 이동 후](baseline/reservation-next-ko-640.png), [추가 모달](baseline/reservation-add-ko-390.png) | 반응형 전환과 클릭 후 표시 |
| 공지 편집 | [기본](baseline/notice-editor-ko-390.png), [필수 오류](baseline/notice-errors-ko-390.png), [입력·첨부·만료일](baseline/notice-filled-ko-390.png) | 기본·오류·입력 상태 |
| 한영 편집·관리 | [교수 영어 입력](baseline/faculty-editor-en-390.png), [슬라이드](baseline/admin-slide-ko-1280.png), [중요 안내](baseline/admin-important-ko-1280.png), [이미지 팝업 관리](baseline/admin-imageModal-ko-1280.png) | 반복 입력과 관리 패턴 |
| 긴 콘텐츠 | [360](baseline/long-notice-ko-360.png), [768](baseline/long-notice-ko-768.png), [1280](baseline/long-notice-ko-1280.png) | 긴 한영 제목, 6문단, 목록, 표, 링크 |

## 실제 렌더에서 확인한 관찰

**관찰과 수정 결정은 다르다.** 아래는 1-3·1-4에서 원인과 사용 맥락을 더 조사할 항목이다.

| ID | 관찰과 근거 | 연결할 검토 |
| --- | --- | --- |
| B-01 | 640·768·1023·1024px 표본에서 문서 폭이 1200px이었다. [루트](../../apps/web/src/routes/__root.tsx)의 `sm:min-w-[1200px]`와 일치한다. | 중간 폭의 가로 스크롤을 허용할지, 어떤 배치를 전환할지 |
| B-02 | 영어 모바일 표본의 문서 폭이 436px이었다. 캡처에서 푸터의 긴 링크가 오른쪽으로 넘친다. [Footer](../../apps/web/src/components/layout/Footer/index.tsx)의 `whitespace-nowrap`가 원인 후보다. | 긴 영문과 공용 셸의 줄바꿈 |
| B-03 | 교수 편집은 390px에서 문서 폭이 692px이다. 전화·팩스, 반복 입력이 오른쪽으로 나간다. [FacultyEditor](../../apps/web/src/routes/$locale/people/-components/FacultyEditor.tsx)의 고정 폭 구간과 연결된다. | 폼 배치와 모바일 사용 범위 |
| B-04 | 예약의 639px 표본은 3일 표시·3일 이동, 640·1023·1024px 표본은 7일 표시·7일 이동이었다. JSON의 URL과 보이는 날짜를 함께 확인했다. | Q-01의 과거 브랜치 문제를 새 출발점의 문제로 간주하지 않기. 다른 전환도 별도 조사 |
| B-05 | 공지 필수 오류가 각 입력칸 옆이 아닌 폼 맨 아래의 행동 버튼 옆에 모인다. | 긴 폼에서 오류 발견·이동·초점 기준 |
| B-06 | 교과목 상세·카드에는 시드의 `<p>…</p>`가 글자로 보인다. 영어 페이지의 일부 정렬 버튼·본문에는 한국어가 남는다. | 데이터 계약·번역 연결과 디자인 문제를 구분. 이 표본만 보고 본문 타이포를 결정하지 않기 |
| B-07 | 공지 편집의 빈 폼은 390px에 맞지만 첨부를 넣으면 문서 폭이 542px이 된다. [Form.File](../../apps/web/src/components/form/File.tsx)의 첨부 행은 `w-[520px]`다. | 기본 모양뿐 아니라 값이 들어간 상태에서 폼 폭 검토 |

긴 공지 360px 표본의 문서 폭은 360px이며 제목과 본문·표가 줄바꿈됐다. 이 한 표본으로 모든
본문 서식이나 표의 반응형 적합성이 검증된 것은 아니다. 예약 추가 모달의 입력 폭 등은
관련 폼을 조사할 때 내부 스크롤과 잘림을 별도로 확인한다.

## 기존 시각 회귀 실행 결과

136개 실행: **131개 첫 시도 통과, 2개 재시도 후 통과, 3개 실패**. 전체 통과로 처리하지 않는다.
추가 캡처의 생성 성공과 기존 기준의 픽셀 일치는 별개의 결과다.

추가 수집은 4개 묶음 모두 실행에 성공했다. 이미지 확인 중 첨부 파일 입력 대상이 에디터 내부의
파일 입력으로 잡힌 것을 발견해 수집 코드를 수정했고, 관리·편집 묶음을 재실행해 실제 첨부 행을
확인했다. 보존한 41장은 수정된 캡처를 포함한다.

| 화면 | 결과 | 보존한 차이 이미지 |
| --- | --- | --- |
| 새 소식 목록 · 데스크톱 | 실패 | [diff](baseline/regression/news-list-desktop-diff.png) |
| 새 소식 목록 · 모바일 | 실패 | [diff](baseline/regression/news-list-mobile-diff.png) |
| 공지 목록 · 모바일 | 실패 | [diff](baseline/regression/notice-list-mobile-diff.png) |
| 새 소식 상세 · 데스크톱 | 재시도 후 통과 | [첫 실패 diff](baseline/regression/news-detail-desktop-diff.png) |
| 공지 상세 · 데스크톱 | 재시도 후 통과 | [첫 실패 diff](baseline/regression/notice-detail-desktop-diff.png) |

직접 확인한 차이는 조회수 마스크 경계와 인접한 날짜 위치에 집중된다. 두 상세의 첫 실패는 각각
30픽셀 차이였다. 조회수를 올리는 상세 방문과 목록 캡처의 병렬 실행, 숫자별 글자 폭이 영향을
줄 가능성이 있지만 아직 분리 재현으로 원인을 확정하지 않았다. 데이터/마스크의 재현성 문제와
앱 디자인 변경을 구분해 후속 조사한다. 기존 기준을 덮어쓰거나 허용 오차를 늘리지 않았다.

## 아직 이 자료로 판단할 수 없는 것

- 빈약한 시드가 남아 있다. 실제 인물 사진, 많은 교수·교과목, 풍부한 연구실 설명·첨부는 별도 표본이 필요하다.
- 태그 제안의 처리 중·성공·실패, 업로드·저장 실패, 서버 오류는 이번 수집의 완료 범위가 아니다.
- 예약 블록·정기 예약·예약 상세, 메인 이미지 팝업, 교과목 추가 등은 관련 패턴을 검토할 때 보충한다.
- 그림으로 초점 순서·키보드 조작·스크린리더 동작을 검증했다고 판단하지 않는다.
- 영어 URL에서도 한국어 시드가 보이는 도메인이 있다. 번역 데이터/연결 상태와 배치 문제를 구분해야 한다.

이 누락은 1-3의 사용 맥락 조사와 이후 해당 컴포넌트 검토에 연결한다. 모든 상태 조합을 미리
촬영하는 대신, 대표 화면으로 출발점을 확보하고 실제 결정에 필요한 예외를 보충한다.
