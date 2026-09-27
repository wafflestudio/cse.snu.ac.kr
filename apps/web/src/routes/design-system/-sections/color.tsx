import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 색 페이지. 값은 app.css @theme 이 정본이다. 버튼의 호버·누름 색처럼 부품이 정하는 색은 적지 않는다.

// 예시 아래 색 줄: 칩 · 이름 · hex · 쓰는 곳.
function Swatches({
  items,
}: {
  items: [chip: string, name: string, hex: string, use: string][];
}) {
  return (
    <ul className="grid gap-x-6 gap-y-2 type-meta sm:grid-cols-2">
      {items.map(([chip, name, hex, use]) => (
        <li key={name} className="flex items-center gap-2">
          <span
            className={clsx('size-4 shrink-0 border border-neutral-200', chip)}
          />
          <span className="text-neutral-950">{name}</span>
          <span className="text-neutral-500">{hex}</span>
          <span className="text-neutral-600">{use}</span>
        </li>
      ))}
    </ul>
  );
}

function ColorExamples() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <p className="type-label">면</p>
        <Example>
          <div className="w-full overflow-hidden border border-neutral-200">
            <div className="bg-neutral-900 px-5 py-4">
              <p className="type-meta text-neutral-300">소식</p>
              <p className="type-section text-white">공지사항</p>
            </div>
            <div className="bg-white px-5 py-4 type-ui">
              <div className="flex h-9 items-center px-2">수강신청 안내</div>
              <div className="flex h-9 items-center bg-neutral-50 px-2">
                논문 심사 일정
              </div>
            </div>
            <div className="bg-neutral-100 px-5 py-4 type-ui text-neutral-600">
              회색 띠
            </div>
          </div>
        </Example>
        <Swatches
          items={[
            ['bg-neutral-900', 'neutral-900', '#171717', '헤더·제목 영역'],
            ['bg-white', 'white', '#ffffff', '본문 바탕'],
            ['bg-neutral-50', 'neutral-50', '#fafafa', '표 줄무늬'],
            ['bg-neutral-100', 'neutral-100', '#f5f5f5', '회색 띠·보조 버튼'],
          ]}
        />
      </div>

      <div className="space-y-3">
        <p className="type-label">어두운 면</p>
        <Example>
          <div className="flex h-40 w-full max-w-100 overflow-hidden">
            <div className="flex w-24 flex-col items-center gap-3 bg-chrome-menu pt-4 type-meta">
              <span className="text-neutral-400">소개</span>
              <span className="text-white">소식</span>
              <span className="text-neutral-400">구성원</span>
            </div>
            <div className="flex grow flex-col gap-3 bg-neutral-850 pt-4 pl-5 type-meta text-white">
              <span>공지사항</span>
              <span>새 소식</span>
              <span>세미나</span>
            </div>
          </div>
        </Example>
        <Swatches
          items={[
            ['bg-chrome-menu', 'chrome-menu', '#323235', '왼쪽 내비 막대'],
            [
              'bg-neutral-850',
              'neutral-850',
              '#1e1e1e',
              '펼침 패널·카테고리 머리',
            ],
            [
              'bg-neutral-400',
              'neutral-400',
              '#a3a3a3',
              '어두운 면의 보조 글자',
            ],
            ['bg-chrome-bar', 'chrome-bar', '#2d2d30', '모바일 상단 바'],
          ]}
        />
      </div>

      <div className="space-y-3">
        <p className="type-label">글자</p>
        <Example>
          <div className="w-full max-w-120">
            <p className="type-item text-neutral-950">
              2026학년도 2학기 수강신청 안내
            </p>
            <p className="mt-1 type-ui text-neutral-600">
              수강신청 일정과 유의 사항을 안내합니다.
            </p>
            <p className="mt-1 type-meta text-neutral-500">
              2026/9/26 · 조회 312
            </p>
          </div>
        </Example>
        <Swatches
          items={[
            ['bg-neutral-950', 'neutral-950', '#0a0a0a', '제목·본문'],
            ['bg-neutral-600', 'neutral-600', '#525252', '설명·보조 버튼 글자'],
            ['bg-neutral-500', 'neutral-500', '#737373', '날짜·조회'],
          ]}
        />
      </div>

      <div className="space-y-3">
        <p className="type-label">행동과 표시</p>
        <Example>
          <Button variant="secondary">취소</Button>
          <Button variant="primary">저장</Button>
          <span className="ml-4 type-ui font-bold text-main-orange">
            공지사항
          </span>
          <Tag label="장학" />
          <span className="flex items-center gap-1 type-ui text-main-orange-dark">
            더보기 <ChevronRight className="size-4" />
          </span>
          <a
            href="#color"
            className="type-ui text-link underline underline-offset-2"
          >
            학사 안내
          </a>
        </Example>
        <Swatches
          items={[
            ['bg-neutral-700', 'neutral-700', '#404040', '주요 버튼'],
            [
              'bg-main-orange',
              'main-orange',
              '#ff6914',
              '현재 위치·태그·필수 표시',
            ],
            [
              'bg-main-orange-dark',
              'main-orange-dark',
              '#e65817',
              '더보기·호버·눌림',
            ],
            ['bg-link', 'link', '#2867cf', '본문 링크'],
          ]}
        />
      </div>

      <div className="space-y-3">
        <p className="type-label">선과 오류</p>
        <Example>
          <div className="w-full max-w-80 space-y-3">
            <span className="flex h-8.5 items-center rounded-xs border border-neutral-300 px-3 type-ui text-neutral-300">
              부제목
            </span>
            <div>
              <span className="flex h-8.5 items-center rounded-xs border border-red-600 px-3 type-ui text-neutral-300">
                제목
              </span>
              <p className="mt-2 type-meta text-red-600">
                제목을 입력해 주세요.
              </p>
            </div>
            <div className="border-y border-neutral-200 py-2 type-ui">
              표 위아래 선
            </div>
          </div>
        </Example>
        <Swatches
          items={[
            [
              'bg-neutral-300',
              'neutral-300',
              '#d4d4d4',
              '입력 칸 테두리·자리표시',
            ],
            ['bg-red-600', 'red-600', '#e7000b', '오류 문장·오류 칸'],
            ['bg-neutral-200', 'neutral-200', '#e5e5e5', '표 선·구분선'],
          ]}
        />
      </div>
    </div>
  );
}

