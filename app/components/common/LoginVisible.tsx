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
  const userRole = useStore((s) => s.role);
  if (!userRole) return fallback;

  const roleArr = Array.isArray(allow) ? allow : [allow];
  if (!roleArr.includes(userRole)) return fallback;

  return children;
}
