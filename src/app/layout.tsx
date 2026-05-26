import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { Metadata } from "next";

const jbMono = JetBrains_Mono({
  variable: '--font-jb-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "My Tech Stack Directory"
};



export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <html lang="en">
      <body className={`${jbMono.className} bg-slate-950 text-slate-200 flex flex-col w-full min-h-screen`}>

        <Navbar />
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        <Footer />

        <Toaster position="top-center" richColors={true} theme='dark' offset={70} toastOptions={{
          classNames: { toast: '!bg-slate-900/90 !border !border-slate-700 !font-extrabold !text-lg', },
        }} />

      </body>
    </html>
  );
}