export function ColorSection() {
  return (
    <>
      <Lead>회색은 행동, 주황은 표시입니다.</Lead>

      <DocSection title="역할별 예시">
        <ColorExamples />
      </DocSection>

      <DocSection title="쓰는 법">
        <RuleList
          items={[
            '위로 올라오는 면일수록 밝은 면에서는 짙게, 어두운 면에서는 밝게 합니다. 예외: 왼쪽 내비·모바일 메뉴는 막대가 펼침 패널보다 밝습니다.',
            '행동은 회색, 표시는 주황입니다. 주황으로 채워 행동을 강조하지 않습니다.',
            '짙은 주황은 호버·눌림과 배너에만 씁니다.',
            '현재 위치·선택은 주황에 굵게, 이동할 수 있는 글자는 호버에 주황만 줍니다(굵기는 그대로).',
            '밝은 면에 neutral-400 글자를 쓰지 않습니다(흰 바탕 대비 2.52). 읽어야 하면 500, 비활성이면 300입니다.',
            '작은 보조 글자가 neutral-100·200 면 위에 오면 neutral-600으로 올립니다.',
            '본문 속 정보 링크는 link 색에 밑줄을 항상 긋습니다.',
            '오류 문장(red-600)은 흰 바탕과 neutral-50 바탕에서만 씁니다.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않기">
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
            caption: '정보 링크는 link 색에 밑줄을 긋습니다.',
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
            caption:
              '주황 글자로 링크를 표시합니다. 주황은 현재 위치의 색입니다.',
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
