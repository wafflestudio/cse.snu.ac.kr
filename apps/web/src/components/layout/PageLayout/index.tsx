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
  // 띠 틀: 본문을 PageBand 로 쌓는다(/design-system#page). 없으면 기본 틀.
  bands?: boolean;
  subNav?: SubNavConfig;
  pageTitle?: string; // <title> 및 og:title용
  pageDescription?: string; // meta description 및 og:description용
  noImageIndex?: boolean; // 이미지 검색 차단용
  children: ReactNode;
}

/**
 * 본문 기본 스타일
 * 기본 틀: 위 48(모바일 32)·아래 128(모바일 64), 흰 바탕. 띠 틀은 bands.
 */
export default function PageLayout({
  title,
  subtitle,
  breadcrumb,
  bands = false,
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

  // 기본 틀: 위 32/48·아래 64/128. 띠 틀은 여백을 띠(PageBand)가 준다.
  const paddingClass = bands
    ? ''
    : 'page-gutter-x pt-8 pb-16 sm:pt-12 sm:pb-32';

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
          />
        )}
        <div className={`relative grow bg-white ${paddingClass}`}>
          {children}
          {subNav && <SubNavbar {...subNav} />}
        </div>
      </div>
    </>
  );
}
