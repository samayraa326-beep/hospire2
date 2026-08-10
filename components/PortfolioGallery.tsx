"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type Work = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

const defaultWorks: Work[] = [
  {
    id: "signature-dish",
    title: "Signature Dish",
    category: "Culinary",
    description: "Showcase a dish, plating project, or practical culinary work.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900",
  },
  {
    id: "latte-art",
    title: "Latte Art",
    category: "Barista",
    description: "Cappuccino latte art created during practical training.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900",
  },
  {
    id: "bakery-creation",
    title: "Bakery Creation",
    category: "Bakery",
    description: "A handcrafted bakery project developed during training.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900",
  },
];

const STORAGE_KEY = "hospire-profile-portfolio";

export default function PortfolioGallery() {
  const [works, setWorks] = useState<Work[]>(defaultWorks);
  const [showForm, setShowForm] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Culinary");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Work[];
      if (Array.isArray(parsed) && parsed.length > 0) setWorks(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveWorks = (nextWorks: Work[]) => {
    setWorks(nextWorks);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextWorks));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const newWork: Work = {
      id: `${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      image:
        image ||
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900",
    };

    saveWorks([newWork, ...works]);
    setTitle("");
    setCategory("Culinary");
    setDescription("");
    setImage("");
    setImageName("");
    setShowForm(false);
  };

  const emptyState = useMemo(() => works.length === 0, [works.length]);

  return (
    <section className="mt-14">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Visual Portfolio
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Show Me What You Can Do.
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Your work speaks louder than a resume. Showcase dishes, coffee,
            bakery, internships and achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800"
        >
          + Add Your Work
        </button>
      </div>

      {showForm && (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Add your work</h3>
              <p className="mt-1 text-sm text-slate-500">
                Build a portfolio recruiters can actually review.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-3 py-2 text-slate-500 hover:bg-white hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="Project title"
              className="rounded-xl border border-slate-200 bg-white p-4 outline-none transition focus:border-blue-500"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white p-4 outline-none focus:border-blue-500"
            >
              <option>Culinary</option>
              <option>Barista</option>
              <option>Bakery</option>
              <option>Pastry</option>
              <option>Housekeeping</option>
              <option>Front Office</option>
              <option>Internship</option>
              <option>Achievement</option>
            </select>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              placeholder="Describe what you did, what you learned, or what makes this work special."
              className="h-32 rounded-xl border border-slate-200 bg-white p-4 outline-none transition focus:border-blue-500 md:col-span-2"
            />

            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 md:col-span-2">
              <label className="block cursor-pointer">
                <span className="font-semibold text-slate-800">Project image</span>
                <span className="mt-1 block text-sm text-slate-500">
                  Upload a photo of your dish, project, internship or achievement.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-4 block w-full text-sm"
                />
              </label>
              {imageName && (
                <p className="mt-2 text-sm font-medium text-blue-700">{imageName}</p>
              )}
            </div>

            {image && (
              <div className="overflow-hidden rounded-xl md:col-span-2">
                <img src={image} alt="Portfolio preview" className="h-56 w-full object-cover" />
              </div>
            )}

            <div className="flex gap-3 md:col-span-2 md:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Save Work
              </button>
            </div>
          </form>
        </div>
      )}

      {emptyState ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-lg font-semibold text-slate-800">Your portfolio is empty.</p>
          <p className="mt-2 text-slate-500">Add your first project to get started.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <article
              key={work.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={work.image}
                  alt={work.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-blue-700 shadow-lg">
                  {work.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">{work.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {work.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWork(work)}
                    className="font-semibold text-blue-700 hover:text-blue-900"
                  >
                    View Project →
                  </button>
                  <button
                    type="button"
                    onClick={() => saveWorks(works.filter((item) => item.id !== work.id))}
                    className="text-sm font-medium text-slate-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white">
        <h3 className="text-2xl font-bold">Your portfolio is your new resume.</h3>
        <p className="mt-2 text-slate-300">
          Add your best work and let recruiters discover your talent.
        </p>
      </div>

      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <img
              src={selectedWork.image}
              alt={selectedWork.title}
              className="h-72 w-full object-cover"
            />
            <div className="p-7">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                {selectedWork.category}
              </p>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                {selectedWork.title}
              </h3>
              <p className="mt-4 leading-7 text-slate-600">{selectedWork.description}</p>
              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                className="mt-7 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
              >
                Close Project
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
