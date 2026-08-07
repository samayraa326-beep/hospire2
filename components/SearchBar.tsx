export default function SearchBar() {
  return (
    <div className="mt-12 rounded-2xl bg-white p-4 shadow-2xl">
      <div className="grid gap-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Job Title (Chef, Barista, F&B...)"
          className="rounded-xl border p-4 outline-none"
        />

        <input
          type="text"
          placeholder="Location"
          className="rounded-xl border p-4 outline-none"
        />

        <select className="rounded-xl border p-4">
          <option>Experience</option>
          <option>Fresher</option>
          <option>1-3 Years</option>
          <option>3-5 Years</option>
          <option>5+ Years</option>
        </select>

        <button className="rounded-xl bg-blue-700 p-4 font-semibold text-white hover:bg-blue-800">
          Search Jobs
        </button>
      </div>
    </div>
  );
}