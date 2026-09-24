import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';

// 제안 단계라 새 크롬 색은 아직 토큰이 없어 여기서만 값을 적는다. 승인되면 app.css 로 옮긴다.
const CHROME_BAR = '#2d2d30';
const CHROME_MENU = '#323235';

type Swatch = { name: string; role: string; className?: string; hex?: string };

const LIGHT: Swatch[] = [
  { name: 'white', role: '바탕', className: 'bg-white' },
  { name: 'neutral-50', role: '카드·묶음', className: 'bg-neutral-50' },
  {
    name: 'neutral-100',
    role: '구분 면·표 헤더·선택된 줄',
    className: 'bg-neutral-100',
  },
  { name: 'neutral-200', role: '눌림·비활성', className: 'bg-neutral-200' },
];

const DARK: Swatch[] = [
  {
    name: 'neutral-900',
    role: '바탕·페이지 제목 영역',
    className: 'bg-neutral-900',
  },
  {
    name: 'neutral-850',
    role: '판(카테고리 머리·메인 공지·내비 펼침 패널·푸터 아랫단)',
    className: 'bg-neutral-850',
  },
  {
    name: 'neutral-800',
    role: '올린 면(모바일 푸터 윗단)',
    className: 'bg-neutral-800',
  },
];

const CHROME: Swatch[] = [
  { name: 'chrome-bar', role: '모바일 상단 바', hex: CHROME_BAR },
  { name: 'chrome-menu', role: '왼쪽 내비·모바일 메뉴', hex: CHROME_MENU },
];

type Merge = { from: string; where: string; to: string; toHex: string };

const MERGES: Merge[] = [
  {
    from: '#1f2021',
    where: '내비 펼침 패널·모바일 메뉴 상세',
    to: 'neutral-850',
    toHex: '#1e1e1e',
  },
  {
    from: '#202020',
    where: '메인 공지 필터 알약',
    to: 'neutral-850',
    toHex: '#1e1e1e',
  },
  {
    from: '#212121',
    where: '메인 공지 판',
    to: 'neutral-850',
    toHex: '#1e1e1e',
  },
  {
    from: 'rgb(30,30,30)',
    where: '푸터 아랫단(값이 같음)',
    to: 'neutral-850',
    toHex: '#1e1e1e',
  },
  {
    from: '#262728',
    where: '모바일 푸터 윗단',
    to: 'neutral-800',
    toHex: '#262626',
  },
  {
    from: '#e65615',
    where: '뉴스 더보기·캐러셀 점',
    to: 'main-orange-dark',
    toHex: '#e65817',
  },
  {
    from: '#ff7b34',
    where: '이미지 팝업 버튼 호버',
    to: 'main-orange-dark',
    toHex: '#e65817',
  },
  {
    from: '#f55a00',
    where: '이미지 팝업 버튼 눌림',
    to: 'main-orange-dark',
    toHex: '#e65817',
  },
  {
    from: '#3c7de4',
    where: '예약 안내 링크(오타)',
    to: 'link',
    toHex: '#2867cf',
  },
  {
    from: '#f8f8f8',
    where: 'neutral-75, 학사 타임라인만',
    to: 'neutral-50',
    toHex: '#fafafa',
  },
  {
    from: '#a3a3a3·#f5f5f5',
    where: '카테고리 소개문(토큰을 hex로 적음)',
    to: 'neutral-400·100',
    toHex: '#a3a3a3',
  },
];

function Chip({ className, hex }: { className?: string; hex?: string }) {
  return (
    <span
      className={`inline-block size-6 shrink-0 rounded-xs border border-neutral-200 ${className ?? ''}`}
      style={hex ? { backgroundColor: hex } : undefined}
    />
  );
}

