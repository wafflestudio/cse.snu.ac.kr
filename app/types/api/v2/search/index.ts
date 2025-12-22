export type SearchParam = { keyword: string; number: number; amount?: number };

export type AboutSearchResult = {
  total: number;
  results: AboutPreview[];
};

export type AboutPreview = {
  id: number;
  name: string;
  aboutPostType:
    | 'OVERVIEW'
    | 'GREETINGS'
    | 'HISTORY'
    | 'FUTURE_CAREERS'
    | 'CONTACT'
    | 'STUDENT_CLUBS'
    | 'FACILITIES'
    | 'DIRECTIONS';
  partialDescription: string;
  boldStartIndex: number;
  boldEndIndex: number;
};

export type NoticeSearchResult = {
  total: number;
  results: {
    id: number;
    title: string;
    createdAt: string;
    partialDescription: string;
    boldStartIndex: number;
    boldEndIndex: number;
  }[];
};

export type NewsSearchResult = {
  total: number;
  results: {
    id: number;
    title: string;
    date: string;
    partialDescription: string;
    boldStartIndex: number;
    boldEndIndex: number;
    tags: string[];
    imageUrl: string | null;
  }[];
};

export type MemberType = 'PROFESSOR' | 'STAFF';

export type Member = {
  id: number;
  name: string;
  academicRankOrRole: string;
  imageURL: string | null;
  memberType: MemberType;
};

export type MemberSearchResult = {
  total: number;
  results: Member[];
};

export type ResearchType =
  | 'RESEARCH_GROUP'
  | 'RESEARCH_CENTER'
  | 'LAB'
  | 'CONFERENCE';

export type ResearchSearchResult = {
  total: number;
  results: {
    id: number;
    name: string;
    researchType: ResearchType;
    partialDescription: string;
    boldStartIndex: number;
    boldEndIndex: number;
  }[];
};

export type AcademicType =
  | 'GUIDE'
  | 'GENERAL_STUDIES_REQUIREMENTS'
  | 'GENERAL_STUDIES_REQUIREMENTS_SUBJECT_CHANGES'
  | 'CURRICULUM'
  | 'DEGREE_REQUIREMENTS'
  | 'DEGREE_REQUIREMENTS_YEAR_LIST'
  | 'COURSE_CHANGES'
  | 'SCHOLARSHIP';

export type PostType = 'ACADEMICS' | 'COURSE' | 'SCHOLARSHIP';

export type StudentType = 'UNDERGRADUATE' | 'GRADUATE';

export type Academic = {
  id: number;
  name: string;
  academicType: AcademicType;
  postType: PostType;
  studentType: StudentType;
  partialDescription: string;
  boldStartIndex: number;
  boldEndIndex: number;
};

export type AcademicsSearchResult = {
  total: number;
  results: Academic[];
};

export type AdmissionsSearchResult = {
  total: number;
  admissions: {
    id: number;
    name: string;
    mainType: string;
    postType: string;
    partialDescription: string;
    boldStartIndex: number;
    boldEndIndex: number;
  }[];
};
