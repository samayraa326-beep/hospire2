export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <div className="mx-auto max-w-7xl">

        <h1 className="text-4xl font-bold">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Let's build your hospitality career.
        </p>

        {/* Profile Completion */}

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Profile Completion
              </h2>

              <p className="text-slate-500">
                Complete your profile to get noticed by recruiters.
              </p>

            </div>

            <span className="text-3xl font-bold text-blue-700">
              40%
            </span>

          </div>

          <div className="mt-6 h-4 rounded-full bg-slate-200">

            <div className="h-4 w-2/5 rounded-full bg-blue-700"></div>

          </div>

        </div>

        {/* Quick Actions */}

        <h2 className="mt-12 text-3xl font-bold">
          Quick Actions
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <button className="rounded-3xl bg-white p-8 text-left shadow-lg hover:-translate-y-1 transition">
            📄
            <h3 className="mt-4 text-xl font-bold">
              Upload Resume
            </h3>
          </button>

          <button className="rounded-3xl bg-white p-8 text-left shadow-lg hover:-translate-y-1 transition">
            👤
            <h3 className="mt-4 text-xl font-bold">
              Edit Profile
            </h3>
          </button>

          <button className="rounded-3xl bg-white p-8 text-left shadow-lg hover:-translate-y-1 transition">
            💼
            <h3 className="mt-4 text-xl font-bold">
              Browse Jobs
            </h3>
          </button>

          <button className="rounded-3xl bg-white p-8 text-left shadow-lg hover:-translate-y-1 transition">
            📨
            <h3 className="mt-4 text-xl font-bold">
              My Applications
            </h3>
          </button>

        </div>

        {/* Recent Jobs */}

        <h2 className="mt-14 text-3xl font-bold">
          Recommended Jobs
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <h3 className="text-2xl font-bold">
              Commis Chef
            </h3>

            <p className="mt-2 text-slate-500">
              Taj Hotels • Mumbai
            </p>

            <button className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-white">
              Apply Now
            </button>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow-lg">

            <h3 className="text-2xl font-bold">
              Front Office Associate
            </h3>

            <p className="mt-2 text-slate-500">
              Marriott • Pune
            </p>

            <button className="mt-6 rounded-xl bg-blue-700 px-6 py-3 text-white">
              Apply Now
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}