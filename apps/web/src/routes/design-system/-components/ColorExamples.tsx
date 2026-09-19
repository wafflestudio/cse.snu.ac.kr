import { Search } from 'lucide-react';
import { Fragment, type ReactNode, useState } from 'react';
import Checkbox from '@/components/ui/Checkbox';
import { Tag } from '@/components/ui/Tag';

// Tailwind 는 클래스 이름을 문자열로 찾으므로 토큰마다 적어둔다. 조립하면 못 찾는다.
const SWATCH: Record<string, string> = {
  white: 'bg-white',
  'neutral-50': 'bg-neutral-50',
  'neutral-100': 'bg-neutral-100',
  'neutral-200': 'bg-neutral-200',
  'neutral-300': 'bg-neutral-300',
  'neutral-400': 'bg-neutral-400',
  'neutral-500': 'bg-neutral-500',
  'neutral-600': 'bg-neutral-600',
  'neutral-700': 'bg-neutral-700',
  'neutral-800': 'bg-neutral-800',
  'neutral-850': 'bg-neutral-850',
  'neutral-900': 'bg-neutral-900',
  'neutral-950': 'bg-neutral-950',
  overlay: 'bg-overlay',
  'main-orange': 'bg-main-orange',
  'main-orange-muted': 'bg-main-orange-muted',
  link: 'bg-link',
  error: 'bg-error',
  'shell-100': 'bg-shell-100',
  'shell-200': 'bg-shell-200',
  'shell-300': 'bg-shell-300',
  'shell-400': 'bg-shell-400',
};

/** 해부도. 규칙과 역할을 먼저 적고, 그 아래 진짜 화면에 토큰 이름을 제자리에 붙인다. */
function Diagram({
  rule,
  roles,
  children,
}: {
  rule: string;
  roles: [string, string][];
  children: ReactNode;
}) {
  return (
    <figure>
      <figcaption className="max-w-[560px] text-md/[1.7] text-neutral-800">
        {rule}
      </figcaption>
      {/* 색이 깊이만 뜻하므로 견본을 붙여 띠로 읽히게 둔다. 팔레트와 같은 방식이다. */}
      <dl className="mt-2.5 mb-4 grid max-w-[560px] grid-cols-[16px_auto_minmax(0,1fr)] gap-x-3">
        {roles.map(([token, role], i) => (
          <Fragment key={token}>
            <span
              className={`border-x border-neutral-200 ${SWATCH[token]} ${i === 0 ? 'border-t' : ''} ${i === roles.length - 1 ? 'border-b' : ''}`}
              aria-hidden="true"
            />
            <dt className="py-0.5 [&_code]:text-neutral-500">
              <code>{token}</code>
            </dt>
            <dd className="py-0.5 text-sm/[1.6] text-neutral-600">{role}</dd>
          </Fragment>
        ))}
      </dl>
      <div className="max-w-[560px] border border-neutral-200">{children}</div>
    </figure>
  );
}

/** 해부도 안에서 그 자리의 토큰 이름. 내용이 아니라 주석이라 흐리게 둔다. */
function Pin({ name, dark = false }: { name: string; dark?: boolean }) {
  return (
    <code
      className={`ml-auto shrink-0 pl-3 ${dark ? 'text-neutral-500' : 'text-neutral-400'}`}
    >
      {name}
    </code>
  );
}

function CheckboxSample() {
  const [checked, setChecked] = useState(true);
  return <Checkbox label="장학" checked={checked} onChange={setChecked} />;
}

const NOTICES = [
  '2026학년도 겨울 계절수업 수강신청 안내',
  '졸업 사정 결과 공지',
  '2034학년도 2학기 등록금 수납계획 알림',
  '학부 전산망 양자내성암호 인증서 갱신 안내',
];

