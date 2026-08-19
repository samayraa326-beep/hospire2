"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(), password,
    });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }
    router.push("/onboarding");
    router.refresh();
  }

  async function handleForgotPassword() {
    setError("");
    if (!email.trim()) {
      setError("Enter your email first, then choose Forgot password.");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setError("Password reset email sent. Check your inbox.");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-6 py-5"><div className="text-2xl font-black tracking-tight">Hospire</div><p className="text-xs text-slate-500">Hospitality careers, built on trust.</p></div></nav>
      <section className="flex min-h-[calc(100vh-81px)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Welcome back</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Log in to Hospire.</h1>
            <p className="mt-3 text-slate-500">Continue building your hospitality career.</p>

            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-4 font-black text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60">
              <span className="text-lg">G</span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>
            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold uppercase tracking-widest text-slate-400">or email</span><div className="h-px flex-1 bg-slate-200" /></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="you@example.com" /></label>
              <label className="block"><div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold">Password</span><button type="button" className="text-sm font-bold text-blue-700 hover:text-blue-800" onClick={handleForgotPassword}>Forgot password?</button></div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="Your password" /></label>
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-4 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Logging in..." : "Log in"}</button>
            </form>
            <div className="my-7 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold uppercase tracking-widest text-slate-400">New here?</span><div className="h-px flex-1 bg-slate-200" /></div>
            <a href="/signup" className="block w-full rounded-xl border border-slate-200 px-5 py-4 text-center font-black text-slate-900 transition hover:border-blue-300 hover:bg-blue-50">Create a Hospire account</a>
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">Hospire · 2026</p>
        </div>
      </section>
    </main>
  );
}
