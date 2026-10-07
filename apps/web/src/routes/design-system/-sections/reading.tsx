import clsx from 'clsx';
import HTMLViewer from '@/components/ui/HTMLViewer';
import {
  DeviceToggle,
  DocSection,
  Example,
  Lead,
  RuleList,
} from '../-components/doc';
import { SAMPLE_IMAGE, stay } from '../-components/sample';

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

const IMAGE_TEXT = [
  '컴퓨터공학부 대학원 전기 모집 요강을 안내합니다. 지원 자격과 제출 서류, 전형 일정을 아래에서 확인해 주세요. 원서 접수 기간이 지나면 받지 않습니다.',
  '제출 서류는 모두 PDF로 올려 주세요. 면접 일정은 개별 연락하지 않으므로 홈페이지 공지를 꼭 확인해 주세요.',
  '문의는 컴퓨터공학부 행정실로 해 주세요. 학부 과정 관련 문의는 학부 사무실, 장학 관련 문의는 장학 담당자에게 따로 해 주세요.',
];

// 대표 이미지. 실제는 HTMLViewer 의 image 다(폭 고정, 높이는 사진 비율). 데스크톱은 오른쪽에 띄우고(왼쪽 32)
// 모바일은 위에 폭 가득.
function ImageSlot({ className }: { className: string }) {
  return (
    <img
      src={SAMPLE_IMAGE.news}
      alt="대표 이미지"
      width={640}
      height={400}
      className={clsx('mb-8 h-auto object-contain', className)}
    />
  );
}

function ImageLayout({ mobile }: { mobile: boolean }) {
  return (
    <div
      className={clsx('flow-root bg-neutral-50 p-6', !mobile && 'max-w-3xl')}
    >
      <ImageSlot className={mobile ? 'w-full' : 'float-right ml-8 w-60'} />
      <div className="space-y-4">
        {IMAGE_TEXT.map((text) => (
          <p key={text} className="max-w-160 type-body">
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ReadingSection() {
  return (
    <>
      <Lead>
        에디터로 쓴 글은 <code>HTMLViewer</code> 하나로 보여 줍니다.
      </Lead>

      <DocSection title="구성">
        <Example caption="문단·목록·제목·인용은 읽기 폭 640에서 멈추고, 표·이미지는 본문 폭을 씁니다. 넓은 표는 표 안에서 가로로 밉니다. 에디터도 같은 값이라 작성 화면과 보기 화면이 같습니다.">
          {/* 본문 링크는 진짜 <a> 라 호버·초점이 그대로지만, 눌러도 이동하지 않게 여기서 막는다. */}
          <div
            className="w-full max-w-2xl bg-neutral-50 p-6"
            onClickCapture={stay}
          >
            <HTMLViewer html={SAMPLE} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="대표 이미지">
        <DeviceToggle
          caption="데스크톱은 본문 오른쪽에 띄워 글이 왼쪽과 아래로 흐르고(그림 폭 240), 모바일은 본문 위에 폭 가득."
          desktop={<ImageLayout mobile={false} />}
          mobile={<ImageLayout mobile />}
        />
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '작성자가 정한 글자 크기·색·표 서식은 바꾸지 않습니다. 본문은 에디터에서 본 모습 그대로여야 합니다.',
            '대표 이미지 폭은 쓰임에 맞춰 200·240·320 중에서 고릅니다(세미나 240).',
          ]}
        />
      </DocSection>
    </>
  );
}
