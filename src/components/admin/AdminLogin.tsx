import { useState } from "react";
import { Lock, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

interface Props { onLogin: () => void; }

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === "admin123") { onLogin(); }
      else { setError("Invalid credentials."); }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="blob blob-blue  w-[500px] h-[500px] top-0 -right-32 opacity-40" />
      <div className="blob blob-pink  w-[400px] h-[400px] bottom-0 -left-32  opacity-30" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-white border border-black/[0.07] rounded-2xl shadow-sm mb-6">
            <Cpu className="h-5 w-5 text-[#393737]" strokeWidth={1.5} />
          </Link>
          <h1 className="serif text-3xl text-[#393737] mb-2">Organizer Access</h1>
          <p className="text-sm text-[#888787]">Enter the administrative password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-black/[0.07] rounded-3xl p-8 shadow-sm">
          <label className="block text-xs font-medium text-[#888787] mb-1.5">Master Password</label>
          <div className="relative mb-1.5">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BCBCBC]" strokeWidth={1.5} />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className={`w-full bg-[#F7F7F7] border ${error ? "border-red-300" : "border-black/[0.08]"} rounded-xl pl-10 pr-4 py-3 text-sm text-[#393737] focus:outline-none focus:border-black/30 transition-colors`}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#393737] hover:bg-[#222] text-white py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : "Access Dashboard"
            }
          </button>
        </form>
      </div>
    </div>
  );
}
