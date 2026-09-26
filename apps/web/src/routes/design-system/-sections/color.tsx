import type { ReactNode } from 'react';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
  SpecTable,
} from '../-components/doc';

// 색 페이지 — 값은 app.css @theme 이 정본이다. 버튼의 호버·누름 색처럼 부품이 정하는 색은 적지 않는다.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function Chip({ className }: { className: string }) {
  return (
    <span
      className={`inline-block size-5 shrink-0 rounded-xs border border-neutral-200 ${className}`}
    />
  );
}

function Token({ name, chip }: { name: string; chip: string }) {
  return (
    <span className="flex items-center gap-2">
      <Chip className={chip} />
      {name}
    </span>
  );
}

const SURFACES: [string, string, string, string][] = [
  ['white', 'bg-white', '#ffffff', '밝은 바탕'],
  ['neutral-50', 'bg-neutral-50', '#fafafa', '카드·묶음'],
  ['neutral-100', 'bg-neutral-100', '#f5f5f5', '구분 면·표 헤더·선택된 줄'],
  ['neutral-200', 'bg-neutral-200', '#e5e5e5', '눌림·비활성'],
  ['neutral-900', 'bg-neutral-900', '#171717', '어두운 바탕·페이지 제목 영역'],
  [
    'neutral-850',
    'bg-neutral-850',
    '#1e1e1e',
    '어두운 판 — 카테고리 머리·메인 공지·왼쪽 내비·모바일 메뉴·푸터 아랫단',
  ],
  ['neutral-800', 'bg-neutral-800', '#262626', '올린 면 — 모바일 푸터 윗단'],
  ['chrome-bar', 'bg-chrome-bar', '#2d2d30', '모바일 상단 바'],
  [
    'chrome-menu',
    'bg-chrome-menu',
    '#323235',
    '내비 펼침 패널·모바일 메뉴 펼침(내비 위로 올라온 면)',
  ],
];

export function ColorSection() {
  return (
    <>
      <Lead>
        면과 글자는 회색 단계로 짓고, 행동은 회색의 짙기로, 현재 위치·선택 같은
        표시는 주황으로 한다.
      </Lead>

      <DocSection title="값">
        <Sub title="면">
          <SpecTable
            head={['토큰', '값', '쓰는 곳']}
            rows={SURFACES.map(([name, chip, hex, use]) => [
              <Token key={name} name={name} chip={chip} />,
              hex,
              use,
            ])}
          />
        </Sub>

        <Sub title="글자">
          <SpecTable
            head={['토큰', '역할', '쓰는 곳']}
            rows={[
              [
                <span key="1" className="text-neutral-950">
                  neutral-950
                </span>,
                '주요',
                '제목·본문',
              ],
              [
                <span key="2" className="text-neutral-700">
                  neutral-700
                </span>,
                '설명',
                '설명문·부제',
              ],
              [
                <span key="3" className="text-neutral-500">
                  neutral-500
                </span>,
                '보조',
                '날짜·작성자·도움말',
              ],
              [
                <span key="4" className="text-neutral-300">
                  neutral-300
                </span>,
                '비활성',
                '비활성·자리표시',
              ],
              [
                <span key="5" className="bg-neutral-900 px-1.5 text-white">
                  white
                </span>,
                '어두운 면 주요',
                '헤더·내비·제목 영역',
              ],
              [
                <span
                  key="6"
                  className="bg-neutral-900 px-1.5 text-neutral-400"
                >
                  neutral-400
                </span>,
                '어두운 면 보조',
                '어두운 면의 날짜·설명',
              ],
            ]}
          />
        </Sub>

        <Sub title="강조·선·오류">
          <SpecTable
            head={['토큰', '값', '쓰는 곳']}
            rows={[
              [
                <Token key="o" name="main-orange" chip="bg-main-orange" />,
                '#ff6914',
                '현재 위치·선택·호버·태그·필수 표시·원과 선',
              ],
              [
                <Token
                  key="od"
                  name="main-orange-dark"
                  chip="bg-main-orange-dark"
                />,
                '#e65817',
                '호버·눌림, 배너 면',
              ],
              [
                <Token key="l" name="link" chip="bg-link" />,
                '#2867cf',
                '본문 속 정보 링크(연락처·이메일·홈페이지)',
              ],
              [
                <Token key="b2" name="neutral-200" chip="bg-neutral-200" />,
                '#e5e5e5',
                '목록·카드의 구분선',
              ],
              [
                <Token key="b3" name="neutral-300" chip="bg-neutral-300" />,
                '#d4d4d4',
                '입력칸 테두리',
              ],
              [
                <Token key="r" name="red-600" chip="bg-red-600" />,
                '기본값',
                '오류 문장',
              ],
            ]}
          />
          <Example caption="주황은 표시에만 쓴다 — 현재 위치(주황+굵게), 호버한 링크(굵기는 그대로), 태그, 필수 표시, 원과 선, 배너 면(짙은 주황).">
            <span className="type-ui font-bold text-main-orange">
              학부 소개
            </span>
            <a
              href="#color"
              className="type-ui text-neutral-700 hover:text-main-orange"
            >
              연혁
            </a>
            <Tag label="장학" />
            <span className="type-label">
              제목 <span className="text-main-orange">*</span>
            </span>
            <span className="w-24">
              <Node variant="straight" />
            </span>
            <span className="bg-main-orange-dark px-2 type-label text-white">
              중요 안내
            </span>
          </Example>
        </Sub>
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '위로 올라오는 면일수록 밝은 면에서는 짙게, 어두운 면에서는 밝게 한다.',
            '행동은 회색, 표시는 주황이다. 주황으로 채워 행동을 강조하지 않는다.',
            '짙은 주황은 호버·눌림과 배너에만 쓴다.',
            '현재 위치·선택은 주황에 굵게, 이동할 수 있는 글자는 호버에 주황만(굵기는 그대로).',
            '밝은 면에 neutral-400 글자를 쓰지 않는다(흰 바탕 대비 2.52). 읽어야 하면 500, 비활성이면 300이다.',
            '작은 보조 글자가 neutral-100·200 면 위에 오면 neutral-600으로 올린다.',
            '본문 속 정보 링크는 link 색에 밑줄을 항상 긋는다.',
            '오류 문장(red-600)은 흰 바탕과 neutral-50 바탕에서만 쓴다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <span className="type-meta text-neutral-500">
                2026/09/25 · 행정실
              </span>
            ),
            caption: '읽어야 하는 보조 글자는 neutral-500.',
          }}
          bad={{
            example: (
              <span className="type-meta text-neutral-400">
                2026/09/25 · 행정실
              </span>
            ),
            caption: '흰 바탕에 neutral-400 — 대비가 모자라 읽기 어렵다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <span className="type-ui">
                이메일{' '}
                <a
                  href="#color"
                  className="text-link underline underline-offset-2"
                >
                  cse@snu.ac.kr
                </a>
              </span>
            ),
            caption: '정보 링크는 link 색에 밑줄.',
          }}
          bad={{
            example: (
              <span className="type-ui">
                이메일{' '}
                <a href="#color" className="text-main-orange">
                  cse@snu.ac.kr
                </a>
              </span>
            ),
            caption: '주황 글자로 링크를 표시한다 — 주황은 현재 위치의 색이다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['type', '글자'],
            ['shape', '모서리·그림자·선'],
            ['graphic', '그래픽'],
            ['button', '버튼'],
          ]}
        />
      </DocSection>
    </>
  );
}
