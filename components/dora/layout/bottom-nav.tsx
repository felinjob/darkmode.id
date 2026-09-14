'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, FilePlus2, Workflow, AreaChart, LogOut } from 'lucide-react';
import { useAuth } from '@/context/dora/auth-context';

const BASE = '/pt/sandbox/dora-mes';

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  activeColor: string;
  glowColor: string;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { role, signOut } = useAuth();

  if (pathname?.includes('/login')) return null;

  const adminItems: NavItem[] = [
    {
      href: `${BASE}`,
      icon: <ClipboardList size={22} />,
      label: 'Gerência',
      activeColor: 'text-factory-cut',
      glowColor: 'rgba(59,130,246,0.6)',
    },
    {
      href: `${BASE}/nova-op`,
      icon: <FilePlus2 size={22} />,
      label: 'Nova OP',
      activeColor: 'text-violet-400',
      glowColor: 'rgba(139,92,246,0.6)',
    },
    {
      href: `${BASE}/chao-de-fabrica`,
      icon: <Workflow size={22} />,
      label: 'Produção',
      activeColor: 'text-factory-sew',
      glowColor: 'rgba(20,184,166,0.6)',
    },
    {
      href: `${BASE}/metricas`,
      icon: <AreaChart size={22} />,
      label: 'Métricas',
      activeColor: 'text-factory-qc',
      glowColor: 'rgba(16,185,129,0.6)',
    },
  ];

  const operadorItems: NavItem[] = [
    {
      href: `${BASE}/chao-de-fabrica`,
      icon: <Workflow size={22} />,
      label: 'Produção',
      activeColor: 'text-factory-sew',
      glowColor: 'rgba(20,184,166,0.6)',
    },
  ];

  const items = role !== 'operador' ? adminItems : operadorItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-app-border print:hidden"
         style={{ background: '#060B18' }}>
      <div className={`grid h-16 ${role === 'operador' ? 'grid-cols-2' : `grid-cols-${items.length}`}`}>
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href === BASE && pathname === `${BASE}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative touch-target-industrial flex-col gap-1 transition-all duration-200 select-none group"
            >
              {/* Active top indicator */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full"
                  style={{ background: `linear-gradient(90deg, ${item.glowColor}, ${item.glowColor.replace('0.6', '0.3')})` }}
                />
              )}

              {/* Icon */}
              <span
                className={`transition-all duration-200 ${isActive ? item.activeColor : 'text-text-muted group-hover:text-text-secondary'}`}
                style={isActive ? { filter: `drop-shadow(0 0 8px ${item.glowColor})` } : {}}
              >
                {item.icon}
              </span>

              {/* Label */}
              <span
                className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive ? item.activeColor : 'text-text-muted group-hover:text-text-secondary'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Logout for operador */}
        {role === 'operador' && (
          <button
            onClick={() => signOut()}
            className="touch-target-industrial flex-col gap-1 transition-all duration-200 select-none text-text-muted hover:text-text-secondary group"
          >
            <LogOut size={22} className="transition-colors duration-200" />
            <span className="text-[9px] font-bold uppercase tracking-wider">Sair</span>
          </button>
        )}
      </div>
    </nav>
  );
}