export function SurfaceExamples() {
  return (
    <div className="flex flex-col gap-9">
      <Diagram
        rule="밝은 화면의 면. 더 구분할수록 어두워집니다"
        roles={[
          ['white', '기본'],
          ['neutral-50', '한 단계 구분'],
          ['neutral-100', '두 단계 구분'],
          ['neutral-200', '마우스를 올렸거나 선택된 상태'],
          ['neutral-700', '채운 요소'],
        ]}
      >
        <div className="bg-white p-4 text-sm/[1.5] text-neutral-800">
          <p className="flex items-center text-neutral-400">
            페이지 본문
            <Pin name="white" />
          </p>

          <div className="mt-3 flex items-center gap-3 bg-neutral-50 p-3">
            <span className="shrink-0 text-xs font-bold">검색</span>
            <span className="flex h-7 w-44 items-center justify-between rounded-sm bg-white pr-2">
              <span className="px-2 text-xs text-neutral-300">
                검색어를 입력하세요
              </span>
              <Search className="h-4 w-4 text-neutral-800" />
            </span>
            <Pin name="neutral-50" />
          </div>

          <div className="mt-3 border border-neutral-200">
            <p className="flex items-center bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-500">
              제목
              <Pin name="neutral-100" />
            </p>
            {NOTICES.map((title, i) => (
              <p
                key={title}
                className={`flex items-center px-3 py-2 transition-colors hover:bg-neutral-200 ${i % 2 ? 'bg-neutral-50' : 'bg-white'}`}
              >
                <span className="min-w-0 truncate">{title}</span>
                {i < 2 && <Pin name={i ? 'neutral-50' : 'white'} />}
              </p>
            ))}
            <p className="flex items-center bg-white px-3 py-2 transition-colors hover:bg-neutral-200">
              <span className="min-w-0 truncate text-neutral-400">
                마우스를 올려보세요
              </span>
              <Pin name="호버 neutral-200" />
            </p>
          </div>

          <div className="mt-3 flex items-center">
            <button
              type="button"
              className="bg-neutral-700 px-3 py-1.5 text-xs text-white transition-colors hover:bg-neutral-500"
            >
              목록으로
            </button>
            <Pin name="neutral-700 · 호버 -500" />
          </div>
        </div>
      </Diagram>

      <Diagram
        rule="어두운 화면의 면. 더 구분할수록 밝아집니다"
        roles={[
          ['neutral-900', '기본'],
          ['neutral-850', '한 단계 구분 — 제목 영역'],
          ['neutral-800', '한 단계 구분 — 카드'],
        ]}
      >
        <div className="bg-neutral-900 text-sm/[1.5]">
          {/* 제목 띠와 카드는 형제다. 하나가 다른 하나 위에 놓이지 않는다. */}
          <div className="flex items-center bg-neutral-850 px-4 py-4 font-bold text-white">
            학부 소개
            <Pin name="neutral-850" dark />
          </div>
          <div className="p-4">
            <div className="bg-neutral-800 p-3">
              <p className="flex items-center text-xs font-medium text-white">
                공지사항
                <Pin name="neutral-800" dark />
              </p>
              {NOTICES.slice(0, 2).map((title) => (
                <p
                  key={title}
                  className="mt-2 truncate text-xs text-neutral-300"
                >
                  {title}
                </p>
              ))}
            </div>
            <p className="mt-3 flex">
              <Pin name="neutral-900" dark />
            </p>
          </div>
        </div>
      </Diagram>

      <Diagram
        rule="오버레이. 다이얼로그 뒤의 화면을 덮어 시선을 앞으로 모읍니다"
        roles={[['overlay', '다이얼로그 뒤를 덮는 층']]}
      >
        <div className="relative bg-white p-4 text-sm/[1.5] text-neutral-800">
          <p className="text-neutral-400">첨부 파일</p>
          <p className="mt-2 text-xs text-neutral-500">수강신청_안내.pdf</p>
          <p className="mt-1 text-xs text-neutral-500">제출서류_양식.hwp</p>
          <p className="mt-1 text-xs text-neutral-500">계절수업_시간표.xlsx</p>
          <div className="absolute inset-0 bg-overlay" />
          <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 items-center border border-neutral-200 bg-white px-3 py-2.5 text-xs">
            게시물을 삭제하시겠습니까?
            <Pin name="overlay" />
          </div>
        </div>
      </Diagram>
    </div>
  );
}

