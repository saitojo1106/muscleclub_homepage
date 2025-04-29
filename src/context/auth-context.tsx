'use client';

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  ReactNode,
  useCallback
} from 'react';
import { Session, User, Provider, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import * as authService from '@/lib/auth';
import { 
  AuthResult, 
  LoginCredentials, 
  SignUpCredentials,
  ResetPasswordCredentials,
  UpdatePasswordCredentials 
} from '@/lib/auth';

// Define the auth context type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: AuthError | null;
  isAdmin: boolean;
  
  // Auth methods
  signInWithPassword: (credentials: LoginCredentials) => Promise<AuthResult<Session>>;
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  signInWithOAuth: (provider: Provider) => Promise<AuthResult>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult<Session>>;
  signOut: () => Promise<AuthResult>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<AuthResult>;
  updatePassword: (credentials: UpdatePasswordCredentials) => Promise<AuthResult>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  error: null,
  isAdmin: false,
  
  // Default implementations that will be overridden by the provider
  signInWithPassword: async () => ({ data: null, error: null, success: false }),
  signInWithMagicLink: async () => ({ data: null, error: null, success: false }),
  signInWithOAuth: async () => ({ data: null, error: null, success: false }),
  signUp: async () => ({ data: null, error: null, success: false }),
  signOut: async () => ({ data: null, error: null, success: false }),
  resetPassword: async () => ({ data: null, error: null, success: false }),
  updatePassword: async () => ({ data: null, error: null, success: false }),
});

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);
  
  // Check if the user is an admin based on user metadata
  const isAdmin = user?.user_metadata?.role === 'admin';

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // Get the initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error);
        } else if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error as AuthError);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const handleSignInWithPassword = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);
      const result = await authService.signInWithPassword(credentials);
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  const handleSignInWithMagicLink = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);
      const result = await authService.signInWithMagicLink(email);
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  const handleSignInWithOAuth = useCallback(
    async (provider: Provider) => {
      setLoading(true);
      setError(null);
      const result = await authService.signInWithOAuth(provider);
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  const handleSignUp = useCallback(
    async (credentials: SignUpCredentials) => {
      setLoading(true);
      setError(null);
      const result = await authService.signUp(credentials);
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  const handleSignOut = useCallback(
    async () => {
      setLoading(true);
      setError(null);
      const result = await authService.signOut();
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  const handleResetPassword = useCallback(
    async (credentials: ResetPasswordCredentials) => {
      setLoading(true);
      setError(null);
      const result = await authService.resetPassword(credentials);
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  const handleUpdatePassword = useCallback(
    async (credentials: UpdatePasswordCredentials) => {
      setLoading(true);
      setError(null);
      const result = await authService.updatePassword(credentials);
      
      if (result.error) {
        setError(result.error);
      }
      
      setLoading(false);
      return result;
    },
    []
  );

  // Provide the context values
  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    initialized,
    error,
    isAdmin,
    signInWithPassword: handleSignInWithPassword,
    signInWithMagicLink: handleSignInWithMagicLink,
    signInWithOAuth: handleSignInWithOAuth,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

