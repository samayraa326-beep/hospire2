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
    ? [
        ["Talent", "/discover"],
        ["Jobs", "/opportunities"],
        ["Community", "/community"],
        ["Courses & Certifications", "/courses"],
        ["Challenges", "/challenges"],
      ]
    : [
        ["Jobs", "/opportunities"],
        ["Community", "/community"],
        ["Courses & Certifications", "/courses"],
        ["Challenges", "/challenges"],
      ];

  const cards = employer
    ? [
        ["👥", "Discover Talent", "Find hospitality professionals by skills, experience and real work.", "/discover"],
        ["📢", "Post a Job", "Tell the right candidates about your opening and start hiring.", "/opportunities/post"],
        ["📋", "Manage Jobs", "Keep track of your active jobs and incoming applications.", "/opportunities"],
        ["🏆", "Hiring Challenges", "Run a competition to identify and recognize great talent.", "/challenges"],
      ]
    : [
        ["💼", "Find Jobs", "Search hospitality jobs that match your skills, experience and preferred location.", "/opportunities"],
        ["👤", "Get Discovered", "Build your profile and portfolio so hospitality employers can find you.", "/profile"],
        ["🎓", "Learn & Certify", "Discover courses and certifications from hospitality institutes and industry trainers.", "/courses"],
        ["🏆", "Prove Your Skills", "Take part in challenges, competitions and talent opportunities.", "/challenges"],
      ];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">Hospire</Link>
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map(([label, href]) => <Link key={label} href={href} className="text-sm font-bold text-slate-600 hover:text-blue-700">{label}</Link>)}
          </nav>
          <Link href="/profile" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-800">My Profile</Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-blue-300">{employer ? "Your hiring hub" : "Your career hub"}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Welcome back, {name} 👋</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {employer
              ? "Find the right hospitality people, build your team and hire with confidence."
              : "Find your next hospitality job, build your skills and show the industry what you can do."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={employer ? "/discover" : "/opportunities"} className="rounded-xl bg-white px-6 py-3.5 font-black text-slate-950 hover:bg-slate-100">
              {employer ? "Discover Talent →" : "Find Jobs →"}
            </Link>
            {employer && <Link href="/opportunities/post" className="rounded-xl border border-white/20 px-6 py-3.5 font-black text-white hover:bg-white/10">Post a Job →</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-sm font-black uppercase tracking-widest text-blue-700">{employer ? "Hire on Hospire" : "Your next step"}</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">{employer ? "Everything you need to build your team." : "Everything you need to move forward."}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([icon, title, desc, href]) => (
            <Link href={href} key={title} className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              <span className="mt-5 inline-block text-sm font-black text-blue-700">Open →</span>
            </Link>
          ))}
        </div>

        {!employer && (
          <section className="mt-10 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
            <p className="text-sm font-black uppercase tracking-widest text-blue-700">Show your work</p>
            <h2 className="mt-2 text-2xl font-black">Your profile is more than a resume.</h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-500">Add skills, experience and portfolio work so employers can see what you can actually do.</p>
            <Link href="/profile" className="mt-5 inline-block rounded-xl bg-slate-950 px-5 py-3 font-black text-white">Build my profile →</Link>
          </section>
        )}

        {employer && (
          <section className="mt-10 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
            <p className="text-sm font-black uppercase tracking-widest text-blue-700">Build your employer presence</p>
            <h2 className="mt-2 text-2xl font-black">Help great people choose you.</h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-500">A complete business profile gives candidates context about your workplace and makes your hiring presence more trustworthy.</p>
            <Link href="/profile" className="mt-5 inline-block rounded-xl bg-slate-950 px-5 py-3 font-black text-white">Manage profile →</Link>
          </section>
        )}
      </section>
    </main>
  );
}
