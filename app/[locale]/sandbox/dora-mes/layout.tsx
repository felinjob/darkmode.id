import "./dora.css";

import BottomNav from "@/components/dora/layout/bottom-nav";
import Header from "@/components/dora/layout/header";
import { AuthProvider } from "@/context/dora/auth-context";





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <div className="dora-app-wrapper bg-[#060B18] text-white antialiased min-h-screen pb-20 font-sans relative">
      <div className="w-full bg-[#060B18] border-b border-orange-500/20 p-3 flex justify-between items-center z-[100] relative shadow-[0_4px_24px_rgba(249,115,22,0.1)]">
        <a href="/pt" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors">
          ← Voltar ao Portfólio
        </a>
        <span className="text-[10px] font-mono text-orange-400/50 uppercase tracking-widest hidden sm:inline-block">SANDBOX INTERATIVO — DORA MES</span>
      </div>
  
        <AuthProvider>
          <Header />
          {children}
          <BottomNav />
        </AuthProvider>
      </div>
  );
}