function SwatchList({ items, dark }: { items: Swatch[]; dark?: boolean }) {
  return (
    <ul className={dark ? 'bg-neutral-900 p-3' : 'p-3'}>
      {items.map((s) => (
        <li key={s.name} className="flex items-center gap-3 py-1.5">
          <Chip className={s.className} hex={s.hex} />
          <span
            className={`text-md font-medium ${dark ? 'text-white' : 'text-neutral-950'}`}
          >
            {s.name}
          </span>
          <span
            className={`text-sm ${dark ? 'text-neutral-400' : 'text-neutral-500'}`}
          >
            {s.role}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

function Decision({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-2 border-main-orange p-5">
      <p className="mb-4 font-bold">{title}</p>
      {children}
    </div>
  );
}

function TextSample({ primary }: { primary: string }) {
  return (
    <div className="space-y-1">
      <p className={`text-lg font-bold ${primary}`}>
        2026학년도 후기 입학 설명회
      </p>
      <p className={`text-md leading-7 ${primary}`}>
        설명회는 301동 118호에서 열립니다. 사전 신청은 필요하지 않습니다.
      </p>
      <p className="text-sm text-neutral-500">2026/09/25 · 행정실</p>
    </div>
  );
}

export function ColorSection() {
  return (
    <div className="space-y-12 text-md leading-7">
      <div className="border-l-4 border-main-orange bg-neutral-50 px-4 py-3 text-sm">
        <p className="font-medium">제안(미적용). 결정할 것 2개</p>
        <ol className="mt-1 list-decimal pl-5">
          <li>주요 글자색: 800과 950 중 하나로</li>
          <li>정보 링크: 지금 색(호버 때만 밑줄) / 더 짙은 색 + 항상 밑줄</li>
        </ol>
      </div>

      <Sub title="면">
        <p>
          밝은 면 4단계, 어두운 면 3단계, 내비게이션 틀 2색. 위로 올라오는
          면일수록 밝은 면에서는 짙어지고 어두운 면에서는 밝아진다.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="border border-neutral-200">
            <SwatchList items={LIGHT} />
          </div>
          <div className="space-y-px">
            <SwatchList items={DARK} dark />
            <SwatchList items={CHROME} dark />
          </div>
        </div>
      </Sub>

      <Sub title="합치는 값">
        <p>
          눈으로 거의 구별되지 않는 값들을 가까운 단계로 합친다. 합치면 팔레트
          밖 값이 앱에서 사라진다.
        </p>
        <table className="w-full max-w-3xl text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-2 font-medium">지금</th>
              <th className="py-2 font-medium">쓰는 곳</th>
              <th className="py-2 font-medium">합칠 단계</th>
            </tr>
          </thead>
          <tbody>
            {MERGES.map((m) => (
              <tr
                key={m.from + m.where}
                className="border-b border-neutral-100"
              >
                <td className="py-1.5">
                  <span className="flex items-center gap-2">
                    <Chip
                      hex={
                        m.from.startsWith('#')
                          ? m.from.split('·')[0]
                          : '#1e1e1e'
                      }
                    />
                    {m.from}
                  </span>
                </td>
                <td className="py-1.5 text-neutral-500">{m.where}</td>
                <td className="py-1.5">
                  <span className="flex items-center gap-2">
                    <Chip hex={m.toHex} />
                    {m.to}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sub>

      <Sub title="글자">
        <table className="w-full max-w-3xl text-left">
          <tbody>
            {[
              ['주요', '제목·본문', 'text-neutral-950'],
              ['설명', '설명문·부제', 'text-neutral-700'],
              ['보조', '날짜·작성자·도움말', 'text-neutral-500'],
              ['비활성', '비활성·자리표시', 'text-neutral-300'],
            ].map(([name, use, cls]) => (
              <tr key={name} className="border-b border-neutral-100">
                <td className="w-24 py-2 font-medium">{name}</td>
                <td className={`py-2 ${cls}`}>
                  {cls.replace('text-', '')} — {use}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          어두운 면에서는 주요 white, 보조 neutral-400. 작은 보조 글자가
          neutral-100·200 면 위에 오면 neutral-600.
        </p>
        <Decision title="결정 1 — 주요 글자색">
          <p className="mb-4">
            지금 페이지 기본 글자는 950인데 컴포넌트 31곳이 800을 쓰고 900도 4곳
            있다. 하나로 맞춘다.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-neutral-500">
                A. neutral-950 #0a0a0a (추천 — 페이지 기본과 같음)
              </p>
              <TextSample primary="text-neutral-950" />
            </div>
            <div>
              <p className="mb-2 text-sm text-neutral-500">
                B. neutral-800 #262626 (컴포넌트에 더 많음, 조금 부드러움)
              </p>
              <TextSample primary="text-neutral-800" />
            </div>
          </div>
        </Decision>
      </Sub>

      <Sub title="강조">
        <p>
          행동은 회색, 표시는 주황이다. 주황 채움 버튼으로 행동을 강조하지
          않는다.
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="font-medium">행동</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="neutral">추가</Button>
              <Button variant="secondary">취소</Button>
            </div>
            <ul className="list-disc pl-5 text-sm text-neutral-700">
              <li>
                주요 행동(추가·저장·게시·예약): neutral-700, 호버 neutral-500
              </li>
              <li>
                보조 행동(취소·편집·삭제·목록): neutral-100 면. 글자는 500 →
                600으로 (100 면 위 500은 대비 4.35로 기준 4.5에 못 미침)
              </li>
              <li>
                어느 버튼이 주요인지 정리하는 일(주황 추가 버튼 등)은 2-1
                버튼에서 한다.
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-medium">
              표시 — 주황 #ff6914, 짙은 주황 #e65817
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <span className="font-bold text-main-orange">학부 소개</span>
                <span className="text-neutral-500">
                  현재 위치·선택: 주황 + 굵게
                </span>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href="#color"
                  className="text-neutral-700 hover:text-main-orange"
                >
                  연혁
                </a>
                <span className="text-neutral-500">
                  이동할 수 있는 글자: 호버하면 주황(굵기는 그대로)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Tag label="장학" />
                <span className="text-neutral-500">태그</span>
              </li>
              <li className="flex items-center gap-3">
                <span>
                  제목 <span className="text-main-orange">*</span>
                </span>
                <span className="text-neutral-500">필수 표시</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-24">
                  <Node variant="straight" />
                </span>
                <span className="text-neutral-500">원과 선 그래픽</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-main-orange-dark px-2 text-white">
                  중요 안내
                </span>
                <span className="text-neutral-500">
                  배너 면. 짙은 주황은 호버·눌림과 배너에만
                </span>
              </li>
            </ul>
          </div>
        </div>
        <Decision title="결정 2 — 정보 링크(연락처·이메일·홈페이지 주소 등 본문 속 링크)">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-neutral-500">
                A. 지금: #3c7be4, 호버 때만 밑줄. 흰 바탕 대비 4.08(기준 4.5
                미만)
              </p>
              <p>
                이메일{' '}
                <a href="#color" className="text-link hover:underline">
                  cse@snu.ac.kr
                </a>
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-neutral-500">
                B. #2867cf, 항상 밑줄. 대비 5.34 (추천 — Codex 때 고르신 안)
              </p>
              <p>
                이메일{' '}
                <a
                  href="#color"
                  className="underline underline-offset-2"
                  style={{ color: '#2867cf' }}
                >
                  cse@snu.ac.kr
                </a>
              </p>
            </div>
          </div>
        </Decision>
      </Sub>

      <Sub title="선·오류">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="border-b border-neutral-200 pb-0.5">
              neutral-200
            </span>{' '}
            — 목록·카드의 구분선
          </li>
          <li>
            <span className="border-b border-neutral-300 pb-0.5">
              neutral-300
            </span>{' '}
            — 입력칸 테두리
          </li>
          <li>
            <span className="text-red-600">red-600</span> — 오류 문장. 흰 바탕과
            50 바탕에서만 쓴다
          </li>
        </ul>
      </Sub>
    </div>
  );
}
