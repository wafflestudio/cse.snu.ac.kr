import { useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowLeft, CircleCheck } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CategoryGrid from '@/components/feature/category/CategoryGrid';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import ArrowLink from '@/components/ui/ArrowLink';
import Attachments from '@/components/ui/Attachments';
import Button from '@/components/ui/Button';
import Calendar from '@/components/ui/Calendar';
import Checkbox from '@/components/ui/Checkbox';
import HTMLViewer from '@/components/ui/HTMLViewer';
import SearchInput from '@/components/ui/SearchInput';
import { toast } from '@/components/ui/sonner';
import Tabs from '@/components/ui/Tabs';
import { Tag } from '@/components/ui/Tag';
import { TEXT_LINK } from '@/components/ui/textLink';
import type { NavItem } from '@/constants/navigation';
import LinkRow from '@/routes/$locale/-components/LinkRow';
import CourseList from '@/routes/$locale/academics/-components/courses/CourseList';
import PrivacyPolicyLink from '@/routes/$locale/reservations/-components/ReservationCalendar/PrivacyPolicyLink';
import type { Course } from '@/types/api';
import { SampleFormProvider, stay } from '../../-components/sample';
import LegacyAction from '../../-legacy/Action';
import { LegacyPrivacyPolicyLink } from '../../-legacy/AddReservationModal';
import LegacyAlertPanel from '../../-legacy/AlertDialog';
import { LegacyAttachments } from '../../-legacy/Attachments';
import LegacyButton from '../../-legacy/Button';
import { LegacyCalendar } from '../../-legacy/Calendar';
import { LegacyCategoryGrid } from '../../-legacy/CategoryGrid';
import { LegacyCheckbox } from '../../-legacy/Checkbox';
import { LegacyCourseList } from '../../-legacy/CourseList';
import LegacyFieldset from '../../-legacy/Fieldset';
import { LegacyFilePicker } from '../../-legacy/File';
import { LegacyFooterBottomLeft } from '../../-legacy/Footer';
import { LegacyHeaderSearchBar } from '../../-legacy/HeaderSearchBar';
import { LegacyImagePicker } from '../../-legacy/Image';
import { LegacyLanguagePicker } from '../../-legacy/LanguagePicker';
import { LegacyLinkRow } from '../../-legacy/LinkRow';
import { LegacyLinkSectionColumn } from '../../-legacy/LinkSection';
import { LegacySearchBox } from '../../-legacy/SearchBox';
import { LegacySearchResultRow } from '../../-legacy/SearchResultRow';
import { LegacySection } from '../../-legacy/Section';
import LegacyText from '../../-legacy/Text';
import { LegacyTextList } from '../../-legacy/TextList';

// v2 개선 기록의 견본. "후"는 지금 쓰는 실제 부품, "전"은 base 커밋(d1baf83c)의 예전 부품을 옮긴 -legacy 사본이다.
// 실제 부품을 쓸 수 없는 자리(라우터 로더·네트워크가 필요한 것)만 지금 클래스 그대로 다시 그렸고, 그 자리에 적어 두었다.
// 견본 안의 링크는 진짜 링크(커서·호버·초점)지만 누르면 이동하지 않는다.

const HERE = '/design-system';

// 안에 든 실제 부품의 링크(라우터 Link·내려받기 링크)를 눌러도 이동하지 않게 클릭을 먼저 붙잡는다.
function NoNav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className} onClickCapture={stay}>
      {children}
    </div>
  );
}

// 견본을 어떻게 만져 보는지 적는 한 줄.
function Hint({ children }: { children: ReactNode }) {
  return (
    <p className="w-full text-center type-meta text-neutral-500">{children}</p>
  );
}

// ── 색 ────────────────────────────────────────────────────────────

// 예전 링크는 text-link(#3c7be4) + 호버 밑줄. 지금은 사람 상세·세미나 상세의 링크와 같은 클래스.
export function LinkSentence({ old }: { old: boolean }) {
  return (
    <span className="type-ui">
      자세한 내용은{' '}
      <a
        href={HERE}
        onClick={stay}
        className={old ? 'text-[#3c7be4] hover:underline' : TEXT_LINK}
      >
        학사 안내
      </a>
      를 확인해 주세요.
    </span>
  );
}

// ── 글자 ──────────────────────────────────────────────────────────

