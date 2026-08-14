"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

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
          "full_name, phone, city, institute, headline, bio, hospitality_role, experience_years, skills"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
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
  }, [router, supabase]);

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  };

  const completionItems = [
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

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!city.trim()) {
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

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: name.trim(),
        phone: phone.trim() || null,
        city: city.trim() || null,
        institute: institute.trim() || null,
        headline: headline.trim() || null,
        bio: bio.trim() || null,
        hospitality_role: hospitalityRole || null,
        experience_years: experienceYears
          ? Number(experienceYears)
          : null,
        skills,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

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
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-black">Hospire</div>
          <p className="mt-2 text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-black tracking-tight">
              Hospire
            </div>
            <p className="text-xs text-slate-500">
              Hospitality careers, built on trust.
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-500">
            Profile setup
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Candidate onboarding
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Build your hospitality profile.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-500">
            Tell hotels and hospitality companies what you can do,
            where you're based, and what kind of opportunity you're
            looking for.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-slate-900">
                Profile completion
              </p>
              <p className="mt-1 text-sm text-slate-500">
                A complete profile gets more attention from employers.
              </p>
            </div>

            <div className="text-2xl font-black text-blue-700">
              {completion}%
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-700 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black">1. About you</h2>
            <p className="mt-1 text-sm text-slate-500">
              Basic information employers need to know.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-bold">
                  Full name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                  placeholder="Your college or institute"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black">2. Hospitality career</h2>
            <p className="mt-1 text-sm text-slate-500">
              Help employers understand your professional direction.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Professional headline
                </span>

                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
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
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
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
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                  placeholder="Tell employers about your hospitality interests, strengths, training and career goals..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black">3. Your skills</h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the skills that best represent you.
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
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    {selected ? "✓ " : ""}
                    {skill}
                  </button>
                );
              })}
            </div>
          </section>

          {error && (
            <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-2xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-blue-700 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving profile..." : "Save & continue"}
          </button>
        </form>
      </section>
    </main>
  );
}