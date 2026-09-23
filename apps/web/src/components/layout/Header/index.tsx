import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';
import MobileNavButton from './MobileNavButton';

export default function Header() {
  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between bg-[#2D2D30] px-5 shell:h-auto shell:bg-transparent shell:px-15 shell:pb-[2.44rem] shell:pt-12">
      <HeaderLeft />
      <HeaderRight />
      <MobileNavButton />
    </header>
  );
}
