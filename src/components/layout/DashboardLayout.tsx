"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getNavigationWithActiveState } from '@/lib/navigation';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user?.role) {
    return null;
  }

  // Get navigation items based on user role with active state
  const navigationWithActive = getNavigationWithActiveState(user.role, pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigation={navigationWithActive} />
      <main>{children}</main>
    </div>
  );
}

