import { Mail, Twitter, Linkedin, Instagram, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] border-t border-black/[0.06] mt-auto">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <img src="/ieee-logo.png" alt="IEEE Logo" className="h-10 object-contain mb-4" />
            <p className="text-[#888787] text-sm leading-relaxed max-w-xs mb-6">
              Empowering students through technology and innovation. Join us in shaping the future of engineering.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Twitter,   href: "#" },
                { Icon: Linkedin,  href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Github,    href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="text-[#BCBCBC] hover:text-[#393737] transition-colors">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#393737] uppercase mb-4">Navigation</p>
            <ul className="space-y-2.5">
              {[
                { label: "About",    href: "/#about" },
                { label: "Tracks",   href: "/#tracks" },
                { label: "Timeline", href: "/#timeline" },
                { label: "Register", href: "/register" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-[#888787] hover:text-[#393737] transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#393737] uppercase mb-4">Contact</p>
            <a
              href="mailto:ieee.pua.sb.tech@gmail.com"
              className="flex items-center gap-2 text-sm text-[#888787] hover:text-[#393737] transition-colors"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              ieee.pua.sb.tech@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-black/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#BCBCBC]">
          <p>© 2026 IEEE Student Branch. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-[#393737] transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-[#393737] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
