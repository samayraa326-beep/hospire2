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
    <section className="overflow-hidden border-t border-[#8f6b35]/35 bg-[#0b0a08] py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.22em] text-[#c9a45c]">Featured talent</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f4efe5]">Meet the talent on Hospire.</h2></div>
          <Link href="/discover" className="shrink-0 text-sm font-semibold text-[#c9a45c]">View all →</Link>
        </div>
      </div>
      <div className="mt-7 overflow-hidden">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused]">
          {[...candidates, ...candidates].map((candidate, index) => {
            const items = work.filter((item) => item.profile_id === candidate.id).slice(0, 3);
            return <Link href={`/profile/${candidate.id}`} key={`${candidate.id}-${index}`} className="mx-2 block w-[300px] shrink-0 overflow-hidden border border-[#8f6b35]/45 bg-[#15120e] shadow-[0_12px_40px_rgba(0,0,0,.28)] transition hover:border-[#c9a45c]/70 hover:shadow-[0_16px_50px_rgba(0,0,0,.4)]">
              <div className="flex items-center gap-3 border-b border-[#8f6b35]/25 p-4">{candidate.profile_photo_url ? <img src={candidate.profile_photo_url} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#272017] text-[#c9a45c]">👨‍🍳</div>}<div className="min-w-0"><h3 className="truncate font-semibold text-[#f4efe5]">{candidate.full_name || "Hospitality professional"}</h3><p className="truncate text-sm text-[#c9a45c]">{candidate.hospitality_role || candidate.headline || "Hospitality professional"}</p><p className="text-xs text-[#918878]">{candidate.city || "India"}{candidate.experience_years != null ? ` · ${candidate.experience_years} yrs` : ""}</p></div></div>
              {items.length > 0 && <div className="grid grid-cols-3 gap-px bg-[#0b0a08]">{items.map((item) => <div key={`${item.profile_id}-${item.title}`} className="aspect-square overflow-hidden bg-[#201b15]">{(item.image_url || item.media_url) ? <img src={item.image_url || item.media_url || ""} alt="" className="h-full w-full object-cover" /> : null}</div>)}</div>}
              <div className="flex items-center justify-between border-t border-[#8f6b35]/20 px-4 py-3 text-xs">{candidate.is_verified ? <span className="font-semibold text-[#c9a45c]">Verified</span> : <span className="text-[#756f65]">Profile</span>}<span className="font-semibold text-[#bdb6a9]">View →</span></div>
            </Link>;
          })}
        </div>
      </div>
      <style jsx>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
