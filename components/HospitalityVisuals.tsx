const scenes = [
  {
    title: "Welcome",
    role: "Guest experience",
    image: "https://images.pexels.com/photos/37680832/pexels-photo-37680832.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Create",
    role: "Culinary",
    image: "https://images.pexels.com/photos/30660319/pexels-photo-30660319.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Serve",
    role: "Food & beverage",
    image: "https://images.pexels.com/photos/30622044/pexels-photo-30622044.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Connect",
    role: "Front office",
    image: "https://images.pexels.com/photos/5378703/pexels-photo-5378703.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Craft",
    role: "Bar & beverage",
    image: "https://images.pexels.com/photos/14161920/pexels-photo-14161920.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function HospitalityVisuals() {
  return (
    <section className="border-y border-[#8f6b35]/35 bg-[#0b0a08] py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#c9a45c]">Hospitality in motion</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#f4efe5]">The people behind the experience.</h2>
          </div>
          <div className="hidden h-px w-24 bg-[#c9a45c]/60 sm:block" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {scenes.map((scene, index) => (
            <div key={scene.title} className={`group relative overflow-hidden border border-[#8f6b35]/35 bg-[#17130e] ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}>
              <img src={scene.image} alt={`${scene.title} — ${scene.role}`} className="aspect-[4/5] h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pb-4 pt-12">
                <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#c9a45c]">{scene.role}</p>
                <p className="mt-1 text-lg font-semibold text-white">{scene.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
