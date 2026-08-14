"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

type Profile = {
  full_name: string | null;
  profile_photo_url: string | null;
  institute: string | null;
  headline: string | null;
  bio: string | null;
  city: string | null;
  hospitality_role: string | null;
  experience_years: number | null;
  skills: string[] | null;
  is_verified: boolean | null;
};

export default function ProfileHero() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, profile_photo_url, institute, headline, bio, city, hospitality_role, experience_years, skills, is_verified"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile loading error:", error);
      }

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white shadow-xl">
        <p className="text-blue-100">
          Loading your profile...
        </p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white shadow-xl">
        <p className="text-blue-100">
          Your profile information is not available yet.
        </p>
      </section>
    );
  }

  const name =
    profile.full_name?.trim() || "Hospire Member";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const headline =
    profile.headline ||
    profile.hospitality_role ||
    "Hospitality Professional";

  const bio =
    profile.bio ||
    "Building my hospitality career with Hospire.";

  // Calculate profile strength
  const profileFields = [
    profile.full_name,
    profile.profile_photo_url,
    profile.institute,
    profile.headline,
    profile.bio,
    profile.city,
    profile.hospitality_role,
    profile.experience_years !== null &&
      profile.experience_years !== undefined,
  ];

  const completedFields = profileFields.filter(Boolean).length;

  const hasSkills =
    Array.isArray(profile.skills) &&
    profile.skills.length > 0;

  const profileStrength = Math.min(
    completedFields * 10 + (hasSkills ? 10 : 0),
    100
  );

  return (
    <section className="rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white shadow-xl">

      <div className="flex flex-col gap-8 md:flex-row md:items-center">

        {/* Profile Photo */}

        <div className="flex-shrink-0">

          {profile.profile_photo_url ? (
            <img
              src={profile.profile_photo_url}
              alt={name}
              className="h-32 w-32 rounded-full border-4 border-white/30 object-cover shadow-xl"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-5xl font-bold shadow-xl backdrop-blur">
              {initials}
            </div>
          )}

        </div>

        {/* Candidate Information */}

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-4xl font-extrabold">
              {name}
            </h1>

            <span className="rounded-full bg-green-400/20 px-4 py-2 text-sm font-semibold text-green-100">
              🟢 Available
            </span>

            {profile.is_verified && (
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-blue-50">
                ✓ Verified
              </span>
            )}

          </div>

          <p className="mt-2 text-xl font-medium text-blue-100">
            {headline}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-blue-100">

            {profile.institute && (
              <span>
                🎓 {profile.institute}
              </span>
            )}

            {profile.city && (
              <span>
                📍 {profile.city}, India
              </span>
            )}

            {profile.hospitality_role && (
              <span>
                🍳 {profile.hospitality_role}
              </span>
            )}

          </div>

          <p className="mt-6 max-w-2xl text-base leading-7 text-blue-50">
            {bio}
          </p>

        </div>

      </div>

      {/* Profile Strength */}

      <div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-blue-100">
              Profile Strength
            </p>

            <p className="mt-1 text-lg font-bold">
              {profileStrength >= 80
                ? "Looking great to recruiters"
                : profileStrength >= 50
                ? "Getting noticed by recruiters"
                : "Keep building your profile"}
            </p>
          </div>

          <span className="text-2xl font-bold">
            {profileStrength}%
          </span>

        </div>

        <div className="mt-4 h-3 rounded-full bg-white/20">

          <div
            className="h-3 rounded-full bg-white transition-all duration-700"
            style={{
              width: `${profileStrength}%`,
            }}
          />

        </div>

      </div>

    </section>
  );
}