"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Post = { id: string; profile_id: string; title: string; category: string; description: string | null; image_url: string | null; media_url: string | null; created_at: string };
type Profile = { id: string; full_name: string | null; profile_photo_url: string | null; hospitality_role: string | null; city: string | null; is_verified: boolean };
type Company = { id: string; name: string; company_type: string | null; logo_url: string | null; city: string | null; is_verified: boolean };

export default function CommunityPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: postData }, { data: profileData }, { data: companyData }, { data: { user } }] = await Promise.all([
        supabase.from("portfolio_items").select("id,profile_id,title,category,description,image_url,media_url,created_at").order("created_at", { ascending: false }).limit(40),
        supabase.from("public_candidate_profiles").select("id,full_name,profile_photo_url,hospitality_role,city,is_verified").order("updated_at", { ascending: false }).limit(50),
        supabase.from("companies").select("id,name,company_type,logo_url,city,is_verified").order("updated_at", { ascending: false }).limit(30),
        supabase.auth.getUser(),
      ]);
      setPosts((postData as Post[]) || []);
      setProfiles((profileData as Profile[]) || []);
      setCompanies((companyData as Company[]) || []);
      if (user) {
        const { data: follows } = await supabase.from("profile_follows").select("following_id").eq("follower_id", user.id);
        setFollowing((follows || []).map((x) => x.following_id));
      }
      setLoading(false);
    }
    load();
  }, []);

  async function toggleFollow(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (following.includes(id)) {
      await supabase.from("profile_follows").delete().eq("follower_id", user.id).eq("following_id", id);
      setFollowing((prev) => prev.filter((x) => x !== id));
    } else {
      await supabase.from("profile_follows").insert({ follower_id: user.id, following_id: id });
      setFollowing((prev) => [...prev, id]);
    }
  }

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const verifiedChefs = profiles.filter((p) => p.is_verified).slice(0, 8);
  const featuredCompanies = companies.filter((c) => c.is_verified).slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <nav className="border-b bg-white px-5 py-4"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-2xl font-black">Hospire</Link><div className="flex gap-3"><Link href="/discover" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black">Discover talent</Link><Link href="/profile" className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-black text-white">My profile</Link></div></div></nav>

      <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 px-5 py-14 text-white sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-black uppercase tracking-[.2em] text-blue-300">Hospire community</p><h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-6xl">See what hospitality people are creating.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Discover chefs, hotel professionals and hospitality brands. Follow people you admire, learn from their work and build your own reputation.</p></div></section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-black uppercase tracking-widest text-blue-700">Community feed</p><h2 className="mt-2 text-3xl font-black">Latest work</h2></div><Link href="/profile#my-work" className="font-black text-blue-700">Post your work →</Link></div>
        {loading ? <div className="rounded-3xl bg-white p-10 text-center font-bold text-slate-500">Loading community...</div> : posts.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center"><p className="text-lg font-black">The community is just getting started.</p><p className="mt-2 text-slate-500">Be one of the first to share your work.</p><Link href="/profile#my-work" className="mt-5 inline-block rounded-xl bg-blue-700 px-5 py-3 font-black text-white">Add My Work</Link></div> : <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="space-y-5">{posts.map((post) => { const person = profileMap.get(post.profile_id); return <article key={post.id} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between p-5"><Link href={`/profile/${post.profile_id}`} className="flex items-center gap-3">{person?.profile_photo_url ? <img src={person.profile_photo_url} alt="" className="h-12 w-12 rounded-2xl object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">👨‍🍳</div>}<div><p className="font-black">{person?.full_name || "Hospire professional"} {person?.is_verified && <span className="text-emerald-600">✓</span>}</p><p className="text-xs font-bold text-slate-500">{person?.hospitality_role || "Hospitality professional"} · {person?.city || "India"}</p></div></Link>{person && <button onClick={() => toggleFollow(person.id)} className="rounded-xl border px-3 py-2 text-xs font-black">{following.includes(person.id) ? "Following" : "Follow"}</button>}</div>{post.image_url || post.media_url ? <img src={post.image_url || post.media_url || ""} alt={post.title} className="aspect-[16/9] w-full object-cover" /> : <div className="flex aspect-[16/9] items-center justify-center bg-slate-100 p-8 text-center text-2xl font-black text-slate-400">{post.title}</div>}<div className="p-5"><span className="text-xs font-black uppercase tracking-widest text-blue-700">{post.category}</span><h3 className="mt-2 text-2xl font-black">{post.title}</h3>{post.description && <p className="mt-2 leading-7 text-slate-600">{post.description}</p>}<Link href={`/profile/${post.profile_id}`} className="mt-4 inline-block font-black text-blue-700">View full portfolio →</Link></div></article>; })}</div>

          <aside className="space-y-6"><div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-blue-700">Connect</p><h2 className="mt-2 text-2xl font-black">Chefs & hospitality leaders</h2><p className="mt-2 text-sm leading-6 text-slate-500">Verified public profiles can become the people others follow and learn from.</p><div className="mt-5 space-y-3">{verifiedChefs.length ? verifiedChefs.map((chef) => <div key={chef.id} className="flex items-center justify-between gap-3"><Link href={`/profile/${chef.id}`} className="flex min-w-0 items-center gap-3">{chef.profile_photo_url ? <img src={chef.profile_photo_url} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">👨‍🍳</div>}<div className="min-w-0"><p className="truncate text-sm font-black">{chef.full_name || "Verified chef"}</p><p className="truncate text-xs text-slate-500">{chef.hospitality_role || "Chef"}</p></div></Link><button onClick={() => toggleFollow(chef.id)} className="text-xs font-black text-blue-700">{following.includes(chef.id) ? "Following" : "Follow"}</button></div>) : <p className="text-sm text-slate-500">Verified chef profiles will appear here.</p>}</div></div>

          <div className="rounded-3xl bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-widest text-blue-700">Industry network</p><h2 className="mt-2 text-2xl font-black">Hotels · Resorts · Cruise</h2><p className="mt-2 text-sm leading-6 text-slate-500">Discover hospitality companies, their profiles and opportunities.</p><div className="mt-5 space-y-3">{featuredCompanies.length ? featuredCompanies.map((company) => <div key={company.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">{company.logo_url ? <img src={company.logo_url} alt="" className="h-10 w-10 rounded-xl object-contain bg-white" /> : <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">🏨</div>}<div><p className="text-sm font-black">{company.name}</p><p className="text-xs text-slate-500">{company.company_type || "Hospitality company"} · {company.city || "India"}</p></div>{company.is_verified && <span className="ml-auto text-xs font-black text-emerald-600">✓</span>}</div>) : <p className="text-sm text-slate-500">Verified hotels, resorts and cruise companies will appear here.</p>}</div></div></aside>
        </div>}
      </section>
    </main>
  );
}
