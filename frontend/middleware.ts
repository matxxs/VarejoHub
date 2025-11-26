import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

type NivelAcesso = 'Administrador' | 'Gerente' | 'Caixa' | 'Financeiro';

interface JwtPayload {
    idUsuario?: number;
    email?: string;
    role: NivelAcesso;
    eGlobalAdmin: boolean;
    iat?: number;
    exp?: number;
}

const ROLE_MAPS: Record<NivelAcesso, string[]> = {
    Administrador: [
        '/vendas',
        '/registrations',
        '/financeiro',
        '/management',
    ],
    Gerente: [
        '/vendas', 
        '/registrations', 
        '/financeiro'
    ],
    Caixa: [
        '/vendas' 
    ], 
    Financeiro: [
        '/financeiro'
    ],
};

const SECURED_PREFIXES = [
    '/vendas',
    '/registrations',
    '/financeiro',
    '/management',
];


const PUBLIC_PATHS = [
    '/', 
    '/login', 
    '/register', 
    '/auth/callback',
    '/error/forbidden', 
];

function getJwtSecretKey(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('ERRO CRÍTICO: JWT_SECRET não está definido nas variáveis de ambiente');
        throw new Error('JWT_SECRET não está definido nas variáveis de ambiente');
    }
    return new TextEncoder().encode(secret);
}

async function verifyToken(
    token: string,
): Promise<{ success: boolean; payload?: JwtPayload }> {
    if (!token) {
        return { success: false };
    }
    try {
        const { payload } = await jwtVerify<JwtPayload>(
            token,
            getJwtSecretKey(),
        );
        return { success: true, payload };
    } catch (error) {
        if (error instanceof Error) {
            console.warn('Falha na verificação do JWT:', error.message);
        } else {
            console.warn('Falha na verificação do JWT:', String(error));
        }
        return { success: false };
    }
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get('jwt_token')?.value;

    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }
    
    const isSecuredRoute = SECURED_PREFIXES.some(prefix => 
        pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

    if (!isSecuredRoute) {
        return NextResponse.next();
    }

    const { success, payload } = await verifyToken(token || '');

    if (!success || !payload || !payload.role) {        
        const url = request.nextUrl.clone();
        url.pathname = '/login'; 
        url.searchParams.set('redirect', pathname);

        const response = NextResponse.redirect(url);
        response.cookies.delete('jwt_token');
        return response; 
    }

    const userRole = payload.role; 
    const isGlobalAdmin = payload.eGlobalAdmin;

    if (isGlobalAdmin) {
        return NextResponse.next();
    }

    const allowedPaths = ROLE_MAPS[userRole] || [];

    const isAuthorized = allowedPaths.some((prefix) =>
        pathname.startsWith(prefix),
    );

    if (isAuthorized) {
        return NextResponse.next();
    } else {
        const url = request.nextUrl.clone();
        url.pathname = '/error/forbidden'; 
        return NextResponse.redirect(url);
    }
}


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};