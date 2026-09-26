import type { ReactNode } from 'react';
import HTMLViewer from '@/components/ui/HTMLViewer';

// 견본 글을 실제 본문 뷰어로 그린다. 값은 components/ui/assets/suneditor-contents.override.css.

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="type-item">{title}</h3>
      {children}
    </div>
  );
}

const SAMPLE = {
  html: `<h2>2026학년도 전기 대학원 입학 안내</h2>
<p>컴퓨터공학부 대학원 전기 모집 요강을 안내합니다. 자세한 일정은 <a href="#reading">입학 본부 공지</a>를 확인해 주세요.</p>
<h3>지원 자격</h3>
<ul><li>학사 학위 취득자 또는 취득 예정자</li><li>영어 성적 기준을 충족하는 자</li></ul>
<p>제출 서류는 모두 PDF로 올려 주세요. 원서 접수 기간이 지나면 받지 않습니다.</p>
<h4>유의 사항</h4>
<blockquote>면접 일정은 개별 연락하지 않으므로 홈페이지 공지를 꼭 확인해 주세요.</blockquote>
<p>문의: 컴퓨터공학부 행정실</p>`,
  cssRules: '',
};

export function ReadingSection() {
  return (
    <div className="space-y-12 type-body">
      <Sub title="본문 — 제목·링크·인용·간격">
        <div className="max-w-2xl border border-neutral-200 bg-neutral-50 p-6">
          <HTMLViewer html={SAMPLE} />
        </div>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            본문 제목을 글자 단계에 맞춘다: h1·h2 20/700, h3 16/700, h4~h6
            14/700, 줄높이 1.4, 위 32·아래 16(h4 이하는 위 24·아래 12).
          </li>
          <li>
            링크는 사이트 링크 색(#2867cf) + 밑줄, 호버 주황(2-1 글자 규칙).
          </li>
          <li>인용은 글자 neutral-600 + 왼쪽 2px neutral-300 선.</li>
          <li>문단 사이 12, 목록 위아래 12.</li>
          <li>
            넓은 표는 본문 폭에서 멈추고 표 안에서 가로로 스크롤한다(작성자가
            고정 폭을 넣어도). 스크롤 막대는 얇은 회색으로 늘 보이고, 옆으로 더
            있으면 오른쪽 끝을 흐리게 한다 — iPhone 은 막대를 늘 숨겨서.
          </li>
          <li>
            작성자가 직접 고른 글자 크기·색·표 서식은 건드리지 않는다. 서체는
            이미 Pretendard다.
          </li>
        </ul>
      </Sub>
    </div>
  );
}
