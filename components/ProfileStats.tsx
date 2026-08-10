export default function ProfileStats() {
  const stats = [
    { value: "82%", label: "Portfolio Complete" },
    { value: "0", label: "Applications" },
    { value: "0", label: "Recruiter Views" },
    { value: "0", label: "Interviews" },
  ];

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-3xl bg-white p-6 text-center shadow-lg"
        >
          <h3 className="text-3xl font-bold text-blue-700">
            {stat.value}
          </h3>

          <p className="mt-2 text-slate-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}