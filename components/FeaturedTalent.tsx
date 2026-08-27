"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

type Candidate = { id: string; full_name: string | null; profile_photo_url: string | null; headline: string | null; city: string | null; hospitality_role: string | null; experience_years: number | null; skills: string[] | null; is_verified: boolean };
type Work = { profile_id: string; title: string; image_url: string | null; media_url: string | null };

export default function FeaturedTalent() {
  const supabase = createClient();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [work, setWork] = useState<Work[]>([]);

  useEffect(() => {
    async function load() {
      const [{ data: profiles }, { data: portfolio }] = await Promise.all([
        supabase.from("public_candidate_profiles").select("id,full_name,profile_photo_url,headline,city,hospitality_role,experience_years,skills,is_verified").order("updated_at", { ascending: false }).limit(12),
        supabase.from("portfolio_items").select("profile_id,title,image_url,media_url").order("created_at", { ascending: false }).limit(60),
      ]);
      setCandidates((profiles as Candidate[]) || []);
      setWork((portfolio as Work[]) || []);
    }
    load();
  }, [supabase]);

  if (!candidates.length) return null;

  return (
    <section className="overflow-hidden bg-slate-100 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">Featured talent</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Meet the talent on Hospire.</h2></div>
          <Link href="/discover" className="shrink-0 text-sm font-semibold text-blue-700">View all →</Link>
        </div>
      </div>
      <div className="mt-7 overflow-hidden">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
          {[...candidates, ...candidates].map((candidate, index) => {
            const items = work.filter((item) => item.profile_id === candidate.id).slice(0, 3);
            return <Link href={`/profile/${candidate.id}`} key={`${candidate.id}-${index}`} className="mx-2 block w-[300px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <div className="flex items-center gap-3 p-4">{candidate.profile_photo_url ? <img src={candidate.profile_photo_url} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">👨‍🍳</div>}<div className="min-w-0"><h3 className="truncate font-bold text-slate-950">{candidate.full_name || "Hospitality professional"}</h3><p className="truncate text-sm text-blue-700">{candidate.hospitality_role || candidate.headline || "Hospitality professional"}</p><p className="text-xs text-slate-500">{candidate.city || "India"}{candidate.experience_years != null ? ` · ${candidate.experience_years} yrs` : ""}</p></div></div>
              {items.length > 0 && <div className="grid grid-cols-3 gap-1 bg-slate-100">{items.map((item) => <div key={`${item.profile_id}-${item.title}`} className="aspect-square overflow-hidden bg-slate-200">{(item.image_url || item.media_url) ? <img src={item.image_url || item.media_url || ""} alt="" className="h-full w-full object-cover" /> : null}</div>)}</div>}
              <div className="flex items-center justify-between px-4 py-3 text-xs">{candidate.is_verified ? <span className="font-semibold text-emerald-700">Verified</span> : <span className="text-slate-400">Profile</span>}<span className="font-semibold text-slate-500">View →</span></div>
            </Link>;
          })}
        </div>
      </div>
      <style jsx>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
