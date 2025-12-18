import { create } from 'zustand';

export type NavbarState =
  | { type: 'closed' }
  | { type: 'expanded' }
  | { type: 'hovered'; section: string };

export type Role = 'ROLE_STAFF' | 'ROLE_RESERVATION' | 'ROLE_COUNCIL';

interface Store {
  role?: Role;
  navbarState: NavbarState;
}

export const useStore = create<Store>()(() => ({
  role: undefined,
  navbarState: { type: 'closed' },
}));
