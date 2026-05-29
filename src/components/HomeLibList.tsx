'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getLibsAction } from '@/app/auth/action';
import { getAuthCredentials } from './authStorage';
import LibCard from './LibCard';
import { LibraryItem, useLibStore } from './useLibStore';

interface HomeLibListProps {
  query: string;
  sort: string;
}

export default function HomeLibList({ query, sort }: HomeLibListProps) {
  const [libs, setLibs] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHomeTrigger = useLibStore(s => s.refreshHomeTrigger);

  useEffect(() => {
    let cancelled = false;

    async function loadLibs(showToast = true) {
      setLoading(true);
      try {
        const credentials = getAuthCredentials();
        const data = await getLibsAction(query, sort, credentials);
        if (!cancelled) {
          setLibs(data);
          if (showToast) {
            toast.success(`Successfully retrieved ${data.length} libraries`);
          }
        }
      } catch {
        if (!cancelled) {
          toast.error('Failed to connect to the server');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLibs();

    return () => { cancelled = true; };
  }, [query, sort, refreshHomeTrigger]);




  if (loading) {
    return <div className="animate-pulse py-12 text-center text-cyan-500">Loading ... ⏳</div>;
  }




  return (
    <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-x-10 gap-y-12 p-4 md:grid-cols-2 lg:grid-cols-3">
      {libs.map((lib) => (
        <LibCard key={lib.id} lib={lib} />
      ))}
    </div>
  );
}
