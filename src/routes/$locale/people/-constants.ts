export const FACULTY_STATUS = {
  ACTIVE: '교수',
  INACTIVE: '역대 교수',
  VISITING: '객원 교수',
} as const;

export type FacultyStatus = keyof typeof FACULTY_STATUS;
