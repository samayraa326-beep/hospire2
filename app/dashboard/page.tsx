"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function Dashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("there");
  const [role, setRole] = useState<"candidate" | "employer">("candidate");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
      if (profile?.full_name) setName(profile.full_name.split(" ")[0]);
      if (profile?.role === "employer") setRole("employer");
    })();
  }, [supabase]);

  const employer = role === "employer";
  const nav = employer
    ? [["Talent", "/discover"], ["Jobs", "/opportunities"], ["Community", "/community"], ["Courses & Certifications", "/courses"], ["Challenges", "/challenges"]]
    : [["Jobs", "/opportunities"], ["Community", "/community"], ["Courses & Certifications", "/courses"], ["Challenges", "/challenges"]];

  const cards = employer
    ? [["👥", "Talent", "/discover"], ["📢", "Post a Job", "/opportunities/post"], ["📋", "Manage Jobs", "/opportunities"], ["🏆", "Challenges", "/challenges"]]
    : [["💼", "Find Jobs", "/opportunities"], ["👤", "Profile", "/profile"], ["🎓", "Courses & Certifications", "/courses"], ["🏆", "Challenges", "/challenges"]];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">Hospire</Link>
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map(([label, href]) => <Link key={label} href={href} className="text-sm font-semibold text-slate-600 hover:text-blue-700">{label}</Link>)}
          </nav>
          <Link href="/profile" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">Profile</Link>
        </div>
      </header>

      <section className="bg-slate-950 px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome back, {name}.</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={employer ? "/discover" : "/opportunities"} className="rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950 hover:bg-slate-100">{employer ? "Discover Talent" : "Find Jobs"}</Link>
            {employer && <Link href="/opportunities/post" className="rounded-xl border border-white/25 px-6 py-3.5 font-bold text-white hover:bg-white/10">Post a Job</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h2 className="text-2xl font-bold text-slate-950">{employer ? "Hiring" : "Explore"}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([icon, title, href]) => (
            <Link href={href} key={title} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
              <span className="mt-5 inline-block text-sm font-semibold text-blue-700">Open →</span>
            </Link>
          ))}
        </div>

        <Link href="/profile" className="mt-8 block rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md">
          <h2 className="text-lg font-bold text-slate-950">{employer ? "Business profile" : "Complete your profile"}</h2>
          <p className="mt-1 text-sm text-slate-500">{employer ? "Keep your hiring profile up to date." : "Add your skills and experience."}</p>
        </Link>
      </section>
    </main>
  );
}
