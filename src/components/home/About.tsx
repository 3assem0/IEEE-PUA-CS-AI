import { Box, Code, Cpu, Globe } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Blob */}
      <div className="blob blob-blue w-[400px] h-[400px] top-10 -right-40 opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        {/* Section label */}
        <p className="text-xs font-semibold tracking-[0.15em] text-[#BCBCBC] uppercase mb-6">About the event</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="serif text-[clamp(2.2rem,4vw,3.5rem)] leading-tight text-[#393737] mb-6">
              Shaping the future<br />
              <span className="italic">of technology</span>
            </h2>
            <p className="text-[#888787] leading-relaxed mb-4">
              The IEEE Tech Pharos Competition is one of the most prestigious technical competitions in the region, bringing together the brightest minds from academic institutions across the country.
            </p>
            <p className="text-[#888787] leading-relaxed mb-8">
              Organized by the official IEEE Student Branch, our mission is to foster innovation, encourage practical problem solving, and give students a platform to showcase their technical capabilities.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "3",        label: "Competition tracks" },
                { value: "500+",     label: "Expected participants" },
                { value: "3 days",   label: "Of challenges" },
                { value: "∞",        label: "Possibilities" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white border border-black/[0.06] rounded-2xl px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                  <p className="text-2xl font-semibold text-[#393737]">{value}</p>
                  <p className="text-sm text-[#BCBCBC] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Abstract visual — bento blocks with "3D tech" elements */}
          <div className="grid grid-cols-2 gap-4">
            {/* Box 1: Code/Development */}
            <div className="h-48 bg-white border border-black/[0.06] rounded-3xl relative overflow-hidden group">
              <div className="blob blob-blue w-32 h-32 -top-4 -left-4 opacity-40 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#F7F7F7] p-4 rounded-2xl shadow-sm border border-black/[0.04] rotate-[-8deg] transform group-hover:rotate-0 transition-transform duration-500">
                  <Code className="w-8 h-8 text-[#393737]" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Box 2: Hardware/IoT */}
            <div className="h-48 bg-white border border-black/[0.06] rounded-3xl relative overflow-hidden translate-y-6 group">
              <div className="blob blob-green w-32 h-32 -bottom-4 -right-4 opacity-40 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#F7F7F7] p-4 rounded-2xl shadow-sm border border-black/[0.04] rotate-[5deg] transform group-hover:scale-110 transition-transform duration-500">
                  <Cpu className="w-10 h-10 text-[#393737]" strokeWidth={1.2} />
                </div>
              </div>
            </div>

            {/* Box 3: 3D/Space */}
            <div className="h-48 bg-white border border-black/[0.06] rounded-3xl relative overflow-hidden group">
              <div className="blob blob-pink w-32 h-32 -bottom-4 -left-4 opacity-40 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Box className="w-12 h-12 text-[#393737] relative z-10" strokeWidth={1.2} />
                  <div className="absolute -inset-2 bg-pink-400/10 blur-xl rounded-full group-hover:bg-pink-400/20 transition-colors" />
                </div>
              </div>

            </div>

            {/* Box 4: Global/Network */}
            <div className="h-48 bg-white border border-black/[0.06] rounded-3xl relative overflow-hidden translate-y-6 group">
              <div className="blob blob-gold w-32 h-32 -top-4 -right-4 opacity-40 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-16 h-16 text-[#393737]/10 animate-[spin_20s_linear_infinite]" strokeWidth={1} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
