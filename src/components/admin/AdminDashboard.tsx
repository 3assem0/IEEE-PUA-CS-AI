import { useState, useEffect } from "react";
import {
  Users, DollarSign, Activity, Search, Download,
  ChevronDown, CheckCircle, Clock, LogOut, Cpu, Filter, Loader2
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  subscribeToRegistrations,
  togglePaymentStatus,
  type Registration,
} from "../../lib/registrations";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [teams, setTeams] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toggling, setToggling] = useState<string | null>(null);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsub = subscribeToRegistrations((data) => {
      // Sort newest first
      const sorted = [...data].sort((a, b) => {
        const at = (a.createdAt as { seconds?: number })?.seconds ?? 0;
        const bt = (b.createdAt as { seconds?: number })?.seconds ?? 0;
        return bt - at;
      });
      setTeams(sorted);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleToggle = async (team: Registration) => {
    if (!team.id) return;
    if (!window.confirm(`Change payment status for "${team.teamName}"?`)) return;
    setToggling(team.id);
    try {
      await togglePaymentStatus(team.id, team.status);
    } finally {
      setToggling(null);
    }
  };

  const exportCSV = () => {
    // Generate headers for dynamic member columns (up to 5 members)
    const headers = [
      "Registration ID", "Team Name", "Track", "Status", "Total Fee ($)", "Date",
      "M1 Name", "M1 Email", "M1 Type", "M1 ID/Uni",
      "M2 Name", "M2 Email", "M2 Type", "M2 ID/Uni",
      "M3 Name", "M3 Email", "M3 Type", "M3 ID/Uni",
      "M4 Name", "M4 Email", "M4 Type", "M4 ID/Uni",
      "M5 Name", "M5 Email", "M5 Type", "M5 ID/Uni"
    ];

    const rows = filtered.map((t) => {
      const date = t.createdAt
        ? new Date((t.createdAt as { seconds: number }).seconds * 1000).toLocaleDateString()
        : "—";
      
      const basic = [
        t.id ?? "",
        `"${t.teamName.replace(/"/g, '""')}"`,
        t.track,
        t.status,
        t.totalFee,
        date
      ];

      const memberCells: (string | number)[] = [];
      for (let i = 0; i < 5; i++) {
        const m = t.members[i];
        if (m) {
          memberCells.push(`"${m.name.replace(/"/g, '""')}"`, m.email, m.type, `"${m.identifier.replace(/"/g, '""')}"`);
        } else {
          memberCells.push("", "", "", "");
        }
      }

      return [...basic, ...memberCells];
    });

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    // Add BOM for Excel UTF-8 support
    const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tech_pharos_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = teams.filter((t) =>
    (search === "" || t.teamName.toLowerCase().includes(search.toLowerCase()) || (t.id ?? "").includes(search)) &&
    (trackFilter === "all" || t.track === trackFilter) &&
    (statusFilter === "all" || t.status === statusFilter)
  );

  const confirmed = teams.filter((t) => t.status === "confirmed");
  const revenue  = confirmed.reduce((s, t) => s + t.totalFee, 0);
  const expected = teams.reduce((s, t) => s + t.totalFee, 0);

  const trackBadge = (track: string) =>
    ({ web: "bg-blue-50 text-blue-600 border-blue-100", ai: "bg-violet-50 text-violet-600 border-violet-100", robotics: "bg-green-50 text-green-600 border-green-100" }[track] ?? "bg-gray-50 text-gray-500 border-gray-100");

  const formatDate = (ts: unknown) => {
    if (!ts) return "—";
    const s = (ts as { seconds?: number }).seconds;
    return s ? new Date(s * 1000).toLocaleDateString() : "—";
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">

      {/* Header */}
      <header className="bg-white border-b border-black/[0.06] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#393737]" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-[#393737]">Tech Pharos Admin</span>
            {loading && <Loader2 className="w-3.5 h-3.5 text-[#BCBCBC] animate-spin ml-2" />}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#BCBCBC] hidden sm:block">
              {teams.length} registration{teams.length !== 1 ? "s" : ""} · live
            </span>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-[#888787] hover:text-[#393737] transition-colors">
              <LogOut className="h-4 w-4" strokeWidth={1.5} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-black/[0.06] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#888787] uppercase tracking-wider">Teams Registered</span>
              <Users className="h-4 w-4 text-[#BCBCBC]" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-semibold text-[#393737]">{teams.length}</p>
            <p className="text-xs text-[#BCBCBC] mt-1">{confirmed.length} confirmed</p>
          </div>

          <div className="bg-white border border-black/[0.06] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#888787] uppercase tracking-wider">Revenue Confirmed</span>
              <DollarSign className="h-4 w-4 text-[#BCBCBC]" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-semibold text-[#393737]">${revenue}</p>
            <p className="text-xs text-[#BCBCBC] mt-1">of ${expected} expected total</p>
          </div>

          <div className="bg-white border border-black/[0.06] p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#888787] uppercase tracking-wider">Track Split</span>
              <Activity className="h-4 w-4 text-[#BCBCBC]" strokeWidth={1.5} />
            </div>
            {teams.length > 0 ? (
              <>
                <div className="flex h-2 bg-black/[0.04] rounded-full overflow-hidden mt-2">
                  {["web", "ai", "robotics"].map((tr) => {
                    const pct = (teams.filter((t) => t.track === tr).length / teams.length) * 100;
                    const color = { web: "bg-blue-400", ai: "bg-violet-400", robotics: "bg-green-400" }[tr];
                    return <div key={tr} style={{ width: `${pct}%` }} className={color} />;
                  })}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-[#888787]">
                  {["web", "ai", "robotics"].map((tr) => (
                    <span key={tr}>{tr} ({teams.filter((t) => t.track === tr).length})</span>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-[#BCBCBC] mt-2">No data yet</p>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between mb-4">
          <div className="flex gap-3 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BCBCBC]" strokeWidth={1.5} />
              <input type="text" placeholder="Search teams or ID…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-black/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#393737] focus:outline-none focus:border-black/20" />
            </div>

            {["trackFilter", "statusFilter"].map((key) => {
              const isTrack = key === "trackFilter";
              const val = isTrack ? trackFilter : statusFilter;
              const set = isTrack ? setTrackFilter : setStatusFilter;
              const opts = isTrack
                ? [["all","All Tracks"],["web","Web"],["ai","AI"],["robotics","Robotics"]]
                : [["all","All Status"],["confirmed","Confirmed"],["pending","Pending"]];
              return (
                <div key={key} className="relative">
                  <select value={val} onChange={(e) => set(e.target.value)}
                    className="appearance-none bg-white border border-black/[0.07] rounded-xl pl-3 pr-8 py-2.5 text-sm text-[#393737] focus:outline-none cursor-pointer">
                    {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#BCBCBC] pointer-events-none" />
                </div>
              );
            })}
          </div>

          <button onClick={exportCSV}
            className="flex items-center gap-2 bg-[#393737] hover:bg-[#222] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
            <Download className="h-4 w-4" strokeWidth={1.5} /> Export to Excel
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-[#888787]">
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
              <span className="text-sm">Loading registrations…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-black/[0.05]">
                    {["Team Name","Track","Members","Fee","Status","Registered","Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-xs font-medium text-[#888787] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {filtered.length > 0 ? filtered.map((team) => (
                    <tr key={team.id} className="hover:bg-[#F7F7F7]/60 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#393737]">{team.teamName}</p>
                        <p className="text-[10px] font-mono text-[#BCBCBC] mt-0.5">{team.id?.slice(0, 8).toUpperCase()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border capitalize", trackBadge(team.track))}>
                          {team.track}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#888787]">{team.members.length}</td>
                      <td className="px-5 py-4 font-medium text-[#393737]">${team.totalFee}</td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          team.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>
                          {team.status === "confirmed" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#888787] whitespace-nowrap text-xs">{formatDate(team.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggle(team)}
                          disabled={toggling === team.id}
                          className="text-xs font-medium text-[#888787] hover:text-[#393737] border border-black/[0.07] hover:border-black/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 flex items-center gap-1.5"
                        >
                          {toggling === team.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                          Toggle
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <Filter className="w-6 h-6 text-[#BCBCBC] mx-auto mb-2" strokeWidth={1.5} />
                        <p className="text-sm text-[#888787]">
                          {teams.length === 0 ? "No registrations yet. Share the registration link to get started." : "No teams match your filters."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
