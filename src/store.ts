import { create } from 'zustand';
import { BASE_URL } from '@/constants/api';
import type { NavItem } from '@/constants/navigation';
import { api } from '@/utils/api';

type NavbarState =
  | { type: 'closed' }
  | { type: 'expanded' }
  | { type: 'hovered'; navItem: NavItem };

export type Role =
  | 'ROLE_STAFF'
  | 'ROLE_RESERVATION'
  | 'ROLE_LABMASTER'
  | 'ROLE_COUNCIL';

interface Store {
  navbarState: NavbarState;
  expandNavbar: () => void;
  closeNavbar: () => void;
  hoverNavItem: (navItem: NavItem) => void;

  roles: Role[];
  login: () => void;
  logout: () => Promise<void>;
  mockLogin: (...roles: Role[]) => Promise<void>;
  mockLogout: () => Promise<void>;
}

export const useStore = create<Store>()((set) => ({
  navbarState: { type: 'closed' },
  expandNavbar: () => set({ navbarState: { type: 'expanded' } }),
  closeNavbar: () => set({ navbarState: { type: 'closed' } }),
  hoverNavItem: (navItem: NavItem) =>
    set({ navbarState: { type: 'hovered', navItem } }),

  roles: [],
  login: () => {
    // fetch가 아니라 브라우저 top-level 네비게이션(OAuth) — URL 문자열이 필요하다.
    window.location.href = `${BASE_URL}/v1/login`;
  },
  logout: async () => {
    await api
      .get('v1/logout', { redirect: 'manual', throwHttpErrors: false })
      .catch(() => {});
    window.location.reload();
  },
  mockLogin: async (...roles: Role[]) => {
    const params = roles.map((r) => `role=${r}`).join('&');
    const response = await api.get(`v2/mock-login?${params}`, {
      throwHttpErrors: false,
    });
    if (response.ok) set({ roles });
  },
  mockLogout: async () => {
    await api
      .get('v1/logout', { redirect: 'manual', throwHttpErrors: false })
      .catch(() => {});
    set({ roles: [] });
  },
}));
