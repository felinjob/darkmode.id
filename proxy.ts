import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['pt', 'en'];
const defaultLocale = 'pt';

function getLocale() {
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  // Normaliza barras múltiplas para evitar anomalias de roteamento / open redirect
  const rawPathname = request.nextUrl.pathname;
  const pathname = rawPathname.replace(/\/{2,}/g, '/');

  // Excluir rotas de arquivos estáticos, imagens, APIs e rotas executivas isoladas
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/orcamento-boutique-ne' ||
    pathname.startsWith('/orcamento-boutique-ne/') ||
    pathname === '/orcamento-aw-bikes' ||
    pathname.startsWith('/orcamento-aw-bikes/')
  ) {
    return NextResponse.next();
  }

  // Redirecionar acessos com prefixo de locale para a rota canônica sem locale
  if (
    pathname.startsWith('/pt/orcamento-boutique-ne') ||
    pathname.startsWith('/en/orcamento-boutique-ne')
  ) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.pathname = '/orcamento-boutique-ne';
    return NextResponse.redirect(cleanUrl);
  }

  if (
    pathname.startsWith('/pt/orcamento-aw-bikes') ||
    pathname.startsWith('/en/orcamento-aw-bikes')
  ) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.pathname = '/orcamento-aw-bikes';
    return NextResponse.redirect(cleanUrl);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale();
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
