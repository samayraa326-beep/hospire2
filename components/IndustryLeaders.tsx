export default function IndustryLeaders() {
  const leaders = [
    {
      name: "Chef Rahul Kapoor",
      role: "Executive Chef",
      company: "Luxury Hotel",
      image: "👨‍🍳",
    },
    {
      name: "Ananya Sharma",
      role: "Hotel General Manager",
      company: "5-Star Resort",
      image: "🏨",
    },
    {
      name: "Rohit Mehta",
      role: "Restaurant Director",
      company: "Fine Dining",
      image: "🍽️",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-4xl font-bold text-slate-900">
          Meet Industry Leaders
        </h2>

        <p className="mt-4 text-center text-slate-600">
          Learn from professionals shaping hospitality and culinary careers.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-6xl">{leader.image}</div>

              <h3 className="mt-6 text-2xl font-bold">
                {leader.name}
              </h3>

              <p className="mt-2 text-blue-700 font-semibold">
                {leader.role}
              </p>

              <p className="text-slate-500">
                {leader.company}
              </p>

              <button className="mt-6 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}