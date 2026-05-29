'use client';

import { PackagePlus } from 'lucide-react';

import { setModalStatus, setNewEntryStatus, useLibStore } from './useLibStore';

export default function AddButton() {

  const authenticated = useLibStore(s => s.isAuthenticated);

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