export function BorderExamples() {
  return (
    <div className="flex flex-col gap-9">
      <Diagram
        rule="밝은 화면의 선. 세게 가를수록 진해집니다"
        roles={[
          ['neutral-100', '같은 성격의 것을 잇달아 놓을 때'],
          ['neutral-200', '영역의 가장자리와 그 안의 칸'],
          ['neutral-300', '값을 넣는 곳의 경계'],
          ['neutral-700', '화면을 큰 단위로 가를 때'],
        ]}
      >
        <div className="bg-white p-4 text-sm/[1.5] text-neutral-800">
          <p className="flex items-center border-b-2 border-neutral-700 pb-2 font-bold">
            2026년 세미나
            <Pin name="neutral-700" />
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-7 grow items-center border border-neutral-300 px-2 text-xs text-neutral-300">
              검색어를 입력하세요
            </span>
            <Pin name="neutral-300" />
          </div>
          <div className="mt-3 border border-neutral-200 px-3 py-2">
            <p className="flex items-center border-b border-neutral-100 pb-2">
              2026학년도 겨울 계절수업 수강신청 안내
              <Pin name="neutral-100" />
            </p>
            <p className="flex items-center pt-2">
              졸업 사정 결과 공지
              <Pin name="neutral-200" />
            </p>
          </div>
        </div>
      </Diagram>

      <Diagram
        rule="어두운 화면에서는 같은 역할에 다른 값을 씁니다"
        roles={[
          [
            'neutral-800',
            '같은 성격의 것을 잇달아 놓을 때 — 밝은 면의 neutral-100 자리',
          ],
          ['neutral-400', '값을 넣는 곳의 경계 — 밝은 면의 neutral-300 자리'],
        ]}
      >
        <div className="bg-shell-100 p-4 text-sm/[1.5]">
          <div className="flex items-center border-b border-neutral-400 pb-1.5">
            <span className="grow text-neutral-400">검색어를 입력하세요</span>
            <Pin name="neutral-400" dark />
          </div>
          <p className="mt-6 flex items-center border-t-2 border-neutral-800 pt-3 text-xs text-neutral-400">
            푸터 시작
            <Pin name="neutral-800" dark />
          </p>
        </div>
      </Diagram>
    </div>
  );
}

export function TextExamples() {
  return (
    <div className="flex flex-col gap-9">
      <Diagram
        rule="밝은 화면의 글자. 덜 읽어도 되는 것일수록 옅어집니다"
        roles={[
          ['neutral-900', '한 단계 또렷하게'],
          ['neutral-800', '기본'],
          ['neutral-600', '고를 수 있는 것의 이름'],
          ['neutral-500', '한 단계 옅게'],
          ['neutral-400', '두 단계 옅게'],
          ['neutral-300', '가장 옅게'],
          ['link', '본문 속 이동'],
          ['error', '입력값이 틀렸음'],
        ]}
      >
        <div className="bg-white p-4 text-sm/[1.5]">
          <p className="flex items-center text-md font-bold text-neutral-900">
            공학관 신축 설명회
            <Pin name="neutral-900" />
          </p>
          <p className="mt-2 flex items-center text-neutral-800">
            2026학년도 겨울 계절수업 수강신청을 안내합니다.
            <Pin name="neutral-800" />
          </p>
          <p className="mt-1.5 flex items-center text-neutral-500">
            신청 기간과 방법
            <Pin name="neutral-500" />
          </p>
          <p className="mt-1.5 flex items-center text-xs text-neutral-400">
            M1522.000600 · 3학점
            <Pin name="neutral-400" />
          </p>
          <p className="mt-1.5 flex items-center">
            <span className="text-link underline underline-offset-4">
              신청 안내 바로가기
            </span>
            <Pin name="link" />
          </p>
          <div className="mt-4 flex items-center">
            <CheckboxSample />
            <Pin name="neutral-600" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex h-7 grow items-center border border-error px-2 text-xs text-neutral-300">
              제목을 입력하세요
            </span>
            <Pin name="neutral-300" />
          </div>
          <p className="mt-1 flex items-center text-xs text-error">
            제목을 입력해주세요.
            <Pin name="error" />
          </p>
        </div>
      </Diagram>

      <Diagram
        rule="어두운 화면의 글자. 세 단계뿐입니다"
        roles={[
          ['white', '기본'],
          ['neutral-300', '한 단계 옅게'],
          ['neutral-400', '두 단계 옅게'],
        ]}
      >
        <div className="bg-shell-100 p-4 text-sm/[1.5]">
          <p className="flex items-center font-medium text-white">
            학부 소개
            <Pin name="white" dark />
          </p>
          <p className="mt-2 flex items-center text-xs text-neutral-300">
            1975년 계산통계학과로 출발했습니다
            <Pin name="neutral-300" dark />
          </p>
          <p className="mt-3 flex items-center text-neutral-400">
            학사 및 교과
            <Pin name="neutral-400" dark />
          </p>
          <p className="mt-1.5 text-neutral-400">시설 예약</p>
        </div>
      </Diagram>

      <Diagram
        rule="주황 면 위의 글자. 면이 어느 주황이냐로 갈립니다"
        roles={[
          ['white', '밝은 주황 위 — 버튼·태그의 짧은 라벨'],
          ['neutral-950', '진한 주황 위 — 읽는 글이 올라가는 넓은 면'],
        ]}
      >
        <div className="bg-white p-4">
          <div className="flex items-center">
            <button
              type="button"
              className="bg-main-orange px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-main-orange-hover active:bg-main-orange-active"
            >
              제안받기
            </button>
            <Pin name="white" />
          </div>
          <div className="mt-3 bg-main-orange-muted px-3 py-2.5">
            <p className="flex items-center text-sm font-bold text-neutral-950">
              중요 안내
              <Pin name="neutral-950" />
            </p>
            <p className="mt-1 text-xs text-neutral-950">
              학부 전산망 인증서 갱신 기한이 다가옵니다
            </p>
          </div>
        </div>
      </Diagram>
    </div>
  );
}

