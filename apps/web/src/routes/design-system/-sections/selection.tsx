import { useState } from 'react';
import Fieldset from '@/components/form/Fieldset';
import Form from '@/components/form/Form';
import PillGroup from '@/components/ui/PillGroup';
import Tabs from '@/components/ui/Tabs';
import { Tag } from '@/components/ui/Tag';
import TextToggle from '@/components/ui/TextToggle';
import {
  DocSection,
  DoDont,
  Example,
  KnownGap,
  Lead,
  RuleList,
  VariantTable,
} from '../-components/doc';
import { SampleFormProvider } from '../-components/sample';
import { LegacySortOptions } from '../-legacy/CourseToolbar';

// 선택·태그 페이지. 실제 PillGroup·TextToggle·Tabs·Tag 를 그린다. 색·높이·호버는 부품이 정하므로 적지 않는다.

const SORT = [
  { value: 'name', label: '가나다순' },
  { value: 'department', label: '소속순' },
] as const;
const NOTICE = [
  { value: 'all', label: '전체' },
  { value: 'scholarship', label: '장학' },
] as const;
const VIEW = [
  { value: 'list', label: '목록형' },
  { value: 'card', label: '카드형' },
] as const;

function Pills() {
  const [value, setValue] = useState<(typeof SORT)[number]['value']>('name');
  return (
    <PillGroup
      ariaLabel="정렬"
      options={SORT}
      value={value}
      onChange={setValue}
    />
  );
}

function DarkPills() {
  const [value, setValue] = useState<(typeof NOTICE)[number]['value']>('all');
  return (
    <PillGroup
      ariaLabel="공지 분류"
      tone="dark"
      options={NOTICE}
      value={value}
      onChange={setValue}
    />
  );
}

function Toggle() {
  const [value, setValue] = useState<(typeof VIEW)[number]['value']>('list');
  return (
    <TextToggle
      ariaLabel="보기 방식"
      options={VIEW}
      value={value}
      onChange={setValue}
    />
  );
}

const COURSE_SORT = [
  { value: 'year', label: '학년' },
  { value: 'type', label: '교과목 구분' },
  { value: 'credit', label: '학점' },
] as const;

function CourseSortPills() {
  const [value, setValue] =
    useState<(typeof COURSE_SORT)[number]['value']>('year');
  return (
    <PillGroup
      ariaLabel="교과목 정렬"
      options={COURSE_SORT}
      value={value}
      onChange={setValue}
    />
  );
}

const LANG = [
  { value: 'ko', label: '한글' },
  { value: 'en', label: 'English' },
] as const;

// 편집 언어: 탭이 같은 자리의 입력 칸 패널을 바꾼다. 견본 폼이라 저장하지 않는다.
const NAME = { ko: '김철수', en: 'Cheolsu Kim' } as const;

function LangPanel({ language }: { language: (typeof LANG)[number]['value'] }) {
  return (
    <Fieldset title={language === 'ko' ? '이름' : '이름(영문)'}>
      <Form.Text key={language} name={language} size="md" />
    </Fieldset>
  );
}

function LangTabs() {
  const [value, setValue] = useState<(typeof LANG)[number]['value']>('ko');
  return (
    <SampleFormProvider defaultValues={NAME}>
      <div className="w-full max-w-80 text-left">
        <Tabs
          ariaLabel="편집 언어"
          tabs={LANG}
          value={value}
          onChange={setValue}
        >
          <LangPanel language={value} />
        </Tabs>
      </div>
    </SampleFormProvider>
  );
}

// 종류 표의 작은 견본: 탭과 패널 자리만.
function TabsSample() {
  const [value, setValue] = useState<(typeof LANG)[number]['value']>('ko');
  return (
    <Tabs ariaLabel="편집 언어" tabs={LANG} value={value} onChange={setValue}>
      <span className="type-meta text-neutral-500">
        {value === 'ko' ? '한글 입력 칸' : '영문 입력 칸'}
      </span>
    </Tabs>
  );
}

