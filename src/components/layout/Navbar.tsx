import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const links = [
  { name: "Home",     href: "/" },
  { name: "About",    href: "/#about" },
  { name: "Tracks",   href: "/#tracks" },
  { name: "Timeline", href: "/#timeline" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-[#F7F7F7]/90 backdrop-blur-md border-b border-black/[0.06] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
          {/* Logo (Left) */}
          <Link to="/" className="flex items-center gap-3 group justify-self-start">
            <img src="/ieee-logo.png" alt="IEEE Logo" className="h-8 object-contain" />
            <div className="h-6 w-px bg-black/[0.1] hidden sm:block" />
            <span className="font-semibold text-[#393737] tracking-tight text-[15px] hidden sm:block">
              Tech Pharos
            </span>
          </Link>

          {/* Desktop Links (Middle) */}
          <div className="hidden md:flex items-center justify-center gap-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#888787] hover:text-[#393737] transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA & Mobile Burger (Right) */}
          <div className="flex items-center justify-self-end gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/register"
                className="bg-[#393737] hover:bg-[#222] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-sm"
              >
                Register Now
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-[#888787] hover:text-[#393737] p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#F7F7F7] border-b border-black/[0.06]">
          <div className="px-6 py-4 space-y-1">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2.5 text-[#888787] hover:text-[#393737] text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full block text-center bg-[#393737] text-white px-4 py-2.5 rounded-full text-sm font-medium"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
