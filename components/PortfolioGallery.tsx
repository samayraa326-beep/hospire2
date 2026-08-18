 "use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
export default function PortfolioGallery() {
  const supabase = createClient();
  const [savedWorks, setSavedWorks] = useState<any[]>([]);
const [loadingWorks, setLoadingWorks] = useState(true);
const [showAddWork, setShowAddWork] = useState(false);
const [title, setTitle] = useState("");
const [category, setCategory] = useState("Culinary");
const [description, setDescription] = useState("");
const [skills, setSkills] = useState("");
const [mediaFile, setMediaFile] = useState<File | null>(null);
const [saving, setSaving] = useState(false);
const [formError, setFormError] = useState("");
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
      setSaving(false);
      return;
    }

    const fileExtension = mediaFile.name.split(".").pop() || "file";
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(filePath, mediaFile);

    if (uploadError) {
      setFormError(uploadError.message);
      setSaving(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(filePath);

    const mediaType = mediaFile.type.startsWith("video/")
      ? "video"
      : "image";

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
      setSaving(false);
      return;
    }

    setSavedWorks((current) => [newWork, ...current]);

    setTitle("");
    setCategory("Culinary");
    setDescription("");
    setSkills("");
    setMediaFile(null);
    setShowAddWork(false);
  } catch (error) {
    setFormError(
      error instanceof Error ? error.message : "Something went wrong."
    );
  } finally {
    setSaving(false);
  }
}
const works = [
    {
      title: "Modern Indian Plating",
      category: "Culinary",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
      description:
        "Contemporary presentation inspired by traditional Indian flavours.",
    },
    {
      title: "Latte Art",
      category: "Barista",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900",
      description:
        "Cappuccino latte art created during practical training.",
    },
    {
      title: "Artisan Pastry",
      category: "Bakery",
      image:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900",
      description:
        "Handcrafted pastry project developed during bakery training.",
    },
    {
      title: "Signature Dessert",
      category: "Pastry",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900",
      description:
        "Dessert plating focused on colour, texture and presentation.",
    },
    {
      title: "Professional Kitchen",
      category: "Experience",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900",
      description:
        "Hands-on experience working in a professional kitchen.",
    },
    {
      title: "Culinary Competition",
      category: "Achievement",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900",
      description:
        "Participation in a culinary competition and practical challenge.",
    },
  ];
useEffect(() => {
  async function loadPortfolio() {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSavedWorks(data);
    }

    setLoadingWorks(false);
  }

  loadPortfolio();
}, []);
  return (
    <section className="mt-14">
      {showAddWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                  Living Portfolio
                </p>

                <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                  Add Your Work
                </h3>

                <p className="mt-2 text-slate-500">
                  Show recruiters something you actually created.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddWork(false)}
                className="rounded-full px-3 py-2 text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-8 space-y-5">

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Work title
                </span>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Modern Indian Plating"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Category
                </span>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                >
                  <option>Culinary</option>
                  <option>Bakery</option>
                  <option>Barista</option>
                  <option>Pastry</option>
                  <option>Front Office</option>
                  <option>Housekeeping</option>
                  <option>Experience</option>
                  <option>Achievement</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Tell your story
                </span>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you create? What did you learn?"
                  className="h-32 w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Skills used
                </span>

                <input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Plating, Indian Cuisine, Food Presentation"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Add photo or video
                </span>

                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-slate-200 p-3"
                />
              </label>

              {formError && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {formError}
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveWork}
                disabled={saving}
                className="w-full rounded-xl bg-blue-700 px-5 py-4 font-black text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save to my profile"}
              </button>

            </div>
          </div>
        </div>
      )}
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Visual Portfolio
          </p>

          <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
            Show Me What You Can Do.
          </h2>

          <p className="mt-3 max-w-2xl text-slate-500">
            Your work speaks louder than a resume. Showcase dishes,
            plating, coffee, bakery, internships and achievements.
          </p>
        </div>

        <button
  type="button"
  onClick={() => setShowAddWork(true)}
  className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800"
>
  + Add Your Work
</button>

      </div>

      {/* Gallery */}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {(savedWorks.length > 0 ? savedWorks : works).map((work) => (
          <div
            key={work.title}
            className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            {/* Image */}

            <div className="relative h-72 overflow-hidden">

              {work.media_type === "video" ? (
  <video
    src={work.media_url}
    controls
    playsInline
    className="h-full w-full object-cover"
  />
) : (
  <img
    src={work.media_url || work.image}
    alt={work.title}
    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
  />
)}

              <div className="absolute left-4 top-4">
                <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-blue-700 shadow-lg">
                  {work.category}
                </span>
              </div>

            </div>

            {/* Information */}

            <div className="p-6">

              <h3 className="text-2xl font-bold text-slate-900">
                {work.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {work.description}
              </p>

              <button className="mt-5 font-semibold text-blue-700 hover:text-blue-900">
                View Project →
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* Bottom CTA */}

      <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <h3 className="text-2xl font-bold">
              Your portfolio is your new resume.
            </h3>

            <p className="mt-2 text-slate-300">
              Add your best work and let recruiters discover your talent.
            </p>
          </div>

          <button className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-100">
            Build Portfolio
          </button>

        </div>

      </div>

    </section>
  );
}