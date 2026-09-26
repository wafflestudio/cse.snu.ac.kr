import { Globe, Mail, MapPin, PhoneCall, Printer } from 'lucide-react';
import type { ReactNode } from 'react';

// 고유 화면 조각을 같은 값의 div 로 그린다. 실제는 PeopleDetailLayout·CourseCard·NewsCard.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

// 사진 틀은 폭 200·3:4 고정. 사진은 틀에 맞춰 채우고, 없으면 같은 틀에 로고.
function Photo({ empty = false }: { empty?: boolean }) {
  return (
    <div className="flex aspect-3/4 w-50 items-center justify-center bg-neutral-100">
      {empty ? (
        <span className="snu-logo block size-15 bg-neutral-200" />
      ) : (
        <div className="size-full bg-neutral-300" />
      )}
    </div>
  );
}

const CONTACTS = [
  { Icon: MapPin, text: '301동 516호' },
  { Icon: PhoneCall, text: '02-880-1234' },
  { Icon: Printer, text: '02-880-5678' },
  { Icon: Mail, text: 'prof@snu.ac.kr', link: true },
  { Icon: Globe, text: 'lab.snu.ac.kr', link: true },
];

function Contacts() {
  return (
    <ul className="flex flex-col gap-4 type-meta text-neutral-600">
      {CONTACTS.map(({ Icon, text, link }) => (
        <li key={text} className="flex items-start gap-1">
          <Icon className="shrink-0" />
          <span
            className={link ? 'text-link underline underline-offset-2' : ''}
          >
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-4 type-section">{title}</p>
      <ul className="list-disc space-y-2 pl-5 leading-normal">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function CourseCard() {
  return (
    <div className="h-44 w-64 border border-neutral-200 bg-neutral-50 p-4">
      <p className="type-item">컴퓨터의 개념 및 실습</p>
      <p className="mt-1 type-meta text-neutral-500">M1522.000600 · 3학점</p>
    </div>
  );
}

function NewsCard() {
  return (
    <div className="h-48 w-44 bg-white">
      <div className="h-20 bg-neutral-300" />
      <div className="p-4">
        <p className="type-item">연구실 수상 소식</p>
        <p className="mt-1 type-meta text-neutral-500">2024/3/15</p>
      </div>
    </div>
  );
}

export function UniqueSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="인물 상세 — 한 짜임">
        <div className="max-w-3xl border border-neutral-200 p-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div className="flex shrink-0 flex-col gap-4">
              <Photo />
              <Contacts />
            </div>
            <div className="flex flex-col gap-8">
              <Section title="학력" items={['서울대학교 컴퓨터공학 박사']} />
              <Section
                title="연구 분야"
                items={['데이터베이스', '분산 시스템']}
              />
              <Section title="경력" items={['2015 – 현재 서울대학교 교수']} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">사진 있음</p>
            <Photo />
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">사진 없음</p>
            <Photo empty />
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            사진 틀은 3:4로 고정한다 — 상세 폭 200, 목록 카드 144. 운영 사진은
            교수 3:4가 가장 많고(49장 중 15, 폭÷높이 중앙값 0.75)
            2:3·4:5·정사각형이 섞여 있다. 사진은 틀을 채우도록
            자르고(object-cover), 없으면 같은 틀의 회색 칸 가운데 로고. 사진
            유무·원본 비율과 관계없이 사진 칸은 모두 같은 크기다.
          </li>
          <li>
            교수·역대 교수·행정직원 상세가 같은 짜임을 쓴다: 왼쪽에 사진과 그
            아래 아이콘 연락처(위치·전화·팩스·메일·홈페이지), 오른쪽에 섹션
            (20/700 소제목 + 글머리 목록). 두 칸 사이 64. 모바일은 사진·연락처가
            위이고 사이 32.
          </li>
          <li>
            연락처 줄 사이는 16, 아이콘과 글자 사이 4. 글자가 13에 줄높이 1.2로
            빡빡해 8이면 붙어 보인다. 16이면 줄 간격 약 32로 오른쪽 목록(줄높이
            28)과 비슷하다. 메일·홈페이지는 링크 색에 밑줄.
          </li>
          <li>
            섹션 사이 32, 소제목과 목록 사이 16. 섹션 목록은 줄높이 1.5(14px
            글자에 21)에 항목 사이 8. 본문 줄높이 28을 그대로 쓰면 한 항목이 두
            줄로 넘어갈 때 줄 사이가 항목 사이만큼 벌어진다. 넘어가도 글머리
            점은 첫 줄 옆.
          </li>
          <li>
            섹션은 사람마다 있는 것만: 교수는 연구실·학력·연구 분야·경력, 역대
            교수는 재직 기간, 직원은 주요 업무. 비어 있는 항목은 그리지 않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="교과목 카드 — 그림자 대신 선">
        <CourseCard />
        <ul className="list-disc space-y-1 pl-5">
          <li>
            카드는 그림자 없이 면과 neutral-200 선 하나로
            구분한다(모서리·그림자·선 절). 앞면은 neutral-50(호버 100), 뒤집은
            뒷면은 neutral-200.
          </li>
        </ul>
      </Sub>

      <Sub title="메인 새 소식 카드">
        <div className="bg-neutral-100 p-6">
          <NewsCard />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            회색 띠(neutral-100) 위 카드라 그림자 없이 흰 바탕으로 띠와
            구분한다. 그림자는 떠 있는 층(모달·드롭다운)에만
            쓴다(모서리·그림자·선 절).
          </li>
        </ul>
      </Sub>

      <Sub title="그 밖의 고유 화면">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            예약 달력: 예약 칸은 <code>main-orange/80</code>. 날짜 칸은 폭을
            나눠 쓴다(100 고정이면 데스크톱 7칸이 본문 폭을 못 채운다). 시간
            칸은 모바일에도 AM/PM을 적는다.
          </li>
          <li>
            학사 연혁의 연도 원·선은 연혁 그래픽이라 자기 모양을 쓴다(그래픽
            절).
          </li>
          <li>
            연구실 상세: 요약 카드(접힌 모서리)는 데스크톱에서 본문 오른쪽 240,
            모바일은 본문 폭 전체. 소속 스트림 링크는 "더보기 →"와 같은 글자
            링크다(메인·카테고리 절). 주황 외곽선 상자를 쓰지 않는다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
