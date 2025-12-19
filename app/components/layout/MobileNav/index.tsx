import { useStore } from '~/store';
import MobileNavDetail from './MobileNavDetail';
import MobileNavList from './MobileNavList';

export default function MobileNav() {
  const navbarState = useStore((s) => s.navbarState);

  if (navbarState.type !== 'hovered') return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 top-[68px] z-50 flex sm:hidden">
      <MobileNavList />
      <MobileNavDetail />
    </div>
  );
}
