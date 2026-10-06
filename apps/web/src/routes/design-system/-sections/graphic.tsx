import type { ReactNode } from 'react';
import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';
import Node from '@/components/ui/Nodes';
import { DocSection, Example, Lead, RuleList } from '../-components/doc';

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

// 원과 선의 변형과 쓰는 곳. 새 변형을 만들지 않고 이 중에서 고른다.
const NODES: {
  variant:
    | 'straight'
    | 'straightDouble'
    | 'curvedHorizontalGray'
    | 'curvedHorizontalSmall';
  name: string;
  use: string;
  dark?: boolean;
}[] = [
  {
    variant: 'straight',
    name: '직선',
    use: '섹션 제목·게시물 본문 아래 구분, 선택형 상세 제목 아래',
  },
  {
    variant: 'straightDouble',
    name: '양 끝 원 직선',
    use: '검색 영역과 선택한 태그 사이',
  },
  {
    variant: 'curvedHorizontalGray',
    name: '직선 + 사선(회색)',
    use: '페이지 제목 영역의 breadcrumb 옆(어두운 면, 회색)',
    dark: true,
  },
  {
    variant: 'curvedHorizontalSmall',
    name: '짧은 사선',
    use: '교수 → 연구실 연결',
  },
];

function NodeList() {
  return (
    <div className="max-w-3xl divide-y divide-neutral-200 border-y border-neutral-200">
      {NODES.map((n) => (
        <div
          key={n.variant}
          className="grid items-center gap-2 py-4 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-6"
        >
          <div
            className={
              n.dark ? 'overflow-hidden bg-neutral-900 p-4 pb-20' : 'p-4'
            }
          >
            <Node variant={n.variant} />
          </div>
          <div className="space-y-1">
            <p className="type-label">{n.name}</p>
            <p className="type-meta text-neutral-500">{n.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GraphicSection() {
  return (
    <>
      <Lead>그래픽은 정보 사이의 관계를 나타냅니다.</Lead>

      <DocSection title="값">
        <Sub title="원과 선(연결과 구분)">
          <NodeList />
        </Sub>
        <Sub title="접힌 모서리(한 대상의 정보 묶음)">
          <Example caption="선택 탭(주황이 선택된 항목, 회색 탭에 마우스를 올리면 모서리가 접힙니다)과 연구실 요약.">
            <CornerFoldedRectangle
              colorTheme="orange"
              size="small"
              shadow="medium"
            >
              <span className="block whitespace-nowrap py-1 pr-6 pl-3 type-label text-white">
                선택됨
              </span>
            </CornerFoldedRectangle>
            <CornerFoldedRectangle
              colorTheme="lightGray"
              size="small"
              shadow="medium"
              animationType="folding"
            >
              <span className="block whitespace-nowrap py-1 pr-6 pl-3 type-label text-neutral-700">
                선택 안 됨
              </span>
            </CornerFoldedRectangle>
            <CornerFoldedRectangle
              colorTheme="summary"
              size="large"
              shadow="light"
            >
              <div className="w-56 max-w-full px-5 py-4 type-meta text-neutral-700">
                연구실 위치·전화·홈페이지
              </div>
            </CornerFoldedRectangle>
          </Example>
        </Sub>
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '원과 선은 이어진 정보(제목과 그 내용, 교수와 연구실)를 이을 때 위 변형에서 골라 사용합니다. 밝은 면에서는 주황, 어두운 제목 영역에서는 회색입니다. 어두운 면의 주황 선은 내비의 현재 위치 표시입니다.',
            '접힌 모서리는 선택 탭과 연구실 요약 두 곳에만 사용합니다. 자리가 늘면 한 대상의 정보 묶음이라는 뜻이 흐려집니다.',
            '메인 그래픽(원과 막대 여섯 줄, ASCII로 읽으면 SNUCSE)은 메인 첫 화면에만 사용합니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '관계없는 묶음을 나누거나 빈 곳을 채울 때는 그리지 않습니다(나눌 때는 회색 구분선). 그래픽이 있으면 이어진 정보로 읽힙니다.',
            '새로 그리는 그래픽을 누를 수 있다는 표시로 쓰지 않습니다. 이동은 선 옆의 이름(링크)이, 선택은 주황이 알립니다. 선택 탭의 접힘은 아래 작동 방식의 예외입니다.',
          ]}
        />
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '선택 안 된 탭은 마우스를 올리면 모서리가 접히고 면과 글자가 한 단계 짙어집니다. 접힌 모서리는 선택된 탭의 표시라서, 접히는 동작이 누르면 이 탭이 선택된다는 것을 미리 보여 줍니다.',
          ]}
        />
      </DocSection>
    </>
  );
}
