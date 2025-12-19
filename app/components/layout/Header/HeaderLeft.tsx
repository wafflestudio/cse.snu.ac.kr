import { Link } from 'react-router';
import { useLanguage } from '~/hooks/useLanguage';
import { useStore } from '~/store';
import HeaderLogoSVG from './assets/header_logo.svg?react';
import HeaderSubTextSVG from './assets/header_sub_text.svg?react';
import HeaderTextSVG from './assets/header_text.svg?react';
import SNULogoSVG from './assets/SNU_Logo.svg?react';

const translations = {
  '메인으로 이동': 'Go to home',
};

export default function HeaderLeft() {
  const { localizedPath, t } = useLanguage(translations);
  const homePath = localizedPath('/');
  const closeNavbar = useStore((s) => s.closeNavbar);

  return (
    <Link
      to={homePath}
      className="cursor-pointer"
      aria-label={t('메인으로 이동')}
      onClick={closeNavbar}
    >
      {/* desktop - 큰 화면에서만 표시 */}
      <HeaderLogoSVG className="hidden sm:block" />

      {/* mobile - 작은 화면에서만 표시 */}
      <div className="flex items-center gap-4 sm:hidden">
        <SNULogoSVG className="fill-white" width="34" height="35" />
        <div className="flex flex-col gap-1">
          <HeaderTextSVG />
          <HeaderSubTextSVG />
        </div>
      </div>
    </Link>
  );
}
