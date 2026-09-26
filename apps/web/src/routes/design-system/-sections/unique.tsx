import clsx from 'clsx';
import { Globe, Mail, MapPin, Phone, Printer } from 'lucide-react';
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

// 사진 틀은 폭 200·4:5 고정. 사진은 틀에 맞춰 채우고, 없으면 같은 틀에 로고.
function Photo({ empty = false }: { empty?: boolean }) {
  return (
    <div className="flex aspect-4/5 w-50 items-center justify-center bg-neutral-100">
      {empty ? (
        <span className="snu-logo block size-15 bg-neutral-200" />
      ) : (
        <div className="size-full bg-neutral-300" />
      )}
    </div>
  );
}

function Contacts() {
  return (
    <ul className="space-y-4 type-meta text-neutral-600">
      {[
        [MapPin, '301동 516호'],
        [Phone, '02-880-1234'],
        [Printer, '02-880-5678'],
        [Mail, 'prof@snu.ac.kr'],
        [Globe, 'lab.snu.ac.kr'],
      ].map(([Icon, text]) => {
        const I = Icon as typeof MapPin;
        return (
          <li key={text as string} className="flex items-center gap-2">
            <I className="text-neutral-500" /> {text as string}
          </li>
        );
      })}
    </ul>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 type-section">{title}</p>
      <ul className="list-disc space-y-2 pl-5 leading-normal">
        {items.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

function CourseCard({ next }: { next: boolean }) {
  return (
    <div
      className={clsx(
        'h-44 w-64 p-4',
        next
          ? 'border border-neutral-200 bg-neutral-50'
          : 'bg-neutral-50 shadow-[2px_2px_4px_0_rgba(255,255,255,0.05)_inset,-2px_-2px_6px_0_rgba(0,0,0,0.05)_inset]',
      )}
    >
      <p className="type-item">컴퓨터의 개념 및 실습</p>
      <p className="mt-1 type-meta text-neutral-500">M1522.000600 · 3학점</p>
    </div>
  );
}

function NewsCard({ kind }: { kind: 'now' | 'next' }) {
  return (
    <div
      className={clsx(
        'h-48 w-44',
        kind === 'now'
          ? 'bg-neutral-50 shadow-[0_0_31.9px_0_rgba(0,0,0,0.07)]'
          : 'bg-white',
      )}
    >
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
          <div className="flex flex-col gap-8 sm:flex-row">
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
            사진 틀은 폭 200·4:5로 고정한다(운영 사진이 대략 4:5 — 166×206,
            220×270). 사진은 틀을 채우도록 자르고(object-cover), 없으면 같은
            틀의 회색 칸 가운데 로고. 사진 유무·원본 비율과 관계없이 모든 사람의
            사진 칸이 같은 크기다(지금은 없을 때 로고 칸이 60×60이거나 연락처
            폭으로 늘어난다).
          </li>
          <li>
            교수·역대 교수·행정직원 상세가 같은 짜임을 쓴다: 왼쪽에 사진과 그
            아래 아이콘 연락처(위치·전화·팩스·메일·홈페이지), 오른쪽에 섹션
            (20/700 소제목 + 글머리 목록). 모바일은 사진·연락처가 위.
          </li>
          <li>
            연락처 줄 사이는 16. 글자가 13에 줄높이 1.2로 빡빡해 8이면 붙어
            보인다(지금 8). 16이면 줄 간격 약 32로 오른쪽 목록(줄높이 28)과
            비슷하다.
          </li>
          <li>
            섹션 목록은 줄높이 1.5(14px 글자에 21)에 항목 사이 8. 본문 줄높이
            28을 그대로 쓰면 한 항목이 두 줄로 넘어갈 때 줄 사이가 항목 사이만큼
            벌어진다. 넘어가도 글머리 점은 첫 줄 옆.
          </li>
          <li>
            섹션은 사람마다 있는 것만: 교수는 연구실·학력·연구 분야·경력, 역대
            교수는 재직 기간, 직원은 주요 업무. 비어 있는 항목은 그리지 않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="교과목 카드 — 그림자 대신 선">
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">전</p>
            <CourseCard next={false} />
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">지금</p>
            <CourseCard next />
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            카드는 그림자 대신 면과 선으로 구분한다(1-5). 앞·뒷면에 서로 다른
            안쪽 그림자 두 값을 없애고 neutral-200 선 하나.
          </li>
        </ul>
      </Sub>

      <Sub title="메인 새 소식 카드">
        <div className="flex flex-wrap gap-8 bg-neutral-100 p-6">
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">전</p>
            <NewsCard kind="now" />
          </div>
          <div className="space-y-2">
            <p className="type-meta text-neutral-500">지금</p>
            <NewsCard kind="next" />
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            회색 띠 위 카드라 그림자 없이 흰 바탕으로 띠와 구분한다. 지금은
            neutral-50 카드에 번지는 그림자(32px, 7%)다 — 그림자는 떠 있는 층
            (모달·드롭다운)에만(1-5).
          </li>
        </ul>
      </Sub>

      <Sub title="함께 정리">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            예약 달력의 예약 칸 색 <code>#ff6914cc</code>를 토큰(
            <code>main-orange/80</code>)으로 — 화면은 같다.
          </li>
          <li>학사 연혁의 연도 원·선은 연혁 그래픽이라 그대로 둔다.</li>
          <li>
            쓰이지 않는 <code>search/style.module.css</code>를 지운다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
