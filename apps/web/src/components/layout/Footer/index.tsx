import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  getLinkGroups,
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
  const { locale, pathWithoutLocale } = useLanguage(footerTranslations);

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

  const topBg =
    mode === 'light' ? 'bg-neutral-50' : 'bg-neutral-800 sm:bg-neutral-900';
  const bottomBg = mode === 'light' ? 'bg-neutral-100' : 'bg-neutral-850';
  const borderTop =
    mode === 'light' ? 'border-neutral-100' : 'border-neutral-800';

  return (
    <footer className={`border-t-2 ${borderTop}`}>
      <div
        className={`${topBg} flex flex-wrap gap-y-8 px-5 py-8 sm:px-15 sm:py-12`}
      >
        {getLinkGroups(locale).map((group) => (
          <LinkGroup key={group.groupName} {...group} mode={mode} />
        ))}
      </div>
      <div
        className={`${bottomBg} flex flex-col justify-between px-5 py-8 sm:flex-row sm:items-center sm:px-15 sm:py-8`}
      >
        <FooterBottomLeft />
        <FooterBottomRight />
      </div>
    </footer>
  );
}

function LinkGroup({
  groupName,
  links,
  width,
  mode = 'light',
}: LinkGroupProps) {
  const { t } = useLanguage(footerTranslations);

  const titleColor =
    mode === 'light' ? 'text-neutral-600' : 'text-neutral-200 sm:text-white';
  const itemColor =
    mode === 'light'
      ? 'text-neutral-500'
      : 'text-neutral-300 sm:text-neutral-500';

  return (
    <section className={width}>
      <h3 className={`${titleColor} mb-2 type-label tracking-[0.025rem]`}>
        {groupName}
      </h3>

      <ul className={`${itemColor} flex flex-col gap-3 type-ui`}>
        {links.map((link, i) => (
          <li key={i}>
            <Link to={link.href} className="whitespace-nowrap">
              {t(link.title)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FooterBottomLeft() {
  const { t, localizedPath } = useLanguage(footerTranslations);
  const [cserealOpen, setCserealOpen] = useState(false);

  return (
    <div className="type-meta text-neutral-500">
      <div className="mb-1 flex gap-2 [&>a]:font-bold ">
        <a
          href="https://www.snu.ac.kr/personal_information"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('개인정보처리방침')}
        </a>
        <span>|</span>
        <Link to={localizedPath('/about/contact')}>{t('학부 연락처')}</Link>
        <span>|</span>
        <Link to={localizedPath('/about/directions')}>
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
          className="cursor-pointer font-bold text-inherit hover:underline"
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
        title="CSEREAL 팀 소개"
        contentClassName="w-[92vw] max-w-3xl p-0"
      >
        <div className="relative flex flex-col gap-6 overflow-y-auto overflow-x-hidden px-8 pb-12 pt-12 sm:px-12 sm:pb-16 sm:pt-16">
          <h1 className="type-section text-neutral-950">
            Team <span className="text-main-orange">CSEREAL</span>
            <br />
            <span className="type-meta text-neutral-500">
              컴퓨터공학부 디자인 · 개발 팀입니다.
            </span>
          </h1>
          <CserealMembers />
        </div>
      </Dialog>
    </div>
  );
}

function CserealMembers() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {CSEREAL_MEMBERS.map((info) => (
        <CserealPart part={info.part} members={info.members} key={info.part} />
      ))}
    </div>
  );
}

function CserealPart({ part, members }: { part: string; members: string[] }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <h4 className="type-item text-main-orange">{part}</h4>
      <div className="mt-4 flex flex-wrap gap-2">
        {members.map((member) => (
          <span
            key={member}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 type-meta text-neutral-600"
          >
            {member}
          </span>
        ))}
      </div>
    </div>
  );
}

function FooterBottomRight() {
  return (
    <div className="mt-8 flex flex-wrap gap-8 sm:mt-0 sm:flex-nowrap sm:items-center">
      <a
        href="http://eng.snu.ac.kr/"
        aria-label="서울대 공과대학 홈페이지로 이동"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={snuEngineeringUrl} alt="" width={126} height={33} />
      </a>
      <a
        href="https://www.snu.ac.kr/snunow/pr/videos"
        aria-label="서울대 홈페이지로 이동"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={snuLogoWithTextUrl} alt="" width={159} height={37} />
      </a>
    </div>
  );
}
