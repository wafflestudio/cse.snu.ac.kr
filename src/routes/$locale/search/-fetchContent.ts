import type {
  AboutSearchResult,
  AcademicsSearchResult,
  AdmissionsSearchResult,
  MemberSearchResult,
  NewsSearchResult,
  NoticeSearchResult,
  ResearchSearchResult,
  SeminarPreviewList,
  TotalSearchResult,
} from '@/types/api';
import { api } from '@/utils/api';
import type { TreeNode } from './-components/ui/SearchSubNavbar';

export type SectionContent = {
  about?: AboutSearchResult;
  notice?: NoticeSearchResult;
  news?: NewsSearchResult;
  seminar?: SeminarPreviewList;
  member?: MemberSearchResult;
  research?: ResearchSearchResult;
  admission?: AdmissionsSearchResult;
  academics?: AcademicsSearchResult;
};

export default async function fetchContent(
  keyword: string,
  tag?: string[],
  locale: string = 'ko',
) {
  const noTag = tag === undefined || tag.length === 0;
  const isSectionVisible = (sectionName: string) =>
    noTag || tag.includes(sectionName);

  const searchParams = new URLSearchParams({
    keyword,
    number: '3', // 도메인별 상위 N개(구성원은 memberNumber로 별도)
    memberNumber: '10',
    stringLength: '200', // 강조 주변 미리보기 길이
    language: locale,
  });
  const result = await api
    .get(`v2/totalSearch?${searchParams.toString()}`)
    .json<TotalSearchResult>();

  // 태그 필터는 표시 단계에서만 적용한다 — 통합검색은 항상 전 도메인을 받는다.
  const about = isSectionVisible('소개') ? result.aboutResult : undefined;
  const notice = isSectionVisible('소식') ? result.noticeResult : undefined;
  const news = isSectionVisible('소식') ? result.newsResult : undefined;
  const seminar = isSectionVisible('소식') ? result.seminarResult : undefined;
  const member = isSectionVisible('구성원') ? result.memberResult : undefined;
  const research = isSectionVisible('연구·교육')
    ? result.researchResult
    : undefined;
  const admission = isSectionVisible('입학')
    ? result.admissionsResult
    : undefined;
  const academics = isSectionVisible('학사 및 교과')
    ? result.academicsResult
    : undefined;

  const sectionContent: SectionContent = {
    about,
    notice,
    news,
    seminar,
    member,
    research,
    admission,
    academics,
  };

  const total = [
    about,
    notice,
    news,
    seminar,
    member,
    research,
    admission,
    academics,
  ].reduce((prev, cur) => prev + (cur?.total ?? 0), 0);

  const noticeTotal = notice?.total;
  const newsTotal = news?.total;
  const seminarTotal = seminar?.total;
  const hasCommunity = Boolean(notice || news || seminar);
  const communityTotal = hasCommunity
    ? (noticeTotal ?? 0) + (newsTotal ?? 0) + (seminarTotal ?? 0)
    : undefined;

  const node: TreeNode[] = [
    {
      id: 'all',
      name: '전체',
      size: noTag ? total : undefined,
      bold: noTag,
    },
    {
      id: 'about',
      name: '소개',
      size: about?.total,
      bold: !noTag && about !== undefined,
    },
    {
      id: 'community',
      name: '소식',
      size: communityTotal,
      children: [
        { id: 'notice', name: '공지사항', size: noticeTotal },
        { id: 'news', name: '새 소식', size: newsTotal },
        { id: 'seminar', name: '세미나', size: seminarTotal },
      ],
      bold: !noTag && hasCommunity,
    },
    {
      id: 'member',
      name: '구성원',
      size: member?.total,
      bold: !noTag && member !== undefined,
    },
    {
      id: 'research',
      name: '연구·교육',
      size: research?.total,
      bold: !noTag && research !== undefined,
    },
    {
      id: 'admissions',
      name: '입학',
      size: admission?.total,
      bold: !noTag && admission !== undefined,
    },
    {
      id: 'academics',
      name: '학사 및 교과',
      size: academics?.total,
      bold: !noTag && academics !== undefined,
    },
  ];

  return { sectionContent, node, total };
}
