import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import type {
  NewsSearchResult,
  NoticeSearchResult,
} from '~/types/api/v2/search';
import type { SeminarPreviewList } from '~/types/api/v2/seminar';
import SeminarRow from '../../community/seminar/components/SeminarRow';
import { SEARCH_TRANSLATIONS } from '../constants';
import CircleTitle from './CircleTitle';
import Divider from './Divider';
import NewsRow from './NewsRow';
import NoticeRow from './NoticeRow';
import Section from './Section';

export default function CommunitySection({
  keyword,
  notice,
  news,
  seminar,
}: {
  keyword: string;
  notice: NoticeSearchResult;
  news: NewsSearchResult;
  seminar: SeminarPreviewList;
}) {
  return (
    <Section
      title="소식"
      size={notice.total + news.total + seminar.total}
      sectionId="community"
    >
      <CommunitySubSection
        title="공지사항"
        size={notice.total}
        href={`/community/notice?keyword=${encodeURIComponent(keyword)}`}
        divider={news.total !== 0 || seminar.total !== 0}
        sectionId="notice"
      >
        {notice.results.map((result) => (
          <NoticeRow
            key={result.id}
            id={result.id}
            title={result.title}
            dateStr={result.createdAt}
            partialDescription={result.partialDescription}
            boldStartIndex={result.boldStartIndex}
            boldEndIndex={result.boldEndIndex}
          />
        ))}
      </CommunitySubSection>

      <CommunitySubSection
        title="새 소식"
        size={news.total}
        href={`/community/news?keyword=${encodeURIComponent(keyword)}`}
        divider={seminar.total !== 0}
        sectionId="news"
      >
        {news.results.map((result) => (
          <NewsRow
            key={result.id}
            href={`/community/news/${result.id}`}
            title={result.title}
            partialDescription={result.partialDescription}
            boldStartIndex={result.boldStartIndex}
            boldEndIndex={result.boldEndIndex}
            date={result.date}
            imageURL={result.imageUrl}
          />
        ))}
      </CommunitySubSection>

      <CommunitySubSection
        title="세미나"
        size={seminar.total}
        href={`/community/seminar?keyword=${encodeURIComponent(keyword)}`}
        sectionId="seminar"
      >
        {seminar.searchList.slice(0, 3).map((result) => (
          <SeminarRow key={result.id} seminar={result} />
        ))}
      </CommunitySubSection>
    </Section>
  );
}

const CommunitySubSection = ({
  title,
  size,
  href,
  divider,
  sectionId,
  children,
}: {
  title: string;
  size: number;
  href: string;
  divider?: boolean;
  sectionId: string;
  children: ReactNode;
}) => {
  if (size === 0) return null;

  return (
    <>
      <CircleTitle title={title} size={size} />
      <div
        className="mx-5 mt-8 flex flex-col gap-7.5 sm:mr-10 sm:gap-7"
        id={`nav_${sectionId}`}
      >
        {children}
      </div>
      <MoreResultLink href={href} />
      {divider && <Divider />}
    </>
  );
};

const MoreResultLink = ({ href }: { href: string }) => {
  const { t, localizedPath } = useLanguage(SEARCH_TRANSLATIONS);
  return (
    <Link
      to={localizedPath(href)}
      className="text-middle mr-4 mt-10 flex items-center self-end text-md font-medium text-main-orange"
    >
      {t('결과 더보기')}
      <span className="material-symbols-outlined text-sm">chevron_right</span>
    </Link>
  );
};
