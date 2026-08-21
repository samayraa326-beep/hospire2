"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";

type Mode = "login" | "signup";
type Role = "candidate" | "employer";

const PRODUCTION_URL = "https://hospire2-jx7quxdoz-jack-97bf.vercel.app";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
    setMessage("");
  }

  async function handleGoogle() {
    setError("");
    setMessage("");
    setGoogleLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${PRODUCTION_URL}/onboarding` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (mode === "login") {
      if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        setLoading(false);
        return;
      }
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }
      router.push("/onboarding");
      router.refresh();
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (!accepted) {
      setError("Please accept the terms to continue.");
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), role } },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }
    setMessage("Account created. Check your email to confirm your account, then log in here.");
    setMode("login");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div><div className="text-3xl font-black tracking-tight">Hospire</div><p className="mt-2 text-sm font-semibold text-blue-200">Hospitality careers, built on trust.</p><Link href="/discover" className="mt-6 inline-flex rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-black hover:bg-white/15">Discover hospitality talent →</Link></div>
          <div><p className="text-sm font-bold uppercase tracking-[.2em] text-blue-300">Your living profile</p><h1 className="mt-5 text-5xl font-black leading-tight">Your work should speak for you.</h1><p className="mt-6 max-w-md text-lg leading-8 text-slate-300">Create one Hospire account, build your profile, and showcase real photos and videos of your hospitality work.</p></div>
          <p className="text-sm text-slate-500">Hospire MVP · 2026</p>
        </section>

        <section className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden"><div className="flex items-center justify-between gap-4"><div><div className="text-3xl font-black">Hospire</div><p className="mt-1 text-sm text-slate-500">Hospitality careers, built on trust.</p></div><Link href="/discover" className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white">Discover talent</Link></div></div>
          <div className="mx-auto max-w-xl">
            <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4"><p className="text-sm font-black text-slate-900">See what other hospitality professionals are achieving.</p><p className="mt-1 text-sm text-slate-600">Explore real portfolios, then build one of your own.</p><Link href="/discover" className="mt-3 inline-block text-sm font-black text-blue-700">Explore talent portfolios →</Link></div>
            <div className="flex rounded-2xl bg-slate-100 p-1">
              <button type="button" onClick={() => switchMode("login")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Log in</button>
              <button type="button" onClick={() => switchMode("signup")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${mode === "signup" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Create account</button>
            </div>

            <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-700">{mode === "login" ? "Welcome back" : "Join Hospire"}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{mode === "login" ? "Continue your profile." : "Build your profile."}</h2>
            <p className="mt-3 text-slate-500">{mode === "login" ? "Log in and continue where you left off." : "One account takes you from signup to your own profile."}</p>

            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-5 py-4 font-black text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"><span className="text-lg font-black">G</span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</button>
            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold uppercase tracking-widest text-slate-400">or email</span><div className="h-px flex-1 bg-slate-200" /></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && <><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setRole("candidate")} className={`rounded-2xl border p-4 text-left transition ${role === "candidate" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200"}`}><span className="text-xl">👨‍🍳</span><span className="mt-2 block font-black">Looking for work</span></button><button type="button" onClick={() => setRole("employer")} className={`rounded-2xl border p-4 text-left transition ${role === "employer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200"}`}><span className="text-xl">🏨</span><span className="mt-2 block font-black">Hiring talent</span></button></div><label className="block"><span className="mb-2 block text-sm font-bold">Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="Your full name" /></label></>}
              <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="you@example.com" /></label>
              <div className={mode === "signup" ? "grid gap-5 sm:grid-cols-2" : ""}><label className="block"><span className="mb-2 block text-sm font-bold">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "login" ? "current-password" : "new-password"} className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder={mode === "login" ? "Your password" : "Minimum 6 characters"} /></label>{mode === "signup" && <label className="block"><span className="mb-2 block text-sm font-bold">Confirm password</span><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="Repeat password" /></label>}</div>
              {mode === "signup" && <label className="flex gap-3 text-sm text-slate-600"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4" />I agree to Hospire&apos;s terms and understand that employer verification may be required.</label>}
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}{message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-4 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? mode === "login" ? "Logging in..." : "Creating account..." : mode === "login" ? "Log in & open my profile" : "Create account & build my profile"}</button>
            </form>
            {mode === "login" && <button type="button" className="mt-5 block w-full text-sm font-bold text-blue-700 hover:text-blue-800" onClick={() => router.push("/login")}>Forgot password?</button>}
          </div>
        </section>
      </div>
    </main>
  );
}
