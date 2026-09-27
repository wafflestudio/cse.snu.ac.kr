import { ColorExplorer } from '../-components/ColorExplorer';
import {
  DocSection,
  DoDont,
  Lead,
  Related,
  RuleList,
} from '../-components/doc';

// 색 페이지. 값은 app.css @theme 이 정본이다. 버튼의 호버·누름 색처럼 부품이 정하는 색은 적지 않는다.

export function ColorSection() {
  return (
    <>
      <Lead>회색은 행동, 주황은 표시입니다.</Lead>

      <DocSection title="어디에 쓰나">
        <ColorExplorer />
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
