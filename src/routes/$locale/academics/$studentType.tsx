import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import NotFound from '@/components/layout/NotFound';
import type { StudentType } from '@/types/api';

// 백엔드 enum(StudentType)과 1:1. 값이 늘거나 줄면 satisfies가 컴파일을 깨뜨려 여기도 고치게 만든다.
const STUDENT_TYPES = { undergraduate: true, graduate: true } satisfies Record<
  StudentType,
  true
>;

const isStudentType = (value: string): value is StudentType =>
  value in STUDENT_TYPES;

/**
 * `$studentType` 세그먼트 검증. URL은 아무 문자열이나 올 수 있으므로 여기서 한 번 좁히고,
 * 하위 라우트(courses·guide·scholarship·course-changes)는 `as` 없이 StudentType을 받는다.
 * 잘못된 값은 백엔드까지 가지 않고 404.
 */
export const Route = createFileRoute('/$locale/academics/$studentType')({
  params: {
    parse: ({ studentType }) => {
      if (!isStudentType(studentType)) throw notFound();
      return { studentType };
    },
    stringify: ({ studentType }) => ({ studentType }),
  },
  notFoundComponent: NotFound,
  component: Outlet,
});
