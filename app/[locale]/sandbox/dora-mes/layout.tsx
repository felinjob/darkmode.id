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
      <div className="w-full bg-blue-600/10 border-b border-blue-500/20 p-2 flex justify-between items-center z-[100] relative">
        <a href="/pt" className="text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors">← Voltar ao Portfólio</a>
        <span className="text-xs font-mono text-blue-400 opacity-50">SANDBOX INTERATIVO — DORA MES</span>
      </div>
  
        <AuthProvider>
          <Header />
          {children}
          <BottomNav />
        </AuthProvider>
      </div>
  );
}
