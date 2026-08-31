"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import FeaturedTalent from "../components/FeaturedTalent";

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
      options: { data: { full_name: name.trim(), role }, emailRedirectTo: `${window.location.origin}/onboarding?role=${role}` },
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
    <main className="min-h-screen bg-[#0b0a08] px-4 py-4 text-[#f4efe5] sm:px-6 sm:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden border border-[#8f6b35]/45 bg-[#f6f1e7] shadow-[0_25px_80px_rgba(0,0,0,.45)] lg:grid-cols-2">
        <section className="hidden bg-[#0b0a08] p-12 text-[#f4efe5] lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="text-3xl font-semibold tracking-[.18em] text-[#c9a45c]">HOSPIRE</div>
            <div className="mt-4 h-px w-20 bg-[#c9a45c]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#c9a45c]">Hospitality network</p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.08] tracking-tight">Where hospitality talent meets opportunity.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#bdb6a9]">Discover people, work and opportunities across hospitality.</p>
          </div>
          <p className="text-xs tracking-[.18em] text-[#756f65]">HOSPIRE · 2026</p>
        </section>

        <section className="bg-[#f6f1e7] p-6 text-[#17130e] sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden">
            <div className="text-2xl font-semibold tracking-[.18em] text-[#17130e]">HOSPIRE</div>
            <div className="mt-3 h-px w-14 bg-[#a57b3b]" />
          </div>
          <div className="mx-auto max-w-xl">
            <div className="flex rounded-xl border border-[#d8cdbb] bg-[#eee7da] p-1">
              <button type="button" onClick={() => switchMode("login")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-[#6f675b]"}`}>Log in</button>
              <button type="button" onClick={() => switchMode("signup")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition ${mode === "signup" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>Create account</button>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[.22em] text-[#9a7337]">{mode === "login" ? "Welcome back" : "Join Hospire"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#17130e]">{mode === "login" ? "Continue your profile." : "Create your profile."}</h2>
            <p className="mt-2 text-sm text-[#6f675b]">{mode === "login" ? "Log in to continue." : "One account for hospitality."}</p>

            <button type="button" onClick={handleGoogle} disabled={googleLoading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-[#d8cdbb] bg-white px-5 py-4 font-semibold text-[#17130e] transition hover:border-[#b99a68] hover:bg-[#fbf8f2] disabled:opacity-60"><span className="text-lg font-black">G</span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</button>
            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs font-bold uppercase tracking-widest text-slate-400">or email</span><div className="h-px flex-1 bg-slate-200" /></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && <><div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setRole("candidate")} className={`rounded-2xl border p-4 text-left transition ${role === "candidate" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200"}`}><span className="text-xl">👨‍🍳</span><span className="mt-2 block font-black">Looking for work</span></button><button type="button" onClick={() => setRole("employer")} className={`rounded-2xl border p-4 text-left transition ${role === "employer" ? "border-[#a57b3b] bg-[#f3eadc] ring-2 ring-[#eadfcf]" : "border-[#d8cdbb] bg-white"}`}><span className="text-xl">🏨</span><span className="mt-2 block font-black">Hiring talent</span></button></div><label className="block"><span className="mb-2 block text-sm font-bold">Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-[#d8cdbb] bg-white px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="Your full name" /></label></>}
              <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="you@example.com" /></label>
              <div className={mode === "signup" ? "grid gap-5 sm:grid-cols-2" : ""}><label className="block"><span className="mb-2 block text-sm font-bold">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "login" ? "current-password" : "new-password"} className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder={mode === "login" ? "Your password" : "Minimum 6 characters"} /></label>{mode === "signup" && <label className="block"><span className="mb-2 block text-sm font-bold">Confirm password</span><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="Repeat password" /></label>}</div>
              {mode === "signup" && <label className="flex gap-3 text-sm text-[#6f675b]"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4" />I agree to Hospire&apos;s terms and understand that employer verification may be required.</label>}
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}{message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#17130e] px-5 py-4 font-semibold text-[#f6f1e7] transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">{loading ? mode === "login" ? "Logging in..." : "Creating account..." : mode === "login" ? "Log in to Hospire" : "Create account & build my profile"}</button>
            </form>
            {mode === "login" && <button type="button" className="mt-5 block w-full text-sm font-bold text-blue-700 hover:text-blue-800" onClick={() => router.push("/login")}>Forgot password?</button>}
          </div>
        </section>
      </div>
      <FeaturedTalent />
    </main>
  );
}
