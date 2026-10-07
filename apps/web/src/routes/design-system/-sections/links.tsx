import type { ReactNode } from 'react';
import { LinkGroup } from '@/components/layout/Footer';
import { LINK_GROUPS } from '@/components/layout/Footer/linkGroups';
import ArrowLink from '@/components/ui/ArrowLink';
import DotLinkList from '@/components/ui/DotLinkList';
import { ROW_LINK, ROW_LINK_TARGET } from '@/components/ui/rowLink';
import { TEXT_LINK } from '@/components/ui/textLink';
import LinkRow from '@/routes/$locale/-components/LinkRow';
import PrivacyPolicyLink from '@/routes/$locale/reservations/-components/ReservationCalendar/PrivacyPolicyLink';
import {
  DocSection,
  DoDont,
  Example,
  KnownGap,
  Lead,
  RuleList,
  VariantTable,
} from '../-components/doc';
import { stay } from '../-components/sample';
import { LegacyPrivacyPolicyLink } from '../-legacy/AddReservationModal';
import { LegacyFooterLinkGroup } from '../-legacy/Footer';
import { LegacyLinkOrText } from '../-legacy/SeminarDetail';
import { LegacyStreamLink } from '../-legacy/StreamLink';

// 링크 페이지. 견본은 실제 부품(ArrowLink·DotLinkList·LinkRow·푸터 LinkGroup·예약 동의 링크)과
// 실제 클래스(TEXT_LINK·ROW_LINK)로 그린다. 링크는 커서·호버·초점이 그대로지만 누르면 이동하지 않는다.
// 푸터 링크는 실제 페이지로 가는 라우터 링크라 호버하면 그 페이지를 미리 불러온다.

const HERE = '/design-system/links';

// 견본 안의 링크(라우터 Link 포함)를 눌러도 이동하지 않게 클릭을 먼저 붙잡는다.
function Stay({ children }: { children: ReactNode }) {
  return <div onClickCapture={stay}>{children}</div>;
}

function TextLinkSample() {
  return (
    <span className="type-ui">
      자세한 내용은{' '}
      <a href={HERE} onClick={stay} className={TEXT_LINK}>
        학사 안내
      </a>
      를 확인해 주세요.
    </span>
  );
}

// 행 링크: 실제 ROW_LINK·ROW_LINK_TARGET 으로 그린 공지 목록 한 줄.
function RowLinkSample() {
  return (
    <div
      className={`${ROW_LINK} flex h-11 w-60 items-center justify-between gap-3 px-3 type-ui hover:bg-neutral-100`}
    >
      <a href={HERE} onClick={stay} className={`min-w-0 ${ROW_LINK_TARGET}`}>
        <span className="block truncate group-hover:text-main-orange-dark">
          세미나실 예약 기간 변경
        </span>
      </a>
      <span className="type-meta text-neutral-500">9/26</span>
    </div>
  );
}

const FOOTER_GROUP = LINK_GROUPS[1];

