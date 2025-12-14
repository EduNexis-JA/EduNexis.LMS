import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp(e: any) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    // Optionally create a profile row in users table (server-side is better)
    // For now redirect to home and user can confirm email if required by Supabase settings
    router.push("/");
  }

  return (
    <main className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Create an account</h1>
      <form onSubmit={handleSignUp} className="max-w-md">
        <label className="block mb-2">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <label className="block mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </main>
  );
}
