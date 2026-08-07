export default function Features() {
  const features = [
    {
      title: "Verified Hotels",
      desc: "Connect only with trusted hospitality brands.",
      icon: "🏨",
    },
    {
      title: "Top Culinary Jobs",
      desc: "Discover chef, bakery, F&B and hospitality careers.",
      icon: "👨‍🍳",
    },
    {
      title: "Student Community",
      desc: "Network with future chefs and hospitality professionals.",
      icon: "🎓",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold">
          Why Choose Hospire?
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-5xl">{feature.icon}</div>

              <h3 className="mt-6 text-2xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-600">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}