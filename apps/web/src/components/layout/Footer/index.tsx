import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  LINK_GROUPS,
  type LinkGroupProps,
} from '@/components/layout/Footer/linkGroups';
import Dialog from '@/components/ui/Dialog';
import { useLanguage } from '@/hooks/useLanguage';
import commonTranslations from '@/translations.json';
import snuEngineeringUrl from './assets/SNU_Engineering.svg?url';
import snuLogoWithTextUrl from './assets/SNU_Logo_with_Text.svg?url';
import footerOnlyTranslations from './translations.json';

const footerTranslations = { ...commonTranslations, ...footerOnlyTranslations };
const CSEREAL_MEMBERS = [
  { part: 'Designer', members: ['유채원', '최유진'] },
  { part: 'Frontend Dev', members: ['이성열', '임찬솔'] },
  { part: 'Backend Dev', members: ['김준형', '우혁준', '조성규'] },
];

export default function Footer() {
  const { pathWithoutLocale } = useLanguage(footerTranslations);

  // Main page or navigationTree의 top-level 페이지들은 dark mode
  const mode = [
    '/',
    '/about',
    '/community',
    '/people',
    '/research',
    '/admissions',
    '/academics',
    '/reservations',
  ].includes(pathWithoutLocale)
    ? 'dark'
    : 'light';

  const topBg = mode === 'light' ? 'bg-neutral-50' : 'bg-neutral-800';
  const bottomBg = mode === 'light' ? 'bg-neutral-100' : 'bg-neutral-850';
  const borderTop =
    mode === 'light' ? 'border-neutral-100' : 'border-neutral-800';

  return (
    <footer
      className={`border-t-2 ${borderTop} ${mode === 'light' ? 'surface-light' : 'surface-dark'}`}
    >
      <div
        // 열은 글 길이만큼, 사이는 간격으로(모바일 24·데스크톱 48). 열 폭을 적지 않는다.
        className={`${topBg} flex flex-wrap gap-x-6 gap-y-8 px-5 py-8 sm:gap-x-12 sm:px-15 sm:py-12`}
      >
        {LINK_GROUPS.map((group) => (
          <LinkGroup key={group.groupName} {...group} mode={mode} />
        ))}
      </div>
      <div
        className={`${bottomBg} flex flex-col justify-between px-5 py-8 sm:flex-row sm:items-center sm:gap-12 sm:px-15 sm:py-8`}
      >
        <FooterBottomLeft mode={mode} />
        <FooterBottomRight />
      </div>
    </footer>
  );
}

// 회색 글자 링크라 호버하면 주황 대신 더 또렷한 쪽으로 바꾼다(주황은 회색보다 대비가 낮다, /design-system/links).
const HOVER_CLASS = {
  light: 'hover:text-neutral-950',
  dark: 'hover:text-white',
} as const;

function LinkGroup({ groupName, links, mode = 'light' }: LinkGroupProps) {
  const { t, localizedPath } = useLanguage(footerTranslations);

  const titleColor = mode === 'light' ? 'text-neutral-600' : 'text-neutral-200';
  const itemColor = mode === 'light' ? 'text-neutral-500' : 'text-neutral-300';

  return (
    <section>
      <h3 className={`${titleColor} mb-4 type-label tracking-[0.025rem]`}>
        {groupName}
      </h3>

      <ul className={`${itemColor} flex flex-col gap-3 type-ui`}>
        {links.map((link, i) => (
          <li key={i}>
            {/* 자리가 모자랄 때만 열 안에서 줄을 바꾼다. */}
            <Link to={localizedPath(link.href)} className={HOVER_CLASS[mode]}>
              {t(link.title)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// 아래 띠 글자는 바탕과 4.5:1 이상(밝은 판 600 on 100 = 7.2, 어두운 판 400 on 850 = 6.6).
function FooterBottomLeft({ mode }: { mode: 'light' | 'dark' }) {
  const { t, localizedPath } = useLanguage(footerTranslations);
  const [cserealOpen, setCserealOpen] = useState(false);

  return (
    <div
      className={`type-meta ${mode === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}
    >
      <div className="mb-1 flex gap-2 [&>a]:font-bold">
        <a
          href="https://www.snu.ac.kr/personal_information"
          className={HOVER_CLASS[mode]}
        >
          {t('개인정보처리방침')}
        </a>
        <span>|</span>
        <Link
          to={localizedPath('/about/contact')}
          className={HOVER_CLASS[mode]}
        >
          {t('학부 연락처')}
        </Link>
        <span>|</span>
        <Link
          to={localizedPath('/about/directions')}
          className={HOVER_CLASS[mode]}
        >
          {t('찾아오시는 길')}
        </Link>
      </div>

      <address className="mb-6 not-italic">
        {t(
          '08826 서울특별시 관악구 관악로 1 서울대학교 공과대학 컴퓨터공학부 행정실(301동 316호)',
        )}
      </address>

      <p>
        Powered by{' '}
        <button
          type="button"
          className={`cursor-pointer font-bold text-inherit ${HOVER_CLASS[mode]}`}
          onClick={() => setCserealOpen(true)}
        >
          CSEREAL
        </button>
        <br />
        <span className="whitespace-nowrap">© Department of CSE, SNU.</span>
        <span className="whitespace-nowrap"> All Rights Reserved.</span>
      </p>
      <Dialog
        open={cserealOpen}
        onOpenChange={setCserealOpen}
        title="Team CSEREAL"
      >
        <p className="mb-6 type-body text-neutral-600">
          컴퓨터공학부 홈페이지를 만든 디자인·개발 팀입니다.
        </p>
        {/* 이름 목록이라 태그 모양 없이 글로 잇는다(/design-system/navigation). */}
        <dl className="divide-y divide-neutral-200 border-y border-neutral-200">
          {CSEREAL_MEMBERS.map(({ part, members }) => (
            <div
              key={part}
              className="grid grid-cols-[120px_1fr] items-baseline gap-4 py-4"
            >
              <dt className="type-label">{part}</dt>
              <dd className="type-ui text-neutral-700">
                {members.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </Dialog>
    </div>
  );
}

function FooterBottomRight() {
  return (
    <div className="mt-8 flex flex-wrap gap-8 sm:mt-0 sm:flex-nowrap sm:items-center">
      <a
        href="http://eng.snu.ac.kr/"
        aria-label="서울대 공과대학 홈페이지로 이동"
      >
        <img src={snuEngineeringUrl} alt="" width={126} height={33} />
      </a>
      <a
        href="https://www.snu.ac.kr/snunow/pr/videos"
        aria-label="서울대 홈페이지로 이동"
      >
        <img src={snuLogoWithTextUrl} alt="" width={159} height={37} />
      </a>
    </div>
  );
}
