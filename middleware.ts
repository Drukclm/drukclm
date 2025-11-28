// Filename: middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

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
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Define all public pages that anyone can see.
  // Add all the pages from your navbar here.
  const publicPaths = [
    '/',                 // Home page
    '/login',            // Login page
    '/screening-cpo',    // Screening page
    '/about',            // About page
    '/reports',          // Reports page
    '/statistics',       // Statistics page
    '/screening',        // Screening page
  ];

  // 2. Define your private, protected pages.
  const privatePaths = [
    '/dashboard',        // For Admin
    '/kpo-dashboard',    // For KPO
  ];

  // Logic to check if the current page is a private one
  const isPrivatePath = privatePaths.some(path => pathname.startsWith(path));

  // --- HANDLE USERS WHO ARE NOT LOGGED IN ---
  if (!user) {
    // If a user is not logged in and tries to access a private page...
    if (isPrivatePath) {
      // ...redirect them to the login page.
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Otherwise, let them see the public page they requested.
    return response;
  }

  // --- HANDLE USERS WHO ARE LOGGED IN ---
  const { data: profile } = await supabase
    .from('Profile')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  const role = profile?.role?.toLowerCase();

  // If a logged-in user tries to visit a public page like Home or Login,
  // send them to their correct dashboard automatically.
  // if (publicPaths.includes(pathname)) {
  //   if (role === 'admin') {
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }
  //   if (role === 'kpo') {
  //     return NextResponse.redirect(new URL('/kpo-dashboard', request.url));
  //   }

  // }
  if (pathname === '/login') { // only redirect from login page
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (role === 'kpo') {
      return NextResponse.redirect(new URL('/kpo-dashboard', request.url));
    }
  }


  // If none of the above conditions are met, allow the user to proceed.
  return response;
}

// Middleware applies to all pages except static assets
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};