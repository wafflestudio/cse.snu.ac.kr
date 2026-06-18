import type {
  Classification,
  ClassificationEn,
  StudentType,
} from '@/types/academics';

export interface Course {
  code: string;
  credit: number;
  grade: number;
  studentType: StudentType;
  ko: { name: string; description: string; classification: Classification };
  en: { name: string; description: string; classification: ClassificationEn };
}
