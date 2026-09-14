'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/en/sandbox/dora-mes');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060B18]">
      <div className="text-white font-mono text-sm animate-pulse">Entrando no Sandbox...</div>
    </div>
  );
}
