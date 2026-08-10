export default function PortfolioGallery() {
  const works = [
    {
      title: "Signature Dish",
      category: "Culinary",
      emoji: "🍽️",
    },
    {
      title: "Latte Art",
      category: "Coffee",
      emoji: "☕",
    },
    {
      title: "Bakery Creation",
      category: "Bakery",
      emoji: "🍰",
    },
  ];

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            🍽 Featured Work
          </h2>

          <p className="mt-2 text-slate-500">
            Show recruiters what you can actually create.
          </p>
        </div>

        <button className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
          + Add Work
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <div
            key={work.title}
            className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex h-64 items-center justify-center bg-slate-100 text-7xl transition group-hover:scale-105">
              {work.emoji}
            </div>

            <div className="p-6">
              <p className="text-sm font-semibold text-blue-700">
                {work.category}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {work.title}
              </h3>

              <button className="mt-5 text-sm font-semibold text-slate-500 hover:text-blue-700">
                View Work →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}