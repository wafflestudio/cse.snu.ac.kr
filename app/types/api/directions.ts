export interface Direction {
  id: number;
  name: string;
  description: string;
}

export type WithLanguage<T> = {
  ko: T;
  en: T;
};

export type DirectionsResponse = WithLanguage<Direction>[];
