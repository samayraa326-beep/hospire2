export default function SearchBar() {
  return (
    <div className="mt-10 rounded-2xl bg-white p-3 shadow-2xl">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="🔍 Job title (Chef, Barista...)"
          className="rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600"
        />

        <input
          type="text"
          placeholder="📍 Location"
          className="rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600"
        />

        <select className="rounded-xl border border-slate-200 p-4 outline-none focus:border-blue-600">
          <option>Experience</option>
          <option>Fresher</option>
          <option>1–3 Years</option>
          <option>3–5 Years</option>
          <option>5+ Years</option>
        </select>

        <button className="rounded-xl bg-blue-700 p-4 font-semibold text-white transition hover:bg-blue-800">
          Search Jobs
        </button>
      </div>
    </div>
  );
}