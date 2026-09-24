# 전체 읽기 회귀 분류 — 2026-09-24

**최신 상태:** 아래 첫 분류를 바탕으로64개, DS-040/개인정보 모바일 추가 대조 뒤2개, 총66개 기준 이미지를 갱신했다. 재실행 전체140개는132통과·1재시도통과·7실패였고, 마지막2개 갱신 뒤 해당2개를 별도 실행해 통과했다. 남은5개(목록3/본문·마스크 혼합 상세2)는 기준에 흡수하지 않았다. [실행 요약](integration-regression/run-summary.json).

아래는 최초 분류 당시의 기록이다. 그 시점에는 앱 소스·테스트·기준 이미지를 수정하지 않았다. 기존 JSON과 예상/실제/diff PNG를 읽고 검토했다. 아래 후보는 승인된 DS 변경과 이미지 차이의 대응 결과이며, 71건 전체 자동 승인 목록이 아니다.

## 결과와 권장 범위

- 140개: 최초 통과 68, 재시도 통과 1, 최종 실패 71. 최종 실패 원인은 **스크린샷 차이 70 + 브라우저 기동 실패 1**, 기능 assert 실패 0이다.
- 최종 기동 실패인 모바일 개인정보처리방침도 앞선 두 시도에서는 스크린샷 차이였다. 따라서 실패 71개 모두 최소 한 번 시각 차이가 있었으며, 이를 70개의 시각 영향 화면이라고 축소하면 안 된다.
- 기존 3개 목록 차이를 제외한 68개 중 **64개는 승인 DS로 설명되는 갱신 후보**, **모바일 개인정보 1개는 동일하게 설명되나 공식 회귀의 기동 재실행 필요(별도 장면 재실행은 성공)**, **데스크톱 공지·뉴스 상세 2개는 마스크 잡음이 섞여 보류**, **모바일 참가자1개는 기존 제목 넘침 비교를 위해 보류**다.
- 알려진 공개 모바일 시각 한계: 10-10 참가자 412px 폭은 제목 넘침으로 비교 필요. 개인정보 표는 기존 CSS 가로 스크롤 영역이라 캡처상 오른쪽 열이 보이지 않는다. 스크롤로 실제 열을 읽을 수 있는지는 이후 실제320/390px에서 가로 휠로 마지막 열까지 이동함을 확인했다.

## 소스와 이미지 근거

- DS-006: 시작점 d1baf83c 대비 `suneditor-contents.override.css` 변경은 font-family 첫 항목에 `"Pretendard Variable"`을 연결한 것뿐이다. 기본 크기·줄높이·굵기 규칙 변경은 없다. 10-10 세 페이지와 예약 안내·개인정보 라우트 HTML도 시작점과 동일하다.
- 10-10의 기존 `<h2>` 및 `<strong>` 문구가 실제에서는 굵게 표현된다. 새로운 강조 규칙 추가가 아니라 등록된 서체를 쓰면서 기존 작성 스타일이 표현되는 차이로 판단한다. Proposal 제목, Executive Summary 본문·4항목, P1~P5, Part B/C/D, References 모두 예상/실제에 남는다.
- Proposal 높이 desktop +56px/mobile +112px. 예약 안내 desktop -56px/mobile -28px. 개인정보 양쪽 -28px. 본문 줄바꿈 차이이고 상단 틀·사이드 내비는 유지된다. Proposal/개인정보의 이동 보정한 푸터 하단은 정확히 같은 픽셀이다. 예약 안내 모바일도 같다. 예약 안내 desktop은 작은 로고 AA 잔차만 남아 완전 동일이라고 쓰지 않는다.
- 개인정보 actual 문장은 기존처럼 개인정보 수집 동의/동의 외 목적에 활용하지 않음/동의 거부 시 예약 불가 내용을 유지한다. desktop 첫 문단 3→2줄, mobile 5→4줄. 작성자 표의 15·17·19px 크기는 그대로이며 표 내용/열을 삭제하지 않았다. desktop은 마지막 열이 더 잘 보이고 mobile은 가로 스크롤로 나머지 열을 읽는 기존 방식이다.
- DS-011: 명예교수·직원 이메일 밑줄 4개, 찾아오는 길·졸업생 진로의 정보 링크 4개. 후자 4개에는 DS-006 본문 차이도 함께 있다. 본문 차이로만 분류하지 않았다.
- DS-035: 빈 검색 desktop/mobile 2개는 같은 문구의 색만 neutral-300→500. icon/필터/전체 배치/문구는 같다.

