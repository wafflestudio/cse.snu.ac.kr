import { useStore } from '~/store';
import LNBDetail from './LeftNavDetail';
import LNBSidebar from './LeftNavSidebar';

export default function LNB() {
  const closeNavbar = useStore((s) => s.closeNavbar);

  return (
    <nav
      className="fixed bottom-0 left-0 top-0 z-50 hidden sm:flex"
      onMouseLeave={closeNavbar}
      aria-label="주 네비게이션"
    >
      <LNBSidebar />
      <LNBDetail />
    </nav>
  );
}