/** 태그는 href·onClick 이 있을 때만 호버가 붙는다. 눌러서 고를 수 있어야 색이 다 보인다. */
function TagSample() {
  const [selected, setSelected] = useState(['대학원']);
  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  return (
    <span className="flex items-center gap-2">
      {['채용정보', '대학원'].map((label) => (
        <Tag
          key={label}
          label={label}
          variant={selected.includes(label) ? 'solid' : 'outline'}
          onClick={() => toggle(label)}
        />
      ))}
    </span>
  );
}

function CurrentItemSample() {
  const [current, setCurrent] = useState(0);
  return (
    <ul className="w-full text-sm">
      {['학부 소개', '연혁', '찾아오시는 길'].map((item, index) => (
        <li key={item} className={index > 0 ? 'mt-2' : ''}>
          <button
            type="button"
            onClick={() => setCurrent(index)}
            className={
              index === current
                ? 'font-bold tracking-wider text-main-orange'
                : 'text-neutral-800 hover:text-main-orange'
            }
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function AccentExamples() {
  return (
    <Diagram
      rule="주황은 주요 행동과 현재 위치를 가리킵니다"
      roles={[
        ['main-orange', '주황 면과 테두리, 그리고 현재 위치'],
        [
          'main-orange-muted',
          '진한 주황 — 눌린 듯한 면과 어두운 화면 위의 강조',
        ],
        ['link', '본문 속 이동'],
      ]}
    >
      <div className="bg-white p-4 text-sm/[1.5]">
        <div className="flex items-center">
          <button
            type="button"
            className="bg-main-orange px-4 py-2 font-medium text-white transition-colors hover:bg-main-orange-hover active:bg-main-orange-active"
          >
            저장
          </button>
          <Pin name="main-orange · 호버 -hover · 누름 -active" />
        </div>
        <div className="mt-4 flex items-start">
          <CurrentItemSample />
          <Pin name="main-orange" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <TagSample />
          <Pin name="main-orange · 호버 -muted" />
        </div>
        <div className="mt-4 flex items-center bg-neutral-900 px-3 py-2.5">
          <span className="font-medium text-main-orange-muted">더 보기 →</span>
          <Pin name="main-orange-muted" dark />
        </div>
      </div>
    </Diagram>
  );
}

export function ShellExamples() {
  return (
    <Diagram
      rule="내비게이션·헤더·푸터는 중립색 대신 셸 색을 씁니다. 위에 놓인 면일수록 밝습니다"
      roles={[
        ['shell-100', '가장 앞'],
        ['shell-200', '한 단계 뒤'],
        ['shell-300', '두 단계 뒤'],
        ['shell-400', '가장 뒤'],
      ]}
    >
      <div className="text-xs/[1.5] text-neutral-400">
        <div className="flex items-center bg-shell-200 px-3 py-3">
          헤더
          <Pin name="shell-200" dark />
        </div>
        <div className="flex">
          <div className="flex w-28 shrink-0 flex-col justify-between bg-shell-100 px-3 py-4">
            <span className="text-white">내비게이션</span>
            <span className="mt-6 flex">
              <Pin name="shell-100" dark />
            </span>
          </div>
          <div className="flex min-w-0 grow items-start bg-shell-400 px-3 py-4">
            그 위에 펼쳐지는 패널
            <Pin name="shell-400" dark />
          </div>
        </div>
        <div className="flex items-center bg-shell-300 px-3 py-3">
          푸터 윗단
          <Pin name="shell-300" dark />
        </div>
        <div className="flex items-center bg-shell-400 px-3 py-2.5">
          푸터 아랫단
          <Pin name="shell-400" dark />
        </div>
      </div>
    </Diagram>
  );
}
