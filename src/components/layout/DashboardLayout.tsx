"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  navigation: Array<{ label: string; href: string }>;
}

export default function DashboardLayout({ children, navigation }: DashboardLayoutProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Mark active navigation item
  const navigationWithActive = navigation.map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + '/'),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navigation={navigationWithActive} />
      <main>{children}</main>
    </div>
  );
}

