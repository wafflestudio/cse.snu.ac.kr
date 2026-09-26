import type commonTranslations from '@/translations.json';
import type footerOnlyTranslations from './translations.json';

type FooterTranslations = typeof commonTranslations &
  typeof footerOnlyTranslations;
type TranslationKeys = keyof FooterTranslations;

type Links = { href: string; title: TranslationKeys }[];

export type LinkGroupProps = {
  groupName: string;
  links: Links;
  mode?: 'light' | 'dark';
};

const aboutLinks = [
  { href: '/about/overview', title: '학부 소개' },
  { href: '/people/faculty', title: '교수진' },
  { href: '/academics/undergraduate/guide', title: '학부 안내' },
  { href: '/academics/graduate/guide', title: '대학원 안내' },
] satisfies Links;

const resourcesLinks = [
  { href: '/community/notice', title: '공지사항' },
  { href: '/community/seminar', title: '세미나' },
  { href: '/reservations/introduction', title: '시설 예약 안내' },
] satisfies Links;

const researchLinks = [
  { href: '/community/faculty-recruitment', title: '신임교수초빙' },
  { href: '/research/labs', title: '연구실 목록' },
  { href: '/research/top-conference-list', title: 'Top Conference List' },
  { href: '/10-10-project', title: '10-10 Project' },
] satisfies Links;

const moreLinks = [
  { title: '연합전공 인공지능(학사)', href: 'https://imai.snu.ac.kr' },
  { title: '지능형컴퓨팅사업단', href: 'http://bkcse.snu.ac.kr' },
  { title: '컴퓨터 연구소', href: 'http://ict.snu.ac.kr' },
  { title: '해동학술정보실', href: 'http://haedong.snu.ac.kr/' },
] satisfies Links;

export const LINK_GROUPS = [
  {
    groupName: 'About',
    links: aboutLinks,
  },
  {
    groupName: 'Resources',
    links: resourcesLinks,
  },
  {
    groupName: 'Research',
    links: researchLinks,
  },
  {
    groupName: 'More',
    links: moreLinks,
  },
] satisfies LinkGroupProps[];
