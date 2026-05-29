import Modal from '@/components/Modal';
import FilterBar from '@/components/FilterBar';
import AddButton from '@/components/AddButton';
import HomeLibList from '@/components/HomeLibList';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorHandler from '@/components/ErrorHandler';
import SignInModal from '@/components/SignInModal';
import SignUpModal from '@/components/SignUpModal';

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

  return (
    <>
      <header className="mx-auto mt-16 w-full max-w-4xl items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-4xl font-extrabold tracking-widest text-white md:text-6xl">
          Find Your Library
        </h2>
        <p className="mb-8 text-lg text-slate-400">
          Search about React tools, or add your own discovery.
        </p>

        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 sm:flex-row">
          <FilterBar />
          <AddButton />
        </div>
      </header>

      <ErrorBoundary fallbackRender={ErrorHandler}>
        <HomeLibList query={query} sort={sort} />
      </ErrorBoundary>

      <Modal />
      <SignInModal />
      <SignUpModal />
    </>
  );
}
