"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

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

type Work = { profile_id: string; title: string; image_url: string | null; media_url: string | null };

export default function FeaturedTalent() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [work, setWork] = useState<Work[]>([]);

  useEffect(() => {
    async function load() {
      const [{ data: profiles }, { data: portfolio }] = await Promise.all([
        supabase.from("public_candidate_profiles").select("id,full_name,profile_photo_url,headline,city,hospitality_role,experience_years,skills,is_verified").order("updated_at", { ascending: false }).limit(6),
        supabase.from("portfolio_items").select("profile_id,title,image_url,media_url").order("created_at", { ascending: false }).limit(60),
      ]);
      setCandidates((profiles as Candidate[]) || []);
      setWork((portfolio as Work[]) || []);
    }
    load();
  }, [supabase]);

  if (!candidates.length) return null;

  return (
    <section className="bg-slate-100 px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-blue-700">Talent network</p><h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">See the people behind the work.</h2><p className="mt-2 max-w-2xl text-slate-600">Real hospitality professionals. Real skills. Real work.</p></div>
          <Link href="/discover" className="font-black text-blue-700">Explore all talent →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => {
            const items = work.filter((item) => item.profile_id === candidate.id).slice(0, 3);
            return <article key={candidate.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="p-5"><div className="flex items-center gap-4">{candidate.profile_photo_url ? <img src={candidate.profile_photo_url} alt="" className="h-14 w-14 rounded-2xl object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl">👨‍🍳</div>}<div className="min-w-0"><h3 className="truncate font-black text-slate-950">{candidate.full_name || "Hospire professional"}</h3><p className="truncate text-sm font-bold text-blue-700">{candidate.hospitality_role || candidate.headline || "Hospitality professional"}</p><p className="text-xs text-slate-500">{candidate.city || "India"}{candidate.experience_years != null ? ` · ${candidate.experience_years} yrs` : ""}</p></div></div>{candidate.is_verified && <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">✓ Verified</span>}<div className="mt-3 flex flex-wrap gap-1.5">{(candidate.skills || []).slice(0, 3).map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{skill}</span>)}</div></div>
              {items.length > 0 && <div className="grid grid-cols-3 gap-1 bg-slate-100">{items.map((item) => <div key={`${item.profile_id}-${item.title}`} className="aspect-square overflow-hidden bg-slate-200">{(item.image_url || item.media_url) ? <img src={item.image_url || item.media_url || ""} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center p-2 text-center text-xs font-bold text-slate-500">{item.title}</div>}</div>)}</div>}
              <div className="p-4"><Link href={`/profile/${candidate.id}`} className="block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white hover:bg-blue-700">View portfolio →</Link></div>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}
