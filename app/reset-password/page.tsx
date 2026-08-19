"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) return setError(updateError.message);
    setMessage("Password updated successfully. You can now log in.");
    setTimeout(() => router.push("/login"), 1200);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="text-2xl font-black">Hospire</div>
        <p className="mt-1 text-sm text-slate-500">Reset your password securely.</p>
        <h1 className="mt-8 text-3xl font-black">Choose a new password</h1>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-bold">New password</span><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold">Confirm password</span><input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" /></label>
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
          {message && <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}
          <button disabled={loading} className="w-full rounded-xl bg-blue-700 px-5 py-4 font-black text-white disabled:opacity-60">{loading ? "Updating..." : "Update password"}</button>
        </form>
      </div>
    </main>
  );
}
