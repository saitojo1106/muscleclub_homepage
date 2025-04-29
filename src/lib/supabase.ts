import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/supabase';

// Determine if we're running on the client side
const isClient = typeof window !== 'undefined';

// Define types for our Supabase client
type TypedSupabaseClient = SupabaseClient<Database>;

// Class to handle Supabase client with singleton pattern
class SupabaseService {
  private static instance: TypedSupabaseClient | null = null;
  
  // Private constructor to prevent direct instantiation
  private constructor() {}
  
  // Get the Supabase client instance (singleton pattern)
  static getInstance(): TypedSupabaseClient {
    if (!this.instance) {
      // Check environment to use the appropriate client initialization
      if (isClient) {
        // Client-side: use createClientComponentClient for automatic token refresh and storage handling
        this.instance = createClientComponentClient<Database>();
      } else {
        // Server-side: use the standard createClient with env variables
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        this.instance = createClient<Database>(supabaseUrl, supabaseAnonKey);
      }
    }
    return this.instance;
  }
  
  // Reset the instance (useful for testing)
  static resetInstance(): void {
    this.instance = null;
  }
}

// Export the Supabase client instance for backward compatibility
export const supabase = SupabaseService.getInstance();

// Export the service for advanced usage
export const supabaseService = SupabaseService;
