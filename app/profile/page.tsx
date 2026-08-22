"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortfolioGallery from "../../components/PortfolioGallery";
import { createClient } from "../../lib/supabase/client";

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
  const [role, setRole] = useState("");
  const [preferredCity, setPreferredCity] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");
      const { data, error: loadError } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (loadError) { setError(loadError.message); setLoading(false); return; }
      if (data) {
        setProfileId(data.id); setFullName(data.full_name || user.user_metadata?.full_name || ""); setPhone(data.phone || ""); setCity(data.city || ""); setInstitute(data.institute || ""); setCourse(data.course || ""); setGraduationYear(data.graduation_year || ""); setScore(data.score || ""); setRole(data.hospitality_role || ""); setPreferredCity(data.preferred_city || data.city || ""); setExperience(data.experience_years != null ? String(data.experience_years) : ""); setSalary(data.expected_salary || ""); setSkills((data.skills || []).join(", ")); setAbout(data.bio || "");
      } else setProfileId(user.id);
      setLoading(false);
    }
    load();
  }, []);

  async function saveProfile() {
    setError(""); setSaved(false);
    if (!fullName.trim()) { setError("Please add your full name."); return; }
    if (!role.trim()) { setError("Please add the role you do or want to work in."); return; }
    const experienceNumber = experience.trim() ? Number(experience) : null;
    if (experienceNumber !== null && (!Number.isFinite(experienceNumber) || experienceNumber < 0)) { setError("Experience must be a valid number of years."); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/"); return; }
    const existing = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const accountRole = existing.data?.role || user.user_metadata?.role || "candidate";
    const { error: saveError } = await supabase.from("profiles").upsert({ id: user.id, full_name: fullName.trim(), role: accountRole, phone: phone.trim() || null, city: city.trim() || null, institute: institute.trim() || null, course: course.trim() || null, graduation_year: graduationYear.trim() || null, score: score.trim() || null, hospitality_role: role.trim(), headline: role.trim(), preferred_city: preferredCity.trim() || null, experience_years: experienceNumber, expected_salary: salary.trim() || null, skills: skills.split(",").map(s => s.trim()).filter(Boolean), bio: about.trim() || null, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (saveError) { setError(saveError.message); setSaving(false); return; }
    setProfileId(user.id); setSaved(true); setSaving(false);
    router.push("/community");
    router.refresh();
  }

  if (loading) return <main className="min-h-screen bg-slate-100 p-8"><div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 text-center font-bold text-slate-500">Loading your profile...</div></main>;

  return <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 sm:py-10"><div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl">
    <header className="bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 p-7 text-white sm:p-10"><Link href="/" className="text-2xl font-black">Hospire</Link><p className="mt-8 text-sm font-black uppercase tracking-[.2em] text-blue-300">Candidate profile</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">Build a profile employers remember.</h1><p className="mt-3 max-w-2xl text-slate-300">You do not need to complete everything today. Start with the essentials, save them, then add your best work.</p></header>
    <div className="p-6 sm:p-10">
      {saved && <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-lg font-black text-emerald-900">🎉 Profile saved successfully!</p><p className="mt-1 text-sm text-emerald-800">Your next best step is to join the Hospire community and see what others are creating.</p><div className="mt-4 flex flex-wrap gap-3"><a href="#my-work" className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white">Add My Work →</a><Link href={`/profile/${profileId}`} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900">Preview My Profile</Link><Link href="/community" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900">Enter Community →</Link></div></div>}
      {error && <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50 p-5"><p className="font-black text-slate-900">💡 What matters most?</p><p className="mt-1 text-sm leading-6 text-slate-600">Name + role + city + experience + skills first. Your portfolio is what will make the profile stand out.</p></div>
      <section><p className="text-sm font-black uppercase tracking-widest text-blue-700">1 · About you</p><h2 className="mt-2 text-2xl font-black">👤 Basic information</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Full name *" value={fullName} setValue={setFullName} placeholder="Your full name" /><label><span className="mb-2 block text-sm font-bold">Email</span><input value={email} readOnly className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-slate-500" /></label><Field label="Phone number" value={phone} setValue={setPhone} placeholder="+91 XXXXX XXXXX" /><Field label="Current city" value={city} setValue={setCity} placeholder="Mumbai, Delhi, Bengaluru..." /></div></section>
      <section className="mt-12"><p className="text-sm font-black uppercase tracking-widest text-blue-700">2 · Education</p><h2 className="mt-2 text-2xl font-black">🎓 Education</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Institute name" value={institute} setValue={setInstitute} placeholder="Hotel management institute / college" /><Field label="Course" value={course} setValue={setCourse} placeholder="BHM, Culinary Arts, Bakery..." /><Field label="Graduation year" value={graduationYear} setValue={setGraduationYear} placeholder="2025" /><Field label="CGPA / Percentage" value={score} setValue={setScore} placeholder="8.2 CGPA / 82%" /></div></section>
      <section className="mt-12"><p className="text-sm font-black uppercase tracking-widest text-blue-700">3 · Career</p><h2 className="mt-2 text-2xl font-black">💼 What do you do?</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Role / specialization *" value={role} setValue={setRole} placeholder="Commis Chef, Barista, Front Office..." /><Field label="Preferred city" value={preferredCity} setValue={setPreferredCity} placeholder="Where would you like to work?" /><label><span className="mb-2 block text-sm font-bold">Experience (years)</span><input type="number" min="0" step="0.5" value={experience} onChange={e => setExperience(e.target.value)} className="w-full rounded-xl border border-slate-200 p-4" placeholder="0 for fresher" /></label><Field label="Expected salary (optional)" value={salary} setValue={setSalary} placeholder="₹25,000 / month" /></div></section>
      <section className="mt-12"><p className="text-sm font-black uppercase tracking-widest text-blue-700">4 · Skills</p><h2 className="mt-2 text-2xl font-black">⭐ Your skills</h2><p className="mt-1 text-sm text-slate-500">Add the skills employers might search for. Separate them with commas.</p><textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="Bakery, Continental, Latte Art, Housekeeping, Front Office..." className="mt-5 h-32 w-full rounded-xl border border-slate-200 p-4" /></section>
      <section className="mt-12"><p className="text-sm font-black uppercase tracking-widest text-blue-700">5 · Your story</p><h2 className="mt-2 text-2xl font-black">📝 About me</h2><textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Tell employers about your experience, strengths and the kind of hospitality work you enjoy..." className="mt-5 h-40 w-full rounded-xl border border-slate-200 p-4" /></section>
      <section className="mt-12"><p className="text-sm font-black uppercase tracking-widest text-blue-700">6 · Resume</p><h2 className="mt-2 text-2xl font-black">📄 Resume</h2><div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6"><p className="font-bold text-slate-700">Resume is optional for now.</p><p className="mt-1 text-sm text-slate-500">Save your profile first. We will add a proper resume upload with file validation in the next production step.</p></div></section>
      <section id="my-work" className="mt-12"><p className="text-sm font-black uppercase tracking-widest text-blue-700">7 · My Work</p><h2 className="mt-2 text-2xl font-black">📸 Show your work</h2><p className="mt-1 text-sm text-slate-500">Add photos or videos of dishes, coffee, bakery, hotel operations, projects and achievements.</p><PortfolioGallery /></section>
      <div className="mt-12 border-t border-slate-100 pt-8"><button type="button" onClick={saveProfile} disabled={saving} className="w-full rounded-2xl bg-blue-700 px-8 py-5 text-lg font-black text-white shadow-lg hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving your profile..." : "Save Profile & Continue →"}</button><p className="mt-3 text-center text-sm text-slate-400">You can edit this profile anytime.</p></div>
    </div>
  </div></main>;
}

function Field({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (value: string) => void; placeholder: string }) { return <label><span className="mb-2 block text-sm font-bold">{label}</span><input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" /></label>; }
