import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

// d1baf83c 의 apps/web/src/components/form/Text.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 글자 칸: 높이 32, 13px, outline-none 이라 초점 표시가 없고 오류여도 모양이 그대로다.
// maxWidth 는 예전처럼 폼마다 적던 임의 폭 클래스를 받는다.
export default function LegacyText({
  name,
  maxWidth,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  maxWidth?: string;
}) {
  const { register } = useFormContext();
  return (
    <input
      type="text"
      className={clsx(
        maxWidth,
        'h-8 rounded-xs border border-neutral-300 bg-white pl-2 text-sm outline-none placeholder:text-neutral-300 disabled:text-neutral-400',
      )}
      {...props}
      {...register(name)}
    />
  );
}
