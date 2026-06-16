import type { Decorator } from '@storybook/tanstack-react';
import { FormProvider, useForm } from 'react-hook-form';

/**
 * react-hook-form `useFormContext`에 의존하는 form 컴포넌트 스토리용 데코레이터.
 * 필드 초기값이 필요한 컴포넌트(DatePicker=Date, File=배열 등)는 스토리에
 * `parameters: { formValues: { <name>: <value> } }`로 defaultValues를 준다.
 */
export const withForm: Decorator = (Story, context) => {
  const methods = useForm({
    defaultValues: context.parameters.formValues as
      | Record<string, unknown>
      | undefined,
  });
  return (
    <FormProvider {...methods}>
      {/* 폼 컨트롤 중 가장 넓은 TextList(내부 Text w-[25rem]+버튼)도 안 줄바꿈하게 충분히 넓게 */}
      <form className="w-[30rem]">
        <Story />
      </form>
    </FormProvider>
  );
};
