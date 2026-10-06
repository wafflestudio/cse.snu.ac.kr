import clsx from 'clsx';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/ui/SearchInput';
import LinkRow from '@/routes/$locale/-components/LinkRow';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyLinkRow } from '../-legacy/LinkRow';
import { LegacyNewsCard } from '../-legacy/NewsCard';
import { SAMPLE_NEWS, SampleNewsCard } from './shape';

// 초점·키보드. 견본의 초점 모양은 정적 클래스로 흉내 낸다(실제 모양은 app.css 의 :focus-visible).
// 견본 부품은 실제 부품이라 Tab 으로 옮겨 가면 진짜 링도 볼 수 있다.

const RING = 'outline-2 outline-offset-2 outline-neutral-700';
const RING_DARK = 'outline-2 outline-offset-2 outline-white';
// 예전 모양: 브라우저 기본 파란 1px.
const RING_BLUE = 'outline-1 outline-blue-600';

function Field({ focused, border }: { focused?: boolean; border?: boolean }) {
  return (
    <span
      className={clsx(
        'flex h-8.5 w-48 items-center rounded-xs border bg-white px-3 type-ui text-neutral-300',
        border ? 'border-neutral-700' : 'border-neutral-300',
        focused && RING,
      )}
    >
      제목
    </span>
  );
}

// 메인 새 소식 캐러셀. 지금은 NewsCarousel 처럼 틀 안쪽에 4px(px-1 pt-1)을 두고, 예전(d1baf83c)은 여유 없이 잘랐다.
// 링 모양은 정적 클래스로 카드 둘레에 그린다.
function Carousel({ old }: { old?: boolean }) {
  return (
    <div
      className={clsx(
        'overflow-hidden bg-neutral-100',
        old ? 'pr-3 pb-3' : 'px-1 pt-1 pb-3',
      )}
    >
      <div className={clsx('w-fit', old ? RING_BLUE : RING)}>
        {old ? <LegacyNewsCard news={SAMPLE_NEWS} /> : <SampleNewsCard />}
      </div>
    </div>
  );
}

// 메인 아래 바로가기 한 줄. 지금은 실제 LinkRow(이 페이지를 떠나지 않는다), 예전은 d1baf83c 사본.
function Shortcut({ old }: { old?: boolean }) {
  return (
    <div
      className="w-full max-w-[342px] bg-neutral-900 p-4"
      onClickCapture={stay}
    >
      <div className={old ? RING_BLUE : RING_DARK}>
        {old ? (
          <LegacyLinkRow title="Top Conference List" />
        ) : (
          <LinkRow to="/design-system/focus" title="Top Conference List" />
        )}
      </div>
    </div>
  );
}

export function FocusSection() {
  return (
    <>
      <Lead>
        초점 표시는 키보드로 이동하는 사용자에게 현재 위치를 알립니다.
      </Lead>

      <DocSection title="값">
        <Example caption="밝은 면: 짙은 회색 2px 실선을 요소에서 2px 띄워 그립니다.">
          <span className={clsx('inline-flex', RING)}>
            <Button variant="primary">저장</Button>
          </span>
          <span className={clsx('inline-flex', RING)}>
            <Button variant="secondary">취소</Button>
          </span>
          <a
            href="#"
            onClick={stay}
            className={clsx('type-ui text-link underline', RING)}
          >
            링크
          </a>
        </Example>
        <Example tone="dark" caption="어두운 면: 같은 모양의 흰 링입니다.">
          <span className={clsx('inline-flex', RING_DARK)}>
            <Button variant="textInverse">로그인</Button>
          </span>
          <div className={clsx('w-64', RING_DARK)} onClickCapture={stay}>
            <LinkRow to="/design-system/focus" title="Top Conference List" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="입력 칸">
        <Example caption="흰 면의 입력 칸·드롭다운은 링 대신 테두리만 짙게 합니다. 칸 둘레에 링을 그리면 칸이 두 겹으로 보입니다.">
          <Field border />
        </Example>
        <Example
          tone="dark"
          caption="어두운 면 위에 뜬 칸(헤더 검색)은 짙은 테두리가 배경에 묻히므로 흰 링을 표시합니다."
        >
          <form
            className={clsx('w-fit rounded-xs', RING_DARK)}
            onSubmit={(e) => e.preventDefault()}
          >
            <SearchInput tone="dark" ariaLabel="통합검색" />
          </form>
        </Example>
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '초점 표시는 키보드 사용자가 현재 위치를 아는 유일한 단서라 반드시 남겨 두어야 하고, 요소마다 바꾸지 않습니다. 키보드로 이동할 때만 나타납니다.',
            '어두운 면(헤더·내비·제목 영역·메인 어두운 띠) 안에서는 흰 링입니다. 짙은 회색 링은 어두운 바탕에 묻힙니다.',
            '링은 누르는 영역 전체를 감쌉니다. 체크박스·라디오·알약·글자 토글은 상자와 글자를 함께 감쌉니다.',
            '가장자리를 자르는 틀(캐러셀·이미지 팝업 판)에서는 틀 안쪽에 여유를 두고, 그럴 수 없으면 링을 안쪽에 그립니다. 잘린 링은 없는 것과 같습니다.',
            '보이지 않는 것(닫힌 메뉴·다른 폭용 마크업·비활성 버튼)은 반드시 Tab 순서에서 빼야 합니다. 보이지 않는 곳으로 초점이 가면 사용자가 위치를 잃습니다.',
          ]}
        />
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <Carousel />,
            caption:
              '캐러셀 영역 안쪽에 4px 여유를 두어 바깥 링이 온전히 보입니다.',
          }}
          bad={{
            example: <Carousel old />,
            caption:
              '예전 메인 새 소식 카드는 브라우저 기본 파란 1px 링이 캐러셀에 위·왼쪽이 잘렸습니다.',
          }}
        />
        <DoDont
          good={{
            example: <Shortcut />,
            caption: '어두운 면에서는 흰 2px 링이 바탕과 분명히 구분됩니다.',
          }}
          bad={{
            example: <Shortcut old />,
            caption:
              '예전 메인 바로가기는 파란 1px 링이라 어두운 띠 위에서 거의 보이지 않았습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
