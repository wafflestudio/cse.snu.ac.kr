export interface Club {
  id: number;
  name: string;
  description: string;
  imageURL: string | null;
}

export type StudentClubsResponse = { ko: Club; en: Club }[];
