const About = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="overflow-hidden rounded-[2rem] border border-[#1E4E2B]/20 bg-gradient-to-br from-[#FFF8EA] via-[#FFFDF7] to-[#F5FAF1] shadow-[0_20px_60px_-30px_rgba(29,78,45,0.45)]">
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9A3412]">About Us</p>
            <h1
              className="mt-3 text-4xl font-semibold leading-tight text-[#1F2A1F] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Rooted in Soil, Built on Trust
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#2D3A2D] sm:text-xl sm:leading-9">
              AARANYA is a family-run farm growing seasonal vegetables with clean practices,
              honest sourcing, and zero compromise on freshness.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#2D3A2D] sm:text-xl sm:leading-9">
              We work directly with households so families receive farm-fresh produce with full confidence in
              quality, consistency, and care.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:grid-cols-3">
              <article className="rounded-2xl border border-[#14532D]/20 bg-white/80 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-[#14532D] sm:text-3xl">100%</p>
                <p className="mt-1 text-sm font-medium text-[#2D3A2D]">Freshly sourced</p>
              </article>
              <article className="rounded-2xl border border-[#14532D]/20 bg-white/80 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-[#14532D] sm:text-3xl">Daily</p>
                <p className="mt-1 text-sm font-medium text-[#2D3A2D]">Harvest checks</p>
              </article>
              <article className="rounded-2xl border border-[#14532D]/20 bg-white/80 p-4 backdrop-blur col-span-2 sm:col-span-1">
                <p className="text-2xl font-bold text-[#14532D] sm:text-3xl">Local</p>
                <p className="mt-1 text-sm font-medium text-[#2D3A2D]">Farm to home</p>
              </article>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full overflow-hidden rounded-3xl border border-[#14532D]/20 bg-[#F7FCEB] p-3 shadow-xl">
              <img
                src="/image.png"
                alt="AARANYA"
                className="h-[280px] w-full rounded-2xl object-cover sm:h-[360px] lg:h-[520px]"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#14532D]/15 bg-[#F8FCEB] px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="rounded-2xl bg-white/90 p-5">
              <h2 className="text-xl font-semibold text-[#1F2A1F]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our Promise
              </h2>
              <p className="mt-2 text-base leading-7 text-[#2D3A2D]">
                Safe, clean, and naturally grown produce for every home.
              </p>
            </article>
            <article className="rounded-2xl bg-white/90 p-5">
              <h2 className="text-xl font-semibold text-[#1F2A1F]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our Method
              </h2>
              <p className="mt-2 text-base leading-7 text-[#2D3A2D]">
                Seasonal farming, careful sorting, and same-day dispatch workflows.
              </p>
            </article>
            <article className="rounded-2xl bg-white/90 p-5">
              <h2 className="text-xl font-semibold text-[#1F2A1F]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our Goal
              </h2>
              <p className="mt-2 text-base leading-7 text-[#2D3A2D]">
                Build a trusted farm brand that families return to every week.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
