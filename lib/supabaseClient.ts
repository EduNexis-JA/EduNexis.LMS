import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side supabase: only instantiate when env vars are present to avoid runtime errors in dev without configuration.
let _supabase: any;
if (supabaseUrl && supabaseAnonKey) {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Lightweight stub to avoid runtime crashes when env vars are missing. Methods return safe defaults.
  // This keeps the app usable for development without Supabase configured.
  const createStubQuery = () => ({
    select: () => createStubQuery(),
    order: () => createStubQuery(),
    eq: () => createStubQuery(),
    insert: () => createStubQuery(),
    update: () => createStubQuery(),
    delete: () => createStubQuery(),
    then: async (resolve: any) => resolve({ data: [], error: null }),
    single: async () => ({ data: null, error: null })
  });
  
  _supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => createStubQuery()
  } as any;
}

export const supabase = _supabase;

// Admin / server-side client (use only in server runtime)
export const supabaseAdmin = (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;
