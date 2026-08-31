"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../lib/supabase/client";

type Category = { id: string; name: string; slug: string; icon: string | null; description: string | null };
type Course = { id: string; title: string; slug: string; short_description: string | null; description: string | null; credential_type: string; duration: string | null; mode: string | null; location: string | null; fee: number | null; currency: string; image_url: string | null; featured: boolean; category_id: string | null; institute: { name: string; city: string | null; is_verified: boolean } | null };

export default function CoursesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: cats }, { data: rows }] = await Promise.all([
        supabase.from("course_categories").select("id,name,slug,icon,description").order("name"),
        supabase.from("courses").select("id,title,slug,short_description,description,credential_type,duration,mode,location,fee,currency,image_url,featured,category_id,institute:institutes(name,city,is_verified)").eq("status", "approved").order("featured", { ascending: false }).order("created_at", { ascending: false }),
      ]);
      setCategories((cats || []) as Category[]);
      setCourses((rows || []) as unknown as Course[]);
      setLoading(false);
    };
    load();
  }, []);

  const visible = useMemo(() => courses.filter((course) => {
    const text = `${course.title} ${course.short_description || ""} ${course.institute?.name || ""}`.toLowerCase();
    return (selectedCategory === "all" || course.category_id === selectedCategory) && text.includes(search.toLowerCase());
  }), [courses, search, selectedCategory]);

  return <main className="min-h-screen bg-[#f6f1e7]">
    <header className="border-b border-[#d8cdbb] bg-[#fffdf8]"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"><Link href="/dashboard" className="text-2xl font-black tracking-tight text-[#17130e]">Hospire</Link><nav className="hidden items-center gap-7 md:flex"><Link href="/opportunities" className="text-sm font-bold text-[#6f675b]">Opportunities</Link><Link href="/discover" className="text-sm font-bold text-[#6f675b]">Discover Talent</Link><Link href="/courses" className="text-sm font-black text-[#9a7337]">Courses & Certifications</Link><Link href="/profile" className="text-sm font-bold text-[#6f675b]">My Profile</Link></nav><Link href="/profile" className="rounded-xl bg-[#17130e] px-4 py-2.5 text-sm font-black text-white">My Profile</Link></div></header>

    <section className="bg-gradient-to-br from-[#17130e] via-[#0b0a08] to-[#2a2117] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-black uppercase tracking-[.22em] text-[#c9a45c]">Learn • Certify • Grow</p><h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Courses & Certifications for your hospitality journey.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Discover practical programs from hospitality institutes, academies and industry trainers — whether you want your first job, a new skill or to build your own food business.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#courses" className="rounded-xl bg-[#fffdf8] px-6 py-3.5 font-black text-[#17130e]">Explore programs →</a><Link href="/courses/institute" className="rounded-xl border border-white/25 px-6 py-3.5 font-black text-white">For institutes & trainers</Link></div></div></section>

    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><p className="text-sm font-black uppercase tracking-widest text-[#9a7337]">Explore by goal</p><h2 className="mt-2 text-3xl font-black text-[#17130e]">What do you want to learn?</h2><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map((item) => <button key={item.id} onClick={() => { setSelectedCategory(item.id); document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" }); }} className={`rounded-3xl bg-[#fffdf8] p-6 text-left shadow-sm ring-1 ring-[#d8cdbb] transition hover:-translate-y-1 hover:shadow-lg ${selectedCategory === item.id ? "ring-2 ring-blue-600" : ""}`}><div className="text-4xl">{item.icon || "🎓"}</div><h3 className="mt-5 text-xl font-black text-[#17130e]">{item.name}</h3><p className="mt-2 text-sm leading-6 text-[#7b7265]">{item.description || "Explore practical hospitality programs."}</p><span className="mt-5 inline-block text-sm font-black text-[#9a7337]">View programs →</span></button>)}</div></section>

    <section id="courses" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-black uppercase tracking-widest text-[#9a7337]">Marketplace</p><h2 className="mt-2 text-3xl font-black text-[#17130e]">Find your next program.</h2></div><div className="flex gap-2"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or institutes..." className="w-full rounded-xl border border-[#d8cdbb] bg-[#fffdf8] px-4 py-3 text-sm outline-none focus:border-[#a57b3b] sm:w-72"/><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="rounded-xl border border-[#d8cdbb] bg-[#fffdf8] px-3 py-3 text-sm font-bold"><option value="all">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div></div>
      {loading ? <div className="py-16 text-center font-bold text-[#7b7265]">Loading programs...</div> : visible.length === 0 ? <div className="mt-7 rounded-3xl bg-[#fffdf8] p-12 text-center ring-1 ring-[#d8cdbb]"><div className="text-5xl">🎓</div><h3 className="mt-4 text-xl font-black">No approved programs yet</h3><p className="mt-2 text-[#7b7265]">Institutes can list their programs through Hospire. New approved programs will appear here.</p></div> : <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(course => <article key={course.id} className="overflow-hidden rounded-3xl bg-[#fffdf8] shadow-sm ring-1 ring-[#d8cdbb]"><div className="flex h-36 items-end bg-gradient-to-br from-blue-100 to-slate-100 p-5"><span className="rounded-full bg-[#fffdf8] px-3 py-1 text-xs font-black text-[#9a7337]">{course.credential_type}</span></div><div className="p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black text-[#17130e]">{course.title}</h3><p className="mt-1 text-sm font-bold text-[#7b7265]">{course.institute?.name || "Hospitality Institute"}{course.institute?.is_verified ? " ✓" : ""}</p></div>{course.featured && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700">Featured</span>}</div><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#7b7265]">{course.short_description || course.description}</p><div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#7b7265]"><span>⏱ {course.duration || "Flexible"}</span>{course.mode && <span>• {course.mode}</span>}{course.location && <span>• {course.location}</span>}</div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="font-black text-[#17130e]">{course.fee != null ? `${course.currency} ${Number(course.fee).toLocaleString("en-IN")}` : "Contact institute"}</span><Link href={`/courses/${course.slug}`} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white">View details</Link></div></div></article>)}</div>}
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><div className="rounded-3xl bg-[#fffdf8] p-8 shadow-sm ring-1 ring-[#d8cdbb] sm:p-10"><p className="text-sm font-black uppercase tracking-widest text-[#9a7337]">For institutes & industry trainers</p><div className="mt-3 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-3xl font-black text-[#17130e]">Have a course or certification program?</h2><p className="mt-3 max-w-2xl leading-7 text-[#7b7265]">Showcase your programs to people actively looking to build hospitality careers or start and grow food businesses. Hospire becomes your discovery and enrollment channel.</p></div><Link href="/courses/institute" className="rounded-xl bg-[#17130e] px-6 py-3.5 text-center font-black text-white">Partner with Hospire →</Link></div></div></section>
  </main>;
}
