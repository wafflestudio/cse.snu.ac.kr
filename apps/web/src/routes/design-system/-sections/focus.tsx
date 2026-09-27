import clsx from 'clsx';
import Button from '@/components/ui/Button';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  RuleList,
  SpecTable,
} from '../-components/doc';

// 초점·키보드. 견본의 초점 모양은 정적 클래스로 흉내 낸다(실제 모양은 app.css 의 :focus-visible).

const RING = 'outline-2 outline-offset-2 outline-neutral-700';
const RING_DARK = 'outline-2 outline-offset-2 outline-white';
const RING_INSET = 'outline-2 -outline-offset-2 outline-neutral-700';

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

function Card({ ring, clipped }: { ring: string; clipped?: boolean }) {
  return (
    <div
      className={clsx('bg-neutral-100', clipped ? 'overflow-hidden' : 'p-3')}
    >
      <div className={clsx('flex h-24 w-36 flex-col bg-white', ring)}>
        <div className="h-10 bg-neutral-300" />
        <p className="p-2 type-label">새 소식 카드</p>
      </div>
    </div>
  );
}

export function FocusSection() {
  return (
    <>
      <Lead>
        키보드로 움직이는 사람은 초점 표시로 지금 위치를 안다. 초점 표시는
        사이트 전체가 한 모양이고, 마우스로 누를 때는 나타나지 않는다(키보드로
        옮겼을 때만).
      </Lead>

      <DocSection title="값">
        <Example caption="밝은 면 — 버튼·링크">
          <span className={clsx('inline-flex', RING)}>
            <Button variant="primary">저장</Button>
          </span>
          <span className={clsx('inline-flex', RING)}>
            <Button variant="secondary">취소</Button>
          </span>
          <a
            href="#focus"
            className={clsx('type-ui text-link underline', RING)}
          >
            링크
          </a>
        </Example>
        <Example
          tone="dark"
          caption="어두운 면(헤더·내비·제목 영역·메인 어두운 띠) — 흰 링"
        >
          <span className={clsx('inline-flex', RING_DARK)}>
            <Button variant="textInverse">로그인</Button>
          </span>
          <span className={clsx('type-ui text-white', RING_DARK)}>
            Top Conference List
          </span>
        </Example>
        <SpecTable
          head={['항목', '값', '비고']}
          rows={[
            ['선', '2px 실선', ''],
            ['간격', '2px', '요소 밖으로 띄운다'],
            ['색(밝은 면)', 'neutral-700', ''],
            [
              '색(어두운 면)',
              '흰색',
              '어두운 면 틀에 표시를 한 번 달면 안의 것이 모두 따른다',
            ],
          ]}
        />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '초점 모양은 전역 규칙 하나가 준다. 요소마다 링·outline-none 을 따로 적지 않는다.',
            '넘치는 부분을 자르는 틀(캐러셀·이미지 팝업 판)에 링이 잘리면, 틀 안쪽에 4px 여유를 두거나(캐러셀) 링을 안쪽으로 2px 띄워 그린다(팝업 버튼). 한 줄에 놓인 버튼은 같은 모양이다.',
            '숨긴 입력(체크박스·라디오·알약·글자 토글)은 초점이 숨긴 입력에 가므로 감싼 라벨에 링을 그린다.',
            '페이지를 열자마자 스스로 뜨는 팝업은 초점을 판에 둔다 — 누르기 전에 버튼에 링이 뜨지 않게.',
            '보이지 않는 것(닫힌 메뉴·다른 폭의 벌·비활성 버튼)으로 Tab이 가지 않는다.',
          ]}
        />
      </DocSection>

      <DocSection title="입력 칸">
        <Example caption="흰 면의 입력 칸·드롭다운은 링 대신 테두리만 짙게(neutral-300 → 700) — 칸 둘레에 링을 두르면 겉보기가 크게 바뀐다.">
          <Field border />
        </Example>
        <Example
          tone="dark"
          caption="어두운 면 위에 뜬 칸(헤더 검색)은 짙은 테두리가 배경에 묻혀 흰 링을 두른다."
        >
          <span
            className={clsx(
              'flex h-8.5 w-48 items-center rounded-xs bg-neutral-100 px-3 type-ui text-neutral-300',
              RING_DARK,
            )}
          >
            통합검색
          </span>
        </Example>
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: <Card clipped ring={RING_INSET} />,
            caption: '잘리는 자리에서는 링을 안쪽으로.',
          }}
          bad={{
            example: <Card clipped ring={RING} />,
            caption: '밖으로 그린 링이 스크롤 영역에 잘린다.',
          }}
        />
        <DoDont
          good={{
            example: <Field border />,
            caption: '입력 칸도 초점이 보인다(테두리가 짙어진다).',
          }}
          bad={{
            example: <Field />,
            caption: '초점을 꺼 둔다 — 어느 칸에 있는지 모른다.',
          }}
        />
      </DocSection>
    </>
  );
}
