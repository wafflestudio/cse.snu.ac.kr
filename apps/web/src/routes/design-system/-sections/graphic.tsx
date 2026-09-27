import type { ReactNode } from 'react';
import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';
import Node from '@/components/ui/Nodes';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

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

// 이렇게·하지 않기 도식: 서로 관계없는 두 묶음.
function TwoGroups({ node }: { node?: boolean }) {
  return (
    <div className="w-48 space-y-4">
      <p className="type-meta">학부 사무실 위치·전화</p>
      {node ? (
        <Node variant="straight" />
      ) : (
        <div className="border-t border-neutral-200" />
      )}
      <p className="type-meta">열람실 운영 시간 · 09:00–18:00</p>
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
          <Example caption="두 곳에만 사용합니다. 선택 탭(주황이 선택된 항목)과 연구실 상세의 연락처 요약입니다.">
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

      <DocSection title="사용 방법">
        <RuleList
          items={[
            '그래픽은 원과 선, 접힌 모서리, 메인 그래픽 세 가지입니다. 빈 곳을 채우는 장식으로 사용하지 않습니다.',
            '원과 선은 위 변형 중에서 선택합니다. 직선과 45도 사선만 사용하고 끝에 원을 배치합니다.',
            '선에는 클릭 동작을 적용하지 않습니다. 이동은 선 옆의 이름(링크)이 맡습니다.',
            '밝은 면에서는 주황, 어두운 제목 영역에서는 회색 선입니다. 어두운 내비의 주황 선은 "현재 위치" 표시라 예외입니다.',
            '관계가 없는 정보 묶음은 그래픽 대신 neutral-200 구분선으로 구분합니다.',
            '서브내비의 세로 곡선은 서브내비 전용입니다.',
            '접힌 모서리 자체는 "누를 수 있음"이나 "선택됨"을 뜻하지 않습니다. 선택은 주황 색이 알립니다.',
            '긴 본문이나 문서의 모든 섹션을 접힌 모서리로 감싸지 않습니다.',
            '메인 그래픽(0과 1을 나타내는 여섯 줄의 원과 막대로, ASCII로 읽으면 SNUCSE)은 메인 첫 화면에만 사용합니다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않기">
        <DoDont
          good={{
            example: <TwoGroups />,
            caption: '관계없는 묶음은 회색 구분선으로 구분합니다.',
          }}
          bad={{
            example: <TwoGroups node />,
            caption: '원과 선으로 구분하면 이어진 정보처럼 읽힙니다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['color', '색'],
            ['icon', '아이콘'],
            ['selection', '선택·태그'],
            ['main', '메인·카테고리'],
          ]}
        />
      </DocSection>
    </>
  );
}
