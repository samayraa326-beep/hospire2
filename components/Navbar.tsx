export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-3xl font-bold text-blue-600">Hospire</h1>

        <nav className="hidden gap-8 md:flex">
          <a href="#" className="hover:text-blue-600">Jobs</a>
          <a href="#" className="hover:text-blue-600">Hotels</a>
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </nav>

        <div className="flex gap-3">
          <button className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}