import { useLanguage } from '~/hooks/useLanguage';
import { SEARCH_TRANSLATIONS } from '../constants';

export default function CircleTitle({
  title,
  size,
}: {
  title: string;
  size?: number;
}) {
  const { tUnsafe } = useLanguage(SEARCH_TRANSLATIONS);
  return (
    <div className="ml-[0.8rem] flex items-center gap-2">
      <OrangeCircle />
      <h3 className="text-[1.0625rem] font-semibold leading-loose text-neutral-950">
        {tUnsafe(title)}
        {size ? `(${size})` : ''}
      </h3>
    </div>
  );
}

function OrangeCircle() {
  return (
    <div className="h-[.625rem] w-[.625rem] rounded-full border border-main-orange" />
  );
}
