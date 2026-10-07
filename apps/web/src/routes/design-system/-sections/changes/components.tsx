import Button from '@/components/ui/Button';
import LegacyButton from '../../-legacy/Button';
import { type Area, ChangesPage, pairShots, shots } from './kit';
import {
  ButtonStates,
  EditLanguage,
  ErrorSketch,
  FacultyFormSlice,
  FieldWidths,
  FileRow,
  MiniCalendar,
  NarrowDialogButtons,
} from './samples';

// v2 개선 기록: 컴포넌트(버튼·입력·선택·모달·검색·토스트·에디터).

const AREAS: Area[] = [
  {
    id: 'button',
    title: '버튼',
    doc: 'button',
    items: [
      {
        title: '추가 버튼',
        why: '"추가"가 연구실·교과목·시설·졸업생 진로에서는 주황 채움, 교수진에서는 짙은 회색이라 같은 행동이 화면마다 달라 보였습니다. 버튼 색은 행동의 종류로 정해 주요 행동은 늘 짙은 회색입니다.',
        ...pairShots(
          [
            {
              file: 'g2-add-labs-before',
              w: 220,
              h: 64,
              label: '연구실',
              alt: '주황 채움의 연구실 추가 버튼',
            },
            {
              file: 'g2-add-courses-before',
              w: 220,
              h: 64,
              label: '교과과정',
              alt: '주황 채움의 새 교과목 버튼',
            },
            {
              file: 'g2-add-facilities-before',
              w: 220,
              h: 64,
              label: '시설 안내',
              alt: '주황 채움의 시설 추가 버튼',
            },
            {
              file: 'g2-add-careers-before',
              w: 360,
              h: 64,
              label: '졸업생 진로',
              alt: '연도 선택 옆의 주황 연도 추가 버튼과 그 오른쪽의 편집 버튼',
            },
            {
              file: 'g2-add-faculty-before',
              w: 220,
              h: 64,
              label: '교수진',
              alt: '짙은 회색 채움의 추가하기 버튼',
            },
          ],
          [
            {
              file: 'g2-add-labs-after',
              w: 220,
              h: 64,
              label: '연구실',
              alt: '짙은 회색 채움의 연구실 추가 버튼',
            },
            {
              file: 'g2-add-courses-after',
              w: 220,
              h: 64,
              label: '교과과정',
              alt: '짙은 회색 채움의 새 교과목 버튼',
            },
            {
              file: 'g2-add-facilities-after',
              w: 220,
              h: 64,
              label: '시설 안내',
              alt: '짙은 회색 채움의 시설 추가 버튼',
            },
            {
              file: 'g2-add-careers-after',
              w: 360,
              h: 64,
              label: '졸업생 진로',
              alt: '편집이 왼쪽, 짙은 회색 연도 추가가 맨 오른쪽에 놓인 버튼 줄',
            },
            {
              file: 'g2-add-faculty-after',
              w: 220,
              h: 64,
              label: '교수진',
              alt: '원래 모양 그대로인 짙은 회색 추가 버튼',
            },
          ],
        ),
      },
      {
        title: '누름과 호버',
        why: '주요 버튼만 호버·누름 상태가 없어 눌렀는지 알 수 없었습니다. 회색이 한 단계씩 밝아져 마우스를 올린 것과 누른 것이 보입니다.',
        before: <ButtonStates old />,
        after: <ButtonStates old={false} />,
      },
      {
        title: '처리 중 표시',
        why: '저장을 누르면 버튼이 흐려지기만 해서 처리 중인지 누를 수 없는 버튼인지 구분되지 않았습니다. 처리하는 동안 버튼 글자가 "저장 중…"으로 바뀌고 눌리지 않습니다.',
        before: <LegacyButton variant="neutral">저장하기</LegacyButton>,
        after: (
          <Button variant="primary" pending pendingLabel="저장 중…">
            저장
          </Button>
        ),
      },
      {
        title: '좁은 자리의 버튼 글자',
        why: '작은 화면의 확인창에서 버튼 글자가 줄을 바꿔 "취/소"처럼 한 글자씩 끊겼습니다. 버튼 글자는 줄을 바꾸지 않고, 확인창 판은 화면 폭에 맞춰 넓어져 버튼이 한 줄에 들어갑니다.',
        before: <NarrowDialogButtons old />,
        after: <NarrowDialogButtons old={false} />,
      },
      {
        title: '삭제와 저장의 자리',
        why: '편집 폼의 삭제가 저장하기 바로 옆에 같은 짙은 색으로 있어 잘못 누르기 쉬웠습니다. 삭제는 보조 버튼으로 왼쪽 끝에, 저장은 맨 오른쪽에 둡니다.',
        before: (
          <div className="flex w-full justify-end gap-2">
            <LegacyButton variant="secondary">취소</LegacyButton>
            <LegacyButton variant="neutral">삭제</LegacyButton>
            <LegacyButton variant="neutral">저장하기</LegacyButton>
          </div>
        ),
        after: (
          <div className="flex w-full gap-3">
            <Button variant="secondary">삭제</Button>
            <span className="flex-1" />
            <Button variant="secondary">취소</Button>
            <Button variant="primary">저장</Button>
          </div>
        ),
      },
    ],
  },
  {
    id: 'form',
    title: '입력·폼',
    doc: 'form',
    items: [
      {
        title: '입력 칸 한 모양',
        why: '입력 칸마다 높이(28·30·32px)·바탕·테두리가 달랐고, 목록 입력의 새 칸은 회색 바탕, 사진·파일 고르기는 12px 테두리 단추였습니다. 높이 34px·흰 바탕·회색 테두리 칸 하나로 맞추고 고르기 단추는 보조 버튼으로 바꿨습니다. 견본은 교수진 추가 폼의 한 부분이라 직접 입력하고 사진을 고르고 학력을 더해 볼 수 있습니다.',
        before: <FacultyFormSlice old />,
        after: <FacultyFormSlice old={false} />,
        same: [
          '공지·새 소식·세미나 작성 폼',
          '행정직원·연구실·연구 센터·시설·동아리 추가 폼',
          '장학·교과목 변경·전공 이수 폼',
          '교과목 추가 모달',
          '시설 예약 모달',
        ],
        values: [
          ['드롭다운', '28px, 모서리 4px', '34px, 흰 바탕, 모서리 2px'],
          [
            '날짜 선택·공지와 새 소식 검색 상자',
            '30px, 모서리 4px',
            '34px, 흰 바탕, 모서리 2px',
          ],
          [
            '세미나 검색',
            '30px, 회색 채움, 모서리 4px',
            '34px, 흰 바탕, 모서리 2px',
          ],
          [
            '헤더 검색',
            '30px, 회색 채움, 모서리 1px',
            '34px, 옅은 회색 채움, 모서리 2px',
          ],
          ['첨부 파일 고르기', '32px 테두리 단추, 12px 글자', '보조 버튼 34px'],
        ],
      },
      {
        title: '입력 칸 폭',
        why: '폼마다 20rem·25rem·30rem·520px처럼 칸 폭을 따로 적어 칸 오른쪽 끝이 제각각이었습니다. 폭은 짧음 80·보통 320·넓음 480·전체 넷 중에서 값의 길이로 고릅니다.',
        before: <FieldWidths old />,
        after: <FieldWidths old={false} />,
        wide: true,
      },
      {
        title: '교수 추가 폼의 모바일 넘침',
        why: '모바일에서 전화번호·팩스 줄이 고정 폭이라 화면 밖으로 넘쳐 페이지 전체가 692px로 늘어났습니다. 짝을 이루는 두 칸은 좁은 화면에서 위아래로 쌓습니다.',
        ...shots(
          'p3-faculty-form-390',
          692,
          300,
          [
            '예전 교수 추가 폼 390px. 팩스 칸이 화면 오른쪽 밖으로 나가 있습니다.',
            '바뀐 교수 추가 폼 390px. 전화번호 아래에 팩스 칸이 놓여 화면 안에 들어옵니다.',
          ],
          { w: 390, h: 370 },
        ),
        wide: true,
      },
      {
        title: '오류는 필드 아래',
        why: '오류가 버튼 줄 옆에만 모여 긴 폼에서는 어느 칸을 고칠지 찾아야 했습니다. 오류 문장은 그 칸 바로 아래에, 버튼 옆에는 개수만 둡니다.',
        before: <ErrorSketch inline={false} />,
        after: <ErrorSketch inline />,
      },
      {
        title: '긴 파일 이름',
        why: '첨부 파일 이름이 길면 칸을 넘쳐 옆 요소를 밀었습니다. 한 줄에서 말줄임으로 자르고, 지우기는 X 버튼으로 둡니다.',
        before: <FileRow old />,
        after: <FileRow old={false} />,
      },
      {
        title: '날짜 선택의 오늘과 고른 날',
        why: '오늘과 고른 날이 모두 주황이라 무엇을 골랐는지 헷갈렸고, 달을 넘기는 화살표도 주황이었습니다. 주황은 고른 날 하나에만 두고 오늘은 숫자 아래 점으로, 화살표는 회색으로 바꿨습니다.',
        before: <MiniCalendar old />,
        after: <MiniCalendar old={false} />,
      },
    ],
  },
  {
    id: 'selection',
    title: '선택·태그',
    doc: 'selection',
    items: [
      {
        title: '단일 선택과 탭',
        why: '하나를 고르는 컨트롤이 화면마다 따로 만들어져 회색 사각 버튼과 주황 태그 버튼이 섞여 있었습니다. 거르기와 정렬은 알약으로, 보기 바꾸기는 글자 토글로 맞췄습니다. 밝은 면에서 고른 알약은 짙은 회색이고 어두운 메인 공지만 주황입니다. 편집 언어는 값을 고르는 것이 아니라 같은 자리의 입력 칸을 바꾸므로, 밑줄 모양은 그대로 두고 숨긴 라디오를 진짜 탭으로 바꿨습니다. 이제 화면 읽기 프로그램이 탭과 패널로 알리고, 화살표 키로 옮기면 바로 바뀝니다.',
        pairs: [
          ...pairShots(
            [
              {
                file: 'g2-select-main-before',
                w: 300,
                h: 56,
                label: '메인 공지',
                alt: '어두운 띠 위의 주황 알약 필터: 전체, 장학, 학부, 대학원',
              },
              {
                file: 'g2-select-faculty-before',
                w: 200,
                h: 60,
                label: '교수진 정렬',
                alt: '짙은 회색과 연한 회색 사각 버튼으로 된 가나다순, 소속순 정렬',
              },
              {
                file: 'g2-select-sort-before',
                w: 230,
                h: 50,
                label: '교과목 정렬',
                alt: '주황 태그 모양 버튼으로 된 학년, 교과목 구분, 학점 정렬',
              },
              {
                file: 'g2-select-view-before',
                w: 150,
                h: 50,
                label: '교과목 보기 방식',
                alt: '굵은 세로선으로 나뉜 목록형, 카드형 글자 토글',
              },
            ],
            [
              {
                file: 'g2-select-main-after',
                w: 300,
                h: 56,
                label: '메인 공지',
                alt: '어두운 띠 위에서 주황을 유지한 알약 필터',
              },
              {
                file: 'g2-select-faculty-after',
                w: 200,
                h: 60,
                label: '교수진 정렬',
                alt: '고른 항목이 짙은 회색인 알약 정렬',
              },
              {
                file: 'g2-select-sort-after',
                w: 230,
                h: 50,
                label: '교과목 정렬',
                alt: '고른 학년이 짙은 회색이고 나머지는 흰 알약인 정렬',
              },
              {
                file: 'g2-select-view-after',
                w: 150,
                h: 50,
                label: '교과목 보기 방식',
                alt: '얇은 구분선으로 나뉜 목록형, 카드형 글자 토글',
              },
            ],
          ).pairs,
          {
            label: '편집 언어',
            before: <EditLanguage old />,
            after: <EditLanguage old={false} />,
          },
        ],
      },
    ],
    extras: [
      '태그 구현 3벌(교과목 카드 복사본 포함)을 한 부품으로 모으고 높이를 26에서 24px로 맞췄습니다. 나란히 놓아도 거의 같아 보여 한 줄로 적습니다.',
    ],
  },
  {
    id: 'dialog',
    title: '모달',
    doc: 'dialog',
    items: [
      {
        title: '모달 판 한 벌',
        why: '모달마다 판의 바탕색·제목 크기·폭이 달랐고 확인창에는 위 주황 선이 없었으며 실행 버튼이 "확인"이었습니다. 흰 바탕에 위 주황 선이 있는 판 한 벌로 맞추고, 제목은 판이 같은 자리·같은 크기로 그리며, 폭은 확인 400·폼 560·넓게 768 셋에서 고릅니다. 확인창의 실행 버튼은 하는 일(삭제·나가기)을 적습니다.',
        ...pairShots(
          [
            {
              file: 'g2-modal-course-before',
              w: 540,
              h: 220,
              label: '교과목 추가',
              alt: '옅은 회색 바탕에 회색 제목이 있는 교과목 추가 판',
            },
            {
              file: 'g2-modal-reserve-before',
              w: 440,
              h: 220,
              label: '시설 예약',
              alt: '옅은 회색 바탕의 시설 예약 판',
            },
            {
              file: 'g2-modal-detail-before',
              w: 400,
              h: 220,
              label: '예약 상세',
              alt: '좁고 옅은 회색 바탕의 예약 상세 판',
            },
            {
              file: 'g2-modal-confirm-before',
              w: 260,
              h: 150,
              label: '확인창',
              alt: '위 주황 선이 없고 실행 버튼이 확인인 삭제 확인창',
            },
          ],
          [
            {
              file: 'g2-modal-course-after',
              w: 600,
              h: 220,
              label: '교과목 추가',
              alt: '흰 바탕에 굵은 검정 제목이 있는 교과목 추가 판',
            },
            {
              file: 'g2-modal-reserve-after',
              w: 580,
              h: 220,
              label: '시설 예약',
              alt: '흰 바탕으로 바뀐 시설 예약 판',
            },
            {
              file: 'g2-modal-detail-after',
              w: 790,
              h: 220,
              label: '예약 상세',
              alt: '넓은 크기의 흰 바탕 예약 상세 판',
            },
            {
              file: 'g2-modal-confirm-after',
              w: 420,
              h: 180,
              label: '확인창',
              alt: '위 주황 선이 생기고 실행 버튼이 삭제로 바뀐 확인창',
            },
          ],
        ),
        wide: true,
      },
      {
        title: '예약 모달의 모바일 넘침',
        why: '시설 예약 모달은 고정 폭 입력 칸 때문에 390px 화면에서 오른쪽이 잘려 버튼이 보이지 않았습니다. 칸이 판 폭을 따르고 날짜 이름을 칸 위로 올려 판 안에 다 들어옵니다. 320px에서 넘치던 예약 상세와 판 밖으로 나가던 날짜 팝오버도 함께 고쳤습니다.',
        ...shots('reservation-modal-390', 390, 844, [
          '예전 390px 시설 예약 모달. 입력 칸과 버튼이 화면 오른쪽 밖으로 잘립니다.',
          '바뀐 390px 시설 예약 모달. 입력 칸이 판 안에 맞게 들어옵니다.',
        ]),
      },
      {
        title: '이미지 팝업 버튼',
        why: '"자세히 보기"가 주황 채움이라 포스터 색과 부딪혔습니다. 포스터 색은 매번 달라서 짙은 회색으로 바꿨습니다.',
        ...shots('image-popup', 420, 610, [
          '예전 메인 이미지 팝업. 자세히 보기 버튼이 주황입니다.',
          '바뀐 메인 이미지 팝업. 자세히 보기 버튼이 짙은 회색입니다.',
        ]),
      },
    ],
  },
  {
    id: 'search',
    title: '검색 입력',
    doc: 'search',
    items: [
      {
        title: '검색 칸 한 부품',
        why: '헤더·검색 상자·세미나의 검색 칸이 회색 채움이나 테두리 없는 흰 칸 등 저마다 다른 모양이었습니다. 한 부품으로 모아 밝은 면은 다른 입력 칸과 같은 모양으로, 헤더는 채움 칸으로 맞췄습니다.',
        ...pairShots(
          [
            {
              file: 'g2-search-header-before',
              w: 260,
              h: 56,
              label: '헤더',
              alt: '어두운 헤더 위의 회색 채움 검색 칸',
            },
            {
              file: 'g2-search-notice-before',
              w: 400,
              h: 70,
              label: '공지 검색 상자',
              alt: '이름이 왼쪽에 있고 테두리 없는 흰 검색 칸',
            },
            {
              file: 'g2-search-seminar-before',
              w: 340,
              h: 60,
              label: '세미나',
              alt: '이름이 왼쪽에 있는 회색 채움 검색 칸',
            },
          ],
          [
            {
              file: 'g2-search-header-after',
              w: 260,
              h: 56,
              label: '헤더',
              alt: '더 밝은 회색으로 채운 헤더 검색 칸',
            },
            {
              file: 'g2-search-notice-after',
              w: 400,
              h: 90,
              label: '공지 검색 상자',
              alt: '이름이 위에 있고 테두리가 있는 흰 입력 칸',
            },
            {
              file: 'g2-search-seminar-after',
              w: 340,
              h: 60,
              label: '세미나',
              alt: '자리표시 검색어가 있는 테두리 입력 칸',
            },
          ],
        ),
      },
    ],
    extras: [
      '검색 칸 id 를 부품이 만들게 해 같은 화면에 칸이 둘이어도 겹치지 않습니다. 화면에는 보이지 않는 코드 정리입니다.',
    ],
  },
  {
    id: 'toast',
    title: '토스트',
    doc: 'toast',
    items: [
      {
        title: '토스트 모양',
        why: '둥근 판과 채운 아이콘이 사이트의 각진 면과 어울리지 않았고 실패가 성공과 같은 색이었습니다. 각진 판에 선 아이콘을 두고 실패만 빨강이며, 설명 글자의 팔레트 밖 색도 neutral-600으로 바꿨습니다.',
        ...shots('toast', 600, 327, [
          '예전 토스트 셋. 둥근 판에 검정으로 채운 아이콘입니다.',
          '바뀐 토스트 셋. 각진 판에 선 아이콘이고 실패 아이콘만 빨강입니다.',
        ]),
      },
    ],
  },
  {
    id: 'editor',
    title: '에디터',
    doc: 'editor',
    items: [],
    extras: [
      '편집기 테두리·모서리·툴바 버튼 그룹을 입력 칸과 같은 회색 300·2px로, 글꼴을 사이트 서체로 맞췄습니다. 나란히 놓아도 차이가 작아 한 줄로 적습니다.',
    ],
  },
];

export function ChangesComponentsSection() {
  return (
    <ChangesPage
      lead="이번 개편에서 버튼·입력 칸·선택·모달 같은 부품이 어떻게 바뀌었는지 고치기 전과 후로 모은 기록입니다."
      areas={AREAS}
    />
  );
}
