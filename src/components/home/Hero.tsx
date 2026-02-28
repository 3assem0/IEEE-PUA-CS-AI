import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days:    Math.floor(diff / 864e5),
        hours:   Math.floor((diff / 36e5) % 24),
        minutes: Math.floor((diff / 6e4)  % 60),
        seconds: Math.floor((diff / 1e3)  % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

      {/* ── Watercolour mesh blobs ── */}
      <div className="blob blob-blue  w-[700px] h-[700px] -top-32 -left-60 opacity-70" />
      <div className="blob blob-green w-[500px] h-[500px] top-1/2 -right-40 opacity-60" />
      <div className="blob blob-pink  w-[400px] h-[400px] bottom-0 left-1/3  opacity-50" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* University logo */}
        <div className="mb-8 flex justify-center">
          <img src="/Pharos-University.png" alt="Pharos University" className="h-16 md:h-20 object-contain" />
        </div>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-black/[0.07] shadow-sm backdrop-blur-sm mb-10 text-sm text-[#888787]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          Registration is open
        </div>

        {/* Headline */}
        <h1 className="serif text-[clamp(3rem,7vw,6rem)] leading-[1.05] tracking-tight text-[#393737] mb-6">
          IEEE Tech Pharos<br />
          <span className="italic">Competition 2026</span>
        </h1>

        <p className="text-lg md:text-xl text-[#888787] max-w-2xl mx-auto leading-relaxed mb-10">
          Unleash your potential in Web Development, AI, and Robotics.
          Three tracks. One unforgettable challenge.
        </p>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 bg-[#393737] hover:bg-[#222] text-white px-7 py-3.5 rounded-full font-medium text-sm transition-all shadow-md"
          >
            Register Your Team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#tracks"
            className="inline-flex items-center gap-2 bg-white/80 hover:bg-white border border-black/[0.08] text-[#393737] px-7 py-3.5 rounded-full font-medium text-sm transition-all shadow-sm backdrop-blur-sm"
          >
            Explore Tracks
          </a>
        </div>

        {/* Countdown */}
        <div className="flex gap-4 md:gap-8 justify-center">
          {(["days","hours","minutes","seconds"] as const).map((unit) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="w-[72px] h-[72px] md:w-24 md:h-24 bg-white/80 backdrop-blur-sm border border-black/[0.07] rounded-2xl shadow-sm flex items-center justify-center mb-2">
                <span className="text-3xl md:text-4xl font-semibold text-[#393737] tabular-nums">
                  {String(timeLeft[unit]).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[11px] font-medium uppercase tracking-widest text-[#BCBCBC]">{unit}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom quick-facts strip */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 mt-24">
        <div className="grid grid-cols-3 gap-px bg-black/[0.06] rounded-2xl overflow-hidden text-sm">
          {[
            { label: "Competition date",  value: "March 15–20, 2026" },
            { label: "Location",          value: "Pharos University" },
            { label: "Open to",           value: "All students" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#F7F7F7] px-6 py-5 flex flex-col gap-1">
              <span className="text-[#BCBCBC] text-xs">{label}</span>
              <span className="text-[#393737] font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
