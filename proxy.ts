import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['pt', 'en'];
const defaultLocale = 'pt';

function getLocale() {
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Excluir rotas de arquivos estáticos, imagens, APIs e rotas executivas isoladas
  if (
    pathname.includes('.') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname === '/orcamento-boutique-ne' ||
    pathname.startsWith('/orcamento-boutique-ne/')
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

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale();
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
