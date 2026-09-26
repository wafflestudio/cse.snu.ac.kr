import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';

type Swatch = { name: string; role: string; className: string };

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
    role: '판(카테고리 머리·메인 공지·왼쪽 내비·모바일 메뉴·푸터 아랫단)',
    className: 'bg-neutral-850',
  },
  {
    name: 'neutral-800',
    role: '올린 면(모바일 푸터 윗단)',
    className: 'bg-neutral-800',
  },
];

const CHROME: Swatch[] = [
  { name: 'chrome-bar', role: '모바일 상단 바', className: 'bg-chrome-bar' },
  {
    name: 'chrome-menu',
    role: '내비 펼침 패널·모바일 메뉴 펼침(내비 위로 올라온 면이라 더 밝다)',
    className: 'bg-chrome-menu',
  },
];

function Chip({ className }: { className: string }) {
  return (
    <span
      className={`inline-block size-6 shrink-0 rounded-xs border border-neutral-200 ${className}`}
    />
  );
}

function SwatchList({ items, dark }: { items: Swatch[]; dark?: boolean }) {
  return (
    <ul className={dark ? 'bg-neutral-900 p-3' : 'p-3'}>
      {items.map((s) => (
        <li key={s.name} className="flex items-center gap-3 py-1.5">
          <Chip className={s.className} />
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

export function ColorSection() {
  return (
    <div className="space-y-12 text-md leading-7">
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

      <Sub title="팔레트 밖 값">
        <p>
          위 면·글자·강조 단계와 <code>app.css</code> <code>@theme</code>의
          토큰만 쓴다. 눈으로 거의 구별되지 않는 새 hex(<code>#1f2021</code>{' '}
          같은 값)를 만들지 않고 가까운 단계를 쓴다. 토큰을 hex로 다시 적지도
          않는다.
        </p>
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
          neutral-100·200 면 위에 오면 neutral-600. 밝은 면에 neutral-400 글자는
          쓰지 않는다(흰 바탕 대비 2.52). 읽어야 하는 정보면 500, 비활성이면
          300.
        </p>
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
              <Button variant="primary">추가</Button>
              <Button variant="secondary">취소</Button>
            </div>
            <ul className="list-disc pl-5 text-sm text-neutral-700">
              <li>
                주요 행동(추가·저장·게시·예약): neutral-700, 호버 600, 누름 500
              </li>
              <li>
                보조 행동(취소·편집·삭제·목록): neutral-100 면에 neutral-600
                글자(100 면 위 500은 대비 4.35로 기준 4.5에 못 미친다)
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
        <div className="space-y-2">
          <p className="font-medium">정보 링크</p>
          <p>
            연락처·이메일·홈페이지 주소처럼 본문 속 링크는{' '}
            <code>text-link</code>(#2867cf)에 밑줄을 항상 긋는다(
            <code>underline underline-offset-2</code>). 흰 바탕 대비 5.34.
          </p>
          <p>
            이메일{' '}
            <a href="#color" className="text-link underline underline-offset-2">
              cse@snu.ac.kr
            </a>
          </p>
        </div>
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
