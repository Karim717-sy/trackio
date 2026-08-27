import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: On Vercel Edge (Hobby), getUser() can sometimes timeout (MIDDLEWARE_INVOCATION_TIMEOUT)
  // because it makes a network request. We use getSession() here just for fast routing.
  // La vraie sécurité (vérification du token sur le serveur) est gérée par getUser() dans les Server Components
  // et par les politiques RLS dans la base de données.
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  const user = session?.user

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')
  
  // Refus par défaut : toutes les routes sont protégées Sauf l'auth et la home
  const isPublicRoute = isAuthRoute || request.nextUrl.pathname === '/'

  if (!isPublicRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