## 기존 3개와 새로운 혼합 차이

- 새 소식 목록 desktop: 날짜 및 조회수 마스크 인접 경계 357px. mobile 새 소식/공지 목록: 마스크 오른쪽 1px 경계 각17px. 기존 BASELINE.md의 알려진 차이와 일치하며 DS 변경으로 흡수하지 않는다.
- 추가 단독 실행 `/tmp/cse-read-list-results/read-lists.json`: 같은 DB, globalSetup 없음, workers1/retries0에서 목록4개 중3통과·desktop 새 소식1실패. 기존 모바일2개 차이가 항상 재현되는 제품 변경은 아니라는 근거다. 동시성이 원인이라고 단정하지 않는다.
- desktop 새 소식·공지 상세는 본문 외 조회수 마스크 오른쪽 경계도 함께 변한다. 이미지 전체를 DS-006으로 승인하지 말고 동일 조건 재실행에서 마스크가 일치하는 actual을 얻거나 안정화 문제를 분리해야 한다. 모바일 상세2개는 본문 글리프만 달라 별도 후보이다.

## 브라우저 기동 실패

- SIGSEGV가 나타난 시도: 모바일 학사 index 첫 시도(재시도 통과), 모바일 장학제도 목록 retry1(다음 시도 시각 차이), 모바일 개인정보 retry2(최종 실패).
- 로그에 D-Bus socket 메시지도 있으나 SIGSEGV의 원인으로 입증된 것은 아니다. 브라우저/환경 기동 문제로 분류하며 앱 기능 회귀로 단정하지 않는다.

## 파일별 시각 차이 표

좌표는 원본 이미지 기준 `[x0,y0,x1,y1)`이며 Playwright diff의 빨간 픽셀 경계다. 노란 AA 표시를 포함한 모든 비트 차이 경계는 아니다. 높이가 달라진 화면은 본문 아래 푸터 이동까지 포함한다. 표 파일 경로는 저장소 루트 기준이다. JSON에는 예상·실제·diff 절대 경로와 각 시도 오류가 있다.

