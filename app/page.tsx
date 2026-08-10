import Link from "next/link";
import Navbar from "../components/Navbar";

const jobs = [
  ["Commis Chef", "Premium Hotel Partner", "Mumbai"],
  ["Front Office Associate", "Luxury Hotel Partner", "Pune"],
  ["F&B Executive", "Hospitality Partner", "Bengaluru"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <section className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">INDIA&apos;S HOSPITALITY & CULINARY TALENT NETWORK</span>
            <h1 className="mt-8 text-5xl font-black leading-tight sm:text-6xl">Where hospitality talent meets trusted employers.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">Hospire connects hospitality students and professionals with hotels, restaurants, resorts and hospitality companies through one focused professional network.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/dashboard" className="rounded-2xl bg-white px-7 py-4 font-bold text-blue-900">Find Hospitality Jobs →</Link>
              <a href="#employers" className="rounded-2xl border border-white/25 bg-white/10 px-7 py-4 font-bold">Hire Hospitality Talent</a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Early marketplace</p>
              <h2 className="mt-2 text-2xl font-black">Hospitality opportunities</h2>
              <div className="mt-6 space-y-3">{jobs.map(([role, company, location]) => <div key={role} className="rounded-2xl border border-slate-100 p-4"><b>{role}</b><p className="mt-1 text-sm text-slate-500">{company} · {location}</p></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 py-10"><div className="mx-auto max-w-7xl px-6 text-center"><p className="text-xs font-bold uppercase tracking-[.25em] text-slate-400">Built for the hospitality ecosystem</p><div className="mt-6 grid grid-cols-2 gap-5 text-sm font-bold text-slate-500 sm:grid-cols-5"><span>HOTELS</span><span>RESTAURANTS</span><span>RESORTS</span><span>CAFÉS</span><span>INSTITUTES</span></div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-24"><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Why Hospire</p><h2 className="mt-3 max-w-2xl text-4xl font-black sm:text-5xl">A professional network built around hospitality.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Generic job portals make hospitality hiring noisy. Hospire is designed around the people, roles and employers that make the industry work.</p><div className="mt-12 grid gap-6 md:grid-cols-3"><article className="rounded-3xl border p-8 shadow-sm"><b className="text-blue-700">01 · VERIFIED TALENT</b><h3 className="mt-5 text-xl font-black">Profiles employers can understand.</h3><p className="mt-3 leading-7 text-slate-600">Education, experience and hospitality credentials in one focused profile.</p></article><article className="rounded-3xl border p-8 shadow-sm"><b className="text-blue-700">02 · TRUSTED HIRING</b><h3 className="mt-5 text-xl font-black">A network built for employers.</h3><p className="mt-3 leading-7 text-slate-600">Give hospitality companies a focused place to discover relevant talent.</p></article><article className="rounded-3xl border p-8 shadow-sm"><b className="text-blue-700">03 · CAREER GROWTH</b><h3 className="mt-5 text-xl font-black">From student to professional.</h3><p className="mt-3 leading-7 text-slate-600">Help students and professionals discover the next step in their careers.</p></article></div></section>

      <section id="employers" className="bg-slate-50 py-24"><div className="mx-auto max-w-7xl px-6"><div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-blue-700">How it works</p><h2 className="mt-3 text-4xl font-black">Simple for both sides.</h2></div><div className="mt-12 grid gap-6 md:grid-cols-2"><div className="rounded-3xl bg-white p-8 shadow-sm"><b className="text-blue-700">FOR STUDENTS & PROFESSIONALS</b><div className="mt-7 grid gap-5 sm:grid-cols-3"><div><b>01</b><p className="mt-2 font-bold">Create profile</p></div><div><b>02</b><p className="mt-2 font-bold">Discover jobs</p></div><div><b>03</b><p className="mt-2 font-bold">Apply & grow</p></div></div></div><div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm"><b className="text-blue-300">FOR EMPLOYERS</b><div className="mt-7 grid gap-5 sm:grid-cols-3"><div><b>01</b><p className="mt-2 font-bold">Create company</p></div><div><b>02</b><p className="mt-2 font-bold">Post roles</p></div><div><b>03</b><p className="mt-2 font-bold">Find talent</p></div></div></div></div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-24"><div className="flex items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-700">Featured roles</p><h2 className="mt-3 text-4xl font-black">Opportunities that matter.</h2></div><Link href="/dashboard" className="font-bold text-blue-700">Browse jobs →</Link></div><div className="mt-10 grid gap-5 lg:grid-cols-3">{jobs.map(([role, company, location]) => <article key={role} className="rounded-3xl border p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 font-black text-white">H</div><h3 className="mt-6 text-xl font-black">{role}</h3><p className="mt-2 text-slate-500">{company}</p><span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{location}</span><Link href="/dashboard" className="mt-7 block rounded-xl bg-blue-700 py-3 text-center font-bold text-white">View opportunity</Link></article>)}</div></section>

      <section className="mx-6 mb-24 rounded-[2rem] bg-blue-700 text-center text-white"><div className="mx-auto max-w-4xl px-6 py-16"><p className="text-sm font-bold uppercase tracking-widest text-blue-200">Early access</p><h2 className="mt-4 text-4xl font-black sm:text-5xl">Be part of the first hospitality network built for India.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">We are onboarding our first hospitality professionals, students and employers. Join early and help shape the platform.</p><div className="mt-8 flex flex-wrap justify-center gap-4"><Link href="/dashboard" className="rounded-2xl bg-white px-7 py-4 font-bold text-blue-800">Join as Talent</Link><a href="#employers" className="rounded-2xl border border-white/30 px-7 py-4 font-bold">Join as Employer</a></div></div></section>

      <footer className="bg-slate-950 text-white"><div className="mx-auto max-w-7xl px-6 py-12"><div className="text-2xl font-black">Hospire</div><p className="mt-3 max-w-md text-slate-400">A professional network connecting hospitality talent, employers and institutes.</p><div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">© 2026 Hospire. Built for hospitality careers.</div></div></footer>
    </main>
  );
}
