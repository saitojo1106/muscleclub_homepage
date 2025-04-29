import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * This route is called by Supabase Auth when:
 * 1. A user completes the OAuth login flow with a third-party provider
 * 2. A user clicks on a magic link sent to their email
 * 3. A user completes the password reset flow
 * 
 * It exchanges the code for a session and redirects the user back to the application.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    // Create a Supabase client configured to use cookies
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to error page or login page with error message
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('認証に失敗しました')}`, request.url)
      );
    }
  }

  // Redirect to the requested page or home page
  return NextResponse.redirect(new URL(next, request.url));
}

