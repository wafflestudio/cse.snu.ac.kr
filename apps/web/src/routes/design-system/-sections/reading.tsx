import HTMLViewer from '@/components/ui/HTMLViewer';
import {
  DocSection,
  DoDont,
  Example,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 견본 글을 실제 본문 뷰어로 그린다. 제목·문단·인용·표의 값은 components/ui/assets/suneditor-contents.override.css 가 정한다.

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
    <>
      <Lead>
        작성자가 에디터로 쓴 글은 <code>HTMLViewer</code> 하나로 보인다. 제목·
        문단·인용·표의 모양은 뷰어가 정하고, 에디터도 같은 값을 써서 쓰는 화면과
        보는 화면이 같다.
      </Lead>

      <DocSection title="짜임">
        <Example caption="문단·목록·제목·인용은 읽기 폭 640에서 멈추고, 표·이미지는 본문 폭을 쓴다. 넓은 표는 표 안에서 가로로 스크롤한다.">
          <div className="w-full max-w-2xl bg-neutral-50 p-6">
            <HTMLViewer html={SAMPLE} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="규칙">
        <RuleList
          items={[
            '작성자가 직접 고른 글자 크기·색·표 서식은 건드리지 않는다.',
            '본문 옆 대표 이미지는 뷰어에 넘긴다(폭 200·240·320) — 오른쪽에 띄우고 글이 감싸 흐른다. 모바일은 위.',
          ]}
        />
      </DocSection>

      <DocSection title="이렇게 · 이렇게 하지 않는다">
        <DoDont
          good={{
            example: (
              <p className="type-body">
                자세한 일정은{' '}
                <a
                  href="#reading"
                  className="text-link underline underline-offset-2 hover:text-main-orange"
                >
                  입학 본부 공지
                </a>
                를 확인해 주세요.
              </p>
            ),
            caption:
              '본문 밖에서 링크를 짜도 본문 링크와 같다 — 링크 색 + 밑줄, 호버 주황.',
          }}
          bad={{
            example: (
              <p className="type-body">
                자세한 일정은{' '}
                <a href="#reading" className="font-bold text-main-orange">
                  입학 본부 공지
                </a>
                를 확인해 주세요.
              </p>
            ),
            caption:
              '주황 굵은 글자로 링크를 만든다 — 주황은 현재 위치·강조의 색이다.',
          }}
        />
      </DocSection>

      <DocSection title="관련">
        <Related
          links={[
            ['type', '글자'],
            ['editor', '에디터'],
            ['post', '게시물 상세'],
            ['color', '색'],
          ]}
        />
      </DocSection>
    </>
  );
}
