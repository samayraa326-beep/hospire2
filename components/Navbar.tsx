import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-700 text-xl font-bold text-white shadow-lg">
            H
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Hospire
            </h1>
            <p className="-mt-1 text-xs text-slate-500">
              Hospitality & Culinary Network
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="#" className="font-medium text-slate-700 hover:text-blue-700">
            Jobs
          </Link>

          <Link href="#" className="font-medium text-slate-700 hover:text-blue-700">
            Hotels
          </Link>

          <Link href="#" className="font-medium text-slate-700 hover:text-blue-700">
            Students
          </Link>

          <Link href="#" className="font-medium text-slate-700 hover:text-blue-700">
            Institutes
          </Link>

          <Link href="#" className="font-medium text-slate-700 hover:text-blue-700">
            Community
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100">
            Login
          </button>

          <button className="rounded-xl bg-blue-700 px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-blue-800">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}