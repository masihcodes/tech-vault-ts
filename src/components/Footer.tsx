import { Heart } from 'lucide-react';



export default function Footer() {


  return (
    <footer className="border-t bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-4 w-full sticky bottom-0 mt-5 z-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} <span className="text-slate-300">DevStack</span>
          <span className="text-cyan-500/80">Vault</span>.
        </p>

        <div className="flex items-center gap-1.5 text-slate-500 text-xs tracking-wider uppercase">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500/70 fill-rose-500/20" />
          <span>using Next.js</span>
        </div>
      </div>
    </footer>
  );
}