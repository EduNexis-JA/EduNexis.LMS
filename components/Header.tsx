import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-4 flex justify-between items-center">
        <Link href="/"><a className="font-bold text-lg">EduNexis</a></Link>
        <nav>
          {user ? (
            <div className="flex items-center">
              <span className="mr-4 text-sm">Signed in as {user.email}</span>
              <button onClick={signOut} className="px-3 py-1 bg-gray-200 rounded">Sign out</button>
            </div>
          ) : (
            <div>
              <Link href="/signin"><a className="mr-4 text-sm">Sign in</a></Link>
              <Link href="/signup"><a className="px-3 py-1 bg-blue-600 text-white rounded">Sign up</a></Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
