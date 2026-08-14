export default function PortfolioGallery() {
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

  return (
    <section className="mt-14">

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

        <button className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800">
          + Add Your Work
        </button>

      </div>

      {/* Gallery */}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {works.map((work) => (
          <div
            key={work.title}
            className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >

            {/* Image */}

            <div className="relative h-72 overflow-hidden">

              <img
                src={work.image}
                alt={work.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

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