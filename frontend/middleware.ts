import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest){
    // --- Create a Supabase client ---- 
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    // --- Refresh Session if expired --- 
    await supabase.auth.getSession()

    const { data: { session } } = await supabase.auth.getSession()
    const { pathname } = req.nextUrl
    // --- Redirect authenticated users away from the /auth page 
    if (session && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    // --- Protect the /dashboard routes --- 
    if (!session && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth', req.url))
    }
    return res
}

export const config = {
    matcher : [
        '/auth',
        '/dashboard/:path*',
        '/',
    ],
}