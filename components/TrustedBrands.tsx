export default function TrustedBrands() {
  const brands = [
    "Luxury Hotels",
    "Fine Dining",
    "Resorts",
    "Cafés",
    "Cloud Kitchens",
    "Cruise Hospitality",
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-4xl font-bold text-slate-900">
          Trusted Across Hospitality
        </h2>

        <p className="mt-4 text-center text-slate-600">
          Connecting talent with India's leading hospitality businesses.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center font-semibold shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {brand}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}