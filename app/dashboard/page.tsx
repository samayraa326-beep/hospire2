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
    <main className="min-h-screen bg-[#f6f1e7]">
      <header className="border-b border-[#d8cdbb] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-5 py-5 sm:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-[#17130e]">Hospire</Link>
          <nav className="flex min-w-max items-center gap-6">
            {nav.map(([label, href]) => <Link key={label} href={href} className="text-sm font-semibold text-[#6f675b] hover:text-[#9a7337]">{label}</Link>)}
          </nav>
          <Link href="/profile" className="rounded-xl bg-[#17130e] px-4 py-2.5 text-sm font-bold text-white hover:bg-black">Profile</Link>
        </div>
      </header>

      <section className="bg-[#0b0a08] px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome back, {name}.</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={employer ? "/discover" : "/opportunities"} className="rounded-xl bg-[#fffdf8] px-6 py-3.5 font-bold text-[#17130e] hover:bg-[#f3efe7]">{employer ? "Discover Talent" : "Find Jobs"}</Link>
            {employer && <Link href="/opportunities/post" className="rounded-xl border border-white/25 px-6 py-3.5 font-bold text-white hover:bg-[#fffdf8]/10">Post a Job</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <h2 className="text-2xl font-bold text-[#17130e]">{employer ? "Hiring" : "Explore"}</h2>
        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
          {cards.map(([icon, title, href]) => (
            <Link href={href} key={title} className="group min-w-[245px] snap-start rounded-2xl bg-[#fffdf8] p-6 shadow-sm ring-1 ring-[#d8cdbb] transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="text-3xl">{icon}</div>
              <h3 className="mt-4 text-lg font-bold text-[#17130e]">{title}</h3>
              <span className="mt-5 inline-block text-sm font-semibold text-[#9a7337]">Open →</span>
            </Link>
          ))}
        </div>

        <Link href="/profile" className="mt-8 block rounded-2xl bg-[#fffdf8] p-6 shadow-sm ring-1 ring-[#d8cdbb] hover:shadow-md">
          <h2 className="text-lg font-bold text-[#17130e]">{employer ? "Business profile" : "Complete your profile"}</h2>
          <p className="mt-1 text-sm text-[#7b7265]">{employer ? "Keep your hiring profile up to date." : "Add your skills and experience."}</p>
        </Link>
      </section>
    </main>
  );
}
