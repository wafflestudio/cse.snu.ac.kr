import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import MobileNavButton from './MobileNavButton';

export default function Header() {
  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between bg-shell-200 px-5 sm:h-auto sm:bg-transparent sm:px-15 sm:pb-10 sm:pt-12">
      <HeaderLeft />
      <HeaderRight />
      <MobileNavButton />
    </header>
  );
}
