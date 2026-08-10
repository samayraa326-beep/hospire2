export default function PortfolioSection() {
  const categories = [
    {
      emoji: "🍽️",
      title: "Signature Dishes",
      desc: "Upload your best food creations",
    },
    {
      emoji: "☕",
      title: "Coffee & Latte Art",
      desc: "Show your coffee skills",
    },
    {
      emoji: "🍰",
      title: "Bakery & Desserts",
      desc: "Cakes, pastries and desserts",
    },
    {
      emoji: "🍸",
      title: "Beverages",
      desc: "Mocktails & cocktails",
    },
    {
      emoji: "🏨",
      title: "Hotel Operations",
      desc: "Rooms, service & housekeeping",
    },
    {
      emoji: "🎥",
      title: "Videos",
      desc: "Kitchen & service videos",
    },
  ];

  return (
    <section className="mt-14">
      <h2 className="text-3xl font-bold">
        🍽 My Hospitality Portfolio
      </h2>

      <p className="mt-2 text-slate-500">
        Show recruiters your work instead of just telling them.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition hover:border-blue-600 hover:bg-blue-50"
          >
            <div className="text-5xl">{item.emoji}</div>

            <h3 className="mt-6 text-2xl font-bold">
              {item.title}
            </h3>

            <p className="mt-3 text-slate-500">
              {item.desc}
            </p>

            <button className="mt-8 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800">
              + Upload
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}