import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Esta função pode ser marcada como `async` se usar `await` dentro dela
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configuração opcional: Definir quais caminhos este middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos exceto:
     * 1. /api (rotas de API)
     * 2. /_next (arquivos internos do Next.js)
     * 3. /_vercel (arquivos internos do Vercel)
     * 4. /favicon.ico, /sitemap.xml (arquivos estáticos)
     */
    '/((?!api|_next|_vercel|favicon.ico|sitemap.xml).*)',
  ],
};