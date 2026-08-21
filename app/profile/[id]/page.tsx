"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  profile_photo_url: string | null;
  institute: string | null;
  headline: string | null;
  bio: string | null;
  city: string | null;
  hospitality_role: string | null;
  experience_years: number | null;
  skills: string[] | null;
  is_verified: boolean;
};

type Work = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  media_url: string | null;
  media_type: string;
  skills: string | null;
};

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [work, setWork] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: profileData }, { data: workData }] = await Promise.all([
        supabase.from("public_candidate_profiles").select("id,full_name,profile_photo_url,institute,headline,bio,city,hospitality_role,experience_years,skills,is_verified").eq("id", params.id).maybeSingle(),
        supabase.from("portfolio_items").select("id,title,category,description,image_url,media_url,media_type,skills").eq("profile_id", params.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileData as Profile | null);
      setWork((workData as Work[]) || []);
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-slate-100 font-bold text-slate-500">Loading profile...</main>;
  if (!profile) return <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-5 text-center"><p className="text-2xl font-black">Profile not found</p><Link href="/discover" className="mt-4 font-bold text-blue-700">Explore other professionals →</Link></main>;

  return <main className="min-h-screen bg-slate-100">
    <nav className="border-b bg-white px-5 py-4"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href="/" className="text-2xl font-black">Hospire</Link><Link href="/discover" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black">Discover talent</Link></div></nav>
    <section className="bg-slate-950 px-5 py-14 text-white sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-8 sm:flex-row sm:items-center">
      {profile.profile_photo_url ? <img src={profile.profile_photo_url} alt={profile.full_name || "Profile"} className="h-28 w-28 rounded-3xl object-cover ring-4 ring-white/10" /> : <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-900 text-5xl">👨‍🍳</div>}
      <div><div className="flex flex-wrap items-center gap-3"><h1 className="text-4xl font-black sm:text-5xl">{profile.full_name || "Hospire professional"}</h1>{profile.is_verified && <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-black text-emerald-300">✓ Verified</span>}</div><p className="mt-3 text-xl font-bold text-blue-300">{profile.hospitality_role || profile.headline || "Hospitality professional"}</p><p className="mt-2 text-slate-400">{profile.city || "India"}{profile.experience_years != null ? ` · ${profile.experience_years} years experience` : ""}</p></div>
    </div></div></section>

    <section className="px-5 py-10 sm:px-8"><div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_320px]">
      <div><div className="rounded-3xl bg-white p-7 shadow-sm"><h2 className="text-2xl font-black">My story</h2><p className="mt-4 whitespace-pre-line leading-8 text-slate-600">{profile.bio || profile.headline || "This professional is building their Hospire portfolio."}</p></div>
      <div className="mt-8"><div className="flex items-end justify-between"><div><p className="text-sm font-black uppercase tracking-widest text-blue-700">Proof of work</p><h2 className="mt-2 text-3xl font-black">My work</h2></div><span className="text-sm font-bold text-slate-500">{work.length} projects</span></div>
      {work.length === 0 ? <div className="mt-5 rounded-3xl bg-white p-8 text-slate-500">No work added yet.</div> : <div className="mt-5 grid gap-5 sm:grid-cols-2">{work.map((item) => <article key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">{item.image_url || item.media_url ? <img src={item.image_url || item.media_url || ""} alt={item.title} className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 p-6 text-center text-lg font-black text-slate-400">{item.title}</div>}<div className="p-5"><p className="text-xs font-black uppercase tracking-widest text-blue-700">{item.category}</p><h3 className="mt-2 text-xl font-black">{item.title}</h3>{item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}{item.skills && <p className="mt-3 text-xs font-bold text-slate-500">Skills: {item.skills}</p>}</div></article>)}</div>}
      </div></div>
      <aside><div className="sticky top-6 rounded-3xl bg-white p-6 shadow-sm"><h2 className="text-lg font-black">Skills</h2><div className="mt-4 flex flex-wrap gap-2">{(profile.skills || []).length ? profile.skills?.map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">{skill}</span>) : <span className="text-sm text-slate-500">Skills not added yet.</span>}</div>{profile.institute && <><h2 className="mt-7 text-lg font-black">Education</h2><p className="mt-2 text-sm text-slate-600">{profile.institute}</p></>}<Link href="/?mode=signup" className="mt-7 block rounded-2xl bg-blue-700 px-5 py-4 text-center font-black text-white hover:bg-blue-800">Create my own profile</Link></div></aside>
    </div></section>
  </main>;
}