// 푸터 아래 띠(밝은 판)의 안내 링크와 주소. 지금 것은 Footer 안 함수라 지금 클래스 그대로 다시 그렸다.
export function Address({ old }: { old: boolean }) {
  if (old) {
    return (
      <div className="w-78 bg-neutral-100 px-6 py-[30px] text-left">
        <LegacyFooterBottomLeft />
      </div>
    );
  }
  const link = 'hover:text-main-orange-dark';
  return (
    <div className="surface-light w-78 bg-neutral-100 px-5 py-8 text-left">
      <div className="type-meta text-neutral-600">
        <div className="mb-1 flex gap-2 [&>a]:font-bold">
          <a href={HERE} onClick={stay} className={link}>
            개인정보처리방침
          </a>
          <span>|</span>
          <a href={HERE} onClick={stay} className={link}>
            학부 연락처
          </a>
          <span>|</span>
          <a href={HERE} onClick={stay} className={link}>
            찾아오시는 길
          </a>
        </div>
        <address className="mb-6 not-italic">
          08826 서울특별시 관악구 관악로 1 서울대학교 공과대학 컴퓨터공학부
          행정실(301동 316호)
        </address>
      </div>
    </div>
  );
}

const SHORTCUTS: [title: string, subtitle?: string][] = [
  ['Top Conference List'],
  ['신임교수초빙', 'Faculty Recruitment'],
  ['구성원', 'Faculty'],
];

// 모바일 메인 아래 바로가기 한 열. 지금 것은 실제 LinkRow(이 페이지로 가는 링크라 이동하지 않는다).
export function LinkGroup({ old }: { old: boolean }) {
  const { pathname } = useLocation();
  if (old) {
    return (
      <div className="w-full max-w-80 bg-neutral-900 px-6 py-8 text-left">
        <LegacyLinkSectionColumn title="바로가기">
          {SHORTCUTS.map(([title, subtitle]) => (
            <LegacyLinkRow key={title} title={title} subtitle={subtitle} />
          ))}
        </LegacyLinkSectionColumn>
      </div>
    );
  }
  return (
    <NoNav className="surface-dark w-full max-w-80 bg-neutral-900 px-6 py-8 text-left">
      <div className="flex flex-col gap-6">
        <h3 className="type-section text-neutral-400">바로가기</h3>
        <div className="flex flex-col gap-5">
          {SHORTCUTS.map(([title, subtitle]) => (
            <LinkRow
              key={title}
              to={pathname}
              title={title}
              subtitle={subtitle}
            />
          ))}
        </div>
      </div>
    </NoNav>
  );
}

// 보조 글자 대비: 교과목 목록 한 곳을 실제 화면 그대로. 예전 것은 구분·학점·학년이 neutral-400.
const course = (
  name: string,
  classification: string,
  code: string,
  credit: number,
  grade: number,
): Course => ({
  code,
  credit,
  grade,
  studentType: 'undergraduate',
  ko: { name, classification, description: '' },
  en: { name, classification, description: '' },
});

const COURSES = [
  course('컴퓨터의 개념 및 실습', '전공필수', '4190.101', 3, 1),
  course('자료구조', '전공필수', '4190.210', 3, 2),
];

export function CourseMeta({ old }: { old: boolean }) {
  return (
    // 데스크톱 표는 다섯 칸이라 칸보다 넓을 수 있다. 칸 안에서 가로로 민다.
    <div className="w-full overflow-x-auto">
      <div className="sm:min-w-[32rem]">
        {old ? (
          <LegacyCourseList
            courses={COURSES.map((c) => ({
              name: c.ko.name,
              classification: c.ko.classification,
              code: c.code,
              credit: c.credit,
              grade: `${c.grade}학년`,
            }))}
          />
        ) : (
          <CourseList courses={COURSES} onSelectCourse={() => undefined} />
        )}
      </div>
    </div>
  );
}

// 13px 미만 글자: 메인 바로가기 한 줄. 영문 부제가 예전 12px, 지금 보조 글자 13px.
export function ShortcutRow({ old }: { old: boolean }) {
  const { pathname } = useLocation();
  return (
    <div className="surface-dark w-full max-w-80 bg-neutral-900 px-6 py-6 text-left">
      {old ? (
        <LegacyLinkRow title="신임교수초빙" subtitle="Faculty Recruitment" />
      ) : (
        <NoNav>
          <LinkRow
            to={pathname}
            title="신임교수초빙"
            subtitle="Faculty Recruitment"
          />
        </NoNav>
      )}
    </div>
  );
}

// ── 간격 ──────────────────────────────────────────────────────────