// Don't: 같은 패널 바꾸기를 글자 토글(라디오)로 한 모양. 값을 고르는 컨트롤로 알려진다.
function LangToggle() {
  const [value, setValue] = useState<(typeof LANG)[number]['value']>('ko');
  return (
    <SampleFormProvider defaultValues={NAME}>
      <div className="w-full max-w-80 space-y-6 text-left">
        <TextToggle
          ariaLabel="편집 언어"
          options={LANG}
          value={value}
          onChange={setValue}
        />
        <LangPanel language={value} />
      </div>
    </SampleFormProvider>
  );
}

export function SelectionSection() {
  return (
    <>
      <Lead>
        여러 항목 중 하나를 선택하는 컨트롤은 용도에 따라 모양을 구분해
        사용합니다.
      </Lead>

      <DocSection title="예시">
        <Example>
          <Pills />
          <Toggle />
          <LangTabs />
          <Tag label="장학" href="/design-system/selection" />
          <Tag label="대학원" onDelete={() => {}} />
        </Example>
      </DocSection>

      <DocSection title="종류">
        <VariantTable
          rows={[
            {
              name: '알약',
              sample: <Pills />,
              use: '교수 정렬, 교과목 정렬.',
            },
            {
              name: '알약(어두운 면)',
              sample: <DarkPills />,
              use: '메인 공지 패널.',
              dark: true,
            },
            {
              name: '글자 토글',
              sample: <Toggle />,
              use: '교과목 목록형/카드형.',
            },
            {
              name: '탭',
              sample: <TabsSample />,
              use: '편집 화면의 한글/English 패널.',
            },
            {
              name: '태그',
              sample: <Tag label="장학" href="/design-system/selection" />,
              use: '글의 분류(공지·새 소식·검색 결과).',
            },
            {
              name: '태그(지우기)',
              sample: <Tag label="학부" onDelete={() => {}} />,
              use: '검색 영역에서 선택한 태그.',
            },
          ]}
        />
        <KnownGap>
          어두운 알약만 고른 값을 주황으로 표시합니다. 메인 그래픽과 어우러지게
          하려는 것이라 메인 공지 패널에서만 씁니다.
        </KnownGap>
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '알약은 목록을 거르거나 정렬할 때 사용합니다. 목록의 내용이 바뀌므로 눈에 띄게 둡니다.',
            '글자 토글은 같은 내용을 다른 모양으로 볼 때(목록형·카드형) 사용합니다. 내용은 그대로라 알약보다 가볍게 둡니다.',
            '값을 고르면 라디오(알약·글자 토글), 같은 자리의 패널을 바꾸면 탭입니다(편집 화면의 한글/English). 탭으로 두면 화면 읽기 프로그램이 "탭, 2개 중 1번째"처럼 읽고 아래 패널과 이어 주며, 화살표 키로 옮기면 바로 패널이 바뀝니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '태그는 분류 표시라 선택 컨트롤로 쓰지 않습니다. 같은 모양이면 무엇을 누르면 무엇이 바뀌는지 알 수 없습니다.',
            '폼에서 저장할 값은 체크박스·라디오(입력·폼)입니다. 다른 페이지로 옮겨 가는 탭은 접힌 모서리 선택 탭(그래픽)이고, 밑줄 탭은 한 폼 안의 패널만 바꿉니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <CourseSortPills />,
            caption: '정렬은 알약으로 고릅니다.',
          }}
          bad={{
            example: <LegacySortOptions />,
            caption:
              '예전 교과목 정렬은 태그를 버튼처럼 써서 분류 표시와 구분되지 않았습니다.',
          }}
        />
        <DoDont
          good={{
            example: <LangTabs />,
            caption:
              '편집 언어는 같은 자리의 입력 칸을 바꾸므로 탭입니다. 화살표 키로 옮기면 패널이 바로 바뀝니다.',
          }}
          bad={{
            example: <LangToggle />,
            caption:
              '글자 토글은 라디오라 화면 읽기 프로그램이 "라디오 버튼"으로 알려 값을 고르는 것처럼 들리고, 아래 패널과 이어지지 않습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
