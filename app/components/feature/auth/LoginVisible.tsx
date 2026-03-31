import type { ReactNode } from 'react';
import type { Role } from '~/store';
import { useStore } from '~/store';

interface LoginVisibleProps {
  allow?: Role | Role[];
  fallback?: ReactNode;
  children: ReactNode;
}

export default function LoginVisible({
  allow,
  children,
  fallback = null,
}: LoginVisibleProps) {
  const userRoles = useStore((s) => s.roles);
  if (userRoles.length === 0) return fallback;

  const roleArr = Array.isArray(allow) ? allow : [allow];
  if (!userRoles.some((r) => roleArr.includes(r))) return fallback;

  return children;
}
