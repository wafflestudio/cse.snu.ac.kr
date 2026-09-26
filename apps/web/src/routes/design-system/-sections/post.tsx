import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '@/components/ui/Button';
import Node from '@/components/ui/Nodes';
import { Tag } from '@/components/ui/Tag';

// 게시물 상세의 짜임을 도식으로 그린다. 실제는 community/-components/PostDetail.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

function Gap({ label }: { label: string }) {
  return (
    <div className="flex h-6 items-center justify-end border-y border-dashed border-main-orange/60 pr-2 type-meta text-main-orange">
      {label}
    </div>
  );
}

function Band({
  tone,
  children,
}: {
  tone: 'white' | 'subtle';
  children: ReactNode;
}) {
  return (
    <div
      className={clsx('px-6', tone === 'white' ? 'bg-white' : 'bg-neutral-50')}
    >
      {children}
    </div>
  );
}

function Neighbor({
  up,
  label,
  title,
}: {
  up: boolean;
  label: string;
  title: string;
}) {
  return (
    <p className="flex items-center gap-1">
      <span className="flex items-center type-label text-main-orange">
        {up ? <ChevronUp /> : <ChevronDown />}
        {label}
      </span>
      <span className="ml-2 type-ui">{title}</span>
    </p>
  );
}

export function PostSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="상세의 짜임 — 공지·새 소식·세미나 한 벌">
        <div className="max-w-2xl border border-neutral-300">
          <Band tone="white">
            <Gap label="위 32 / 48" />
            <p className="py-2 type-section">게시물 제목</p>
            <p className="type-meta text-neutral-500">
              Mock · 2024/1/10 (수) 오전 08:59 · 조회 1,081
            </p>
            <Gap label="아래 32" />
          </Band>
          <Band tone="subtle">
            <Gap label="위 32" />
            <p className="py-2">첨부 → 본문(읽기 폭 640)</p>
            <Gap label="48" />
            <Node variant="straight" />
            <div className="mt-3 ml-6 flex gap-2">
              <Tag label="장학" />
              <Tag label="학부" />
            </div>
            <Gap label="48" />
            <div className="space-y-2">
              <Neighbor up label="다음글" title="학사 일정 안내" />
              <Neighbor up={false} label="이전글" title="스크롤표본 02" />
            </div>
            <Gap label="48" />
            <div className="flex justify-end gap-3">
              <Button variant="secondary">삭제</Button>
              <Button variant="secondary">편집</Button>
              <Button variant="secondary">목록</Button>
            </div>
            <Gap label="아래 64 / 128" />
          </Band>
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            머리 띠(흰): 제목 20/700, 정보 줄 13 neutral-500. 본문
            띠(neutral-50): 첨부 → 본문 → 주황 선(1-7 "본문 아래 구분") → 태그 →
            이전·다음 글 → 버튼 줄. 묶음 사이는 모두 48(1-4).
          </li>
          <li>
            다음글·이전글 두 줄 사이는 8(지금 4라 한 덩어리로 붙어 보인다).
          </li>
          <li>
            정보 줄은 가운뎃점으로 잇고 이름표를 줄인다: "작성자: Mock 작성
            날짜: … 조회수 1,081" → "Mock · 2024/1/10 (수) 오전 08:59 · 조회
            1,081".
          </li>
          <li>
            공지·새 소식·세미나 상세는 <code>PostDetail</code> 하나를 쓴다.
          </li>
        </ul>
      </Sub>

      <Sub title="세미나 — 정보 줄과 연사">
        <p>같은 세미나 글을 전과 지금으로 그렸다.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          {[false, true].map((next) => (
            <div key={String(next)} className="space-y-2">
              <p className="type-meta text-neutral-500">
                {next ? '지금' : '전'}
              </p>
              <div className="border border-neutral-300">
                <div className="bg-white px-6 py-6">
                  <p className="type-section">인공지능 특별 세미나</p>
                  {next && (
                    <p className="mt-2 type-meta text-neutral-500">
                      2024/2/10 (토) 오후 11:00 · 301동 세미나실 · 주최
                      컴퓨터공학부
                    </p>
                  )}
                </div>
                <div className="bg-neutral-50 px-6 py-6">
                  {next ? (
                    <div>
                      <p className="mb-2 type-item">연사</p>
                      <p>김연사 · 교수 · 서울대학교</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <p>이름: 김연사</p>
                        <p>직함: 교수</p>
                        <p>소속: 서울대학교</p>
                      </div>
                      <div>
                        <p>주최: 컴퓨터공학부</p>
                        <p>날짜: 2024/2/10 오후 11:00</p>
                        <p>위치: 301동 세미나실</p>
                      </div>
                    </div>
                  )}
                  <p className="mt-12 type-item">요약</p>
                  <p>세미나 요약입니다.</p>
                  <p className="mt-12 type-item">연사 소개</p>
                  <p>연사 소개입니다.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            대표 이미지는 오른쪽에 띄우고 글이 감싸 흐른다(모바일은 위) — 새
            소식 본문 이미지와 같다. 이미지 옆에서만 줄이 짧아지고 아래부터는
            읽기 폭(640)으로 돌아간다. 본문 뷰어는 자기 이미지가 있을 때만
            flow-root.
          </li>
          <li>
            언제·어디서·누가 여는지는 제목 바로 아래 정보 줄로 올린다 — 공지·새
            소식의 "작성자 · 날짜 · 조회" 자리와 같다.
          </li>
          <li>
            연사는 요약·연사 소개와 같은 소제목(16/700) + 본문 한 줄: "김연사 ·
            교수 · 서울대학교". 지금처럼 "이름: / 직함: / 소속:"을 줄마다 나누지
            않는다.
          </li>
        </ul>
      </Sub>

      <Sub title="첨부">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            첨부 상자는 오른쪽 여백을 넉넉히(64/128) 두어 오른쪽 위 클립 그림과
            파일 이름이 겹쳐 보이지 않게 한다(16 하나로 줄여 봤다가 되돌렸다).
          </li>
        </ul>
      </Sub>
    </div>
  );
}
