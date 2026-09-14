'use client';

import { useAuth } from '@/context/dora/auth-context';
import { LogOut, Scissors } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ROLE_CONFIG = {
  admin:    { label: 'PCP / Gerência',    color: 'text-factory-cut',   bg: 'bg-blue-500/15 border-blue-500/20' },
  operador: { label: 'Produção',        color: 'text-factory-sew',   bg: 'bg-teal-500/15 border-teal-500/20' },
};

function getInitials(email: string): string {
  const parts = email.split('@')[0].split(/[._-]/);
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('') || '?';
}

export default function Header() {
  const { user, role, signOut } = useAuth();
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const roleCfg = role ? ROLE_CONFIG[role] : null;
  const initials = user?.email ? getInitials(user.email) : '?';

  return (
    <header className="bg-app-surface border-b border-app-border flex items-center justify-between px-4 py-3 print:hidden">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
             style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
          <Scissors size={15} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-black tracking-[0.15em] text-text-primary uppercase">Dora MES</p>
          {roleCfg && (
            <span className={`text-[9px] font-bold uppercase tracking-widest ${roleCfg.color}`}>
              {roleCfg.label}
            </span>
          )}
        </div>
      </div>

      {/* User info + logout */}
      <div className="flex items-center gap-2">
        {/* Avatar with initials */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            {initials}
          </div>
          {roleCfg && (
            <span className={`hidden sm:inline-flex text-[9px] font-bold px-2 py-1 rounded-full border ${roleCfg.bg} ${roleCfg.color} uppercase tracking-widest`}>
              {role}
            </span>
          )}
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10
                     active:bg-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary
                     hover:text-text-primary transition-all duration-150"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
