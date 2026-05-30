"use client";

import { PackagePlus } from 'lucide-react';
import { setModalStatus, setNewEntryStatus, setSignInModalStatus } from './useLibStore';
import { User } from './myTypes';




export default function AddButton({ user }: { user: (User | null); }) {



  function handleAdd() {
    if (!user) {
      setSignInModalStatus(true);
    } else {
      setModalStatus(true);
      setNewEntryStatus(true);
    }
  }

  return (
    <div className='w-full sm:w-auto'>
      <button onClick={handleAdd}
        className='flex bg-cyan-600 text-white px-8 py-4 rounded-xl hover:bg-cyan-500 transition duration-300 ease-in shadow-lg shadow-cyan-500/40 cursor-pointer'>
        <PackagePlus />Add New Library
      </button>
    </div>
  );
}


