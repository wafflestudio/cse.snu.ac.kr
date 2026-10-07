import { type Area, ChangesPage, pairShots, shots } from './kit';
import { AttachmentHover, WideTable } from './samples';

// v2 개선 기록: 목록·글(목록·상태 화면·게시물 상세·읽는 본문).

const AREAS: Area[] = [
  {
    id: 'list',
    title: '목록·상태 화면',
    doc: 'list',
    items: [
      {
        title: '표 한 모양',
        why: '목록마다 표 모양이 달랐습니다(머리 행이 회색이거나 흰색, 행 높이와 줄무늬, 행 사이 점선, 칸 폭, 들여쓰기가 제각각). 공지사항 표 하나를 골라 흰 머리 행과 아래 선, 같은 행 높이, 옅은 회색 줄무늬로 모든 표를 맞추고, 칸은 내용 폭에 맞추며 표는 본문 왼쪽 끝에서 시작합니다. 학회 표는 720px 고정 대신 본문 폭을 다 씁니다.',
        ...pairShots(
          [
            {
              file: 'g1-table-notice-before',
              w: 890,
              h: 190,
              label: '공지사항 (기준으로 고른 모양)',
              alt: '공지사항 표. 흰 머리 행과 옅은 회색 줄무늬 행',
            },
            {
              file: 'g1-table-labs-before',
              w: 890,
              h: 150,
              label: '연구실 목록',
              alt: '연구실 목록 표. 회색 머리 행과 행 사이 점선',
            },
            {
              file: 'g1-table-conference-before',
              w: 740,
              h: 140,
              label: 'Top Conference List',
              alt: 'Top Conference 표. 연번 머리 칸이 두 줄로 꺾이고 표 폭이 좁음',
            },
            {
              file: 'g1-table-career-stat-before',
              w: 445,
              h: 240,
              label: '졸업생 진로 현황',
              alt: '진로 현황 교차표. 회색 머리 행과 회색 행 제목 칸, 칸마다 선',
            },
            {
              file: 'g1-table-startup-before',
              w: 860,
              h: 135,
              label: '졸업생 창업 기업',
              alt: '창업 기업 표. 회색 줄무늬 행에 삭제와 편집 버튼',
            },
            {
              file: 'g1-table-courses-before',
              w: 870,
              h: 100,
              label: '교과과정',
              alt: '교과목 표. 회색 머리 행, 칸이 고르게 나뉘고 숫자 가운데 정렬',
            },
            {
              file: 'g1-table-admin-before',
              w: 870,
              h: 95,
              label: '관리자 메뉴',
              alt: '관리자 슬라이드쇼 표. 흰 머리 행과 아래 선',
            },
          ],
          [
            {
              file: 'g1-table-notice-after',
              w: 890,
              h: 190,
              label: '공지사항',
              alt: '공지사항 표. 흰 머리 행과 옅은 회색 줄무늬 행',
            },
            {
              file: 'g1-table-labs-after',
              w: 890,
              h: 150,
              label: '연구실 목록',
              alt: '연구실 목록 표. 공지사항과 같은 흰 머리 행과 줄무늬, 긴 칸만 넓게',
            },
            {
              file: 'g1-table-conference-after',
              w: 890,
              h: 145,
              label: 'Top Conference List',
              alt: 'Top Conference 표. 연번이 한 줄로 들어가고 같은 머리 행과 줄무늬',
            },
            {
              file: 'g1-table-career-stat-after',
              w: 445,
              h: 324,
              label: '졸업생 진로 현황',
              alt: '진로 현황 교차표. 흰 머리 행과 줄무늬, 행 제목은 굵은 글자',
            },
            {
              file: 'g1-table-startup-after',
              w: 505,
              h: 140,
              label: '졸업생 창업 기업',
              alt: '창업 기업 표. 같은 머리 행과 줄무늬, 칸이 내용 폭에 맞춰짐',
            },
            {
              file: 'g1-table-courses-after',
              w: 890,
              h: 100,
              label: '교과과정',
              alt: '교과목 표. 흰 머리 행, 과목명 칸만 넓고 나머지는 내용 폭',
            },
            {
              file: 'g1-table-admin-after',
              w: 890,
              h: 105,
              label: '관리자 메뉴',
              alt: '관리자 슬라이드쇼 표. 같은 머리 행과 줄무늬 행',
            },
          ],
        ),
        wide: true,
      },
      {
        title: '교과목 표 들여쓰기',
        why: '교과목 정보 제목과 목록형 토글, 표가 본문 왼쪽 끝보다 더 들어가 있었고 머리 행과 칸이 어긋났습니다. 들여쓰기를 없애고 머리 행을 칸에 맞췄습니다.',
        ...shots('p4-course-table', 900, 225, [
          '교과목 정보 제목과 표가 안쪽으로 들어가 있고 학점 머리와 값이 어긋난 화면',
          '제목과 표가 본문 왼쪽 끝에서 시작하고 머리 행과 칸이 맞는 화면',
        ]),
        wide: true,
      },
      {
        title: '빈 목록',
        why: '검색 결과가 없을 때 화면마다 다르게 보였습니다(공지와 새 소식은 왼쪽 검은 글자, 세미나는 가운데 회색 글자와 밑줄, 통합 검색은 흐린 글자와 큰 돋보기 그림). 위아래 선 사이 가운데 한 줄 문구로 맞추고, 쪽이 하나뿐이면 페이지 넘김을 숨겼습니다.',
        ...pairShots(
          [
            {
              file: 'g1-empty-notice-before',
              w: 890,
              h: 140,
              label: '공지사항',
              alt: '왼쪽 정렬 검은 문구 아래 1쪽뿐인 페이지 넘김',
            },
            {
              file: 'g1-empty-news-before',
              w: 890,
              h: 140,
              label: '새 소식',
              alt: '왼쪽 정렬 검은 문구 아래 1쪽뿐인 페이지 넘김',
            },
            {
              file: 'g1-empty-seminar-before',
              w: 890,
              h: 195,
              label: '세미나',
              alt: '가운데 회색 문구와 밑줄, 그 아래 페이지 넘김',
            },
            {
              file: 'g1-empty-search-before',
              w: 890,
              h: 315,
              label: '통합 검색',
              alt: '아주 흐린 문구 아래 찡그린 돋보기 그림',
            },
          ],
          [
            {
              file: 'g1-empty-notice-after',
              w: 890,
              h: 215,
              label: '공지사항',
              alt: '위아래 선 사이 가운데 회색 문구 한 줄, 페이지 넘김 없음',
            },
            {
              file: 'g1-empty-news-after',
              w: 890,
              h: 216,
              label: '새 소식',
              alt: '위아래 선 사이 가운데 회색 문구 한 줄, 페이지 넘김 없음',
            },
            {
              file: 'g1-empty-seminar-after',
              w: 890,
              h: 215,
              label: '세미나',
              alt: '위아래 선 사이 가운데 회색 문구 한 줄, 페이지 넘김 없음',
            },
            {
              file: 'g1-empty-search-after',
              w: 890,
              h: 205,
              label: '통합 검색',
              alt: '위아래 선 사이 가운데 회색 문구 한 줄, 돋보기 그림 없음',
            },
          ],
        ),
        wide: true,
      },
      {
        title: '없는 페이지',
        why: '404 화면이 큰 주황 숫자만 있는 다른 틀이라 사이트를 벗어난 것처럼 보였습니다. 다른 페이지와 같은 틀에 제목·요청 주소·메인으로 가는 버튼을 둡니다.',
        ...shots('not-found', 900, 474, [
          '예전 404 화면. 어두운 면 가운데 큰 주황 404 숫자가 있습니다.',
          '바뀐 404 화면. 다른 페이지처럼 제목 "페이지를 찾을 수 없습니다"와 메인으로 이동 버튼이 있습니다.',
        ]),
        wide: true,
      },
      {
        title: '새 소식 목록 들여쓰기와 빈 사진',
        why: '새 소식 목록만 행이 48px 들어가서 시작하고, 사진이 없으면 빈 회색 칸이 남았습니다. 들여쓰기를 없애 본문 왼쪽 끝에 맞추고, 사진이 없을 때는 세미나 목록처럼 학부 로고를 넣었습니다.',
        ...shots('p4-news-list', 900, 500, [
          '새 소식 목록 행이 안쪽으로 들어가 있고 두 번째 글의 사진 자리가 빈 회색 칸인 화면',
          '목록 행이 본문 왼쪽 끝에서 시작하고 사진 없는 글에 학부 로고가 들어간 화면',
        ]),
        wide: true,
      },
      {
        title: '통합 검색 결과 폭',
        why: '검색 결과 행과 구분선이 위 필터 상자보다 좁아서 오른쪽 끝이 맞지 않았습니다. 결과 행을 필터 상자와 같은 폭으로 늘렸습니다.',
        ...shots('p4-search-width', 900, 525, [
          '필터 상자보다 결과 행 구분선이 짧게 끝나는 통합 검색 화면',
          '결과 행 구분선이 필터 상자와 같은 오른쪽 끝에서 끝나는 통합 검색 화면',
        ]),
        wide: true,
      },
    ],
  },
  {
    id: 'post',
    title: '게시물 상세',
    doc: 'post',
    items: [
      {
        title: '게시물 상세 한 벌',
        why: '공지·새 소식·세미나 상세가 따로 만들어져 정보 줄이 서로 달랐고("작성자:", "작성 날짜:" 같은 이름표가 값보다 길었습니다), 세미나에는 정보 줄이 없었습니다. 흰 머리 띠에 제목과 가운뎃점 정보 줄, 그 아래 회색 본문 띠를 두는 한 짜임으로 세 화면을 맞추고, 이전·다음 글 사이도 4에서 8로 넓혔습니다.',
        ...pairShots(
          [
            {
              file: 'g1-detail-notice-before',
              w: 900,
              h: 520,
              label: '공지사항',
              alt: '공지 상세. 작성자, 작성 날짜, 조회수가 이름표와 함께 나열된 정보 줄',
            },
            {
              file: 'g1-detail-news-before',
              w: 900,
              h: 520,
              label: '새 소식',
              alt: '새 소식 상세. 날짜와 조회수만 있는 정보 줄, 본문 오른쪽에 이미지',
            },
            {
              file: 'g1-detail-seminar-before',
              w: 900,
              h: 520,
              label: '세미나',
              alt: '세미나 상세. 제목 아래 정보 줄이 없고 이름, 직함, 주최, 날짜, 위치가 본문에 한 줄씩',
            },
          ],
          [
            {
              file: 'g1-detail-notice-after',
              w: 900,
              h: 520,
              label: '공지사항',
              alt: '공지 상세. 작성자, 날짜, 조회를 가운뎃점으로 이은 정보 줄',
            },
            {
              file: 'g1-detail-news-after',
              w: 900,
              h: 520,
              label: '새 소식',
              alt: '새 소식 상세. 날짜와 조회를 가운뎃점으로 이은 같은 정보 줄',
            },
            {
              file: 'g1-detail-seminar-after',
              w: 900,
              h: 520,
              label: '세미나',
              alt: '세미나 상세. 날짜, 장소, 주최를 이은 정보 줄과 연사, 요약 소제목, 오른쪽에 뜬 이미지',
            },
          ],
        ),
        wide: true,
      },
      {
        title: '세미나 상세 정보 줄',
        why: '연사와 일정 정보가 이름·직함·소속·주최·날짜·위치 여섯 줄로 따로 나열되어 본문 앞을 길게 차지했습니다. 일정·장소·주최를 제목 아래 한 줄로 모으고, 연사는 소제목 단락으로 묶었으며, 대표 이미지는 글이 감싸 흘러 좁은 폭에서 글이 지나치게 좁아지지 않습니다.',
        ...shots('p4-seminar-detail', 900, 560, [
          '세미나 제목 아래 이름, 직함, 소속, 주최, 날짜, 위치가 한 줄씩 나열되고 오른쪽에 대표 이미지가 있는 화면',
          '제목 아래 일정과 장소, 주최가 한 줄로 있고 연사 단락과 요약 본문이 대표 이미지 옆에 이어지는 화면',
        ]),
        wide: true,
      },
      {
        title: '첨부 파일 링크의 호버',
        why: '첨부 파일 링크만 호버하면 밑줄이 생겨 다른 링크(주황)와 반응이 달랐습니다. 마우스를 올리면 주황으로 바뀝니다. 두 견본 모두 마우스를 올린 상태입니다.',
        before: <AttachmentHover old />,
        after: <AttachmentHover old={false} />,
      },
    ],
  },
  {
    id: 'reading',
    title: '읽는 본문',
    doc: 'reading',
    items: [
      {
        title: '넓은 표',
        why: '작성자가 넣은 넓은 표가 모바일에서 페이지 전체를 옆으로 밀었습니다. 표는 본문 폭에서 멈추고 표 안에서만 가로로 스크롤하며, 옆으로 더 있으면 회색 막대와 오른쪽 끝 흐림으로 알립니다. 운영 사이트 공지 20개를 320·390·1440에서 재 본 넘침이 모두 표였고, 이제 0입니다. 점선 틀이 화면 폭입니다.',
        before: <WideTable old />,
        after: <WideTable old={false} />,
      },
    ],
    extras: [
      '본문 제목이 글 제목보다 크던 것(21 대 20)을 h1·h2 20, h3 16, 그 아래 14로 정했습니다. 1px 차이라 한 줄로 적습니다.',
      '본문 인용을 왼쪽 2px 선과 짙은 회색 글자로 정했습니다. 예전 모습을 담은 캡처가 없어 한 줄로 적습니다.',
    ],
  },
];

export function ChangesContentSection() {
  return (
    <ChangesPage
      lead="이번 개편에서 목록과 게시물 상세, 읽는 본문이 어떻게 바뀌었는지 고치기 전과 후로 모은 기록입니다."
      areas={AREAS}
    />
  );
}
