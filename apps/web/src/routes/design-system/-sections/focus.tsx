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
        초점 표시는 키보드로 이동하는 사용자에게 현재 위치를 알립니다.
      </Lead>

      <DocSection title="값">
        <Example caption="밝은 면의 버튼·링크">
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
          caption="어두운 면(헤더·내비·제목 영역·메인 어두운 띠)에서는 흰 링"
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
            ['간격', '2px', '요소 밖으로 띄웁니다'],
            ['색(밝은 면)', 'neutral-700', ''],
            [
              '색(어두운 면)',
              '흰색',
              '헤더·내비·제목 영역·메인 어두운 띠 안의 모든 것',
            ],
          ]}
        />
      </DocSection>

      <DocSection title="사용 방법">
        <RuleList
          items={[
            '초점 모양은 사이트 어디서나 같습니다. 요소마다 다른 링을 사용하거나 링을 제거하지 않습니다.',
            '초점 표시는 키보드로 이동했을 때만 나타납니다. 마우스로 클릭할 때는 나타나지 않습니다.',
            '가장자리가 잘리는 틀(캐러셀·이미지 팝업 판)에서 링이 잘리면, 틀 안쪽에 4px 여유를 두거나(캐러셀) 링을 안쪽으로 2px 들여 표시합니다(팝업 버튼). 한 줄에 놓인 버튼은 같은 모양입니다.',
            '체크박스·라디오·알약·글자 토글은 상자와 글자를 함께 감싸는 링을 표시합니다.',
            '페이지를 열 때 자동으로 뜨는 팝업은 누르기 전까지 버튼에 링을 표시하지 않습니다.',
            '보이지 않는 것(닫힌 메뉴·다른 폭의 벌·비활성 버튼)으로는 Tab으로 이동하지 않습니다.',
          ]}
        />
      </DocSection>

      <DocSection title="입력 칸">
        <Example caption="흰 면의 입력 칸·드롭다운은 링 대신 테두리만 짙게 합니다(neutral-300 → 700). 칸 둘레에 링을 표시하면 외형이 크게 달라집니다.">
          <Field border />
        </Example>
        <Example
          tone="dark"
          caption="어두운 면 위에 뜬 칸(헤더 검색)은 짙은 테두리가 배경에 묻히므로 흰 링을 표시합니다."
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

      <DocSection title="이렇게 · 이렇게 하지 않기">
        <DoDont
          good={{
            example: <Card clipped ring={RING_INSET} />,
            caption: '잘리는 자리에서는 링을 안쪽에 표시합니다.',
          }}
          bad={{
            example: <Card clipped ring={RING} />,
            caption: '바깥쪽에 표시한 링이 스크롤 영역에 잘립니다.',
          }}
        />
      </DocSection>
    </>
  );
}
