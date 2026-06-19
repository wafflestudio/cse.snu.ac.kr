interface ResearchGroupLab {
  id: number;
  name: string;
}

export interface ResearchGroup {
  id: number;
  name: string;
  description: string;
  mainImageUrl: string | null;
  labs: ResearchGroupLab[];
}

export type ResearchGroupsResponse = ResearchGroup[];
