export default function Categories() {
  const categories = [
    "👨‍🍳 Chef Jobs",
    "🍽️ Restaurant Jobs",
    "🏨 Hotel Jobs",
    "☕ Café Jobs",
    "🛎️ Front Office",
    "🍰 Bakery",
    "🍸 Bartender",
    "🧹 Housekeeping",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          Explore Career Categories
        </h2>

        <p className="mt-4 text-center text-slate-600">
          Find opportunities across every hospitality sector.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-lg font-semibold transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white hover:shadow-xl"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}