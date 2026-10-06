import type { MouseEvent, ReactNode } from 'react';
import { type FieldValues, FormProvider, useForm } from 'react-hook-form';

// 문서 견본용 도구. 견본은 실제 부품을 쓰되 페이지를 떠나거나 서버를 부르지 않는다.

// 견본 안의 링크는 진짜 <a>(커서·호버·초점이 그대로)지만 누르면 이동하지 않는다.
export const stay = (e: MouseEvent) => e.preventDefault();

// form/* 부품은 FormProvider 안에서만 그려진다. 견본용 폼 맥락.
export function SampleFormProvider<T extends FieldValues>({
  defaultValues,
  children,
}: {
  defaultValues?: T;
  children: ReactNode;
}) {
  const methods = useForm<T>({
    // biome-ignore lint/suspicious/noExplicitAny: react-hook-form 의 DefaultValues 제네릭을 견본에서 맞추지 않는다
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}
