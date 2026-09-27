import { useState } from 'react';
import PillGroup from '@/components/ui/PillGroup';
import { Tag } from '@/components/ui/Tag';
import TextToggle from '@/components/ui/TextToggle';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
  VariantTable,
} from '../-components/doc';

// 선택·태그 페이지. 실제 PillGroup·TextToggle·Tag 를 그린다. 색·높이·호버는 부품이 정하므로 적지 않는다.

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

function ViewPills() {
  const [value, setValue] = useState<(typeof VIEW)[number]['value']>('list');
  return (
    <PillGroup
      ariaLabel="보기 방식"
      options={VIEW}
      value={value}
      onChange={setValue}
    />
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
              use: '목록을 필터링하거나 정렬할 때 사용합니다(교수 정렬, 교과목 정렬).',
            },
            {
              name: '알약(어두운 면)',
              sample: <DarkPills />,
              use: '메인 공지 패널 전용. 메인 그래픽과 어우러지도록 주황을 사용합니다.',
              dark: true,
            },
            {
              name: '글자 토글',
              sample: <Toggle />,
              use: '같은 영역의 보기 방식을 전환합니다(교과목 목록형/카드형, 편집 화면의 한글/English).',
            },
            {
              name: '태그',
              sample: <Tag label="장학" href="/design-system/selection" />,
              use: '글의 분류. 누르면 해당 분류의 목록으로 이동합니다.',
            },
            {
              name: '태그(지우기)',
              sample: <Tag label="학부" onDelete={() => {}} />,
              use: '검색 영역에서 선택한 태그.',
            },
          ]}
        />
        <RuleList
          items={['어두운 알약은 메인 공지 패널 밖에서 사용하지 않습니다.']}
        />
      </DocSection>

      <DocSection title="이 모양을 사용하지 않는 것">
        <RuleList
          items={[
            '학사 연혁의 연도 원 → 연혁 그래픽(고유 화면).',
            '연구 그룹·시설 등의 접힌 모서리 선택 탭 → 그래픽.',
            '푸터 제작진 이름표 → 분류가 아니라 이름 목록이라 태그가 아닙니다(내비게이션·셸).',
            '폼 안에서 값을 선택할 때 → 체크박스·라디오(입력·폼).',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않기">
        <DoDont
          good={{
            example: <Pills />,
            caption: '목록 필터링과 정렬에는 알약을 사용합니다.',
          }}
          bad={{
            example: (
              <>
                <Tag label="가나다순" onClick={() => {}} />
                <Tag label="소속순" onClick={() => {}} />
              </>
            ),
            caption:
              '태그를 선택 컨트롤로 사용합니다. 태그는 글의 분류를 표시합니다.',
          }}
        />
        <DoDont
          good={{
            example: <Toggle />,
            caption:
              '보기 전환은 보조 기능이므로 눈에 덜 띄는 글자 토글을 사용합니다.',
          }}
          bad={{
            example: <ViewPills />,
            caption: '보기 전환에 알약을 사용하면 목록 필터처럼 보입니다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['form', '입력·폼'],
            ['button', '버튼'],
            ['search', '검색 입력'],
            ['graphic', '그래픽'],
          ]}
        />
      </DocSection>
    </>
  );
}
