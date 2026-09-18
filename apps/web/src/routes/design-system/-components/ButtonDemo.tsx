import { Check, Plus } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import Button from '@/components/ui/Button';

export function ButtonDemo() {
  const variants = [
    ['primary', '강조형', 'plain'],
    ['neutral', '기본형', 'plain'],
    ['secondary', '보조형', 'plain'],
    ['quiet', '텍스트형', 'light'],
    ['quiet', '텍스트형', 'dark'],
    ['nav', '헤더용', 'dark'],
  ] as const;
  return (
    <div className="leading-[1.2] max-w-[960px] border border-neutral-200">
      <table className="w-full table-fixed border-collapse text-neutral-600 [&_th]:px-4 [&_th]:py-5 [&_th]:text-center [&_th]:align-middle [&_th]:text-xs/[inherit] [&_th]:font-medium [&_td]:px-4 [&_td]:py-5 [&_td]:text-center [&_td]:align-middle [&_th:first-child]:w-[26%] [&_th:first-child]:text-left [&_thead]:bg-neutral-50 [&_thead_th]:py-4 max-sm:[&_th]:px-1 max-sm:[&_th]:py-4 max-sm:[&_th]:text-[11px] max-sm:[&_td]:px-1 max-sm:[&_td]:py-4">
        <thead>
          <tr>
            <th scope="col">{'종류'}</th>
            <th scope="col">{'기본'}</th>
            <th scope="col">{'비활성'}</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(([variant, label, surface]) => (
            <tr
              key={`${variant}-${surface}`}
              className={`h-[86px] border-t ${
                surface === 'dark'
                  ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
                  : surface === 'light'
                    ? 'bg-neutral-200 border-neutral-200'
                    : 'border-neutral-200'
              }`}
            >
              <th scope="row">
                {label}
                {variant === 'quiet' && (
                  <span
                    className={`mt-1 block text-[11px] font-normal ${surface === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}
                  >
                    {surface === 'dark' ? '어두운 메뉴' : '밝은 검색창'}
                  </span>
                )}
              </th>
              <td>
                <ButtonSample variant={variant} />
              </td>
              <td>
                <ButtonSample variant={variant} disabled />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid grid-cols-3 gap-4 p-6 [&_h4]:col-span-full [&_h4]:text-sm/[inherit] [&_h4]:font-medium [&_figure]:min-w-0 [&_figure]:text-center [&_figcaption]:text-xs/[inherit] [&_figcaption]:text-neutral-600 [&_figure>div]:grid [&_figure>div]:h-17 [&_figure>div]:place-items-center max-sm:gap-2 max-sm:p-4">
        <h4>{'크기'}</h4>
        {(
          [
            ['sm', '작게'],
            ['md', '보통'],
            ['lg', '크게'],
          ] as const
        ).map(([size, label]) => (
          <figure key={size}>
            <figcaption>{label}</figcaption>
            <div>
              <ButtonSample variant="primary" size={size} showIcon={false} />
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ButtonSample({
  variant,
  size = 'md',
  disabled = false,
  showIcon = true,
}: Pick<ComponentProps<typeof Button>, 'variant' | 'size'> & {
  disabled?: boolean;
  showIcon?: boolean;
}) {
  const [added, setAdded] = useState(false);
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => setAdded(!added)}
    >
      {showIcon &&
        (added ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Plus size={16} aria-hidden="true" />
        ))}
      {added ? '추가됨' : '추가'}
    </Button>
  );
}
