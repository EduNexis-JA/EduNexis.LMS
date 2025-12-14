import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignIn(e: any) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    // On success redirect to home
    router.push("/");
  }

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={handleSignIn} className="max-w-md">
        <label className="block mb-2">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
