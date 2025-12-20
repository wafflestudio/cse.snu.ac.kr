export interface FutureCareersResponse {
  description: string;
  stat: YearStat[];
  companies: Company[];
}

export interface YearStat {
  year: number;
  bachelor: CareerCount[];
  master: CareerCount[];
  doctor: CareerCount[];
}

export interface CareerCount {
  name: string;
  count: number;
}

export interface Company {
  id: number;
  name: string;
  url?: string;
  year: number;
}
