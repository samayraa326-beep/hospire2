"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";

const hiringCategories = ["Luxury Hotels","Restaurants & Cafés","Cloud Kitchens","Airlines & Cruises","Street Food & Independent Food Businesses","Catering & Events","Resorts","Corporate / Institutional Hospitality"];
const jobTypes = ["full-time","part-time","contract","internship"];

type Job = {
  id: string; company_id: string; title: string; department: string | null; location: string | null;
  experience_min: number | null; experience_max: number | null; salary_min: number | null; salary_max: number | null;
  job_type: string; description: string | null; requirements: string | null; created_at: string;
  companies: { name: string; company_type: string | null; city: string | null; is_verified: boolean } | null;
};

export default function OpportunitiesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("");
  const [location, setLocation] = useState(""); const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState(""); const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applying, setApplying] = useState(""); const [notice, setNotice] = useState(""); const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const { data, error: loadError } = await supabase.from("jobs").select("*, companies(name,company_type,city,is_verified)").eq("is_active", true).order("created_at", { ascending: false });
      if (loadError) setError(loadError.message); else setJobs((data as Job[]) || []);
      setLoading(false);
    }
    loadJobs();
  }, [supabase]);

  const filteredJobs = jobs.filter((job) => {
    const text = [job.title,job.department,job.location,job.description,job.requirements,job.companies?.name,job.companies?.company_type,job.companies?.city].filter(Boolean).join(" ").toLowerCase();
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesCategory = !category || job.companies?.company_type === category;
    const matchesLocation = !location.trim() || [job.location,job.companies?.city].filter(Boolean).join(" ").toLowerCase().includes(location.trim().toLowerCase());
    const matchesType = !jobType || job.job_type === jobType;
    const minExp = Number(experience);
    const matchesExperience = !experience || job.experience_max == null || job.experience_max >= minExp;
    return matchesQuery && matchesCategory && matchesLocation && matchesType && matchesExperience;
  });

  function salary(job: Job) {
    if (job.salary_min == null && job.salary_max == null) return "Salary not disclosed";
    const money = (n: number | null) => n == null ? "" : "₹" + n.toLocaleString("en-IN");
    if (job.salary_min != null && job.salary_max != null) return money(job.salary_min) + " – " + money(job.salary_max) + "/month";
    return money(job.salary_min ?? job.salary_max) + "/month";
  }

  function exp(job: Job) {
    if (job.experience_min == null && job.experience_max == null) return "Experience flexible";
    if (job.experience_min != null && job.experience_max != null) return job.experience_min + "–" + job.experience_max + " years";
    return (job.experience_min ?? job.experience_max) + "+ years";
  }

  async function applyToJob(job: Job) {
    setError(""); setNotice(""); setApplying(job.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Please log in or create a candidate account before applying."); setApplying(""); return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "candidate") { setError("Only candidate accounts can apply for jobs."); setApplying(""); return; }
    const { error: applyError } = await supabase.from("applications").insert({ job_id: job.id, candidate_id: user.id });
    if (applyError) setError(applyError.code === "23505" ? "You have already applied to this job." : applyError.message);
    else setNotice("Application submitted. The employer can now review your profile.");
    setApplying("");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">Hospire</Link>
        <div className="flex items-center gap-3"><Link href="/discover" className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 sm:block">Discover talent</Link><Link href="/opportunities/post" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-800">Post a job</Link></div>
      </div></header>
      <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 px-5 py-14 text-white sm:px-8"><div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[.22em] text-blue-300">Opportunities</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Find work where your hospitality skills matter.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Jobs from luxury hotels, restaurants, cafés, cloud kitchens, airlines, cruises and independent food businesses.</p>
      </div></section>
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role, skill or employer" className="rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600"><option value="">All hiring categories</option>{hiringCategories.map((item) => <option key={item}>{item}</option>)}</select>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600" />
            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600"><option value="">All job types</option>{jobTypes.map((item) => <option key={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3"><select value={experience} onChange={(e) => setExperience(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"><option value="">Any experience</option><option value="0">Fresher friendly</option><option value="1">1+ year</option><option value="2">2+ years</option><option value="3">3+ years</option><option value="5">5+ years</option></select>
            <button type="button" onClick={() => { setQuery(""); setCategory(""); setLocation(""); setJobType(""); setExperience(""); }} className="text-sm font-bold text-blue-700">Clear filters</button><span className="ml-auto text-sm font-bold text-slate-500">{filteredJobs.length} {filteredJobs.length === 1 ? "opportunity" : "opportunities"}</span></div>
        </div>
        {notice && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">{notice}</div>}
        {error && <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</div>}
        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          {loading ? <div className="lg:col-span-2 rounded-3xl bg-white p-12 text-center font-bold text-slate-500">Loading opportunities...</div> : filteredJobs.length === 0 ? <div className="lg:col-span-2 rounded-3xl bg-white p-12 text-center ring-1 ring-slate-200"><div className="text-5xl">💼</div><h2 className="mt-4 text-2xl font-black">No jobs match your search yet.</h2><p className="mx-auto mt-2 max-w-xl text-slate-500">Try another filter, or be the first employer to post an opportunity on Hospire.</p><Link href="/opportunities/post" className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 font-black text-white">Post a job →</Link></div> : filteredJobs.map((job) => <article key={job.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-widest text-blue-700">{job.companies?.company_type || "Hospitality"}</p><h2 className="mt-2 text-2xl font-black text-slate-950">{job.title}</h2><p className="mt-1 font-bold text-slate-700">{job.companies?.name || "Hospitality employer"} {job.companies?.is_verified && <span className="ml-1 text-emerald-600">✓</span>}</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black capitalize text-slate-600">{job.job_type}</span></div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-400">Location</p><p className="mt-1 font-black text-slate-800">{job.location || job.companies?.city || "India"}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-400">Experience</p><p className="mt-1 font-black text-slate-800">{exp(job)}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-400">Salary</p><p className="mt-1 font-black text-slate-800">{salary(job)}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-slate-400">Department</p><p className="mt-1 font-black text-slate-800">{job.department || "Hospitality"}</p></div></div>
            {job.requirements && <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{job.requirements}</p>}
            <div className="mt-6 flex gap-3"><button type="button" onClick={() => setSelectedJob(job)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 hover:bg-slate-50">View job</button><button type="button" onClick={() => applyToJob(job)} disabled={applying === job.id} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:opacity-60">{applying === job.id ? "Applying..." : "Apply now"}</button></div>
          </article>)}
        </div>
      </section>
      {selectedJob && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-5 border-b border-slate-100 p-6 sm:p-8"><div><p className="text-sm font-black uppercase tracking-widest text-blue-700">{selectedJob.companies?.company_type || "Hospitality"}</p><h2 className="mt-2 text-3xl font-black">{selectedJob.title}</h2><p className="mt-1 font-bold text-slate-600">{selectedJob.companies?.name || "Hospitality employer"}</p></div><button type="button" onClick={() => setSelectedJob(null)} className="rounded-xl bg-slate-100 px-3 py-2 font-black text-slate-600">✕</button></div>
        <div className="space-y-7 p-6 sm:p-8"><div className="grid gap-3 sm:grid-cols-4"><div><p className="text-xs font-bold uppercase text-slate-400">Location</p><p className="mt-1 font-bold">{selectedJob.location || selectedJob.companies?.city || "India"}</p></div><div><p className="text-xs font-bold uppercase text-slate-400">Experience</p><p className="mt-1 font-bold">{exp(selectedJob)}</p></div><div><p className="text-xs font-bold uppercase text-slate-400">Salary</p><p className="mt-1 font-bold">{salary(selectedJob)}</p></div><div><p className="text-xs font-bold uppercase text-slate-400">Type</p><p className="mt-1 font-bold capitalize">{selectedJob.job_type}</p></div></div>
          <section><h3 className="text-xl font-black">About the role</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{selectedJob.description || "The employer has not added a description yet."}</p></section><section><h3 className="text-xl font-black">What we are looking for</h3><p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{selectedJob.requirements || "The employer has not added requirements yet."}</p></section><button type="button" onClick={() => applyToJob(selectedJob)} disabled={applying === selectedJob.id} className="w-full rounded-2xl bg-blue-700 px-6 py-4 font-black text-white hover:bg-blue-800">{applying === selectedJob.id ? "Applying..." : "Apply for this opportunity →"}</button>
        </div></div></div>}
    </main>
  );
}