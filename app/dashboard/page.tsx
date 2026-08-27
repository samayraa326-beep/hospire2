"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const categories = [
  ["💼","Opportunities","Find jobs across hotels, restaurants, cafés, cloud kitchens, airlines and more.","/opportunities"],
  ["👨‍🍳","Discover Talent","Explore hospitality professionals and their real work portfolios.","/discover"],
  ["🤝","Connect","Build meaningful connections with chefs and hospitality professionals.","/discover"],
  ["👤","My Profile","Manage your profile, skills and living portfolio.","/profile"],
];

export default function Dashboard() {
  const supabase = createClient();
  const [name,setName]=useState("there");
  const [role,setRole]=useState("candidate");

  useEffect(()=>{(async()=>{
    const {data:{user}}=await supabase.auth.getUser();
    if(!user) return;
    const {data:p}=await supabase.from("profiles").select("full_name,role").eq("id",user.id).maybeSingle();
    if(p?.full_name) setName(p.full_name.split(" ")[0]);
    if(p?.role) setRole(p.role);
  })()},[supabase]);

  const employer = role === "employer";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">Hospire</Link>
          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/opportunities" className="text-sm font-bold text-slate-600 hover:text-blue-700">Opportunities</Link>
            <Link href="/discover" className="text-sm font-bold text-slate-600 hover:text-blue-700">Discover Talent</Link>
            <Link href="/profile" className="text-sm font-bold text-slate-600 hover:text-blue-700">My Profile</Link>
          </nav>
          <Link href={employer ? "/opportunities/post" : "/profile"} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-800">{employer ? "Post an Opportunity" : "Edit Profile"}</Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-blue-300">Your Hospire</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Welcome back, {name} 👋</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{employer ? "Find the right hospitality professional for your business — based on skills, experience and real work." : "Your next opportunity, connection or career move could be one click away."}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={employer ? "/discover" : "/opportunities"} className="rounded-xl bg-white px-6 py-3.5 font-black text-slate-950 hover:bg-slate-100">{employer ? "Discover Talent →" : "Find Opportunities →"}</Link>
            <Link href="/profile" className="rounded-xl border border-white/25 px-6 py-3.5 font-black text-white hover:bg-white/10">View My Profile</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="text-sm font-black uppercase tracking-widest text-blue-700">Explore</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">What do you want to do?</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(([icon,title,desc,href])=><Link href={href} key={title} className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="text-4xl">{icon}</div><h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p><span className="mt-5 inline-block text-sm font-black text-blue-700">Open →</span>
          </Link>)}
        </div>

        <section className="mt-12 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
          <p className="text-sm font-black uppercase tracking-widest text-blue-700">The Hospire difference</p>
          <h2 className="mt-2 text-2xl font-black">Show the work. Not just the resume.</h2>
          <p className="mt-2 max-w-2xl leading-7 text-slate-500">Your profile can tell your story through skills, experience and a living portfolio — so employers can understand what you can actually do.</p>
          <Link href="/profile" className="mt-5 inline-block rounded-xl bg-slate-950 px-5 py-3 font-black text-white">Manage portfolio →</Link>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-blue-700">Learn & grow</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Courses for your next level.</h2>
              <p className="mt-2 max-w-2xl text-slate-500">Build practical hospitality skills, earn credentials and become more job-ready.</p>
            </div>
            <Link href="/courses" className="font-black text-blue-700 hover:text-blue-900">View all courses →</Link>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["👨‍🍳","Professional Kitchen Fundamentals","Knife skills, food preparation, hygiene and kitchen discipline.","Culinary"],
              ["🏨","Hotel & Hospitality Essentials","Guest service, front office basics and professional standards.","Hospitality"],
              ["🧼","Food Safety & Hygiene","Practical hygiene, sanitation and safe food-handling habits.","Certification"],
            ].map(([icon,title,desc,tag]) => (
              <Link href="/courses" key={title} className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{icon}</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{tag}</span>
                </div>
                <h3 className="mt-6 text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
                <span className="mt-5 inline-block text-sm font-black text-blue-700 group-hover:translate-x-1 transition">Explore course →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-widest text-blue-700">Built for every hospitality business</p>
          <h2 className="mt-2 text-3xl font-black">From luxury hotels to the street.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Luxury Hotels","Restaurants & Cafés","Cloud Kitchens","Airlines & Cruises","Street Food & Independent Businesses","Catering & Events","Resorts","Corporate Hospitality"].map(x=><div key={x} className="rounded-2xl bg-slate-100 p-5 font-black text-slate-800 ring-1 ring-slate-200">{x}</div>)}
          </div>
        </section>
      </section>
    </main>
  );
}