import PortfolioGallery from "../../components/PortfolioGallery";
import ProfileStats from "../../components/ProfileStats";
import ProfileHero from "../../components/ProfileHero";
import PortfolioSection from "../../components/PortfolioSection";
export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl">

       <ProfileHero />
       <ProfileStats />
       <PortfolioGallery /> 
        {/* Personal Information */}

        <div className="mt-10">
          <h2 className="text-2xl font-bold">👤 Personal Information</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <input
              type="text"
              placeholder="Full Name"
              className="rounded-xl border p-4"
            />

            <input
              type="email"
              placeholder="Email"
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Current City"
              className="rounded-xl border p-4"
            />

          </div>
        </div>

        {/* Education */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            🎓 Education
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <input
              type="text"
              placeholder="Institute Name"
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Course"
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Graduation Year"
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="CGPA / Percentage"
              className="rounded-xl border p-4"
            />

          </div>

        </div>

        {/* Career */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            💼 Career Preferences
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <input
              type="text"
              placeholder="Preferred Role"
              className="rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Preferred City"
              className="rounded-xl border p-4"
            />

            <select className="rounded-xl border p-4">
              <option>Experience</option>
              <option>Fresher</option>
              <option>Internship</option>
              <option>1-3 Years</option>
            </select>

            <input
              type="text"
              placeholder="Expected Salary"
              className="rounded-xl border p-4"
            />

          </div>

        </div>

        {/* Skills */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            ⭐ Skills
          </h2>

          <textarea
            placeholder="Example: Bakery, Continental, Latte Art, Housekeeping, Front Office..."
            className="mt-6 h-36 w-full rounded-xl border p-4"
          />

        </div>

        {/* About */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            About Me
          </h2>

          <textarea
            placeholder="Tell recruiters about yourself..."
            className="mt-6 h-40 w-full rounded-xl border p-4"
          />

        </div>

        {/* Resume */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            📄 Resume
          </h2>

          <input
            type="file"
            className="mt-6 w-full rounded-xl border p-4"
          />

        </div>
<PortfolioSection />

        <button className="mt-12 rounded-xl bg-blue-700 px-10 py-4 text-lg font-semibold text-white hover:bg-blue-800">
          Save Profile
        </button>

      </div>
    </main>
  );
}