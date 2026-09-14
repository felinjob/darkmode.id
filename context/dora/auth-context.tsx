'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'admin' | 'operador' | null;

interface AuthContextType {
  user: any | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Sandbox mode: Automatically logged in as Admin
  const [user, setUser] = useState<any>({ uid: 'mock-uid', email: 'sandbox@darkmode.id' });
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // se estiver na raiz do sandbox, ir para o dashboard do app mockado (mas a raiz já é o dashboard na verdade? não, em dora é '/')
    // We shouldn't interfere with portfolio routes, only Dora routes.
    if (pathname.includes('/login')) {
      router.push('/en/sandbox/dora-mes'); // just push back to sandbox root if someone hits login
    }
  }, [pathname, router]);

  const signOut = async () => {
    // no-op in sandbox
    router.push('/en/sandbox/dora-mes');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
