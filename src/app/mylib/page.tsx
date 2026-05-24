import { Activity, Database } from 'lucide-react';

import { getLibs } from '@/components/neon';
import MyLibs from '@/components/MyLibs';





export default async function MyLib() {

  const data = await getLibs();
  const myLibs = data?.filter(lib => lib.isBookmarked);




  return (

    <main className=" mx-auto p-4 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h2 className="text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-500" /> My Tech Radar
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Libraries and tools marked for learning or daily use</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Database className=" text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">{myLibs.length} Items Saved</span>
        </div>
      </div>

      <MyLibs myLibs={myLibs} />
    </main>
  );
}