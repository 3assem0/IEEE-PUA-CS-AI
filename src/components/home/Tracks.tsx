import { Globe, Bot, Cpu } from "lucide-react";

const tracks = [
  {
    id: "web",
    title: "Web (UI To Code)",
    icon: Globe,
    description: "Build innovative web applications using modern technologies.",
    rules: "Teams of 1–3 members. Projects must be original work created during the competition period.",
    blobClass: "blob-blue",
  },
  {
    id: "ai",
    title: "AI (OCR)",
    icon: Bot,
    description: "Develop AI & ML solutions for real-world problems.",
    rules: "Teams of 1–3 members. Use of pre-trained models allowed with proper disclosure.",
    blobClass: "blob-green",
  },
  {
    id: "robotics",
    title: "Robotics (Sumo Fight)",
    icon: Cpu,
    description: "Build autonomous robots for a sumo-style competition.",
    rules: "Teams of 3–5 members. Robot weight and size limits apply. Autonomous operation required.",
    blobClass: "blob-pink",
  },
];

export default function Tracks() {
  return (
    <section id="tracks" className="relative py-32 overflow-hidden">
      <div className="blob blob-green w-[500px] h-[500px] -bottom-40 -left-40 opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-[#BCBCBC] uppercase mb-6">Competition tracks</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <h2 className="serif text-[clamp(2.2rem,4vw,3.5rem)] leading-tight text-[#393737]">
            Choose your<br /><span className="italic">battlefield</span>
          </h2>
          <p className="text-[#888787] max-w-sm text-sm leading-relaxed">
            Whether you excel in software, AI, or hardware engineering, there is a track designed for your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group bg-white border border-black/[0.06] rounded-3xl p-8 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Blob per card */}
              <div className={`blob ${track.blobClass} w-56 h-56 -top-10 -right-10 opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#F7F7F7] border border-black/[0.06] flex items-center justify-center mb-6">
                  <track.icon className="w-5 h-5 text-[#393737]" strokeWidth={1.5} />
                </div>

                <h3 className="font-semibold text-[#393737] text-lg mb-3">{track.title}</h3>
                <p className="text-sm text-[#888787] leading-relaxed mb-6">{track.description}</p>

                <div className="pt-5 border-t border-black/[0.04]">
                  <p className="text-xs font-medium text-[#393737] mb-1.5">Rules</p>
                  <p className="text-xs text-[#888787] leading-relaxed">{track.rules}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
