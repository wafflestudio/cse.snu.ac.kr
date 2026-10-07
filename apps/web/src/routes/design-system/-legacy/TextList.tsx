import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import LegacyText from './Text';

// d1baf83c 의 apps/web/src/components/form/TextList.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 목록 입력(학력·연구 분야·경력): 새 칸은 옅은 회색 바탕, 칸 폭 400 고정, 단추는 높이 32·모서리 4px·호버 300.
export function LegacyTextList({
  name,
  placeholder,
}: {
  name: string;
  placeholder?: string;
}) {
  const { getValues, setValue } = useFormContext();
  const list = useWatch({ name }) as string[] | undefined;
  const newValueName = `${name}_new`;

  const handleAdd = () => {
    setValue(name, [getValues(newValueName), ...(list ?? [])]);
    setValue(newValueName, '');
  };

  return (
    <div>
      <div className="mb-2.5 flex gap-3">
        <LegacyText
          maxWidth="w-[25rem]"
          name={newValueName}
          bgColor="bg-neutral-50"
          placeholder={placeholder}
        />
        <OldButton onClick={handleAdd} bgColor="bg-neutral-50">
          추가
        </OldButton>
      </div>
      {list?.map((_, idx) => (
        <div className="mb-2.5 flex gap-3" key={idx}>
          <LegacyText
            maxWidth="w-[25rem]"
            name={`${name}.${idx}`}
            placeholder={placeholder}
          />
          <OldButton
            onClick={() =>
              setValue(
                name,
                list.filter((_, i) => i !== idx),
              )
            }
          >
            삭제
          </OldButton>
        </div>
      ))}
    </div>
  );
}

function OldButton({
  bgColor,
  onClick,
  children,
}: {
  bgColor?: string;
  onClick?: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      className={clsx(
        'h-8 rounded-sm border border-neutral-300 px-2.5 text-[13px] text-neutral-700 hover:bg-neutral-300',
        bgColor,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
