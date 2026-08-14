"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Role = "candidate" | "employer";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [role, setRole] = useState<Role>("candidate");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) return setError("Please enter your name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!accepted) return setError("Please accept the terms to continue.");

    setLoading(true);
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
      router.push(role === "employer" ? "/dashboard?type=employer" : "/dashboard");
      router.refresh();
    } else {
      setMessage("Account created. Check your email to confirm your account, then log in.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="text-2xl font-black tracking-tight">Hospire</div>
            <p className="mt-2 text-sm font-semibold text-blue-200">Hospitality careers, built on trust.</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-300">Join the network</p>
            <h1 className="mt-5 text-5xl font-black leading-tight">Build your next hospitality opportunity.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">Create a professional identity for your hospitality career or start hiring focused hospitality talent.</p>
          </div>
          <p className="text-sm text-slate-500">Hospire MVP · 2026</p>
        </section>

        <section className="p-7 sm:p-10 lg:p-14">
          <div className="mb-8 lg:hidden"><div className="text-2xl font-black">Hospire</div><p className="mt-1 text-sm text-slate-500">Hospitality careers, built on trust.</p></div>
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Create account</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Welcome to Hospire.</h2>
            <p className="mt-3 text-slate-500">First, tell us how you&apos;ll use Hospire.</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setRole("candidate")} className={`rounded-2xl border p-5 text-left transition ${role === "candidate" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
                <span className="text-2xl">👨‍🍳</span><span className="mt-3 block font-black">I&apos;m looking for work</span><span className="mt-1 block text-sm text-slate-500">Student or hospitality professional</span>
              </button>
              <button type="button" onClick={() => setRole("employer")} className={`rounded-2xl border p-5 text-left transition ${role === "employer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
                <span className="text-2xl">🏨</span><span className="mt-3 block font-black">I&apos;m hiring talent</span><span className="mt-1 block text-sm text-slate-500">Hotel, restaurant or hospitality company</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block"><span className="mb-2 block text-sm font-bold">Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder={role === "candidate" ? "Your full name" : "Your name"} /></label>
              <label className="block"><span className="mb-2 block text-sm font-bold">Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="you@example.com" /></label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block"><span className="mb-2 block text-sm font-bold">Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="Minimum 6 characters" /></label>
                <label className="block"><span className="mb-2 block text-sm font-bold">Confirm password</span><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" placeholder="Repeat password" /></label>
              </div>
              <label className="flex gap-3 text-sm text-slate-600"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 h-4 w-4" />I agree to Hospire&apos;s terms and understand that employer verification may be required.</label>
              {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
              {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}
              <button disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-4 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create my Hospire account"}</button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <a href="/login" className="font-bold text-blue-700">Log in</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
