"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortfolioSection from "../../components/PortfolioSection";
import { createClient } from "../../lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  institute: string | null;
  headline: string | null;
  bio: string | null;
  city: string | null;
  phone: string | null;
  hospitality_role: string | null;
  experience_years: number | null;
  skills: string[];
  resume_url: string | null;
};

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [institute, setInstitute] = useState("");
  const [course, setCourse] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [score, setScore] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/");
        return;
      }

      setEmail(user.email || "");
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id,full_name,role,institute,headline,bio,city,phone,hospitality_role,experience_years,skills,resume_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      if (data) {
        const profile = data as Profile;
        setProfileId(profile.id);
        setFullName(profile.full_name || user.user_metadata?.full_name || "");
        setPhone(profile.phone || "");
        setCity(profile.city || "");
        setInstitute(profile.institute || "");
        setPreferredRole(profile.hospitality_role || "");
        setPreferredCity(profile.city || "");
        setExperience(profile.experience_years != null ? String(profile.experience_years) : "");
        setSkills((profile.skills || []).join(", "));
        setAbout(profile.bio || "");
      } else {
        setFullName(user.user_metadata?.full_name || "");
        setProfileId(user.id);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function saveProfile() {
    setError("");
    setSaved(false);
    if (!fullName.trim()) {
      setError("Please add your full name before saving.");
      return;
    }
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/");
      return;
    }

    const experienceNumber = experience.trim() ? Number(experience) : null;
    if (experienceNumber !== null && (!Number.isFinite(experienceNumber) || experienceNumber < 0)) {
      setError("Experience must be a valid number of years.");
      setSaving(false);
      return;
    }

    const existing = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const role = existing.data?.role || user.user_metadata?.role || "candidate";

    const { error: saveError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim(),
      role,
      institute: institute.trim() || null,
      headline: preferredRole.trim() || null,
      bio: about.trim() || null,
      city: (preferredCity || city).trim() || null,
      phone: phone.trim() || null,
      hospitality_role: preferredRole.trim() || null,
      experience_years: experienceNumber,
      skills: skills.split(",").map((item) => item.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });

    if (saveError) {
      setError(saveError.message);
      setSaving(false);
      return;
    }

    setProfileId(user.id);
    setSaved(true);
    setSaving(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return <main className="min-h-screen bg-slate-100 p-8"><div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center font-bold text-slate-500">Loading your profile...</div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white shadow-xl">
        <header className="rounded-t-[2rem] bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 p-7 text-white sm:p-10">
          <Link href="/" className="text-2xl font-black">Hospire</Link>
          <p className="mt-8 text-sm font-black uppercase tracking-[.2em] text-blue-300">Build your professional profile</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Tell employers who you are.</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Keep it simple. Add the information that helps an employer understand your experience, skills and career goals.</p>
        </header>

        <div className="p-6 sm:p-10">
          {saved && <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-lg font-black text-emerald-900">🎉 Your profile is saved!</p><p className="mt-1 text-sm text-emerald-800">Now make it stronger by adding your best work.</p><div className="mt-4 flex flex-wrap gap-3"><a href="#my-work" className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white">Add My Work</a><Link href={profileId ? `/profile/${profileId}` : "/discover"} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900">Preview My Profile</Link><Link href="/discover" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900">Discover Talent</Link></div></div>}
          {error && <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

          <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="font-black text-slate-900">💡 You don't need to fill everything right now.</p><p className="mt-1 text-sm leading-6 text-slate-600">Start with your name, role, city, experience and skills. You can come back later and improve your portfolio.</p></div>

          <section>
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 1</p><h2 className="mt-1 text-2xl font-black">👤 About you</h2></div>
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className="mb-2 block text-sm font-bold">Full name *</span><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600" placeholder="Your full name" /></label>
              <label><span className="mb-2 block text-sm font-bold">Email</span><input value={email} readOnly className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-slate-500" /></label>
              <label><span className="mb-2 block text-sm font-bold">Phone number</span><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600" placeholder="+91 XXXXX XXXXX" /></label>
              <label><span className="mb-2 block text-sm font-bold">Current city</span><input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600" placeholder="Mumbai, Delhi, Bengaluru..." /></label>
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 2</p><h2 className="mt-1 text-2xl font-black">🎓 Education</h2><p className="mt-1 text-sm text-slate-500">Add your hospitality education if you have it.</p></div>
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className="mb-2 block text-sm font-bold">Institute name</span><input value={institute} onChange={(e) => setInstitute(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="Hotel management institute / college" /></label>
              <label><span className="mb-2 block text-sm font-bold">Course</span><input value={course} onChange={(e) => setCourse(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="BHM, Culinary Arts, Bakery..." /></label>
              <label><span className="mb-2 block text-sm font-bold">Graduation year</span><input value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="2025" /></label>
              <label><span className="mb-2 block text-sm font-bold">CGPA / Percentage</span><input value={score} onChange={(e) => setScore(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="8.2 CGPA / 82%" /></label>
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 3</p><h2 className="mt-1 text-2xl font-black">💼 Career</h2></div>
            <div className="grid gap-5 md:grid-cols-2">
              <label><span className="mb-2 block text-sm font-bold">What role are you looking for?</span><input value={preferredRole} onChange={(e) => setPreferredRole(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="Commis Chef, Barista, Front Office..." /></label>
              <label><span className="mb-2 block text-sm font-bold">Preferred city</span><input value={preferredCity} onChange={(e) => setPreferredCity(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="Where would you like to work?" /></label>
              <label><span className="mb-2 block text-sm font-bold">Experience (years)</span><input type="number" min="0" step="0.5" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="0 for fresher" /></label>
              <label><span className="mb-2 block text-sm font-bold">Expected salary <span className="font-normal text-slate-400">(optional)</span></span><input value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="₹25,000 / month" /></label>
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 4</p><h2 className="mt-1 text-2xl font-black">⭐ Skills</h2><p className="mt-1 text-sm text-slate-500">Separate skills with commas.</p></div>
            <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Bakery, Continental, Latte Art, Housekeeping, Front Office..." className="h-32 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600" />
          </section>

          <section className="mt-12">
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 5</p><h2 className="mt-1 text-2xl font-black">📝 About me</h2><p className="mt-1 text-sm text-slate-500">A short introduction helps employers understand you.</p></div>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Tell employers about your experience, strengths and what kind of hospitality work you enjoy..." className="h-40 w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600" />
          </section>

          <section className="mt-12">
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 6</p><h2 className="mt-1 text-2xl font-black">📄 Resume</h2><p className="mt-1 text-sm text-slate-500">You can add your resume later. Your profile and portfolio are more important for discovery.</p></div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">Resume upload will be available here. You can save your profile without it.</div>
          </section>

          <section id="my-work" className="mt-12">
            <div className="mb-5"><p className="text-sm font-black uppercase tracking-widest text-blue-700">Step 7</p><h2 className="mt-1 text-2xl font-black">📸 My Work</h2><p className="mt-1 text-sm text-slate-500">This is what makes your Hospire profile stand out. Add your best food, coffee, service, hotel or project work.</p></div>
            <PortfolioSection />
          </section>

          <div className="mt-12 border-t border-slate-100 pt-8">
            <button type="button" onClick={saveProfile} disabled={saving} className="w-full rounded-2xl bg-blue-700 px-8 py-5 text-lg font-black text-white shadow-lg transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving your profile..." : "Save Profile & Continue →"}</button>
            <p className="mt-3 text-center text-sm text-slate-400">You can edit your profile anytime.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
