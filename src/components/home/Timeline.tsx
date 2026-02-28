const events = [
  { id: 1, phase: "Registration Opens",  date: "TBD", desc: "Online registration portal becomes active for all tracks.", active: true  },
  { id: 2, phase: "Workshop Series",     date: "TBD", desc: "Technical workshops for all registered participants to prepare.",   active: false },
  { id: 3, phase: "Registration Closes", date: "TBD", desc: "Final deadline for team registration. No late entries accepted.", active: false },
  { id: 4, phase: "Final Competition",   date: "TBD", desc: "Main competition day showcasing all tracks at the arena.",         active: false },
];

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-32 overflow-hidden">
      <div className="blob blob-pink w-[450px] h-[450px] top-0 right-0 opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-[#BCBCBC] uppercase mb-6">Roadmap</p>
        <h2 className="serif text-[clamp(2.2rem,4vw,3.5rem)] leading-tight text-[#393737] mb-16">
          Competition<br /><span className="italic">timeline</span>
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-black/[0.07] -translate-x-1/2" />

          <div className="space-y-12">
            {events.map((ev, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={ev.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Dot */}
                  <div className="absolute left-[19px] md:left-1/2 top-4 -translate-x-1/2 z-10">
                    <div className={`w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${ev.active ? "bg-[#393737]" : "bg-[#BCBCBC]"}`}>
                      {ev.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Left panel on desktop (even index) */}
                  <div className={`pl-10 md:pl-0 ${isLeft ? "md:pr-12 md:text-right" : "md:invisible"}`}>
                    {isLeft && (
                      <div className="bg-white border border-black/[0.06] rounded-2xl p-6 md:ml-auto max-w-sm">
                        <span className="inline-block text-xs font-medium text-[#BCBCBC] uppercase tracking-wider mb-2">{ev.date}</span>
                        <h3 className="font-semibold text-[#393737] mb-2">{ev.phase}</h3>
                        <p className="text-sm text-[#888787] leading-relaxed">{ev.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Right panel on desktop (odd index) */}
                  <div className={`pl-10 md:pl-12 ${!isLeft ? "" : "md:invisible hidden md:block"}`}>
                    {!isLeft && (
                      <div className="bg-white border border-black/[0.06] rounded-2xl p-6 max-w-sm">
                        <span className="inline-block text-xs font-medium text-[#BCBCBC] uppercase tracking-wider mb-2">{ev.date}</span>
                        <h3 className="font-semibold text-[#393737] mb-2">{ev.phase}</h3>
                        <p className="text-sm text-[#888787] leading-relaxed">{ev.desc}</p>
                      </div>
                    )}
                    {/* Mobile: always show on right col for odd */}
                    {isLeft && (
                      <div className="block md:hidden bg-white border border-black/[0.06] rounded-2xl p-6">
                        <span className="inline-block text-xs font-medium text-[#BCBCBC] uppercase tracking-wider mb-2">{ev.date}</span>
                        <h3 className="font-semibold text-[#393737] mb-2">{ev.phase}</h3>
                        <p className="text-sm text-[#888787] leading-relaxed">{ev.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
