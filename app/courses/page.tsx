import Link from "next/link";

const categories = [
  { icon: "👨‍🍳", title: "Culinary & Chef", text: "Chef training, kitchen skills, cuisines and professional culinary programs." },
  { icon: "☕", title: "Café & Barista", text: "Barista, café operations, coffee skills and specialty beverage programs." },
  { icon: "🍰", title: "Bakery & Pastry", text: "Baking, pastry, desserts and professional bakery training." },
  { icon: "🏨", title: "Hotel & Hospitality", text: "Front office, guest service, housekeeping and hospitality careers." },
  { icon: "🍽️", title: "Food & Beverage", text: "F&B service, restaurant operations and service excellence." },
  { icon: "📈", title: "Business & Entrepreneurship", text: "Learn how to start, manage and grow a café, restaurant or food business." },
];

const featured = [
  ["Professional Chef Program", "Culinary", "Learn professional kitchen fundamentals, food preparation and kitchen operations.", "Certification", "8 Weeks"],
  ["Barista & Café Skills", "Café & Barista", "Build practical coffee, beverage and café service skills for your first hospitality role.", "Certificate", "4 Weeks"],
  ["Start Your Café", "Business", "A practical program covering menu planning, costing, sourcing, staffing and daily operations.", "Business Program", "6 Weeks"],
  ["Bakery & Pastry Fundamentals", "Bakery & Pastry", "Learn core baking techniques, production discipline and pastry fundamentals.", "Certification", "6 Weeks"],
  ["Food Safety & Hygiene", "Certification", "Build industry-ready food safety, sanitation and safe food-handling knowledge.", "Certification", "2 Weeks"],
  ["Hotel Operations Essentials", "Hospitality", "Understand the fundamentals of hotel operations and professional guest service.", "Certificate", "5 Weeks"],
];

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/dashboard" className="text-2xl font-black tracking-tight text-slate-950">Hospire</Link>
          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/opportunities" className="text-sm font-bold text-slate-600 hover:text-blue-700">Opportunities</Link>
            <Link href="/discover" className="text-sm font-bold text-slate-600 hover:text-blue-700">Discover Talent</Link>
            <Link href="/courses" className="text-sm font-black text-blue-700">Courses & Certifications</Link>
            <Link href="/profile" className="text-sm font-bold text-slate-600 hover:text-blue-700">My Profile</Link>
          </nav>
          <Link href="/profile" className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-800">My Profile</Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 px-5 py-16 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[.22em] text-blue-300">Learn • Certify • Grow</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Courses & Certifications for your hospitality journey.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Discover practical programs from hospitality institutes, academies and industry trainers — whether you want your first job, a new skill or to build your own food business.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#courses" className="rounded-xl bg-white px-6 py-3.5 font-black text-slate-950 hover:bg-slate-100">Explore programs →</a>
            <a href="#institutes" className="rounded-xl border border-white/25 px-6 py-3.5 font-black text-white hover:bg-white/10">For institutes & trainers</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <p className="text-sm font-black uppercase tracking-widest text-blue-700">Explore by goal</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950">What do you want to learn?</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-5 text-xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              <a href="#courses" className="mt-5 inline-block text-sm font-black text-blue-700">View programs →</a>
            </div>
          ))}
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-700">Featured programs</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Find the right program for your next step.</h2>
          </div>
          <span className="text-sm font-bold text-slate-500">More institutes & programs coming soon</span>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map(([title, category, desc, credential, duration]) => (
            <article key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{category}</span>
                <span className="text-xs font-bold text-slate-400">{duration}</span>
              </div>
              <h3 className="mt-5 text-xl font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-black text-slate-700">🏆 {credential}</span>
                <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white">View details</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="institutes" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <p className="text-sm font-black uppercase tracking-widest text-blue-700">For institutes & industry trainers</p>
          <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-950">Have a course or certification program?</h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-500">Showcase your programs to people actively looking to build hospitality careers or start and grow food businesses. Hospire becomes your discovery and enrollment channel.</p>
            </div>
            <button className="rounded-xl bg-blue-700 px-6 py-3.5 font-black text-white hover:bg-blue-800">Partner with Hospire →</button>
          </div>
        </div>
      </section>
    </main>
  );
}
