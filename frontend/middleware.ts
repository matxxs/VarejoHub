// src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Define as rotas públicas (onde a autenticação é opcional ou não necessária)
const PUBLIC_PATHS = [
    '/',
    '/login',
    '/auth/callback',
    '/about', 
    '/contact', 
    // Adicione aqui todos os paths públicos (incluindo assets e APIs públicas se houver)
]

// 2. Define as rotas protegidas (todas que não estão em PUBLIC_PATHS)
const PROTECTED_PREFIXES = ['/dashboard', '/relatorios', '/cadastro'] 

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    
    // 3. Obtém o token do cookie (Middleware não acessa localStorage)
    // O seu AuthProvider precisará ser modificado para salvar o JWT também em um cookie seguro (HttpOnly)
    const isAuthenticated = request.cookies.has('jwt_token') 
    
    // 4. Determina se a rota atual é protegida
    const isProtectedPath = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))

    // 5. Lógica de Redirecionamento
    
    // Caso 1: Usuário NÃO autenticado tentando acessar uma rota protegida
    if (!isAuthenticated && isProtectedPath) {
        // Salva a rota original para redirecionar após o login (se necessário)
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', pathname) // Passa a rota original como search param
        
        return NextResponse.redirect(url)
    }
    
    // Caso 2: Usuário autenticado tentando acessar a página de login
    if (isAuthenticated && pathname === '/login') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard' // Redireciona para o dashboard
        return NextResponse.redirect(url)
    }

    // 6. Caso a rota seja pública OU o usuário esteja autenticado em uma rota privada
    return NextResponse.next()
}

// 7. Configuração do matcher para o Middleware
export const config = {
    // Aplica o middleware a todas as rotas, exceto:
    // - _next/static (arquivos estáticos)
    // - _next/image (imagens otimizadas)
    // - favicon.ico, etc.
    // - Rotas de API que não precisam de autenticação (se houver)
    matcher: [
        /*
         * Rotas para ignorar, ajuste conforme sua necessidade.
         * Neste exemplo, ele rodará para tudo. Se quiser ser mais específico:
         * '/((?!api|_next/static|_next/image|favicon.ico|login|login/callback).*)',
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}