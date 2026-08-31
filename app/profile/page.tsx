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
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");
      const { data, error: loadError } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (loadError) { setError(loadError.message); setLoading(false); return; }
      if (data) {
        setProfileId(data.id); setFullName(data.full_name || user.user_metadata?.full_name || "");
        setResumeUrl(data.resume_url || "");
        if (data.resume_url) setResumeName("Uploaded resume"); setPhone(data.phone || ""); setCity(data.city || ""); setInstitute(data.institute || ""); setCourse(data.course || ""); setGraduationYear(data.graduation_year || ""); setScore(data.score || ""); setRole(data.hospitality_role || ""); setPreferredCity(data.preferred_city || data.city || ""); setExperience(data.experience_years != null ? String(data.experience_years) : ""); setSalary(data.expected_salary || ""); setSkills((data.skills || []).join(", ")); setAbout(data.bio || "");
      } else setProfileId(user.id);
      setLoading(false);
    }
    load();
  }, []);

  async function handleResumeUpload(file: File) {
    setError(""); setResumeStatus(""); setResumeLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/"); return; }
      if (file.type !== "application/pdf") throw new Error("Please upload your resume as a PDF.");
      if (file.size > 8 * 1024 * 1024) throw new Error("Resume must be smaller than 8 MB.");
      const path = user.id + "/resume-" + Date.now() + ".pdf";
      const { error: uploadError } = await supabase.storage.from("resumes").upload(path, file, { contentType: "application/pdf", upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicData } = supabase.storage.from("resumes").getPublicUrl(path);
      setResumeUrl(publicData.publicUrl); setResumeName(file.name);
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += " " + content.items.map((item: any) => item.str || "").join(" ");
      }
      const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
      const phoneMatch = text.match(/(?:\+91[-\s]?)?[6-9]\d{9}/);
      const yearMatch = text.match(/(?:graduat(?:ed|ion)|passing|pass(?:ed)? out)[^\d]{0,30}(20\d{2})/i);
      const expMatch = text.match(/(?:experience|exp)[^\d]{0,20}(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/i);
      const roleMatch = text.match(/(?:role|designation|position|job title)[\s:,-]{0,8}([^\n|,]{3,45})/i);
      const eduMatch = text.match(/(?:education|qualification|institute|college|university)[\s:,-]{0,8}([^\n|]{3,70})/i);
      const skillsMatch = text.match(/skills?[\s:,-]{0,8}([^\n]{3,300})/i);
      if (emailMatch && !email) setEmail(emailMatch[0]);
      if (phoneMatch && !phone) setPhone(phoneMatch[0]);
      if (yearMatch && !graduationYear) setGraduationYear(yearMatch[1]);
      if (expMatch && !experience) setExperience(expMatch[1]);
      if (roleMatch && !role) setRole(roleMatch[1].trim());
      if (eduMatch && !institute) setInstitute(eduMatch[1].trim());
      if (skillsMatch && !skills) setSkills(skillsMatch[1].replace(/[|]/g, ",").trim());
      setResumeStatus("Resume uploaded. We filled the fields we could extract — please review them before saving.");
    } catch (e: any) {
      setError(e?.message || "Could not process this resume.");
    } finally { setResumeLoading(false); }
  }

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

  if (loading) return <main className="min-h-screen bg-[#f3efe7] p-8"><div className="mx-auto max-w-5xl rounded-3xl bg-[#fffdf8] p-10 text-center font-bold text-[#7b7265]">Loading your profile...</div></main>;

  return <main className="min-h-screen bg-[#f3efe7] px-4 py-8 sm:px-6 sm:py-10"><div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#fffdf8] shadow-xl">
    <header className="bg-gradient-to-br from-[#17130e] via-[#0b0a08] to-[#2a2117] p-7 text-white sm:p-10"><Link href="/" className="text-2xl font-black">Hospire</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[.24em] text-[#c9a45c]">Your professional profile</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Build a profile that speaks for you.</h1><p className="mt-3 max-w-2xl text-[#bdb6a9]">Upload your resume, complete your details, and let your work take center stage.</p></header>
    <div className="p-6 sm:p-10">
      {saved && <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-lg font-black text-emerald-900">🎉 Profile saved successfully!</p><p className="mt-1 text-sm text-emerald-800">Your next best step is to join the Hospire community and see what others are creating.</p><div className="mt-4 flex flex-wrap gap-3"><a href="#my-work" className="rounded-xl bg-[#17130e] px-4 py-3 text-sm font-black text-white">Add My Work →</a><Link href={`/profile/${profileId}`} className="rounded-xl border border-[#d8cdbb] bg-[#fffdf8] px-4 py-3 text-sm font-black text-[#17130e]">Preview My Profile</Link><Link href="/community" className="rounded-xl border border-[#d8cdbb] bg-[#fffdf8] px-4 py-3 text-sm font-black text-[#17130e]">Enter Community →</Link></div></div>}
      {error && <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
      <section className="mb-10 rounded-2xl border border-[#8f6b35]/50 bg-[#17130e] p-6 text-[#f6f1e7]">
<p className="text-xs font-semibold uppercase tracking-[.22em] text-[#c9a45c]">Start here</p>
<h2 className="mt-2 text-2xl font-semibold">Upload your resume</h2>
<p className="mt-2 max-w-2xl text-sm leading-6 text-[#bdb6a9]">We'll read the PDF and pre-fill relevant profile fields. Review everything before you save.</p>
<label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#c9a45c]/50 bg-white/5 px-5 py-7 text-center hover:bg-white/10">
<span className="text-lg font-semibold">{resumeLoading ? "Reading your resume…" : resumeName ? resumeName : "Choose PDF resume"}</span>
<span className="mt-1 text-xs text-[#bdb6a9]">{resumeLoading ? "Extracting profile details" : "PDF only · max 8 MB"}</span>
<input type="file" accept="application/pdf,.pdf" className="hidden" disabled={resumeLoading} onChange={e => { const file=e.target.files?.[0]; if(file) handleResumeUpload(file); }} />
</label>
{resumeStatus && <p className="mt-3 text-sm text-[#d8c28d]">{resumeStatus}</p>}
</section>
      <section><h2 className="text-2xl font-semibold tracking-tight">Your details</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Full name *" value={fullName} setValue={setFullName} placeholder="Your full name" /><label><span className="mb-2 block text-sm font-bold">Email</span><input value={email} readOnly className="w-full rounded-xl border border-[#d8cdbb] bg-[#f6f1e7] p-4 text-[#7b7265]" /></label><Field label="Phone number" value={phone} setValue={setPhone} placeholder="+91 XXXXX XXXXX" /><Field label="Current city" value={city} setValue={setCity} placeholder="Mumbai, Delhi, Bengaluru..." /></div></section>
      <section className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Education</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Institute name" value={institute} setValue={setInstitute} placeholder="Hotel management institute / college" /><Field label="Course" value={course} setValue={setCourse} placeholder="BHM, Culinary Arts, Bakery..." /><Field label="Graduation year" value={graduationYear} setValue={setGraduationYear} placeholder="2025" /><Field label="CGPA / Percentage" value={score} setValue={setScore} placeholder="8.2 CGPA / 82%" /></div></section>
      <section className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Career</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Role / specialization *" value={role} setValue={setRole} placeholder="Commis Chef, Barista, Front Office..." /><Field label="Preferred city" value={preferredCity} setValue={setPreferredCity} placeholder="Where would you like to work?" /><label><span className="mb-2 block text-sm font-bold">Experience (years)</span><input type="number" min="0" step="0.5" value={experience} onChange={e => setExperience(e.target.value)} className="w-full rounded-xl border border-[#d8cdbb] p-4" placeholder="0 for fresher" /></label><Field label="Expected salary (optional)" value={salary} setValue={setSalary} placeholder="₹25,000 / month" /></div></section>
      <section className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Skills</h2><p className="mt-1 text-sm text-[#7b7265]">Add the skills employers might search for. Separate them with commas.</p><textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="Bakery, Continental, Latte Art, Housekeeping, Front Office..." className="mt-5 h-32 w-full rounded-xl border border-[#d8cdbb] p-4" /></section>
      <section className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">About you</h2><textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Tell employers about your experience, strengths and the kind of hospitality work you enjoy..." className="mt-5 h-40 w-full rounded-xl border border-[#d8cdbb] p-4" /></section>
      <section id="my-work" className="mt-12"><h2 className="text-2xl font-semibold tracking-tight">Show your work</h2><p className="mt-1 text-sm text-[#7b7265]">Photos, videos, projects and achievements — let your work speak for you.</p><PortfolioGallery /></section>
      <div className="mt-12 border-t border-slate-100 pt-8"><button type="button" onClick={saveProfile} disabled={saving} className="w-full rounded-2xl bg-[#17130e] px-8 py-5 text-lg font-black text-white shadow-lg hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving your profile..." : "Save Profile & Continue →"}</button><p className="mt-3 text-center text-sm text-[#958b7d]">You can edit this profile anytime.</p></div>
    </div>
  </div></main>;
}

function Field({ label, value, setValue, placeholder }: { label: string; value: string; setValue: (value: string) => void; placeholder: string }) { return <label><span className="mb-2 block text-sm font-bold">{label}</span><input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[#d8cdbb] p-4 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" /></label>; }
