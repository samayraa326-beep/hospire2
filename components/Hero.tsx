import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              India's Hospitality & Culinary Talent Network
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 lg:text-7xl">
              Build Your Career in Hospitality.
            </h1>

            <p className="mt-8 text-xl leading-9 text-slate-600">
              Hospire connects students, chefs, hotels, restaurants, cafés,
              resorts and hospitality leaders on one professional platform.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="rounded-xl bg-blue-700 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-800">
                Explore Jobs
              </button>

              <button className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold hover:bg-slate-100">
                Hire Talent
              </button>
            </div>

            <SearchBar />

            <div className="mt-12 flex flex-wrap gap-10">
              <div>
                <h2 className="text-3xl font-bold text-blue-700">500+</h2>
                <p className="text-slate-500">Hotels</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-700">15K+</h2>
                <p className="text-slate-500">Students</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-700">2500+</h2>
                <p className="text-slate-500">Jobs</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
                alt="Hospitality"
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}