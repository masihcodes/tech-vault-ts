import { getLibs, getSessionUser } from '@/components/neon';
import Modal from '@/components/Modal';
import FilterBar from '@/components/FilterBar';
import AddButton from '@/components/AddButton';
import { HomePageProps } from '@/components/myTypes';
import LibList from '@/components/LibList';
import SignInModal from '@/components/SignInModal';
import SignUpModal from '@/components/SignUpModal';
import BadgeModal from '@/components/BadgeModal';




export default async function Home({ searchParams }: HomePageProps) {

  const params = await searchParams;

  const query = (params?.q as string) || '';
  const sort = (params?.sort as string) || '';

  const user = await getSessionUser();
  const libPromise = getLibs(query, sort, user);



  return (
    <>
      <header className='max-w-4xl mx-auto mt-16 p-4 items-center justify-center w-full text-center'>

        <h2 className='text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-widest'>Find Your Library</h2>
        <p className='text-slate-400 mb-8 text-lg'>Search about React tools, or add your own discovery.</p>

        <div className='flex flex-col sm:flex-row max-w-4xl items-center justify-center mx-auto gap-3'>

          <FilterBar />

          <AddButton user={user} />

        </div>

      </header>



      <LibList libPromise={libPromise} user={user} />


      <Modal />
      <SignInModal />
      <SignUpModal />
      <BadgeModal />

    </>
  );
}