export function LinksSection() {
  return (
    <>
      <Lead>
        사이트에서 쓰는 링크의 종류와, 종류마다 정한 모양·호버·링크 글자·여는
        곳입니다.
      </Lead>

      <DocSection title="종류">
        <VariantTable
          rows={[
            {
              name: '글 속 링크',
              sample: <TextLinkSample />,
              use: '문장 안의 링크(교수 연락처, 세미나 연사, 찾아오는 길, 에디터로 쓴 본문).',
            },
            {
              name: '이동 링크',
              sample: (
                <Stay>
                  <ArrowLink to={HERE}>더보기</ArrowLink>
                </Stay>
              ),
              use: '모음 페이지로 보내는 글자와 화살표(메인의 더보기, 연구실 상세의 스트림).',
            },
            {
              name: '메뉴 링크',
              sample: (
                <Stay>
                  <LinkGroup {...FOOTER_GROUP} mode="light" />
                </Stay>
              ),
              use: '모여 있는 이동 목록(왼쪽 내비, 모바일 메뉴, 서브내비, 경로, 푸터, 교수의 연구실).',
            },
            {
              name: '메뉴 링크(어두운 면)',
              sample: (
                <Stay>
                  <div className="surface-dark bg-neutral-800 p-4">
                    <LinkGroup {...FOOTER_GROUP} mode="dark" />
                  </div>
                </Stay>
              ),
              use: '어두운 푸터, 왼쪽 내비 펼침, 모바일 메뉴, 메인 공지 목록.',
            },
            {
              name: '점 목록 링크',
              sample: (
                <Stay>
                  <DotLinkList
                    items={[
                      { key: 1, to: HERE, label: '학부 안내' },
                      { key: 2, to: HERE, label: '대학원 안내' },
                    ]}
                  />
                </Stay>
              ),
              use: '안내 페이지 묶음 목록(학사 안내, 장학 제도).',
            },
            {
              name: '행 링크',
              sample: <RowLinkSample />,
              use: '행이나 카드 전체가 한 곳으로 가는 목록(공지, 새 소식, 세미나, 검색 결과, 메인 새 소식 카드).',
            },
            {
              name: '화살표 줄 링크',
              sample: (
                <Stay>
                  <div className="w-60">
                    <LinkRow to={HERE} title="구성원" subtitle="Faculty" />
                  </div>
                </Stay>
              ),
              use: '메인의 바로가기 줄과 중요 안내 배너.',
              dark: true,
            },
          ]}
        />
      </DocSection>

      <DocSection title="사용하는 경우">
        <RuleList
          items={[
            '다른 페이지로 이동할 때는 링크를 사용합니다. 주소가 있어야 뒤로 가기, 새 탭에서 열기, 주소 복사가 됩니다.',
            '문장 안에서 다른 곳을 가리키면 글 속 링크를 사용합니다. 밑줄이 늘 있어 색을 구분하기 어려운 사용자도 링크를 알아봅니다.',
            '목록 전체나 묶음 페이지로 보낼 때는 이동 링크를 사용합니다. 화살표가 지금 본 것보다 더 많은 내용으로 간다는 것을 알려 줍니다.',
            '링크가 모여 있어 자리만으로 링크인 것을 알 수 있는 곳(메뉴, 푸터, 목록)은 밑줄 없는 메뉴 링크를 사용합니다. 줄마다 밑줄이 있으면 읽기 어렵습니다.',
            '행이나 카드가 한 곳으로만 가면 전체를 누를 수 있게 합니다. 제목만 누를 수 있으면 누를 자리가 작아집니다.',
          ]}
        />
      </DocSection>

      <DocSection title="사용하지 않는 경우">
        <RuleList
          items={[
            '저장, 삭제, 펼치기처럼 무언가를 실행할 때는 링크 대신 버튼을 사용합니다. 링크는 이동, 버튼은 실행이라고 알려야 화면 읽기 프로그램 사용자도 누른 결과를 예상합니다.',
            '링크 글자를 "여기를 클릭", "바로가기", "보러가기"처럼 쓰지 않습니다. 화면 읽기 프로그램 사용자는 링크만 모아 듣기도 하므로 글자만으로 어디로 가는지 알 수 있어야 합니다("학사 안내", "동의 내용 보기").',
            '파랑은 글 속 링크에만 사용합니다. 메뉴나 제목에도 쓰면 파랑이 문장 속 링크라는 표시로 쓰이지 못합니다.',
            '한 행에 링크가 여럿이면 행 전체를 링크로 만들지 않습니다. 어디를 눌렀을 때 어디로 갈지 알 수 없습니다.',
          ]}
        />
      </DocSection>

      <DocSection title="작동 방식">
        <RuleList
          items={[
            '모든 링크는 반드시 마우스를 올리면 눈에 띄게 바뀌어야 합니다. 바뀌지 않으면 누를 수 있는지 알 수 없습니다.',
            '호버는 글자 색에 따라 정합니다. 파랑은 짙은 파랑, 회색·검정은 짙은 주황, 어두운 면의 흰색·회색은 주황, 이미 주황인 이동 링크는 밑줄입니다. 같은 종류의 링크가 어디서나 같게 반응해야 사용자가 한 번 익힌 반응을 믿습니다.',
            '행 링크는 마우스를 올리면 제목이 호버 색으로 바뀌고, 화살표 줄 링크는 화살표가 오른쪽으로 밀립니다. 행이나 카드 어디를 눌러도 같은 곳으로 간다는 것을 보여 줍니다.',
            '모든 링크는 같은 탭에서 엽니다. 다른 사이트로 가는 링크도 같습니다. 새 탭은 뒤로 가기가 듣지 않고, 탭이 쌓이며, 화면 읽기 프로그램 사용자는 새 탭이 열린 것을 알아채기 어렵습니다.',
            '같은 탭에서 열면 쓰던 내용을 잃는 곳만 새 탭으로 엽니다. 이때는 반드시 새 탭 아이콘과 화면 읽기 프로그램용 "(새 탭)" 안내를 붙여야 합니다. 지금은 예약 폼의 동의 내용 링크 하나입니다.',
          ]}
        />
        <Example caption='예약 폼의 동의 내용 링크입니다. 같은 탭에서 열면 쓰던 예약이 사라져 새 탭으로 엽니다. 화면 읽기 프로그램은 "동의 내용 보기 (새 탭)"으로 읽습니다.'>
          <Stay>
            <PrivacyPolicyLink />
          </Stay>
        </Example>
        <KnownGap>
          헤더와 푸터의 학교 로고 링크는 마우스를 올려도 바뀌지 않습니다. 로고
          모양을 그대로 지키기 위해서입니다.
        </KnownGap>
        <KnownGap>
          푸터 링크는 마우스를 올리면 주황 대신 글자만 짙어집니다(밝은 면 검정,
          어두운 면 흰색). 짙은 주황은 푸터의 옅은 회색 바탕에서 대비가 3.5:1에
          그쳐, 글자를 짙게 하는 쪽을 택했습니다.
        </KnownGap>
        <KnownGap>
          선택 목록(접힌 모서리 탭)은 마우스를 올리면 주황 대신 검정이 됩니다.
          고른 항목이 주황이라 호버까지 주황이면 고른 것처럼 보입니다.
        </KnownGap>
        <KnownGap>
          본문에 적은 주소가 저장할 때 저절로 링크가 되면 새 탭으로 열립니다.
          작성자가 에디터에서 새 창으로 열기를 고른 링크도 같습니다. 본문은
          서버가 정리해 내려 주므로 이 문서의 규칙을 아직 따르지 않습니다.
        </KnownGap>
      </DocSection>

      <DocSection title="Do · Don't">
        <DoDont
          good={{
            example: <TextLinkSample />,
            caption:
              '글 속 링크에는 늘 밑줄을 표시합니다. 색을 구분하기 어려운 사용자도 링크를 알아볼 수 있습니다.',
          }}
          bad={{
            example: (
              <span className="text-md">
                자세한 내용은 <LegacyLinkOrText>학사 안내</LegacyLinkOrText>를
                확인해 주세요.
              </span>
            ),
            caption:
              '예전 세미나 연사·교수 연락처 같은 링크는 호버할 때만 밑줄이 생겨, 색으로만 링크를 알아봐야 했습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <Stay>
                <PrivacyPolicyLink />
              </Stay>
            ),
            caption:
              '링크 글자는 가는 곳을 적고, 새 탭으로 열리는 것을 아이콘과 화면 읽기 프로그램용 안내로 알립니다.',
          }}
          bad={{
            example: <LegacyPrivacyPolicyLink />,
            caption:
              '예전 예약 폼의 "보러가기"는 무엇을 보러 가는지, 새 탭으로 열리는지 글자로 알 수 없었습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <Stay>
                <div className="surface-light bg-neutral-50 p-6">
                  <LinkGroup {...FOOTER_GROUP} mode="light" />
                </div>
              </Stay>
            ),
            caption:
              '푸터 링크는 마우스를 올리면 글자가 짙어집니다(밝은 면 검정, 어두운 면 흰색).',
          }}
          bad={{
            example: (
              <div className="bg-neutral-50 p-6 text-left">
                <LegacyFooterLinkGroup
                  groupName="Resources"
                  links={['공지사항', '세미나', '시설 예약 안내']}
                />
              </div>
            ),
            caption:
              '예전 푸터 링크는 마우스를 올려도 바뀌지 않아 누를 수 있는지 알 수 없었습니다.',
          }}
        />
        <DoDont
          good={{
            example: (
              <Stay>
                <ArrowLink to={HERE}>시스템 스트림</ArrowLink>
              </Stay>
            ),
            caption:
              '모음 페이지로 보내는 링크는 화살표를 붙인 이동 링크입니다.',
          }}
          bad={{
            example: <LegacyStreamLink label="시스템 스트림" />,
            caption:
              '예전 연구실 상세의 스트림 링크는 주황 테두리 상자라 실행 버튼처럼 보였습니다.',
          }}
        />
      </DocSection>
    </>
  );
}
