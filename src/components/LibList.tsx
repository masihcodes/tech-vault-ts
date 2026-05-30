"use client";


import { use, useEffect, useRef, } from 'react';
import { toast } from 'sonner';

import LibCard from './LibCard';
import { LibListProps } from './myTypes';



export default function LibList({ libPromise, user }: LibListProps) {

  const data = use(libPromise);


  const hasToasted = useRef(false);
  useEffect(() => {
    if (!hasToasted.current) {
      toast.success(`Successfully retrieved ${data.length} libraries`);
      hasToasted.current = true;
    }
  }, []);



  return (
    <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-x-10 gap-y-12 p-4 md:grid-cols-2 lg:grid-cols-3">
      {data?.map(lib => <LibCard key={lib.id} lib={lib} user={user} />)}
    </div>
  );
}