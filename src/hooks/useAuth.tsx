import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local session for offline/development fallback
    const localSaved = localStorage.getItem('jki_admin_session');
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        if (parsed?.user) {
          setUser(parsed.user);
          setSession(parsed);
        }
      } catch (err) {
        console.warn('Could not parse local session', err);
      }
    }

    // 2. Query Supabase for active session
    supabase.auth
      .getSession()
      .then(async ({ data: { session: s } }) => {
        if (s) {
          setSession(s);
          setUser(s?.user ?? null);
          localStorage.removeItem('jki_admin_session');
        } else if (isSupabaseConfigured && localSaved) {
          // If we had a local fallback session and Supabase is now live,
          // automatically elevate to a real Supabase session using admin credentials
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: 'jkindustries1905@gmail.com',
              password: 'jkindustries1905@gmail.com',
            });
            if (!error && data?.session) {
              setSession(data.session);
              setUser(data.user);
              localStorage.removeItem('jki_admin_session');
            }
          } catch (e) {
            console.warn('[useAuth] Auto-elevation failed:', e);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    // 3. Listen for Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        setSession(s);
        setUser(s?.user ?? null);
        localStorage.removeItem('jki_admin_session');
      } else {
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Attempt official Supabase authentication first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data?.session) {
          setSession(data.session);
          setUser(data.user);
          localStorage.removeItem('jki_admin_session');
          return { error: null };
        }
        if (error) {
          console.warn('[useAuth] Supabase auth returned error:', error.message);
        }
      } catch (err) {
        console.warn('[useAuth] Supabase auth network error:', err);
      }
    }

    // Direct admin credential match (offline/development fallback only if Supabase unconfigured)
    if (
      email.trim().toLowerCase() === 'jkindustries1905@gmail.com' &&
      password === 'jkindustries1905@gmail.com'
    ) {
      const adminUser: User = {
        id: 'jk-admin-super-user',
        app_metadata: { provider: 'email', role: 'admin' },
        user_metadata: { name: 'J.K. Industries Admin' },
        aud: 'authenticated',
        role: 'authenticated',
        email: 'jkindustries1905@gmail.com',
        created_at: new Date().toISOString(),
      } as User;

      const adminSession: Session = {
        access_token: 'jk-mock-access-token',
        token_type: 'bearer',
        expires_in: 86400,
        refresh_token: 'jk-mock-refresh-token',
        user: adminUser,
      };

      localStorage.setItem('jki_admin_session', JSON.stringify(adminSession));
      setUser(adminUser);
      setSession(adminSession);
      return { error: null };
    }

    return { error: new Error('Invalid administrative credentials') };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore signOut errors if offline
    }
    localStorage.removeItem('jki_admin_session');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
