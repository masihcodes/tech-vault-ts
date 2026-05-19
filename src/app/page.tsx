import { ErrorBoundary } from 'react-error-boundary';
import { getLibs } from '@/components/neon';

import Modal from '@/components/Modal';
import FilterBar from '@/components/FilterBar';
import AddButton from '@/components/AddButton';
import ErrorHandler from '@/components/ErrorHandler';
import ToastWrapper from '@/components/ToastWrapper';


interface PageProps {
  searchParams: Promise<{
    q?: string | string[];
    sort?: string | string[];
  }>;
}


export default async function Home({ searchParams }: PageProps) {

  const params = await searchParams;

  const query = (params?.q as string) || '';
  const sort = (params?.sort as string) || '';

  const libPromise = getLibs(query, sort);


  return (
    <>
      <header className='max-w-4xl mx-auto mt-16 p-4 items-center justify-center w-full text-center'>

        <h2 className='text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-widest'>Find Your Library</h2>
        <p className='text-slate-400 mb-8 text-lg'>Search about React tools, or add your own discovery.</p>

        <div className='flex flex-col sm:flex-row max-w-4xl items-center justify-center mx-auto gap-3'>

          <FilterBar />

          <AddButton />

        </div>

      </header>


      <ErrorBoundary fallbackRender={ErrorHandler}>
        <ToastWrapper libPromise={libPromise} />
      </ErrorBoundary>

      <Modal />

    </>
  );
}
