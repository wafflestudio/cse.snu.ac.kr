import type { ReactNode } from 'react';
import CornerFoldedRectangle from '@/components/ui/CornerFoldedRectangle';
import Node from '@/components/ui/Nodes';

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
  use: string;
  dark?: boolean;
}[] = [
  {
    variant: 'straight',
    use: '섹션 제목·게시물 본문 아래 구분, 선택형 상세 제목 아래',
  },
  { variant: 'straightDouble', use: '검색 영역과 선택한 태그 사이' },
  {
    variant: 'curvedHorizontalGray',
    use: '페이지 제목 영역의 breadcrumb 옆(어두운 면, 회색)',
    dark: true,
  },
  { variant: 'curvedHorizontalSmall', use: '교수 → 연구실 연결' },
];

export function GraphicSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="원과 선 — 연결과 구분">
        <p>
          원과 선은 정보 사이의 관계(이어짐)와 구분을 그린다. 직선과 45도 사선만
          쓰고, 끝에 원을 둔다.
        </p>
        <div className="max-w-3xl divide-y divide-neutral-200 border-y border-neutral-200">
          {NODES.map((n) => (
            <div
              key={n.variant}
              className="grid items-center gap-2 py-4 sm:grid-cols-[240px_1fr] sm:gap-6"
            >
              <div
                className={
                  n.dark ? 'overflow-hidden bg-neutral-900 p-4 pb-20' : 'p-4'
                }
              >
                <Node variant={n.variant} />
              </div>
              <div>
                <code className="type-meta">{n.variant}</code>
                <p className="type-meta text-neutral-500">{n.use}</p>
              </div>
            </div>
          ))}
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            선에는 클릭 동작을 주지 않는다. 이동은 선 옆의 이름(링크)이 맡는다.
          </li>
          <li>
            밝은 면에서는 주황, 어두운 제목 영역에서는 회색 선이다. 어두운
            내비의 주황 선은 "현재 위치" 표시라 예외다.
          </li>
          <li>
            빈 곳을 채우는 장식으로 쓰지 않는다. 관계가 없는 정보 묶음을 나눌
            때는 그래픽 대신 neutral-200 구분선을 쓴다.
          </li>
          <li>
            서브내비의 세로 곡선(<code>curvedVertical</code>)은 서브내비
            전용이다.
          </li>
        </ul>
      </Sub>

      <Sub title="접힌 모서리 — 한 대상의 정보 묶음">
        <p>
          파일 모서리를 접은 모양으로, 함께 읽을 정보를 하나로 묶는다. 두 곳에만
          쓴다.
        </p>
        <div className="flex flex-wrap items-start gap-10">
          <div className="space-y-2">
            <div className="flex gap-2">
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
            </div>
            <p className="type-meta text-neutral-500">
              선택 탭(SelectionList): 주황 = 선택된 항목
            </p>
          </div>
          <div className="space-y-2">
            <CornerFoldedRectangle
              colorTheme="summary"
              size="large"
              shadow="light"
            >
              <div className="w-56 px-5 py-4 type-meta text-neutral-700">
                연구실 위치·전화·홈페이지
              </div>
            </CornerFoldedRectangle>
            <p className="type-meta text-neutral-500">
              연구실 상세: 연락처 요약 묶음
            </p>
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            접힌 모서리 자체가 "클릭 가능"이나 "선택됨"을 뜻하지는 않는다.
            선택은 주황 색이 알린다.
          </li>
          <li>긴 본문이나 문서의 모든 섹션을 이 모양으로 감싸지 않는다.</li>
        </ul>
      </Sub>

      <Sub title="메인 그래픽">
        <p>
          메인의 원과 막대는 0과 1을 나타내는 여섯 줄의 기호로, ASCII로 읽으면
          SNUCSE가 된다. 메인 첫 화면에만 쓰고 다른 곳에 옮기지 않는다.
        </p>
      </Sub>
    </div>
  );
}
