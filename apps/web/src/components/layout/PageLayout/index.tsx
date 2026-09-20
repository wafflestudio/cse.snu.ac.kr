import type { ReactNode } from 'react';
import { SITE_NAME } from '@/constants/site';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { useLanguage } from '@/hooks/useLanguage';
import type { SubNavConfig } from '@/hooks/useSubNav';
import Header from '../Header';
import PageTitle from './PageTitle';
import SubNavbar from './SubNavbar';

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  titleMargin?: string;
  padding?: 'default' | 'none' | 'noTop' | 'noBottom';
  subNav?: SubNavConfig;
  pageTitle?: string; // <title> 및 og:title용
  pageDescription?: string; // meta description 및 og:description용
  noImageIndex?: boolean; // 이미지 검색 차단용
  children: ReactNode;
}

/**
 * 본문 기본 스타일
 * padding-left: 100px
 * padding-right: 360px
 * padding-top: 44px
 * padding-bottom: 150px
 * background-color: white
 */
export default function PageLayout({
  title,
  subtitle,
  breadcrumb,
  titleMargin = 'mb-6 sm:mb-11',
  padding = 'default',
  subNav,
  pageTitle,
  pageDescription,
  noImageIndex,
  children,
}: PageLayoutProps) {
  const generatedBreadcrumb = useBreadcrumb();
  const finalBreadcrumb = breadcrumb ?? generatedBreadcrumb;
  const { locale } = useLanguage();

  // pageTitle에 자동으로 SITE_NAME 추가
  const fullPageTitle = pageTitle
    ? `${pageTitle} ⋅ ${locale === 'en' ? SITE_NAME.en : SITE_NAME.ko}`
    : undefined;

  // 가로 거터는 page-gutter-x(단일 출처), 세로 패딩만 변형별로 지정.
  const paddingClass =
    padding === 'none'
      ? 'p-0'
      : padding === 'noTop'
        ? 'page-gutter-x page-end'
        : padding === 'noBottom'
          ? 'page-gutter-x pt-7 sm:pt-11'
          : 'page-gutter-x page-end pt-7 sm:pt-11';

  return (
    <>
      {/* React 19 메타데이터 */}
      {fullPageTitle && (
        <>
          <title>{fullPageTitle}</title>
          <meta property="og:title" content={fullPageTitle} />
        </>
      )}
      {pageDescription && (
        <>
          <meta name="description" content={pageDescription} />
          <meta property="og:description" content={pageDescription} />
        </>
      )}
      {noImageIndex && <meta name="robots" content="noimageindex" />}

      {/* 기존 레이아웃 */}
      <div className="flex grow flex-col bg-neutral-900">
        <Header />
        {(title || finalBreadcrumb.length > 0) && (
          <PageTitle
            title={title}
            subtitle={subtitle}
            breadcrumb={finalBreadcrumb}
            margin={titleMargin}
          />
        )}
        <div
          className={`relative grow bg-white ${paddingClass}`}
          data-subnav={subNav ? '' : undefined}
        >
          {/* 서브내비를 먼저 둔다 — 절대 배치라 자리는 그대로고, 뒤에 두면 `.page-end` 의
              `:last-child` 가 서브내비를 가리켜 본문 마지막 블록의 마진이 안 지워진다. */}
          {subNav && <SubNavbar {...subNav} />}
          {children}
        </div>
      </div>
    </>
  );
}
