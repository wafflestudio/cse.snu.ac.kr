export interface Facility {
  id: number;
  name: string;
  description: string;
  locations: string[];
  imageURL: string | null;
}

export type FacilitiesResponse = { ko: Facility; en: Facility }[];
