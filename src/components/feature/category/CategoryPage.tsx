import clsx from 'clsx';
import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import navbarTranslations from '@/components/layout/LeftNav/translations.json';
import type { NavItem } from '@/constants/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavItem } from '@/hooks/useNavItem';
import CategoryGrid from './CategoryGrid';

const tentenProjectNavItem: NavItem = {
  key: '10-10 Project',
  path: '/10-10-project',
  children: [
    { key: 'Proposal', path: '/10-10-project/proposal' },
    { key: 'Manager', path: '/10-10-project/manager' },
    {
      key: 'Participants(Professors)',
      path: '/10-10-project/participants',
    },
  ],
};

interface MajorCategoryPageLayoutProps {
  subtitle?: string;
  description?: ReactNode;
}

export default function CategoryPage({
  subtitle = '',
  description,
}: MajorCategoryPageLayoutProps) {
  const { tUnsafe, pathWithoutLocale } = useLanguage(navbarTranslations);
  const { activeItem } = useNavItem();

  // 10-10 프로젝트는 navigationTree에 없어서 activeItem이 null이므로 별도 트리로 폴백한다.
  const currentPage = pathWithoutLocale.startsWith('/10-10-project')
    ? tentenProjectNavItem
    : activeItem;

  const resolvedTitle = currentPage ? tUnsafe(currentPage.key) : '';

  return (
    <div className="bg-neutral-850">
      <Header />
      <div className="max-w-7xl px-5 py-8 sm:px-25 sm:pb-18 sm:pt-12">
        <div className="mb-2 text-sm font-light text-neutral-500 sm:text-[20px]">
          {subtitle}
        </div>
        <div className="text-[32px] font-semibold tracking-wide text-white sm:text-[64px]">
          {resolvedTitle}
        </div>
        {description && (
          <Description
            className="mb-6 mt-8 hidden sm:block"
            contentClassName="max-w-[960px] !text-[#f5f5f5]"
          >
            {description}
          </Description>
        )}
      </div>
      <CategoryGrid currentPage={currentPage} theme="dark" />
      {description && (
        <div className="px-5 pb-14 pt-7 sm:hidden">
          <Description contentClassName="!text-[#a3a3a3] text-[13px] font-light">
            {description}
          </Description>
        </div>
      )}
    </div>
  );
}

interface DescriptionProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

function Description({
  children,
  className,
  contentClassName,
}: DescriptionProps) {
  return (
    <div className={clsx('flow-root', className)}>
      <div
        className={clsx(
          'whitespace-pre-wrap text-sm leading-7',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
