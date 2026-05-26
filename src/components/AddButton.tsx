'use client';

import { PackagePlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isLoggedIn } from './authStorage';
import { setModalStatus, setNewEntryStatus } from './useLibStore';

export default function AddButton() {
  const path = usePathname();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isLoggedIn());
  }, [path]);

  if (!authenticated) return null;

  return (
    <div className="w-full sm:w-auto">
      <button
        onClick={() => {
          setModalStatus(true);
          setNewEntryStatus(true);
        }}
        className="flex cursor-pointer rounded-xl bg-cyan-600 px-8 py-4 text-white shadow-lg shadow-cyan-500/40 transition duration-300 ease-in hover:bg-cyan-500">
        <PackagePlus />
        Add New Library
      </button>
    </div>
  );
}
