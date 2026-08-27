"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";

export default function InstitutePage() {
  const supabase = createClient();
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({ name: "", description: "", website: "", city: "", course: "", category: "", duration: "", fee: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("Please log in first."); return; }
    const { data: institute, error: instituteError } = await supabase.from("institutes").insert({ owner_id: user.id, name: form.name, description: form.description, website: form.website || null, city: form.city, status: "pending" }).select().single();
    if (instituteError) { setStatus(instituteError.message); return; }
    const { error } = await supabase.from("courses").insert({ institute_id: institute.id, title: form.course, category: form.category, description: form.description, duration: form.duration, fee: form.fee ? Number(form.fee) : null, status: "pending" });
    if (error) { setStatus(error.message); return; }
    setStatus("Submitted! Hospire will review your institute and program before publishing.");
  };

  const update = (key: string, value: string) => setForm((x) => ({ ...x, [key]: value }));

  return <main className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/courses" className="text-2xl font-black text-slate-950">Hospire</Link><Link href="/courses" className="font-bold text-blue-700">← Courses & Certifications</Link></div></header>
    <section className="bg-slate-950 px-5 py-14 text-white"><div className="mx-auto max-w-6xl"><p className="text-sm font-black uppercase tracking-widest text-blue-300">Partner with Hospire</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Bring your courses to people ready to learn.</h1><p className="mt-4 max-w-2xl text-slate-300">List your institute and programs on Hospire. We help candidates and hospitality business owners discover relevant training.</p></div></section>
    <section className="mx-auto max-w-4xl px-5 py-10"><form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9"><div><h2 className="text-2xl font-black">Institute & program details</h2><p className="mt-1 text-sm text-slate-500">Start with one program. You can add more later.</p></div>
      {[['name','Institute / Academy name'],['website','Website (optional)'],['city','City'],['course','Course / Certification name'],['category','Category'],['duration','Duration'],['fee','Fee (optional)']].map(([key,label])=><label key={key} className="block"><span className="text-sm font-black text-slate-800">{label}</span><input required={!['website','fee'].includes(key)} type={key==='fee'?'number':'text'} value={form[key as keyof typeof form]} onChange={e=>update(key,e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" /></label>)}
      <label className="block"><span className="text-sm font-black text-slate-800">Program description</span><textarea required value={form.description} onChange={e=>update('description',e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" placeholder="What will students learn? Who is it for?" /></label>
      <button className="w-full rounded-xl bg-blue-700 px-5 py-3.5 font-black text-white hover:bg-blue-800">Submit for review →</button>{status&&<p className="rounded-xl bg-slate-100 p-4 text-sm font-bold text-slate-700">{status}</p>}</form></section>
  </main>;
}
