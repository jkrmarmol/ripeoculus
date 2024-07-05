'use client';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useAppDispatch } from '@/lib/hooks';
import { authProtected } from '@/store/auth/authenticationSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { payload } = await dispatch(authProtected());
      if (payload.message === 'Authenticated') {
        router.push('/dashboard');
      }
      if (payload.message === 'Unauthorized') {
        router.push('/');
      }
    })();
  }, []);
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
