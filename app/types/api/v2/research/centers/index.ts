export interface ResearchCenter {
  id: number;
  name: string;
  description: string;
  mainImageUrl: string | null;
  websiteURL: string;
}

export type ResearchCentersResponse = ResearchCenter[];
