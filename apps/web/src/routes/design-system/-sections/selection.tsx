import type { ReactNode } from 'react';
import { useState } from 'react';
import PillGroup from '@/components/ui/PillGroup';
import { Tag } from '@/components/ui/Tag';
import TextToggle from '@/components/ui/TextToggle';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

const SORT = [
  { value: 'name', label: '가나다순' },
  { value: 'department', label: '소속순' },
] as const;
const NOTICE = [
  { value: 'all', label: '전체' },
  { value: 'scholarship', label: '장학' },
  { value: 'undergraduate', label: '학부' },
] as const;
const VIEW = [
  { value: 'list', label: '목록형' },
  { value: 'card', label: '카드형' },
] as const;

function Samples() {
  const [sort, setSort] = useState<(typeof SORT)[number]['value']>('name');
  const [notice, setNotice] = useState<(typeof NOTICE)[number]['value']>('all');
  const [view, setView] = useState<(typeof VIEW)[number]['value']>('list');
  return {
    light: (
      <PillGroup
        ariaLabel="정렬"
        options={SORT}
        value={sort}
        onChange={setSort}
      />
    ),
    dark: (
      <div className="w-fit bg-neutral-850 p-4">
        <PillGroup
          ariaLabel="공지 분류"
          tone="dark"
          options={NOTICE}
          value={notice}
          onChange={setNotice}
        />
      </div>
    ),
    toggle: (
      <TextToggle
        ariaLabel="보기 방식"
        options={VIEW}
        value={view}
        onChange={setView}
      />
    ),
  };
}

function PillSamples() {
  const s = Samples();
  return (
    <div className="flex flex-wrap items-center gap-8">
      {s.light}
      {s.dark}
    </div>
  );
}

function ToggleSample() {
  return Samples().toggle;
}

export function SelectionSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="단일 선택 — 하는 일로 두 종류">
        <p>
          여럿 중 하나를 고르는 컨트롤은 하는 일로 모양을 고른다. 둘 다 네이티브
          radiogroup이라 화살표 키로 옮겨 다닌다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>알약</b>(<code>PillGroup</code>) — 목록을 거르거나 정렬한다(교수
            정렬·교과목 정렬·메인 공지 분류).
          </li>
          <li>
            <b>글자 토글</b>(<code>TextToggle</code>) — 같은 자리의 보기를
            바꾼다(교과목 목록형/카드형, 편집 화면의 한글/English). 보조
            기능이라 조용하게.
          </li>
        </ul>
      </Sub>

      <Sub title="알약 — 거르기·정렬">
        <PillSamples />
        <ul className="list-disc space-y-1 pl-5">
          <li>
            높이 30, 좌우 12, 14/500, 모서리 알약, 알약 사이 12. 버튼(34)보다 한
            단계 가벼워 "실행"이 아니라 "고르기"로 읽힌다. 줄이 모자라면 다음
            줄로 넘어간다.
          </li>
          <li>
            밝은 면: 고른 것 neutral-700 채움·흰 글자, 나머지 흰 바탕·테두리
            300·글자 600, 호버 neutral-100. 체크박스처럼 입력 값이라 회색이다.
          </li>
          <li>
            어두운 면(<code>tone="dark"</code>)은 메인 공지 패널 전용이다. 메인
            그래픽과 한 몸이라 주황(짙은 주황 테두리, 고른 것 채움)을 쓴다.
          </li>
        </ul>
      </Sub>

      <Sub title="글자 토글 — 보기 바꾸기">
        <ToggleSample />
        <ul className="list-disc space-y-1 pl-5">
          <li>
            고른 것 neutral-950, 나머지 neutral-500이고 호버하면 주황(2-1 글자
            버튼 규칙). 사이는 1px 세로선 neutral-300.
          </li>
        </ul>
      </Sub>

      <Sub title="단일 선택이 아닌 것">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            학사 연혁의 연도 원은 연혁 그래픽이라 3-7에서 본다. 연구 그룹·시설
            등의 접힌 모서리 선택 탭은 1-7에서 정했다.
          </li>
        </ul>
      </Sub>

      <Sub title="태그 — 한 벌">
        <div className="flex flex-wrap items-center gap-2">
          <Tag label="장학" href="/design-system#selection" />
          <Tag label="학부" />
          <Tag label="대학원" onDelete={() => {}} />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            태그는 글의 분류를 보여 준다: 주황 테두리 알약, 13px, 높이 24.
            누르면 그 분류의 목록으로 가고, 호버하면 주황 채움.
          </li>
          <li>
            검색 영역에서 고른 태그는 같은 태그에 X 지우기를 붙인다. X는 호버
            짙은 주황.
          </li>
          <li>
            태그를 선택 컨트롤로 쓰지 않는다 — 고르기는 알약. 태그 모양을 직접
            그리지 않고 <code>Tag</code>를 쓴다.
          </li>
          <li>
            푸터 제작진 이름표는 분류가 아니라 이름 목록이라 태그가 아니다 — 3-2
            셸에서 본다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