| # | 기준 파일 | 예상 → 실제 | 빨간 diff 영역 | 근거/판정 |
| --- | --- | --- | --- | --- |
| 1 | `e2e/tests/10-10-project/read.spec.ts-snapshots/10-10-proposal-ko-read-linux.png` | 1280×2692 → 1280×2748 | `[0, 360, 1220, 2748]` | 갱신 후보. DS-006: 기존 h2/strong 강조가 등록된 서체로 표현됨. 동일 HTML, 줄바꿈으로 높이 56px; 이동량 보정 후 푸터 하단 픽셀 동일  |
| 2 | `e2e/tests/10-10-project/read.spec.ts-snapshots/10-10-manager-ko-read-linux.png` | 1280×1286 → 1280×1286 | `[201, 372, 808, 760]` | 갱신 후보. DS-006: 동일 HTML의 제목/strong 강조 및 글리프. 전체 크기 동일  |
| 3 | `e2e/tests/10-10-project/read.spec.ts-snapshots/10-10-participants-ko-read-linux.png` | 1280×2390 → 1280×2390 | `[201, 372, 466, 1865]` | 갱신 후보. DS-006: 동일 HTML의 제목/strong 강조 및 글리프. 전체 크기 동일  |
| 4 | `e2e/tests/10-10-project/read.spec.ts-snapshots/10-10-proposal-ko-read-mobile-linux.png` | 390×3786 → 390×3898 | `[20, 235, 370, 3867]` | 갱신 후보. DS-006: 기존 h2/strong 강조가 등록된 서체로 표현됨. 동일 HTML, 줄바꿈으로 높이 112px; 이동량 보정 후 푸터 하단 픽셀 동일  |
| 5 | `e2e/tests/10-10-project/read.spec.ts-snapshots/10-10-manager-ko-read-mobile-linux.png` | 390×1343 → 390×1343 | `[21, 247, 368, 691]` | 갱신 후보. DS-006: 동일 HTML의 제목/strong 강조 및 글리프. 전체 크기 동일  |
| 6 | `e2e/tests/10-10-project/read.spec.ts-snapshots/10-10-participants-ko-read-mobile-linux.png` | 412×2391 → 412×2391 | `[21, 247, 286, 1739]` | 보류: 기존 모바일 배치. DS-006: 동일 HTML의 제목/strong 강조 및 글리프. 전체 크기 동일 390px 뷰포트에서 예상/실제 모두 412px 이미지. 제목 Participants(Professors)과 장식 영역이 오른쪽으로 넘치는 기존 시각 한계; 해결 완료 아님 |
| 7 | `e2e/tests/about/contact/read.spec.ts-snapshots/contact-ko-read-linux.png` | 1280×900 → 1280×900 | `[201, 361, 319, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 8 | `e2e/tests/about/contact/read.spec.ts-snapshots/contact-ko-read-mobile-linux.png` | 390×883 → 390×883 | `[21, 233, 139, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 9 | `e2e/tests/about/directions/read.spec.ts-snapshots/directions-ko-read-linux.png` | 1280×1563 → 1280×1563 | `[212, 430, 476, 1036]` | 갱신 후보. HTML 본문 글리프 + 정보/기업 링크 밑줄. 표/탭/페이지 틀 유지  |
| 10 | `e2e/tests/about/directions/read.spec.ts-snapshots/directions-ko-read-mobile-linux.png` | 390×1552 → 390×1552 | `[32, 330, 296, 898]` | 갱신 후보. HTML 본문 글리프 + 정보/기업 링크 밑줄. 표/탭/페이지 틀 유지  |
| 11 | `e2e/tests/about/facilities/read.spec.ts-snapshots/facilities-ko-read-linux.png` | 1280×1275 → 1280×1275 | `[201, 393, 304, 622]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 12 | `e2e/tests/about/facilities/read.spec.ts-snapshots/facilities-ko-read-mobile-linux.png` | 390×1494 → 390×1494 | `[21, 461, 124, 800]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 13 | `e2e/tests/about/future-careers/read.spec.ts-snapshots/future-careers-ko-read-linux.png` | 1280×1400 → 1280×1400 | `[202, 361, 670, 876]` | 갱신 후보. HTML 본문 글리프 + 정보/기업 링크 밑줄. 표/탭/페이지 틀 유지  |
| 14 | `e2e/tests/about/future-careers/read.spec.ts-snapshots/future-careers-ko-read-mobile-linux.png` | 390×1429 → 390×1429 | `[22, 233, 252, 783]` | 갱신 후보. HTML 본문 글리프 + 정보/기업 링크 밑줄. 표/탭/페이지 틀 유지  |
| 15 | `e2e/tests/about/greetings/read.spec.ts-snapshots/greetings-ko-read-linux.png` | 1280×900 → 1280×900 | `[200, 361, 333, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 16 | `e2e/tests/about/greetings/read.spec.ts-snapshots/greetings-ko-read-mobile-linux.png` | 390×883 → 390×883 | `[20, 233, 153, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 17 | `e2e/tests/about/history/read.spec.ts-snapshots/history-ko-read-linux.png` | 1280×900 → 1280×900 | `[200, 361, 305, 374]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 18 | `e2e/tests/about/history/read.spec.ts-snapshots/history-ko-read-mobile-linux.png` | 390×883 → 390×883 | `[20, 233, 125, 246]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 19 | `e2e/tests/about/overview/read.spec.ts-snapshots/overview-ko-read-linux.png` | 1280×1432 → 1280×1432 | `[200, 361, 388, 432]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 20 | `e2e/tests/about/overview/read.spec.ts-snapshots/overview-ko-read-mobile-linux.png` | 390×1802 → 390×1802 | `[20, 233, 208, 304]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 21 | `e2e/tests/about/student-clubs/read.spec.ts-snapshots/student-clubs-ko-read-linux.png` | 1280×1056 → 1280×1056 | `[201, 517, 332, 530]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 22 | `e2e/tests/about/student-clubs/read.spec.ts-snapshots/student-clubs-ko-read-mobile-linux.png` | 390×1027 → 390×1027 | `[21, 361, 152, 374]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 23 | `e2e/tests/academics/course-changes/read.spec.ts-snapshots/course-changes-ko-read-linux.png` | 1280×1090 → 1280×1090 | `[221, 510, 409, 522]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 24 | `e2e/tests/academics/course-changes/read.spec.ts-snapshots/course-changes-ko-read-mobile-linux.png` | 390×1088 → 390×1088 | `[41, 382, 229, 394]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 25 | `e2e/tests/academics/curriculum/read.spec.ts-snapshots/curriculum-ko-read-linux.png` | 1280×1090 → 1280×1090 | `[221, 510, 395, 522]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 26 | `e2e/tests/academics/curriculum/read.spec.ts-snapshots/curriculum-ko-read-mobile-linux.png` | 390×1088 → 390×1088 | `[41, 382, 215, 394]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 27 | `e2e/tests/academics/degree-requirements/read.spec.ts-snapshots/degree-requirements-ko-read-linux.png` | 1280×992 → 1280×992 | `[202, 452, 337, 464]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 28 | `e2e/tests/academics/degree-requirements/read.spec.ts-snapshots/degree-requirements-ko-read-mobile-linux.png` | 390×991 → 390×991 | `[22, 325, 157, 337]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 29 | `e2e/tests/academics/general-studies-requirements/read.spec.ts-snapshots/general-studies-ko-read-linux.png` | 1280×1226 → 1280×1226 | `[221, 646, 395, 658]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 30 | `e2e/tests/academics/general-studies-requirements/read.spec.ts-snapshots/general-studies-ko-read-mobile-linux.png` | 390×1280 → 390×1280 | `[41, 574, 215, 586]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 31 | `e2e/tests/academics/guide/read.spec.ts-snapshots/guide-undergraduate-ko-read-linux.png` | 1280×900 → 1280×900 | `[200, 361, 337, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 32 | `e2e/tests/academics/guide/read.spec.ts-snapshots/guide-graduate-ko-read-linux.png` | 1280×900 → 1280×900 | `[201, 361, 351, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 33 | `e2e/tests/academics/guide/read.spec.ts-snapshots/guide-undergraduate-ko-read-mobile-linux.png` | 390×899 → 390×899 | `[20, 233, 157, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 34 | `e2e/tests/academics/guide/read.spec.ts-snapshots/guide-graduate-ko-read-mobile-linux.png` | 390×899 → 390×899 | `[21, 233, 171, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 35 | `e2e/tests/academics/scholarship/read.spec.ts-snapshots/scholarship-list-ko-read-linux.png` | 1280×1038 → 1280×1038 | `[201, 361, 337, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 36 | `e2e/tests/academics/scholarship/read.spec.ts-snapshots/scholarship-detail-ko-read-linux.png` | 1280×900 → 1280×900 | `[201, 361, 397, 374]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 37 | `e2e/tests/academics/scholarship/read.spec.ts-snapshots/scholarship-list-ko-read-mobile-linux.png` | 390×1037 → 390×1037 | `[21, 233, 157, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 38 | `e2e/tests/academics/scholarship/read.spec.ts-snapshots/scholarship-detail-ko-read-mobile-linux.png` | 390×899 → 390×899 | `[21, 233, 217, 246]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 39 | `e2e/tests/admissions/read.spec.ts-snapshots/admissions-undergraduate-regular-ko-read-linux.png` | 1280×900 → 1280×900 | `[200, 361, 369, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 40 | `e2e/tests/admissions/read.spec.ts-snapshots/admissions-international-scholarships-ko-read-linux.png` | 1280×970 → 1280×970 | `[201, 361, 351, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 41 | `e2e/tests/admissions/read.spec.ts-snapshots/admissions-undergraduate-regular-ko-read-mobile-linux.png` | 390×899 → 390×899 | `[20, 233, 189, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 42 | `e2e/tests/admissions/read.spec.ts-snapshots/admissions-international-scholarships-ko-read-mobile-linux.png` | 390×899 → 390×899 | `[21, 233, 171, 245]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 43 | `e2e/tests/community/faculty-recruitment/read.spec.ts-snapshots/recruit-ko-read-linux.png` | 1280×976 → 1280×976 | `[202, 437, 365, 449]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 44 | `e2e/tests/community/faculty-recruitment/read.spec.ts-snapshots/recruit-ko-read-mobile-linux.png` | 390×975 → 390×975 | `[22, 309, 185, 321]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 기존 | `e2e/tests/community/news/read.spec.ts-snapshots/news-list-ko-read-linux.png` | 1280×1581 → 1280×1581 | `[487, 778, 582, 804]` | 보류: 기존 차이. 기존 목록 마스크 경계/날짜 재현성 차이. 승인 DS로 설명하지 않음  |
| 45 | `e2e/tests/community/news/read.spec.ts-snapshots/news-detail-ko-read-linux.png` | 1280×1252 → 1280×1252 | `[201, 389, 379, 497]` | 보류: 혼합. DS-006 본문 + 기존 조회수 마스크 오른쪽 1px 경계가 혼재  |
| 기존 | `e2e/tests/community/news/read.spec.ts-snapshots/news-list-ko-read-mobile-linux.png` | 390×1643 → 390×1643 | `[196, 636, 197, 653]` | 보류: 기존 차이. 기존 목록 마스크 경계/날짜 재현성 차이. 승인 DS로 설명하지 않음  |
| 46 | `e2e/tests/community/news/read.spec.ts-snapshots/news-detail-ko-read-mobile-linux.png` | 390×1353 → 390×1353 | `[21, 373, 125, 386]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 47 | `e2e/tests/community/notice/read.spec.ts-snapshots/notice-detail-ko-read-linux.png` | 1280×1276 → 1280×1276 | `[200, 389, 593, 496]` | 보류: 혼합. DS-006 본문 + 기존 조회수 마스크 오른쪽 1px 경계가 혼재  |
| 기존 | `e2e/tests/community/notice/read.spec.ts-snapshots/notice-list-ko-read-mobile-linux.png` | 390×3498 → 390×3498 | `[208, 1064, 209, 1081]` | 보류: 기존 차이. 기존 목록 마스크 경계/날짜 재현성 차이. 승인 DS로 설명하지 않음  |
| 48 | `e2e/tests/community/notice/read.spec.ts-snapshots/notice-detail-ko-read-mobile-linux.png` | 390×1392 → 390×1392 | `[20, 388, 157, 400]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 49 | `e2e/tests/community/seminar/read.spec.ts-snapshots/seminar-detail-ko-read-linux.png` | 1280×1563 → 1280×1563 | `[201, 713, 319, 823]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 50 | `e2e/tests/community/seminar/read.spec.ts-snapshots/seminar-detail-ko-read-mobile-linux.png` | 390×1664 → 390×1664 | `[21, 601, 139, 711]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 51 | `e2e/tests/internal/read.spec.ts-snapshots/internal-ko-read-linux.png` | 1280×894 → 1280×894 | `[200, 354, 393, 366]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 52 | `e2e/tests/internal/read.spec.ts-snapshots/internal-ko-read-mobile-linux.png` | 390×895 → 390×895 | `[20, 229, 213, 241]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 53 | `e2e/tests/people/emeritus-faculty/read.spec.ts-snapshots/emeritus-detail-ko-read-linux.png` | 1280×1028 → 1280×1028 | `[382, 404, 499, 405]` | 갱신 후보. 이메일 정보 링크 밑줄 1px. 본문/배치 변경 없음  |
| 54 | `e2e/tests/people/emeritus-faculty/read.spec.ts-snapshots/emeritus-detail-ko-read-mobile-linux.png` | 390×1111 → 390×1111 | `[82, 360, 199, 361]` | 갱신 후보. 이메일 정보 링크 밑줄 1px. 본문/배치 변경 없음  |
| 55 | `e2e/tests/people/staff/read.spec.ts-snapshots/staff-detail-ko-read-linux.png` | 1280×1210 → 1280×1210 | `[382, 456, 472, 457]` | 갱신 후보. 이메일 정보 링크 밑줄 1px. 본문/배치 변경 없음  |
| 56 | `e2e/tests/people/staff/read.spec.ts-snapshots/staff-detail-ko-read-mobile-linux.png` | 390×1293 → 390×1293 | `[82, 412, 172, 413]` | 갱신 후보. 이메일 정보 링크 밑줄 1px. 본문/배치 변경 없음  |
| 57 | `e2e/tests/research/centers/read.spec.ts-snapshots/centers-ko-read-linux.png` | 1280×1006 → 1280×1006 | `[212, 517, 356, 529]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 58 | `e2e/tests/research/centers/read.spec.ts-snapshots/centers-ko-read-mobile-linux.png` | 390×999 → 390×999 | `[32, 361, 176, 373]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 59 | `e2e/tests/research/groups/read.spec.ts-snapshots/groups-ko-read-linux.png` | 1280×1276 → 1280×1276 | `[250, 595, 345, 608]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 60 | `e2e/tests/research/groups/read.spec.ts-snapshots/groups-ko-read-mobile-linux.png` | 390×1193 → 390×1193 | `[48, 405, 143, 418]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 61 | `e2e/tests/research/labs/read.spec.ts-snapshots/labs-detail-ko-read-linux.png` | 1280×1068 → 1280×1068 | `[202, 425, 410, 437]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 62 | `e2e/tests/research/labs/read.spec.ts-snapshots/labs-detail-ko-read-mobile-linux.png` | 390×1142 → 390×1142 | `[22, 476, 230, 488]` | 갱신 후보. DS-006: HTML 본문 글꼴 연결; 짧은 본문 글리프에 한정, 전체 크기 동일  |
| 63 | `e2e/tests/reservations/introduction/read.spec.ts-snapshots/reservations-introduction-ko-read-linux.png` | 1280×1652 → 1280×1596 | `[0, 571, 1220, 1652]` | 갱신 후보. DS-006: 동일 HTML의 문장/목록 줄바꿈; 높이 -56px. 색 강조·탭·제목 유지 푸터 이동량 보정 시 로고 36×35 영역만 최대 채널차14인 142px AA 잔차; 눈에 보이는 새 형태차/본문외 배치 변경 없음. 완전 픽셀 동일 표현 금지 |
| 64 | `e2e/tests/reservations/introduction/read.spec.ts-snapshots/reservations-introduction-ko-read-mobile-linux.png` | 390×1903 → 390×1875 | `[20, 415, 370, 1872]` | 갱신 후보. DS-006: 동일 HTML의 문장/목록 줄바꿈; 높이 -28px. 색 강조·탭·제목 유지  |
| 65 | `e2e/tests/reservations/privacy-policy/read.spec.ts-snapshots/reservations-privacy-policy-ko-read-linux.png` | 1280×1176 → 1280×1148 | `[0, 351, 1220, 1176]` | 갱신 후보. DS-006: 동일 HTML의 문장/표 글리프 폭 변화; 첫 문단 1줄 감소, 높이 -28px. 기존 모바일 표 오른쪽 잘림은 별도 시각 한계 데스크톱 표는 서체 폭 감소로 마지막 열 전체가 보임. 모바일 표 한계는 별도 |
| 66 | `e2e/tests/reservations/privacy-policy/read.spec.ts-snapshots/reservations-privacy-policy-ko-read-mobile-linux.png` | 390×1279 → 390×1251 | `[20, 243, 370, 1248]` | 재실행 후 후보. DS-006: 동일 HTML의 문장/표 글리프 폭 변화; 첫 문단 1줄 감소, 높이 -28px. 기존 모바일 표 오른쪽 잘림은 별도 시각 한계 마지막 시도 브라우저 SIGSEGV; retry1 이미지로 비교. 표 가로 잘림이 예상/실제 모두 남음. 재실행 후 갱신 권장 |
| 67 | `e2e/tests/search/read.spec.ts-snapshots/search-empty-ko-read-linux.png` | 1280×1345 → 1280×1345 | `[464, 531, 656, 545]` | 갱신 후보. 빈 결과 문구 neutral-300→500 색 변경만. 문구/글자 위치/화면 크기 유지  |
| 68 | `e2e/tests/search/read.spec.ts-snapshots/search-empty-ko-read-mobile-linux.png` | 390×1426 → 390×1426 | `[99, 486, 291, 500]` | 갱신 후보. 빈 결과 문구 neutral-300→500 색 변경만. 문구/글자 위치/화면 크기 유지  |

## 검토 이미지와 후속 장면

68개 신규 차이를 예상/실제/diff로 나란히 묶은 contact sheet를 모두 확인했다. 긴 본문·복합 링크 장면은 전체 비교 이미지를 추가로 확인했다. 연락처, 목록, 명예교수·직원, 빈 결과, 공지·뉴스 상세는 원본 대표 이미지도 확인했다.

- [contact sheet 1](integration-regression/cse-read-contact-1.png)
- [contact sheet 2](integration-regression/cse-read-contact-2.png)
- [contact sheet 3](integration-regression/cse-read-contact-3.png)
- [contact sheet 4](integration-regression/cse-read-contact-4.png)
- [contact sheet 5](integration-regression/cse-read-contact-5.png)
- [contact sheet 6](integration-regression/cse-read-contact-6.png)
- [1: 10-10-project/read.spec.ts · /10-10-project/proposal (ko) · read](integration-regression/cse-read-full-1.png)
- [4: 10-10-project/read.spec.ts · /10-10-project/proposal (ko) · read-mobile](integration-regression/cse-read-full-4.png)
- [6: 10-10-project/read.spec.ts · /10-10-project/participants (ko) · read-mobile](integration-regression/cse-read-full-6.png)
- [9: about/directions/read.spec.ts · 페이지 (ko) · read](integration-regression/cse-read-full-9.png)
- [13: about/future-careers/read.spec.ts · 페이지 (ko) · read](integration-regression/cse-read-full-13.png)
- [63: reservations/introduction/read.spec.ts · 페이지 (ko) · read](integration-regression/cse-read-full-63.png)
- [64: reservations/introduction/read.spec.ts · 페이지 (ko) · read-mobile](integration-regression/cse-read-full-64.png)
- [65: reservations/privacy-policy/read.spec.ts · 페이지 (ko) · read](integration-regression/cse-read-full-65.png)
- [66: reservations/privacy-policy/read.spec.ts · 페이지 (ko) · read-mobile](integration-regression/cse-read-full-66.png)


## 후속 확인

참가자 모바일은 [제목 줄바꿈 비교](long-title.html)로 검토한다. 개인정보 표는 실제320/390px에서 가로 휠로 마지막 열까지 읽을 수 있어 기존 방식을 유지한다. 공용 본문/에디터 스타일을 추가 수정하지 않았다. 기준 이미지는 아직 갱신하지 않았다.

## DS-040 후속 대조

참가자 모바일은412×2391→390×2420으로 바뀌었고 승인한 제목 줄바꿈과 DS-006 본문 표현에 대응한다. 개인정보 모바일은390×1279→390×1251이며 첫 분류의 실제 이미지와 동일하다. 별도 에이전트가 예상/실제/diff를 직접 확인한 뒤 두 기준을 갱신했고 공식 해당2테스트가 통과했다. 나머지5개의 actual/diff도 첫 실행과 픽셀 동일했다. 상세2개는 마스크뿐 아니라 DS-006 본문 차이를 함께 포함하므로 통째로 갱신하지 않았다.
