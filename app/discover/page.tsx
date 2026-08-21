"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Candidate = {
  id: string;
  full_name: string | null;
  profile_photo_url: string | null;
  headline: string | null;
  city: string | null;
  hospitality_role: string | null;
  experience_years: number | null;
  skills: string[] | null;
  is_verified: boolean;
};

type PortfolioItem = {
  profile_id: string;
  title: string;
  category: string;
  image_url: string | null;
  media_url: string | null;
  media_type: string;
};

export default function DiscoverPage() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [work, setWork] = useState<PortfolioItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: profiles }, { data: portfolio }] = await Promise.all([
        supabase
          .from("public_candidate_profiles")
          .select("id,full_name,profile_photo_url,headline,city,hospitality_role,experience_years,skills,is_verified")
          .order("updated_at", { ascending: false })
          .limit(60),
        supabase
          .from("portfolio_items")
          .select("profile_id,title,category,image_url,media_url,media_type")
          .order("created_at", { ascending: false })
          .limit(180),
      ]);
      setCandidates((profiles as Candidate[]) || []);
      setWork((portfolio as PortfolioItem[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = candidates.filter((candidate) => {
    const haystack = [
      candidate.full_name,
      candidate.headline,
      candidate.city,
      candidate.hospitality_role,
      ...(candidate.skills || []),
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase().trim());
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 px-5 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-2xl font-black tracking-tight">Hospire</Link>
          <p className="mt-12 text-sm font-black uppercase tracking-[.22em] text-blue-300">Discover hospitality talent</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">See the people behind the work.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Explore chefs, hotel professionals and hospitality talent. See their skills, achievements and real work — then build your own profile.</p>
          <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chef, role, skill or city" className="flex-1 rounded-2xl border border-white/10 bg-white px-5 py-4 text-slate-950 outline-none ring-blue-400 focus:ring-4" />
            <Link href="/?mode=signup" className="rounded-2xl bg-blue-600 px-6 py-4 text-center font-black text-white hover:bg-blue-500">Build my profile</Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div><p className="text-sm font-black uppercase tracking-widest text-blue-700">Talent network</p><h2 className="mt-2 text-3xl font-black">Featured professionals</h2></div>
            <span className="text-sm font-bold text-slate-500">{filtered.length} profiles</span>
          </div>
          {loading ? <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-500">Loading talent...</div> : filtered.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center"><p className="text-lg font-black">No profiles found yet.</p><p className="mt-2 text-slate-500">Be one of the first professionals to create a Hospire portfolio.</p></div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((candidate) => {
            const items = work.filter((item) => item.profile_id === candidate.id).slice(0, 3);
            return <article key={candidate.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {candidate.profile_photo_url ? <img src={candidate.profile_photo_url} alt="" className="h-16 w-16 rounded-2xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl">👨‍🍳</div>}
                  <div className="min-w-0"><h3 className="truncate text-xl font-black">{candidate.full_name || "Hospire professional"}</h3><p className="truncate text-sm font-semibold text-blue-700">{candidate.hospitality_role || candidate.headline || "Hospitality professional"}</p><p className="text-sm text-slate-500">{candidate.city || "India"}{candidate.experience_years != null ? ` · ${candidate.experience_years} yrs` : ""}</p></div>
                </div>
                {candidate.is_verified && <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">✓ Verified profile</div>}
                {candidate.headline && <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{candidate.headline}</p>}
                <div className="mt-4 flex flex-wrap gap-2">{(candidate.skills || []).slice(0, 4).map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{skill}</span>)}</div>
              </div>
              {items.length > 0 && <div className="grid grid-cols-3 gap-1 bg-slate-100">{items.map((item) => <div key={`${item.profile_id}-${item.title}`} className="aspect-square overflow-hidden bg-slate-200">{(item.image_url || item.media_url) ? <img src={item.image_url || item.media_url || ""} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center p-2 text-center text-xs font-bold text-slate-500">{item.title}</div>}</div>)}</div>}
              <div className="p-5 pt-4"><Link href={`/profile/${candidate.id}`} className="block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white hover:bg-blue-700">View full portfolio →</Link></div>
            </article>;
          })}</div>}
        </div>
      </section>
    </main>
  );
}
