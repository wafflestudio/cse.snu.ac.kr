export interface Direction {
  id: number;
  name: string;
  description: string;
}

export type DirectionsResponse = { ko: Direction; en: Direction }[];
