"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const hospitalityRoles = [
  "Front Office",
  "Food & Beverage",
  "Housekeeping",
  "Kitchen / Culinary",
  "Sales & Marketing",
  "Events",
  "Guest Relations",
  "Hotel Management",
  "Other",
];

const skillOptions = [
  "Customer Service",
  "Communication",
  "Front Office",
  "Food & Beverage",
  "Housekeeping",
  "Cooking",
  "Leadership",
  "Sales",
  "Event Management",
  "Teamwork",
];

function OnboardingContent() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();
  const [accountRole, setAccountRole] = useState<"candidate" | "employer">("candidate");
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAbout, setCompanyAbout] = useState("");
  const [hiringNeeds, setHiringNeeds] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [institute, setInstitute] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [hospitalityRole, setHospitalityRole] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "full_name, phone, city, institute, headline, bio, hospitality_role, experience_years, skills, role"
        )
        .eq("id", user.id)
        .maybeSingle();

      const roleFromUrl = searchParams.get("role");
      const detectedRole = profile?.role === "employer" || roleFromUrl === "employer" ? "employer" : "candidate";
      setAccountRole(detectedRole);
      if (profile) {
        // A profile row can exist automatically after signup. Only treat it as
        // "completed" when the essentials saved by onboarding are present.
        const profileComplete = Boolean(
          profile.full_name?.trim() &&
          profile.city?.trim() &&
          detectedRole === "employer" || profile.hospitality_role?.trim()
        );
        if (profileComplete) {
          const accountRole = (profile as { role?: string }).role ?? user.user_metadata?.role ?? "candidate";
          router.replace(detectedRole === "employer" ? "/dashboard?type=employer" : "/dashboard");
          return;
        }

        setName(profile.full_name ?? user.user_metadata?.full_name ?? "");
        setPhone(profile.phone ?? "");
        setCity(profile.city ?? "");
        setInstitute(profile.institute ?? "");
        setHeadline(profile.headline ?? "");
        setBio(profile.bio ?? "");
        setHospitalityRole(profile.hospitality_role ?? "");
        setExperienceYears(
          profile.experience_years !== null &&
            profile.experience_years !== undefined
            ? String(profile.experience_years)
            : ""
        );
        setSkills(profile.skills ?? []);
      } else {
        setName(user.user_metadata?.full_name ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router, supabase, searchParams]);

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  };

  const completionItems = accountRole === "employer" ? [companyName.trim(), companyType.trim(), companyCity.trim(), hiringNeeds.trim(), companyAbout.trim()] : [
    name.trim(),
    phone.trim(),
    city.trim(),
    institute.trim(),
    headline.trim(),
    bio.trim(),
    hospitalityRole,
    experienceYears,
    skills.length > 0 ? "yes" : "",
  ];

  const completion = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (accountRole === "candidate" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (accountRole === "candidate" && !city.trim()) {
      setError("Please enter your city.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session has expired. Please log in again.");
      setSaving(false);
      return;
    }

    if (accountRole === "employer") {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          role: "employer",
          company_name: companyName.trim(),
          company_type: companyType.trim(),
          company_city: companyCity.trim(),
          company_website: companyWebsite.trim(),
          hiring_needs: hiringNeeds.trim(),
          company_about: companyAbout.trim(),
        },
      });
      if (metadataError) { setError(metadataError.message); setSaving(false); return; }
    } else {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: name.trim(), phone: phone.trim() || null, city: city.trim() || null,
          institute: institute.trim() || null, headline: headline.trim() || null,
          bio: bio.trim() || null, hospitality_role: hospitalityRole || null,
          experience_years: experienceYears ? Number(experienceYears) : null,
          skills, updated_at: new Date().toISOString(),
        }).eq("id", user.id);
      if (updateError) { setError(updateError.message); setSaving(false); return; }
    }

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setMessage("Profile saved successfully!");

    setTimeout(() => {
      router.push("/profile");
      router.refresh();
    }, 700);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f1e7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-black">Hospire</div>
          <p className="mt-2 text-sm text-[#7b7265]">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1e7]">
      <nav className="border-b border-[#d8cdbb] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-black tracking-tight">
              Hospire
            </div>
            <p className="text-xs text-[#7b7265]">
              Hospitality careers, built on trust.
            </p>
          </div>

          <div className="text-sm font-semibold text-[#7b7265]">
            Profile setup
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#9a7337]">
            Profile setup
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17130e] sm:text-4xl">
            Create your professional profile.
          </h1>

          <p className="mt-4 max-w-2xl text-[#7b7265]">
            Tell hotels and hospitality companies what you can do,
            where you're based, and what kind of opportunity you're
            looking for.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-[#d8cdbb] bg-[#f3efe7] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-[#17130e]">
                Profile progress
              </p>
              <p className="mt-1 text-sm text-[#7b7265]">
                Complete the essentials to make your profile discoverable.
              </p>
            </div>

            <div className="text-2xl font-black text-[#9a7337]">
              {completion}%
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e9dfd0]">
            <div
              className="h-full rounded-full bg-[#17130e] transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {accountRole === "employer" ? (
            <>
              <section className="rounded-2xl border border-[#d8cdbb] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(42,33,23,.07)] sm:p-8">
                <h2 className="text-2xl font-semibold">Organization details</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label><span className="mb-2 block text-sm font-bold">Organization name</span><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="Hotel, restaurant, cruise line or organization" /></label>
                  <label><span className="mb-2 block text-sm font-bold">Organization type</span><input value={companyType} onChange={(e) => setCompanyType(e.target.value)} className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="Hotel / Restaurant / Cruise / Institute" /></label>
                  <label><span className="mb-2 block text-sm font-bold">City</span><input value={companyCity} onChange={(e) => setCompanyCity(e.target.value)} className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="Mumbai" /></label>
                  <label><span className="mb-2 block text-sm font-bold">Website</span><input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="https://..." /></label>
                </div>
              </section>
              <section className="rounded-2xl border border-[#d8cdbb] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(42,33,23,.07)] sm:p-8">
                <h2 className="text-2xl font-semibold">Hiring profile</h2>
                <div className="mt-6 space-y-5">
                  <label><span className="mb-2 block text-sm font-bold">What are you hiring for?</span><textarea value={hiringNeeds} onChange={(e) => setHiringNeeds(e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="Roles, departments, experience levels or talent you are looking for..." /></label>
                  <label><span className="mb-2 block text-sm font-bold">About your organization</span><textarea value={companyAbout} onChange={(e) => setCompanyAbout(e.target.value)} rows={5} className="w-full resize-none rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]" placeholder="Tell candidates what makes your organization a great place to work." /></label>
                </div>
              </section>
            </>
          ) : (
            <>
          <section className="rounded-2xl border border-[#d8cdbb] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(42,33,23,.07)] sm:p-8">
            <h2 className="text-2xl font-black">Your details</h2>
            <p className="mt-1 text-sm text-[#7b7265]">
              
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-bold">
                  Full name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  placeholder="Your full name"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">
                  Phone
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  placeholder="+91 98765 43210"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">
                  City
                </span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  placeholder="Mumbai"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-bold">
                  Institute / College
                </span>
                <input
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  placeholder="Your college or institute"
                />
              </label>
            </div>
          </section>
          <section className="rounded-2xl border border-[#d8cdbb] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(42,33,23,.07)] sm:p-8]">
            <h2 className="text-2xl font-black">Your career</h2>
            <p className="mt-1 text-sm text-[#7b7265]">
              
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Professional headline
                </span>

                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  placeholder="Hotel Management Student | Front Office Enthusiast"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-bold">
                    Preferred hospitality role
                  </span>

                  <select
                    value={hospitalityRole}
                    onChange={(e) =>
                      setHospitalityRole(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#d8cdbb] bg-[#fffdf8] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  >
                    <option value="">Select a role</option>

                    {hospitalityRoles.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold">
                    Experience
                  </span>

                  <select
                    value={experienceYears}
                    onChange={(e) =>
                      setExperienceYears(e.target.value)
                    }
                    className="w-full rounded-xl border border-[#d8cdbb] bg-[#fffdf8] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  >
                    <option value="">Select experience</option>
                    <option value="0">Student / Fresher</option>
                    <option value="0.5">Less than 1 year</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  About you
                </span>

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#d8cdbb] px-4 py-3.5 outline-none focus:border-[#a57b3b] focus:ring-4 focus:ring-[#eadfcf]"
                  placeholder="Tell employers about your hospitality interests, strengths, training and career goals..."
                />
              </label>
            </div>
          </section>
          <section className="rounded-2xl border border-[#d8cdbb] bg-[#fffdf8] p-6 shadow-[0_12px_40px_rgba(42,33,23,.07)] sm:p-8]">
            <h2 className="text-2xl font-black">Skills</h2>

            <p className="mt-1 text-sm text-[#7b7265]">
              
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {skillOptions.map((skill) => {
                const selected = skills.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                      selected
                        ? "border-[#9a7337] bg-[#17130e] text-white"
                        : "border-[#d8cdbb] bg-[#fffdf8] text-[#3d352b] hover:border-[#c9a45c]"
                    }`}
                  >
                    {selected ? "✓ " : ""}
                    {skill}
                  </button>
                );
              })}
            </div>
          </section>
            </>
          )}
          {error && <div className="rounded-2xl bg-[#f7ebe7] px-5 py-4 text-sm font-semibold text-[#8b3f31]">{error}</div>}
          {message && <div className="rounded-2xl bg-[#edf3ec] px-5 py-4 text-sm font-semibold text-[#35533c]">{message}</div>}
          <button type="submit" disabled={saving} className="w-full rounded-2xl bg-[#17130e] px-6 py-4 text-lg font-black text-white transition hover:bg-[#2a2117] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : accountRole === "employer" ? "Create hiring profile" : "Save & continue"}</button>
        </form>
      </section>
    </main>
  );
}

export default function OnboardingPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f6f1e7] flex items-center justify-center"><div className="text-center"><div className="text-3xl font-black">Hospire</div><p className="mt-2 text-sm text-[#7b7265]">Loading your profile...</p></div></main>}><OnboardingContent /></Suspense>;
}
