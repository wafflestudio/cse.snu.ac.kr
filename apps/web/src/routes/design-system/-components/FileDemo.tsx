import { FormProvider, useForm } from 'react-hook-form';
import FilePicker from '@/components/form/File';

export function FileDemo() {
  const methods = useForm({ defaultValues: { files: [] } });
  return (
    <FormProvider {...methods}>
      <fieldset className="leading-[1.2] max-w-[560px] min-w-0 [&>legend]:mb-4 [&>legend]:text-sm/[inherit] [&>legend]:font-medium [&_ol]:w-full [&_ol]:max-w-full [&_li]:h-auto [&_li]:min-h-8 [&_li]:w-full [&_li]:py-2 [&_li_p]:min-w-0 [&_li_p]:leading-[1.5] [&_li_button]:shrink-0 [&_label]:relative [&_label:focus-within]:outline-2 [&_label:focus-within]:outline-link [&_label:focus-within]:outline-offset-4 [&_input[type=file]]:absolute [&_input[type=file]]:block [&_input[type=file]]:size-px [&_input[type=file]]:opacity-0">
        <legend>첨부 자료</legend>
        <FilePicker name="files" />
        <p className="mt-3 block text-xs/[1.7] text-neutral-500">
          선택한 파일은 서버로 전송되지 않습니다.
        </p>
      </fieldset>
    </FormProvider>
  );
}
