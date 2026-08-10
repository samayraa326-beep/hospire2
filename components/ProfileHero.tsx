export default function ProfileHero() {
  return (
    <section className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-500">

      <div className="h-44"></div>

      <div className="relative bg-white px-8 pb-8">

        <div className="-mt-16 flex flex-col items-center">

          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-5xl">
            👨‍🍳
          </div>

          <h1 className="mt-4 text-4xl font-bold">
            Your Name
          </h1>

          <p className="mt-2 text-slate-500">
            🎓 Your Institute • Future Hospitality Leader
          </p>

          <button className="mt-6 rounded-xl bg-blue-700 px-8 py-3 font-semibold text-white hover:bg-blue-800">
            Edit Portfolio
          </button>

        </div>

      </div>

    </section>
  );
}