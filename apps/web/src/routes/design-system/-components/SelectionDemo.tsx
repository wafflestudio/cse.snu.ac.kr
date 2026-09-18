import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Radio from '@/components/form/Radio';
import Checkbox from '@/components/ui/Checkbox';

export function SelectionDemo() {
  const methods = useForm({ defaultValues: { audience: 'undergraduate' } });
  const [checked, setChecked] = useState(true);
  return (
    <div className="leading-[1.2] max-w-[560px] flex flex-col items-start gap-6">
      <FormProvider {...methods}>
        <fieldset className="flex flex-wrap gap-4.5 [&_legend]:mb-4 [&_legend]:text-sm/[inherit] [&_label]:items-center">
          <legend>{'공지 대상'}</legend>
          <Radio name="audience" value="undergraduate" label={'학부'} />
          <Radio name="audience" value="graduate" label={'대학원'} />
        </fieldset>
      </FormProvider>
      <div className="flex flex-col gap-4.5 [&_label:focus-within]:outline-2 [&_label:focus-within]:outline-link [&_label:focus-within]:outline-offset-4">
        <Checkbox label={'알림 받기'} checked={checked} onChange={setChecked} />
        <Checkbox
          label={'선택 불가'}
          checked={false}
          disabled
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
