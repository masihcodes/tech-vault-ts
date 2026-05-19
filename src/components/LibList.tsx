"use client";


import { use, } from 'react';

import LibCard from './LibCard';
import { LibraryItem } from './useLibStore';



interface LibPromise {
  libPromise: Promise<LibraryItem[]>;
}



export default function LibList({ libPromise }: LibPromise) {

  const data = use(libPromise);


  return (
    <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-x-10 gap-y-12 p-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map(lib => <LibCard key={lib.id} lib={lib} />)}
    </div>
  );
}