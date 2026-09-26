import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  PhoneCall,
  Printer,
} from 'lucide-react';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 고유 화면 페이지 — 화면 페이지 틀(짜임 그림 → 규칙 → 이렇게·하지 않는다 → 관련).
// 그림은 같은 값의 div 다. 실제는 PeopleDetailLayout·CourseCard·NewsCard·ReservationCalendar·연구실 상세.

// 사진 틀은 3:4 고정. 사진은 틀에 맞춰 채우고, 없으면 같은 틀에 로고.
function Photo({ empty = false }: { empty?: boolean }) {
  return (
    <div className="flex aspect-3/4 w-36 items-center justify-center bg-neutral-100 sm:w-50">
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

function PeopleSection({ title, items }: { title: string; items: string[] }) {
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
    <div className="h-44 w-64 max-w-full border border-neutral-200 bg-neutral-50 p-4">
      <p className="type-item">컴퓨터의 개념 및 실습</p>
      <p className="mt-1 type-meta text-neutral-500">M1522.000600 · 3학점</p>
    </div>
  );
}

function NewsCard({ shadow = false }: { shadow?: boolean }) {
  return (
    <div className={shadow ? 'w-40 bg-white shadow-lg' : 'w-40 bg-white'}>
      <div className="h-16 bg-neutral-300" />
      <div className="p-3">
        <p className="type-item">연구실 수상 소식</p>
        <p className="mt-1 type-meta text-neutral-500">2024/3/15</p>
      </div>
    </div>
  );
}

const DAYS = ['월', '화', '수', '목', '금'];

function Calendar() {
  return (
    <div className="flex w-full max-w-xl type-meta">
      <div className="flex w-12 shrink-0 flex-col pt-6">
        {['9 AM', '10 AM', '11 AM'].map((t) => (
          <span key={t} className="h-10 text-neutral-500">
            {t}
          </span>
        ))}
      </div>
      {DAYS.map((d, i) => (
        <div key={d} className="min-w-0 flex-1 border-l border-neutral-200">
          <p className="h-6 text-center">{d}</p>
          <div className="relative h-30">
            {i === 1 && (
              <div className="absolute inset-x-0 top-4 h-14 bg-main-orange/80" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function LabDetail() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 sm:flex-row-reverse">
      <div className="h-24 w-full shrink-0 border border-neutral-200 bg-neutral-50 sm:w-40">
        <p className="p-3 type-meta text-neutral-500">요약 카드</p>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="h-3 w-full bg-neutral-200" />
        <div className="h-3 w-5/6 bg-neutral-200" />
        <div className="h-3 w-2/3 bg-neutral-200" />
        <StreamLink />
      </div>
    </div>
  );
}

function StreamLink() {
  return (
    <span className="flex items-center gap-1 type-ui text-main-orange-dark">
      시스템 스트림 <ArrowRight />
    </span>
  );
}

export function UniqueSection() {
  return (
    <>
      <Lead>
        인물 상세·교과목 카드·예약 달력처럼 이 사이트에만 있는 화면이다.
      </Lead>

      <DocSection title="인물 상세">
        <Example caption="왼쪽에 사진과 연락처, 오른쪽에 섹션. 모바일은 사진·연락처가 위.">
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div className="flex shrink-0 flex-col gap-4">
              <Photo />
              <Contacts />
            </div>
            <div className="flex flex-col gap-8">
              <PeopleSection
                title="학력"
                items={['서울대학교 컴퓨터공학 박사']}
              />
              <PeopleSection
                title="연구 분야"
                items={['데이터베이스', '분산 시스템']}
              />
              <PeopleSection
                title="경력"
                items={['2015 – 현재 서울대학교 교수']}
              />
            </div>
          </div>
        </Example>
        <RuleList
          items={[
            '교수·역대 교수·행정직원 상세가 이 한 짜임을 쓴다.',
            '사진 틀은 3:4로 고정한다(상세 폭 200, 목록 카드 144). 원본 비율이 섞여 있어 사진은 틀을 채우도록 자른다.',
            '사진이 없으면 같은 틀의 회색 칸 가운데에 로고를 둔다 — 사진 칸은 언제나 같은 크기다.',
            '연락처는 아이콘 + 글자 줄로 위치·전화·팩스·메일·홈페이지 순서, 줄 사이 16. 메일·홈페이지는 링크 색에 밑줄.',
            '섹션 목록은 줄높이 1.5에 항목 사이 8 — 본문 줄높이면 두 줄 항목의 줄 사이가 항목 사이만큼 벌어진다. 글머리 점은 첫 줄 옆.',
            '섹션은 사람마다 있는 것만 — 교수는 연구실·학력·연구 분야·경력, 역대 교수는 재직 기간, 직원은 주요 업무. 빈 항목은 그리지 않는다.',
          ]}
        />
      </DocSection>

      <DocSection title="교과목 카드">
        <Example caption="앞면. 누르면 뒤집혀 더 짙은 회색 뒷면이 된다.">
          <CourseCard />
        </Example>
        <RuleList
          items={[
            '카드는 그림자 없이 면과 옅은 선 하나로 구분한다.',
            '앞면은 가장 옅은 회색, 뒤집은 뒷면은 한 단계 짙은 회색이다.',
          ]}
        />
      </DocSection>

      <DocSection title="메인 새 소식 카드">
        <Example caption="회색 띠 위의 흰 카드.">
          <div className="bg-neutral-100 p-6">
            <NewsCard />
          </div>
        </Example>
        <RuleList
          items={['회색 띠 위 카드는 그림자 없이 흰 바탕으로 띠와 구분한다.']}
        />
      </DocSection>

      <DocSection title="예약 달력">
        <Example caption="날짜 칸이 폭을 똑같이 나누고, 예약 칸은 반투명 주황.">
          <Calendar />
        </Example>
        <RuleList
          items={[
            '날짜 칸은 고정 폭이 아니라 폭을 나눠 쓴다 — 고정 폭이면 데스크톱 7칸이 본문 폭을 못 채운다.',
            '예약 칸은 반투명 주황(main-orange/80)이다.',
            '시간 칸은 모바일에서도 AM/PM을 적는다.',
          ]}
        />
      </DocSection>

      <DocSection title="연구실 상세">
        <Example caption="데스크톱은 요약 카드가 본문 오른쪽, 모바일은 본문 폭 전체.">
          <LabDetail />
        </Example>
        <RuleList
          items={[
            '요약 카드(접힌 모서리)는 데스크톱에서 본문 오른쪽 240, 모바일은 본문 폭 전체다.',
            '소속 스트림 링크는 "… 스트림 →" 글자 링크로, 메인 "더보기 →"와 같은 모양이다.',
          ]}
        />
      </DocSection>

      <DocSection title="학사 연혁 그래픽">
        <RuleList
          items={[
            '연도 원·선은 연혁 그래픽이라 간격·모양 단계가 아닌 자기 모양을 쓴다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <>
                <Photo />
                <Photo empty />
              </>
            ),
            caption: '사진이 있든 없든 같은 3:4 틀. 없으면 가운데 로고.',
          }}
          bad={{
            example: (
              <>
                <div className="aspect-square w-36 bg-neutral-300" />
                <div className="flex h-24 w-36 items-center justify-center bg-neutral-100">
                  <span className="snu-logo block h-12 w-30 bg-neutral-200" />
                </div>
              </>
            ),
            caption:
              '원본 비율대로 두거나 빈 칸 로고를 늘인다 — 목록에서 사진 칸 크기가 제각각이 된다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <div className="bg-neutral-100 p-4">
                <NewsCard />
              </div>
            ),
            caption: '평평한 띠 위 카드는 흰 바탕만으로 구분한다.',
          }}
          bad={{
            example: (
              <div className="bg-neutral-100 p-4">
                <NewsCard shadow />
              </div>
            ),
            caption: '띠 위 카드에 그림자를 준다 — 떠 있는 층처럼 보인다.',
          }}
        />
        <DoDont
          good={{
            example: <StreamLink />,
            caption: '스트림 링크는 "더보기 →"와 같은 글자 링크.',
          }}
          bad={{
            example: (
              <span className="border border-main-orange px-3 py-2 type-ui text-main-orange">
                시스템 스트림
              </span>
            ),
            caption: '주황 외곽선 상자로 만든다 — 버튼처럼 보인다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['main', '메인·카테고리'],
            ['shape', '모서리·그림자·선'],
            ['graphic', '그래픽'],
            ['list', '목록·상태 화면'],
          ]}
        />
      </DocSection>
    </>
  );
}