const RESULTS = [
  {
    title: '2학기 수강신청 안내',
    preview: [
      { text: '2026학년도 2학기 ', hit: false },
      { text: '수강신청', hit: true },
      { text: ' 일정과 유의 사항을 안내합니다.', hit: false },
    ],
    type: '공지사항',
    date: '2026년 9월 24일 목요일',
  },
  {
    title: '10월 콜로키움 일정',
    preview: [
      { text: '10월 콜로키움 연사와 ', hit: false },
      { text: '일정', hit: true },
      { text: '을 알려 드립니다.', hit: false },
    ],
    type: '새 소식',
    date: '2026년 9월 30일 수요일',
  },
];

// 통합 검색. 검색 칸은 실제 SearchInput, 결과 줄은 로더·라우터에 묶인 SearchResultRow 를 지금 클래스 그대로 다시 그렸다.
export function SearchResults({ old }: { old: boolean }) {
  if (old) {
    return (
      <div className="w-full max-w-96 text-left">
        <LegacySearchBox />
        <p className="mb-11 ml-3 text-md text-neutral-500">25개의 검색결과</p>
        <div className="flex flex-col gap-7">
          {RESULTS.map((item) => (
            <LegacySearchResultRow key={item.title} item={item} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-96 text-left">
      <div className="mb-12 w-full">
        <form
          className="flex flex-col gap-6 bg-neutral-50 p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <SearchInput label="검색" ariaLabel="검색" name="keyword" />
        </form>
      </div>
      <p className="mb-6 border-b border-neutral-200 pb-4 type-meta text-neutral-500">
        25개의 검색결과
      </p>
      <div className="flex flex-col gap-6">
        {RESULTS.map((item) => (
          <article
            key={item.title}
            className="border-b border-neutral-200 pb-6"
          >
            <a href={HERE} onClick={stay} className="group flex gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="type-item tracking-wide text-neutral-950 group-hover:text-main-orange-dark">
                  {item.title}
                </span>
                <p className="line-clamp-2 type-body text-neutral-700">
                  {item.preview.map((segment) =>
                    segment.hit ? (
                      <span
                        key={`${segment.text}-hit`}
                        className="font-bold text-neutral-950"
                      >
                        {segment.text}
                      </span>
                    ) : (
                      <span key={segment.text}>{segment.text}</span>
                    ),
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Tag label={item.type} />
                  <time className="type-meta tracking-wide text-neutral-500">
                    {item.date}
                  </time>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}

// ── 아이콘 ────────────────────────────────────────────────────────

// 헤더 검색 칸. 예전은 HeaderSearchBar 사본, 지금은 헤더와 같은 SearchInput(tone dark)을 form 에 담았다.
function HeaderSearchField({ old }: { old: boolean }) {
  if (old) return <LegacyHeaderSearchBar />;
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <SearchInput tone="dark" ariaLabel="통합검색" />
    </form>
  );
}

export function HeaderSearch({ old }: { old: boolean }) {
  return (
    <div className="surface-dark bg-neutral-900 p-5">
      <HeaderSearchField old={old} />
    </div>
  );
}

// 같은 칸의 검색 버튼 둘레에 점선을 그려 실제 누르는 영역(버튼 요소의 크기)을 보인다.
export function HitArea({ old }: { old: boolean }) {
  return (
    <div className="surface-dark bg-neutral-900 p-5 [&_button]:outline-1 [&_button]:outline-red-600 [&_button]:outline-dashed">
      <HeaderSearchField old={old} />
    </div>
  );
}

// ── 초점 ──────────────────────────────────────────────────────────

const FOCUS_TAGS = ['장학', '학부'];

// 숨긴 입력으로 만든 체크박스. 예전 것은 Tab 으로 옮겨도 아무 표시가 없다.
// 지금 것은 실제 Checkbox 이고, 아무 칸에도 초점이 없을 때 둘째 칸에 초점 링을 미리 그려 둔다.
export function CheckboxFocus({ old }: { old: boolean }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    장학: true,
    학부: false,
  });
  const toggle = (tag: string) => (next: boolean) =>
    setChecked((prev) => ({ ...prev, [tag]: next }));

  if (old) {
    return (
      <>
        <div className="flex gap-5">
          {FOCUS_TAGS.map((tag) => (
            <LegacyCheckbox
              key={tag}
              label={tag}
              checked={checked[tag]}
              onChange={toggle(tag)}
            />
          ))}
        </div>
        <Hint>Tab 키로 옮겨도 초점이 어디 있는지 보이지 않습니다.</Hint>
      </>
    );
  }
  return (
    <>
      <div className="flex gap-5 [&:not(:has(:focus-visible))>label:nth-child(2)]:outline-2 [&:not(:has(:focus-visible))>label:nth-child(2)]:outline-offset-2 [&:not(:has(:focus-visible))>label:nth-child(2)]:outline-neutral-700 [&:not(:has(:focus-visible))>label:nth-child(2)]:outline-solid">
        {FOCUS_TAGS.map((tag) => (
          <Checkbox
            key={tag}
            label={tag}
            checked={checked[tag]}
            onChange={toggle(tag)}
          />
        ))}
      </div>
      <Hint>둘째 칸에 초점이 간 모습입니다. Tab 키로 옮겨 볼 수 있습니다.</Hint>
    </>
  );
}

// ── 문구 ──────────────────────────────────────────────────────────

// 예전 토스트(sonner 기본: 모서리 8, 13px, 검정으로 채운 아이콘). 지금 판으로는 띄울 수 없어 그 값 그대로 그렸다.
function OldToast({ message }: { message: string }) {
  return (
    <div className="flex w-full max-w-[356px] items-center gap-1.5 rounded-lg border border-[#e2e2e2] bg-white p-4 text-left text-[13px] text-[#171717] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <span className="relative -ml-[3px] mr-1 flex size-4 shrink-0 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          height="20"
          width="20"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span className="font-medium leading-normal">{message}</span>
    </div>
  );
}

// 지금 토스트. 판은 화면 아래에 뜨는 실제 토스트와 같은 값으로 그려 두고, 버튼으로 실제 토스트를 띄운다.
export function Toast({ message, old }: { message: string; old: boolean }) {
  if (old) return <OldToast message={message} />;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-[356px] items-start gap-2 border border-neutral-200 bg-white p-4 text-left text-[14px] text-neutral-950 shadow-overlay">
        <CircleCheck className="shrink-0 text-neutral-950" />
        <span className="font-medium leading-[1.2]">{message}</span>
      </div>
      <Button variant="text" onClick={() => toast.success(message)}>
        실제로 띄워 보기
      </Button>
    </div>
  );
}

// 입력 오류 문구. 예전 글자 칸은 오류를 그리지 않아 문장이 버튼 줄 옆에만 나왔다.
function OldCourseName() {
  const { setError } = useFormContext();
  useEffect(() => {
    setError('name', { type: 'required', message: '교과목명' });
  }, [setError]);
  return (
    <div className="w-full max-w-80 text-left">
      <LegacyFieldset title="교과목명" required>
        <LegacyText name="name" />
      </LegacyFieldset>
      <LegacyAction />
    </div>
  );
}

// 지금은 실제 Form.Text. 비워 둔 채 검사해 필드 아래 오류를 보이고, 글자를 넣으면 사라진다.
function NowCourseName() {
  const { trigger } = useFormContext();
  useEffect(() => {
    void trigger('name');
  }, [trigger]);
  return (
    <div className="w-full max-w-80 text-left">
      <Fieldset title="교과목명" required>
        <Form.Text
          name="name"
          options={{ required: '교과목명을 입력해 주세요.' }}
        />
      </Fieldset>
    </div>
  );
}

export function FieldError({ old }: { old: boolean }) {
  return (
    <SampleFormProvider defaultValues={{ name: '' }}>
      {old ? <OldCourseName /> : <NowCourseName />}
    </SampleFormProvider>
  );
}

const WORDING: [string, string][] = [
  ['저장하기', '저장'],
  ['입력해주세요', '입력해 주세요'],
  ['새소식', '새 소식'],
  ['게시글', '게시물'],
  ['선택된 공지', '선택한 공지'],
  ['편집중인 내용', '저장하지 않은 내용'],
];

export function Wording({ old }: { old: boolean }) {
  return (
    <ul className="grid gap-2 type-ui">
      {WORDING.map(([before, after]) => (
        <li key={before}>{old ? before : after}</li>
      ))}
    </ul>
  );
}

// ── 컴포넌트: 버튼 ────────────────────────────────────────────────

// 예전 주요(주황) 버튼은 호버·누름 상태가 없어 세 개 모두 실제 버튼이어도 같은 모습이다.
// 지금 것은 호버·누름을 고정해 그린 셋 옆에 직접 만져 볼 실제 버튼을 둔다.
export function ButtonStates({ old }: { old: boolean }) {
  const labelled = (label: string, button: ReactNode) => (
    <div key={label} className="flex flex-col items-center gap-2">
      {button}
      <span className="type-meta text-neutral-500">{label}</span>
    </div>
  );
  if (old) {
    return (
      <>
        <div className="flex flex-wrap justify-center gap-4">
          {['기본', '호버', '누름'].map((label) =>
            labelled(
              label,
              <LegacyButton variant="primary">추가</LegacyButton>,
            ),
          )}
        </div>
        <Hint>셋 모두 실제 예전 버튼입니다. 올리거나 눌러도 그대로입니다.</Hint>
      </>
    );
  }
  const fixed = (bg: string) => (
    <span
      className={clsx(
        'inline-flex h-8.5 items-center justify-center rounded-xs px-4 type-label text-white',
        bg,
      )}
    >
      추가
    </span>
  );
  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {labelled('기본', fixed('bg-neutral-700'))}
        {labelled('호버', fixed('bg-neutral-600'))}
        {labelled('누름', fixed('bg-neutral-500'))}
        {labelled('직접 해 보기', <Button variant="primary">추가</Button>)}
      </div>
      <Hint>
        앞의 셋은 상태를 고정해 그린 것이고, 마지막은 실제 버튼입니다.
      </Hint>
    </>
  );
}

// 320px 화면의 삭제 확인창. 예전 판은 화면 가운데(left 50%)에서 폭을 정해 남은 절반 폭(160px)에 갇혔고,
// 버튼 글자가 줄을 바꿨다. 지금 판은 화면 폭 - 32 이고 버튼 글자는 줄을 바꾸지 않는다(판은 실제 AlertDialog 값, 버튼은 실제 Button).
export function NarrowDialogButtons({ old }: { old: boolean }) {
  if (old) {
    return (
      <div className="w-40 break-normal text-left">
        <LegacyAlertPanel description="게시물을 삭제하시겠습니까?" />
      </div>
    );
  }
  return (
    <div className="w-72 max-w-full border-t-3 border-main-orange bg-white p-6 text-left shadow-overlay">
      <p className="whitespace-pre-line type-body text-neutral-950">
        {'이 게시물을 삭제하시겠습니까?\n되돌릴 수 없습니다.'}
      </p>
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="secondary">취소</Button>
        <Button variant="primary">삭제</Button>
      </div>
    </div>
  );
}

// ── 컴포넌트: 입력·폼 ─────────────────────────────────────────────

function OldErrorFields() {
  const { setError } = useFormContext();
  useEffect(() => {
    setError('title', { type: 'required', message: '제목을 입력해주세요.' });
  }, [setError]);
  return (
    <>
      <LegacyFieldset title="제목" required>
        <LegacyText name="title" />
      </LegacyFieldset>
      <LegacyFieldset title="작성자">
        <LegacyText name="author" />
      </LegacyFieldset>
      <LegacyAction />
    </>
  );
}

function NowErrorFields() {
  const { trigger } = useFormContext();
  useEffect(() => {
    void trigger('title');
  }, [trigger]);
  return (
    <>
      <Fieldset title="제목" required>
        <Form.Text
          name="title"
          options={{ required: '제목을 입력해 주세요.' }}
        />
      </Fieldset>
      <Fieldset title="작성자">
        <Form.Text name="author" />
      </Fieldset>
      <Form.Action
        onCancel={() => {}}
        onSubmit={async () => {
          await trigger();
        }}
      />
    </>
  );
}

// 제목을 비운 채 저장을 누른 상태. 예전은 오류 문장이 버튼 줄 옆에만, 지금은 칸 아래와 버튼 옆 개수로.
export function ErrorSketch({ inline }: { inline: boolean }) {
  return (
    <SampleFormProvider defaultValues={{ title: '', author: '' }}>
      <div className="w-full max-w-80 text-left">
        {inline ? <NowErrorFields /> : <OldErrorFields />}
      </div>
    </SampleFormProvider>
  );
}

// 날짜 선택 달력. 고른 날은 오늘에서 이틀 뒤(같은 달에 없으면 이틀 앞).
function pickedDate() {
  const today = new Date();
  const picked = new Date(today);
  picked.setDate(today.getDate() + 2);
  if (picked.getMonth() !== today.getMonth()) {
    picked.setDate(today.getDate() - 2);
  }
  return picked;
}

export function MiniCalendar({ old }: { old: boolean }) {
  const [date, setDate] = useState(pickedDate);
  if (old) return <LegacyCalendar initial={date} />;
  return <Calendar selected={date} onSelect={setDate} />;
}

const LONG_FILE_NAME = '2026학년도_전기_대학원_입학전형_안내문_최종본.pdf';

// 첨부 파일 고르기에 긴 이름 하나를 올려 둔 상태. 파일 선택·지우기도 실제로 동작한다(올리지는 않는다).
export function FileRow({ old }: { old: boolean }) {
  const [defaultValues] = useState(() => ({
    files: [{ type: 'LOCAL_FILE', file: new File([''], LONG_FILE_NAME) }],
  }));
  return (
    <SampleFormProvider defaultValues={defaultValues}>
      <div className="w-full min-w-0 text-left">
        {old ? <LegacyFilePicker name="files" /> : <Form.File name="files" />}
      </div>
    </SampleFormProvider>
  );
}

// 편집 언어. 예전은 숨긴 라디오 + 밑줄, 지금은 같은 밑줄 모양의 진짜 탭(←→ 로 옮기면 패널이 바뀐다).
const LANGUAGES = [
  { value: 'ko', label: '한글' },
  { value: 'en', label: 'English' },
] as const;

export function EditLanguage({ old }: { old: boolean }) {
  const [value, setValue] = useState<(typeof LANGUAGES)[number]['value']>('ko');
  if (old) return <LegacyLanguagePicker />;
  return (
    <div className="w-full max-w-60 text-left">
      <Tabs
        ariaLabel="편집 언어"
        tabs={LANGUAGES}
        value={value}
        onChange={setValue}
      >
        <span className="type-meta text-neutral-500">
          {value === 'ko' ? '한글 입력 칸' : '영문 입력 칸'}
        </span>
      </Tabs>
    </div>
  );
}

// 교수진 추가 폼의 한 부분(사진·연락처·이름·직함·학력). 예전 것은 d1baf83c 의 FacultyEditor 를 예전 폼 부품 사본으로,
// 지금 것은 실제 폼 부품으로 그린다. 둘 다 입력·초점·사진 고르기·학력 추가가 실제로 동작하고 저장은 하지 않는다.
const FACULTY = {
  image: null,
  phone: '(02) 880-0000',
  fax: '',
  email: 'cskim@snu.ac.kr',
  name: '김철수',
  academicRank: '교수',
  educations: ['서울대학교 컴퓨터공학 박사 (2010)'],
};

function OldFacultySlice() {
  return (
    <>
      <LegacyFieldset title="사진" spacing="mb-12">
        <span className="mb-3 whitespace-pre-wrap text-[13px] font-normal tracking-wide text-neutral-500">
          3:4 비율의 증명사진이 가장 적합합니다.
        </span>
        <LegacyImagePicker name="image" />
      </LegacyFieldset>
      <LegacySection title="연락처 정보">
        <div className="flex w-2xl">
          <LegacyFieldset title="전화번호" spacing="mb-5">
            <LegacyText name="phone" maxWidth="max-w-[20rem]" />
          </LegacyFieldset>
          <LegacyFieldset title="팩스" spacing="mb-5">
            <LegacyText name="fax" maxWidth="max-w-[20rem]" />
          </LegacyFieldset>
        </div>
        <LegacyFieldset title="이메일" spacing="mb-5">
          <LegacyText name="email" maxWidth="max-w-[25rem]" />
        </LegacyFieldset>
      </LegacySection>
      <LegacyFieldset title="이름" spacing="mb-5" required>
        <LegacyText name="name" maxWidth="max-w-[30rem]" />
      </LegacyFieldset>
      <LegacyFieldset title="직함" spacing="mb-5" required>
        <LegacyText
          name="academicRank"
          maxWidth="max-w-[30rem]"
          placeholder="예: 교수, 조교수, 명예교수 등"
        />
      </LegacyFieldset>
      <LegacyFieldset title="학력" spacing="mb-2.5">
        <LegacyTextList
          name="educations"
          placeholder="예: 서울대학교 컴퓨터공학 학사 (2003)"
        />
      </LegacyFieldset>
    </>
  );
}

function NowFacultySlice() {
  return (
    <>
      <Fieldset title="사진">
        <span className="mb-3 whitespace-pre-wrap type-meta tracking-wide text-neutral-500">
          3:4 비율의 증명사진이 가장 적합합니다.
        </span>
        <Form.Image name="image" />
      </Fieldset>
      <Form.Section title="연락처 정보">
        <Form.Row>
          <Fieldset title="전화번호">
            <Form.Text name="phone" size="md" />
          </Fieldset>
          <Fieldset title="팩스">
            <Form.Text name="fax" size="md" />
          </Fieldset>
        </Form.Row>
        <Fieldset title="이메일">
          <Form.Text name="email" size="lg" />
        </Fieldset>
      </Form.Section>
      <Fieldset title="이름" required>
        <Form.Text name="name" size="lg" />
      </Fieldset>
      <Fieldset title="직함" required>
        <Form.Text
          name="academicRank"
          size="lg"
          placeholder="예: 교수, 조교수, 명예교수 등"
        />
      </Fieldset>
      <Fieldset title="학력">
        <Form.TextList
          name="educations"
          placeholder="예: 서울대학교 컴퓨터공학 학사 (2003)"
        />
      </Fieldset>
    </>
  );
}

export function FacultyFormSlice({ old }: { old: boolean }) {
  return (
    <SampleFormProvider defaultValues={FACULTY}>
      {/* 예전 전화·팩스 줄은 672px 고정이라 칸보다 넓다. 칸 안에서 가로로 밀어 본다. */}
      <div className="w-full overflow-x-auto text-left">
        {old ? <OldFacultySlice /> : <NowFacultySlice />}
      </div>
    </SampleFormProvider>
  );
}

// 입력 칸 폭. 예전 값은 폼마다 적은 임의 폭(20rem·25rem·30rem·520px), 지금은 짧음·보통·넓음·전체 넷.
const FIELD_WIDTHS = [
  { label: '연도', old: 'w-80', size: 'sm' },
  { label: '이름', old: 'w-100', size: 'md' },
  { label: '주소', old: 'w-120', size: 'lg' },
  { label: '제목', old: 'w-130', size: 'full' },
] as const;

export function FieldWidths({ old }: { old: boolean }) {
  return (
    <SampleFormProvider>
      <div className="w-full max-w-160 text-left">
        {FIELD_WIDTHS.map(({ label, old: width, size }) =>
          old ? (
            <LegacyFieldset key={label} title={label}>
              <LegacyText name={label} maxWidth={clsx(width, 'max-w-full')} />
            </LegacyFieldset>
          ) : (
            <Fieldset key={label} title={label}>
              <Form.Text name={label} size={size} />
            </Fieldset>
          ),
        )}
      </div>
    </SampleFormProvider>
  );
}

// ── 패턴 ──────────────────────────────────────────────────────────

// 입학 카테고리의 학부·대학원(누르면 하위 카드를 펼치는 카드). 견본이라 하위 카드에는 경로를 두지 않는다.
const ADMISSIONS: NavItem = {
  key: '입학',
  children: [
    { key: '학부', children: [{ key: '수시 모집' }, { key: '정시 모집' }] },
    { key: '대학원', children: [{ key: '전기/후기 모집' }] },
  ],
};

export function CategoryCards({ old }: { old: boolean }) {
  if (old) {
    return (
      <>
        <LegacyCategoryGrid
          items={[
            { title: '학부', hasArrow: false },
            { title: '대학원', hasArrow: false },
          ]}
          initialSelected="학부"
        />
        <Hint>학부를 펼친 채 대학원에 마우스를 올려 보세요.</Hint>
      </>
    );
  }
  return (
    <>
      <NoNav className="w-full text-left">
        <CategoryGrid currentPage={ADMISSIONS} />
      </NoNav>
      <Hint>학부를 눌러 펼친 뒤 대학원에 마우스를 올려 보세요.</Hint>
    </>
  );
}

// 예전 공지의 더하기(직접 그린 20px), 뉴스의 작은 화살표(직접 그린 18px, 팔레트 밖 주황 #E65615).
function OldPlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 15.5999V10.5999H4V9.3999H9V4.3999H10.2V9.3999H15.2V10.5999H10.2V15.5999H9Z"
        fill="#E65817"
      />
    </svg>
  );
}

function OldSmallRightArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.003 3.60039L14.3984 8.99583M14.3984 8.99583L9.003 14.4004M14.3984 8.99583L3.59844 8.99583"
        stroke="#E65615"
        strokeWidth="1.3"
      />
    </svg>
  );
}

// 메인 공지(어두운 판)와 새 소식(밝은 판)의 더보기 링크. 예전 값은 d1baf83c 의 NoticeSection·NewsSection,
// 지금 것은 실제 ArrowLink(이 문서로 가는 링크라 눌러도 이동하지 않는다).
export function MoreLinks({ old }: { old: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <NoNav className="surface-dark bg-[#212121] px-4 py-3">
        {old ? (
          <a
            href={HERE}
            onClick={stay}
            className="flex text-base font-normal text-main-orange-dark"
          >
            <OldPlusIcon /> 더보기
          </a>
        ) : (
          <ArrowLink to={HERE}>더보기</ArrowLink>
        )}
      </NoNav>
      <NoNav className="bg-neutral-100 px-4 py-3">
        {old ? (
          <a
            href={HERE}
            onClick={stay}
            className="flex items-center gap-1 text-base font-normal text-[#E65615]"
          >
            더보기 <OldSmallRightArrow />
          </a>
        ) : (
          <ArrowLink to={HERE}>더보기</ArrowLink>
        )}
      </NoNav>
    </div>
  );
}

const ATTACHMENT = {
  id: 1,
  name: '학부_장학_안내.pdf',
  url: HERE,
  bytes: 245760,
};

// 첨부 파일 상자. 지금 것은 실제 Attachments(내려받기 링크는 눌러도 받지 않는다).
export function AttachmentHover({ old }: { old: boolean }) {
  if (old) return <LegacyAttachments files={[ATTACHMENT]} />;
  return (
    <NoNav className="flex">
      <Attachments files={[ATTACHMENT]} />
    </NoNav>
  );
}

const TABLE = [
  ['1학기', '컴퓨터의 개념 및 실습', '3', '필수'],
  ['2학기', '자료구조', '3', '필수'],
];

const TABLE_HTML = {
  html: `<table><tbody>${TABLE.map(
    (row) =>
      `<tr>${row.map((cell) => `<td><div>${cell}</div></td>`).join('')}</tr>`,
  ).join('')}</tbody></table>`,
  cssRules: '',
};

// 점선 틀이 화면 폭이다. 예전에는 작성자 서식이 표의 가로 스크롤을 덮어 표가 틀 밖으로 나가 페이지를 밀었다.
// 지금 본문 CSS 로는 그 상태를 다시 만들 수 없어 예전 결과(틀 밖으로 나간 표)를 그대로 그렸다.
// 지금 것은 실제 HTMLViewer 라 틀 안에서 옆으로 밀리고, 더 있으면 오른쪽 끝이 흐려진다.
export function WideTable({ old }: { old: boolean }) {
  return (
    <div className="w-48 border-x border-dashed border-neutral-400 py-3 text-left">
      {old ? (
        <table className="w-96 max-w-none border-collapse type-ui">
          <tbody>
            {TABLE.map((row) => (
              <tr key={row[1]}>
                {row.map((cell) => (
                  <td
                    key={cell}
                    className="border border-[#e1e1e1] px-2 py-1 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <HTMLViewer html={TABLE_HTML} />
      )}
    </div>
  );
}

// ── 공통 ──────────────────────────────────────────────────────────

// 브라우저 탭과 뒤로 가기 단추를 그린 그림(실제 부품이 아니다).
export function BrowserTabs({
  tabs,
  canGoBack,
}: {
  tabs: string[];
  canGoBack: boolean;
}) {
  return (
    <div className="w-60 border border-neutral-300 bg-white">
      <div className="flex gap-1 bg-neutral-100 px-2 pt-2">
        {tabs.map((tab, i) => (
          <span
            key={tab}
            className={clsx(
              'min-w-0 truncate px-2 py-1 type-meta',
              i === tabs.length - 1
                ? 'bg-white text-neutral-950'
                : 'text-neutral-500',
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 type-meta">
        <ArrowLeft
          className={canGoBack ? 'text-neutral-950' : 'text-neutral-300'}
        />
        <span className="text-neutral-500">lab.snu.ac.kr</span>
      </div>
    </div>
  );
}

// 예약 폼의 개인정보 동의 줄. 체크박스·링크는 예전 사본·지금 실제 부품(새 탭으로 열리지 않게 클릭을 막는다).
export function PrivacyLink({ old }: { old: boolean }) {
  const [agreed, setAgreed] = useState(false);
  const label = '개인정보 수집 및 이용동의';
  return (
    <div className="flex flex-wrap items-center gap-4 text-left">
      <div className="flex items-center">
        {old ? (
          <LegacyCheckbox label={label} checked={agreed} onChange={setAgreed} />
        ) : (
          <Checkbox label={label} checked={agreed} onChange={setAgreed} />
        )}
        <span className="text-main-orange">*</span>
      </div>
      {old ? (
        <LegacyPrivacyPolicyLink />
      ) : (
        <NoNav>
          <PrivacyPolicyLink />
        </NoNav>
      )}
    </div>
  );
}
