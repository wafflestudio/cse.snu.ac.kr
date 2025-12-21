export interface Club {
  id: number;
  name: string;
  description: string;
  imageURL: string | null;
}

export type WithLanguage<T> = {
  ko: T;
  en: T;
};

export type StudentClubsResponse = WithLanguage<Club>[];
