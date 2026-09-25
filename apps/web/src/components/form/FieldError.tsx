import { get, useFormState } from 'react-hook-form';

// 필드 바로 아래 8px 에 오류 문장. 부품이 자기 name 으로 부른다.
export function useFieldError(name: string): string | undefined {
  const { errors } = useFormState({ name });
  const error = get(errors, name);
  return error?.message ? String(error.message) : error ? '' : undefined;
}

export default function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 type-meta text-red-600">{message}</p>;
}
