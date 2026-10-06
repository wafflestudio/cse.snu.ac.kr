import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/-components/LinkRow.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 메인 아래 바로가기 한 줄. 라우터 링크는 이동하지 않는 <a href="#"> 로 바꿨다.
// 견본은 모바일 모양이라 sm: 값(18·600, 부제 600)은 뺐다. 예전 값: 링크 16·500, 부제 12·500, 화살표 30·선 1.5.

export function LegacyLinkRow({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <a
      href="#"
      onClick={stay}
      className={clsx(
        'group flex items-center justify-between border-l-[5px] pl-7 duration-300',
        'h-10',
        'border-main-orange-dark',
      )}
    >
      <div
        className={clsx(
          'flex items-end gap-3',
          'text-white',
          'group-hover:text-main-orange',
        )}
      >
        <p className="text-base font-medium">{title}</p>
        {subtitle && <p className="text-xs font-medium">{subtitle}</p>}
      </div>
      <ArrowRight
        className={clsx(
          'pt-0.5 h-[30px] w-[30px] duration-300 group-hover:translate-x-[10px]',
          'text-white',
          'group-hover:text-main-orange',
        )}
        strokeWidth={1.5}
      />
    </a>
  );
}
