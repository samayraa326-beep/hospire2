"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Category = { id: string; name: string };

export default function InstitutePage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", website: "", city: "", course: "", categoryId: "", duration: "", fee: "", credential: "Certificate", mode: "Offline", location: "", shortDescription: "" });

  useEffect(() => { supabase.from("course_categories").select("id,name").order("name").then(({ data }) => setCategories(data || [])); }, []);
  const update = (key: string, value: string) => setForm(x => ({ ...x, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setStatus("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("Please log in first."); setBusy(false); return; }
    const slug = form.course.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 7);
    const { data: institute, error: ie } = await supabase.from("institutes").insert({ owner_id: user.id, name: form.name, description: form.description, website: form.website || null, city: form.city, status: "pending" }).select().single();
    if (ie) { setStatus(ie.message); setBusy(false); return; }
    const { error: ce } = await supabase.from("courses").insert({ institute_id: institute.id, category_id: form.categoryId || null, title: form.course, slug, short_description: form.shortDescription || null, description: form.description, credential_type: form.credential, duration: form.duration || null, mode: form.mode, location: form.location || form.city || null, fee: form.fee ? Number(form.fee) : null, currency: "INR", status: "pending", featured: false });
    if (ce) { setStatus(ce.message); setBusy(false); return; }
    setStatus("Submitted successfully. Your institute and program are pending Hospire review.");
    setForm(x => ({ ...x, name: "", description: "", website: "", city: "", course: "", categoryId: "", duration: "", fee: "", location: "", shortDescription: "" }));
    setBusy(false);
  };

  const fields: [string,string][] = [["name","Institute / Academy name"],["website","Website (optional)"],["city","City"],["course","Course / Certification name"],["duration","Duration"],["location","Training location (optional)"],["fee","Fee in INR (optional)"]];
  return <main className="min-h-screen bg-slate-50"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/courses" className="text-2xl font-black text-slate-950">Hospire</Link><Link href="/courses" className="font-bold text-blue-700">← Courses & Certifications</Link></div></header>
    <section className="bg-slate-950 px-5 py-14 text-white"><div className="mx-auto max-w-6xl"><p className="text-sm font-black uppercase tracking-widest text-blue-300">Partner with Hospire</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Bring your courses to people ready to learn.</h1><p className="mt-4 max-w-2xl text-slate-300">List your institute and programs. Hospire helps candidates and hospitality business owners discover relevant training.</p></div></section>
    <section className="mx-auto max-w-4xl px-5 py-10"><form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9"><div><h2 className="text-2xl font-black">Institute & program details</h2><p className="mt-1 text-sm text-slate-500">Your listing will be reviewed before it becomes public.</p></div>
      {fields.map(([key,label]) => <label key={key} className="block"><span className="text-sm font-black text-slate-800">{label}</span><input required={!['website','fee','location'].includes(key)} type={key==='fee'?'number':'text'} value={form[key as keyof typeof form]} onChange={e=>update(key,e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600" /></label>)}
      <label className="block"><span className="text-sm font-black text-slate-800">Category</span><select required value={form.categoryId} onChange={e=>update('categoryId',e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"><option value="">Select a category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <div className="grid gap-5 sm:grid-cols-2"><label><span className="text-sm font-black">Credential</span><select value={form.credential} onChange={e=>update('credential',e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"><option>Certificate</option><option>Certification</option><option>Diploma</option><option>Degree</option><option>Business Program</option></select></label><label><span className="text-sm font-black">Mode</span><select value={form.mode} onChange={e=>update('mode',e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"><option>Offline</option><option>Online</option><option>Hybrid</option></select></label></div>
      <label className="block"><span className="text-sm font-black">Short description</span><input required value={form.shortDescription} onChange={e=>update('shortDescription',e.target.value)} placeholder="One-line value proposition" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
      <label className="block"><span className="text-sm font-black">Program description</span><textarea required value={form.description} onChange={e=>update('description',e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="What will students learn? Who is it for?" /></label>
      <button disabled={busy} className="w-full rounded-xl bg-blue-700 px-5 py-3.5 font-black text-white disabled:opacity-60">{busy ? "Submitting..." : "Submit for review →"}</button>{status&&<p className="rounded-xl bg-slate-100 p-4 text-sm font-bold text-slate-700">{status}</p>}</form></section></main>;
}
