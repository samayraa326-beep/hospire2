"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

type PortfolioGalleryProps = {
  profileId?: string;
};

type PortfolioItem = {
  id: string;
  profile_id: string;
  title: string;
  category: string;
  description: string | null;
  skills: string | null;
  media_type: "image" | "video" | string;
  media_url: string | null;
  image_url: string | null;
  created_at: string;
};

export default function PortfolioGallery({ profileId }: PortfolioGalleryProps) {
  const supabase = createClient();
  const [savedWorks, setSavedWorks] = useState<PortfolioItem[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [showAddWork, setShowAddWork] = useState(false);
  const [selectedWork, setSelectedWork] = useState<PortfolioItem | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Culinary");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      setLoadingWorks(true);
      setLoadError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) {
          setSavedWorks([]);
          setLoadError("Please log in to view this portfolio.");
          setLoadingWorks(false);
        }
        return;
      }

      // A supplied profileId is used when viewing another person's profile.
      // Otherwise the authenticated user's own profile is shown.
      const targetProfileId = profileId ?? user.id;

      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("profile_id", targetProfileId)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          setSavedWorks([]);
          setLoadError(error.message);
        } else {
          setSavedWorks((data ?? []) as PortfolioItem[]);
        }
        setLoadingWorks(false);
      }
    }

    loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, [profileId]);

  async function handleSaveWork() {
    setFormError("");

    if (!title.trim()) {
      setFormError("Please enter a work title.");
      return;
    }

    if (!mediaFile) {
      setFormError("Please choose a photo or video.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setFormError("Please log in before adding work.");
        return;
      }

      // Users can only add work to their own profile.
      if (profileId && profileId !== user.id) {
        setFormError("You can only add work to your own profile.");
        return;
      }

      const fileExtension = mediaFile.name.split(".").pop() || "file";
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-media")
        .upload(filePath, mediaFile);

      if (uploadError) {
        setFormError(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("portfolio-media")
        .getPublicUrl(filePath);

      const mediaType = mediaFile.type.startsWith("video/") ? "video" : "image";

      const { data: newWork, error: insertError } = await supabase
        .from("portfolio_items")
        .insert({
          profile_id: user.id,
          title: title.trim(),
          category,
          description: description.trim(),
          skills: skills.trim(),
          media_type: mediaType,
          media_url: publicUrl,
        })
        .select()
        .single();

      if (insertError) {
        setFormError(insertError.message);
        return;
      }

      setSavedWorks((current) => [newWork as PortfolioItem, ...current]);
      setTitle("");
      setCategory("Culinary");
      setDescription("");
      setSkills("");
      setMediaFile(null);
      setShowAddWork(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const canAddWork = !profileId;

  return (
    <section className="mt-14">
      {showAddWork && canAddWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Living Portfolio</p>
                <h3 className="mt-2 text-3xl font-extrabold text-slate-900">Add Your Work</h3>
                <p className="mt-2 text-slate-500">Show recruiters something you actually created.</p>
              </div>
              <button type="button" onClick={() => setShowAddWork(false)} className="rounded-full px-3 py-2 text-2xl text-slate-400 hover:bg-slate-100">×</button>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Work title</span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Modern Indian Plating" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50">
                  <option>Culinary</option><option>Bakery</option><option>Barista</option><option>Pastry</option><option>Front Office</option><option>Housekeeping</option><option>Experience</option><option>Achievement</option><option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Tell your story</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you create? What did you learn?" className="h-32 w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Skills used</span>
                <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Plating, Indian Cuisine, Food Presentation" className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Add photo or video</span>
                <input type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)} className="w-full rounded-xl border border-slate-200 p-3" />
              </label>

              {formError && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{formError}</div>}

              <button type="button" onClick={handleSaveWork} disabled={saving} className="w-full rounded-xl bg-blue-700 px-5 py-4 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : "Save to my profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Visual Portfolio</p>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">Show Me What You Can Do.</h2>
          <p className="mt-3 max-w-2xl text-slate-500">Your work speaks louder than a resume. Showcase dishes, plating, coffee, bakery, internships and achievements.</p>
        </div>
        {canAddWork && (
          <button type="button" onClick={() => setShowAddWork(true)} className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800">+ Add Your Work</button>
        )}
      </div>

      {loadError && <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{loadError}</div>}

      {loadingWorks ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center text-slate-500 shadow-lg">Loading portfolio...</div>
      ) : savedWorks.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center text-slate-500 shadow-lg">No work added yet.</div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedWorks.map((work) => (
            <div key={work.id} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-72 overflow-hidden bg-slate-100">
                {work.media_type === "video" ? (
                  <video src={work.media_url ?? undefined} controls playsInline className="h-full w-full object-cover" />
                ) : (
                  <img src={work.media_url || work.image_url || ""} alt={work.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                )}
                <div className="absolute left-4 top-4"><span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-blue-700 shadow-lg">{work.category}</span></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">{work.title}</h3>
                {work.description && <p className="mt-3 text-sm leading-6 text-slate-500">{work.description}</p>}
                <button type="button" onClick={() => setSelectedWork(work)} className="mt-5 font-semibold text-blue-700 hover:text-blue-900">View Project →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button type="button" onClick={() => setSelectedWork(null)} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-4 py-2 text-2xl font-bold text-slate-600 shadow-lg">×</button>
            <div className="bg-slate-950">
              {selectedWork.media_type === "video" ? (
                <video src={selectedWork.media_url ?? undefined} controls autoPlay playsInline className="max-h-[60vh] w-full object-contain" />
              ) : (
                <img src={selectedWork.media_url || selectedWork.image_url || ""} alt={selectedWork.title} className="max-h-[60vh] w-full object-contain" />
              )}
            </div>
            <div className="p-6 sm:p-8">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">{selectedWork.category}</span>
              <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">{selectedWork.title}</h2>
              {selectedWork.description && <p className="mt-4 text-base leading-7 text-slate-600">{selectedWork.description}</p>}
              {selectedWork.skills && <div className="mt-6"><h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Skills Used</h3><div className="mt-3 flex flex-wrap gap-2">{selectedWork.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{skill}</span>)}</div></div>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
