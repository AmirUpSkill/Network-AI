'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to search page as the main dashboard feature
    router.replace('/dashboard/search');
  }, [router]);

  // Show a minimal loading state while redirecting
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted-foreground">
        Loading dashboard...
      </div>
    </div>
  );
}