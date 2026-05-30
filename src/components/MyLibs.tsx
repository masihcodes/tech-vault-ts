'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import MyLibCard from './MyLibCard';
import { LibraryItems } from './myTypes';



export default function MyLibs({ myLibs }: LibraryItems) {




  const hasToasted = useRef(false);
  useEffect(() => {
    if (!hasToasted.current) {
      toast(`You have ${myLibs.length} Library(s) in Your Vault 😀`);
      hasToasted.current = true;
    }
  }, []);





  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
      {myLibs.map((item) => (
        <div key={item.id} className='group flex flex-col rounded-2xl border border-slate-700/50 bg-slate-900/30 p-8 transition-all duration-300 ease-in hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/40'>

          <MyLibCard item={item} />

        </div>
      ))}
    </div>
  );
}
