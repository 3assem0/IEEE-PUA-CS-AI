import { useState, useEffect } from "react";
import { ChevronRight, CheckCircle, AlertCircle, Trash2, Plus, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  isTeamNameTaken,
  findDuplicateEmails,
  findDuplicateIEEEIds,
  saveRegistration,
  type MemberType,
  type TrackId,
  type Member as FirestoreMember,
} from "../../lib/registrations";

type Track = TrackId;

interface Member extends FirestoreMember {
  // local-only uuid for React key (already in FirestoreMember as `id`)
}

const PRICES: Record<MemberType, number> = { ieee: 15, internal: 25, external: 40 };
const LIMITS: Record<Track, { min: number; max: number }> = {
  web:      { min: 1, max: 3 },
  ai:       { min: 1, max: 3 },
  robotics: { min: 3, max: 5 },
};
const TRACKS = [
  { id: "web",      label: "Web (UI To Code)",     size: "1–3 Members" },
  { id: "ai",       label: "AI (OCR)",              size: "1–3 Members" },
  { id: "robotics", label: "Robotics (Sumo Fight)", size: "3–5 Members" },
] as const;

const blankMember = (): Member => ({
  id: Math.random().toString(36).slice(2),
  name: "", email: "", type: "external", identifier: "",
});

export default function RegistrationForm() {
  const [track, setTrack] = useState<Track | "">("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");

  // Adjust member count when track changes
  useEffect(() => {
    if (!track) return;
    const { min, max } = LIMITS[track];
    setMembers((prev) => {
      if (prev.length < min) return [...prev, ...Array.from({ length: min - prev.length }, blankMember)];
      if (prev.length > max) return prev.slice(0, max);
      return prev;
    });
  }, [track]);

  const addMember = () => {
    if (track && members.length < LIMITS[track].max) setMembers((p) => [...p, blankMember()]);
  };

  const removeMember = (id: string) => {
    if (track && members.length > LIMITS[track].min) setMembers((p) => p.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof Member, val: string) => {
    setMembers((p) => p.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
    setErrors((e) => { const n = { ...e }; delete n[`${id}_${field}`]; return n; });
  };

  const clearError = (key: string) =>
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });

  const total = members.reduce((s, m) => s + PRICES[m.type], 0);

  // ── Local validation (before hitting Firestore) ───────────────────────────
  const localValidate = (): boolean => {
    const errs: Record<string, string> = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!teamName.trim()) errs.teamName = "Team name is required";
    if (!track)           errs.track    = "Please select a track";

    // Check for duplicate emails within the same form
    const formEmails = members.map((m) => m.email.toLowerCase());
    const dupeFormEmails = formEmails.filter((e, i) => formEmails.indexOf(e) !== i);

    members.forEach((m) => {
      if (!m.name.trim()) errs[`${m.id}_name`] = "Name is required";

      if (!m.email || !emailRx.test(m.email)) {
        errs[`${m.id}_email`] = "Valid email address required";
      } else if (dupeFormEmails.includes(m.email.toLowerCase())) {
        errs[`${m.id}_email`] = "This email is used more than once in this registration";
      }

      if (m.type === "ieee") {
        if (!/^\d{9,}$/.test(m.identifier))
          errs[`${m.id}_identifier`] = "IEEE ID must be 9+ digits";
      } else if (!m.identifier.trim()) {
        errs[`${m.id}_identifier`] = "This field is required";
      }
    });

    // Check for duplicate IEEE IDs within the form
    const formIEEEIds = members.filter((m) => m.type === "ieee").map((m) => m.identifier);
    const dupeFormIEEEIds = formIEEEIds.filter((id, i) => formIEEEIds.indexOf(id) !== i);
    members.filter((m) => m.type === "ieee" && dupeFormIEEEIds.includes(m.identifier))
      .forEach((m) => { errs[`${m.id}_identifier`] = "This IEEE ID appears more than once"; });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Server-side duplicate check via Firestore ─────────────────────────────
  const serverValidate = async (): Promise<boolean> => {
    const serverErrs: Record<string, string> = {};

    const [nameTaken, dupEmails, dupIds] = await Promise.all([
      isTeamNameTaken(teamName),
      findDuplicateEmails(members.map((m) => m.email)),
      findDuplicateIEEEIds(members.filter((m) => m.type === "ieee").map((m) => m.identifier)),
    ]);

    if (nameTaken) {
      serverErrs.teamName = "This team name is already registered — please choose another";
    }

    members.forEach((m) => {
      if (dupEmails.includes(m.email.toLowerCase())) {
        serverErrs[`${m.id}_email`] = "This email is already registered";
      }
      if (m.type === "ieee" && dupIds.includes(m.identifier)) {
        serverErrs[`${m.id}_identifier`] = "This IEEE ID is already registered";
      }
    });

    if (Object.keys(serverErrs).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrs }));
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localValidate()) return;

    setSubmitting(true);
    try {
      const ok = await serverValidate();
      if (!ok) { setSubmitting(false); return; }

      const docId = await saveRegistration({
        teamName: teamName.trim(),
        track: track as Track,
        members,
        totalFee: total,
        status: "pending",
      });
      setConfirmationId(docId.slice(0, 8).toUpperCase());
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrors({ _global: "A server error occurred. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="blob blob-green w-72 h-72 top-0 left-1/2 -translate-x-1/2 opacity-50 -z-10" />
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-white border border-black/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-7 h-7 text-green-600" strokeWidth={1.5} />
          </div>
          <h2 className="serif text-4xl text-[#393737] mb-4">Registration successful!</h2>
          <p className="text-[#888787] mx-auto mb-8 leading-relaxed">
            <strong className="text-[#393737]">{teamName}</strong> is now registered for the{" "}
            <strong className="text-[#393737] capitalize">{track}</strong> track.
            The organizers will contact you regarding payment and next steps.
          </p>
          <div className="bg-white border border-black/[0.07] rounded-2xl p-6 text-left mb-8 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-[#888787]">Registration ID</span>
              <span className="font-mono text-[#393737] text-xs bg-[#F7F7F7] px-2 py-1 rounded">{confirmationId}</span>
            </div>
            <div className="flex justify-between"><span className="text-[#888787]">Track</span>      <span className="text-[#393737] capitalize">{track}</span></div>
            <div className="flex justify-between"><span className="text-[#888787]">Members</span>    <span className="text-[#393737]">{members.length}</span></div>
            <div className="flex justify-between border-t border-black/[0.05] pt-3">
              <span className="text-[#888787]">Total fee</span>
              <span className="font-semibold text-[#393737]">${total}</span>
            </div>
            <div className="flex justify-between"><span className="text-[#888787]">Payment status</span> <span className="text-amber-600 text-xs font-medium">Pending</span></div>
          </div>
          <a href="/" className="inline-flex items-center gap-2 bg-[#393737] hover:bg-[#222] text-white px-7 py-3.5 rounded-full text-sm font-medium transition-all">
            Return to home
          </a>
        </div>
      </div>
    );
  }

  // ── Helper styles ─────────────────────────────────────────────────────────
  const inputCls = (err?: string) =>
    cn("w-full bg-[#F7F7F7] border rounded-xl px-4 py-3 text-sm text-[#393737] placeholder:text-[#BCBCBC]",
      "focus:outline-none focus:ring-2 transition-all",
      err ? "border-red-300 focus:ring-red-100" : "border-black/[0.08] focus:border-black/30 focus:ring-black/5");

  const selectCls = "w-full bg-[#F7F7F7] border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-[#393737] focus:outline-none focus:border-black/30 transition-all";

  return (
    <div className="relative min-h-screen py-20 px-4 overflow-hidden">
      <div className="blob blob-blue  w-[400px] h-[400px] -top-20 -right-20 opacity-50" />
      <div className="blob blob-pink  w-[350px] h-[350px] bottom-20 -left-20  opacity-40" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="serif text-[clamp(2.5rem,5vw,3.5rem)] text-[#393737] mb-4">Team Registration</h1>
          <p className="text-[#888787]">Complete the form below to secure your spot in the competition.</p>
        </div>

        {errors._global && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            {errors._global}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">

          {/* ── Step 1: Basic info ── */}
          <div className="bg-white border border-black/[0.07] rounded-3xl p-7">
            <h2 className="font-semibold text-[#393737] mb-5 flex items-center gap-2 text-sm">
              <span className="w-5 h-5 rounded-full bg-[#393737] text-white text-[10px] flex items-center justify-center">1</span>
              Track & Team Info
            </h2>

            <label className="block text-xs font-medium text-[#888787] mb-1.5">Team Name *</label>
            <input type="text" value={teamName}
              onChange={(e) => { setTeamName(e.target.value); clearError("teamName"); }}
              className={inputCls(errors.teamName)}
              placeholder="Enter a unique team name"
            />
            {errors.teamName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" strokeWidth={1.5}/>{errors.teamName}</p>}

            <label className="block text-xs font-medium text-[#888787] mb-2 mt-5">Competition Track *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TRACKS.map((t) => (
                <label key={t.id} className={cn(
                  "cursor-pointer border rounded-2xl p-4 transition-all",
                  track === t.id ? "border-[#393737] bg-[#393737]/[0.03]" : "border-black/[0.07] hover:border-black/20"
                )}>
                  <input type="radio" name="track" value={t.id} className="sr-only"
                    checked={track === t.id}
                    onChange={() => { setTrack(t.id as Track); clearError("track"); }}
                  />
                  <p className="font-medium text-sm text-[#393737]">{t.label}</p>
                  <p className="text-xs text-[#BCBCBC] mt-0.5">{t.size}</p>
                  {track === t.id && <CheckCircle className="w-4 h-4 text-[#393737] mt-3" strokeWidth={1.5} />}
                </label>
              ))}
            </div>
            {errors.track && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" strokeWidth={1.5}/>{errors.track}</p>}
          </div>

          {/* ── Step 2: Members ── */}
          {track && (
            <div className="bg-white border border-black/[0.07] rounded-3xl p-7">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-[#393737] flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#393737] text-white text-[10px] flex items-center justify-center">2</span>
                  Team Members
                </h2>
                <span className="text-xs text-[#BCBCBC] border border-black/[0.07] px-2.5 py-1 rounded-full">
                  {members.length} / {LIMITS[track].max}
                </span>
              </div>

              <div className="space-y-5">
                {members.map((m, i) => (
                  <div key={m.id} className="p-5 bg-[#F7F7F7] rounded-2xl border border-black/[0.04]">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-[#393737]">
                        {i === 0 ? "Team Leader" : `Member ${i + 1}`}
                      </span>
                      {i >= LIMITS[track].min && (
                        <button type="button" onClick={() => removeMember(m.id)}
                          className="text-[#BCBCBC] hover:text-red-400 transition-colors p-1">
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#888787] mb-1">Full Name *</label>
                        <input type="text" value={m.name}
                          onChange={(e) => updateMember(m.id, "name", e.target.value)}
                          className={inputCls(errors[`${m.id}_name`])} placeholder="Full name" />
                        {errors[`${m.id}_name`] && <p className="text-red-500 text-xs mt-1">{errors[`${m.id}_name`]}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-[#888787] mb-1">Email *</label>
                        <input type="email" value={m.email}
                          onChange={(e) => updateMember(m.id, "email", e.target.value)}
                          className={inputCls(errors[`${m.id}_email`])} placeholder="email@example.com" />
                        {errors[`${m.id}_email`] && <p className="text-red-500 text-xs mt-1">{errors[`${m.id}_email`]}</p>}
                      </div>

                      <div>
                        <label className="block text-xs text-[#888787] mb-1">Membership Category *</label>
                        <select value={m.type} onChange={(e) => updateMember(m.id, "type", e.target.value)}
                          className={selectCls}>
                          <option value="ieee">IEEE Member (${PRICES.ieee})</option>
                          <option value="internal">Internal Non-IEEE (${PRICES.internal})</option>
                          <option value="external">External Student (${PRICES.external})</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-[#888787] mb-1">
                          {m.type === "ieee" ? "IEEE ID * (9+ digits)" : m.type === "internal" ? "University ID *" : "University Name *"}
                        </label>
                        <input type={m.type === "ieee" ? "text" : "text"}
                          value={m.identifier}
                          inputMode={m.type === "ieee" ? "numeric" : "text"}
                          onChange={(e) => updateMember(m.id, "identifier", e.target.value)}
                          className={inputCls(errors[`${m.id}_identifier`])}
                          placeholder={m.type === "ieee" ? "e.g. 987654321" : m.type === "internal" ? "e.g. CS2023001" : "e.g. Cairo University"} />
                        {errors[`${m.id}_identifier`] && <p className="text-red-500 text-xs mt-1">{errors[`${m.id}_identifier`]}</p>}
                      </div>
                    </div>
                  </div>
                ))}

                {members.length < LIMITS[track].max && (
                  <button type="button" onClick={addMember}
                    className="w-full py-4 border-2 border-dashed border-black/[0.08] hover:border-black/20 text-[#888787] hover:text-[#393737] rounded-2xl flex items-center justify-center gap-2 text-sm transition-all">
                    <Plus className="w-4 h-4" strokeWidth={1.5} /> Add Member
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Summary & Submit ── */}
          {track && members.length >= LIMITS[track].min && (
            <div className="bg-white border border-black/[0.07] rounded-3xl p-7">
              <h2 className="font-semibold text-[#393737] flex items-center gap-2 text-sm mb-5">
                <span className="w-5 h-5 rounded-full bg-[#393737] text-white text-[10px] flex items-center justify-center">3</span>
                Summary
              </h2>

              <div className="bg-[#F7F7F7] rounded-2xl p-5 mb-6 space-y-2 text-sm">
                {members.map((m, i) => (
                  <div key={m.id} className="flex justify-between">
                    <span className="text-[#888787]">
                      {m.name || `Member ${i + 1}`}{" "}
                      <span className="text-[#BCBCBC] text-xs uppercase">({m.type})</span>
                    </span>
                    <span className="text-[#393737]">${PRICES[m.type]}</span>
                  </div>
                ))}
                <div className="border-t border-black/[0.06] pt-3 mt-3 flex justify-between font-semibold text-[#393737]">
                  <span>Total</span><span>${total}</span>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className={cn("w-full py-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all",
                  submitting ? "bg-[#BCBCBC] cursor-not-allowed text-white" : "bg-[#393737] hover:bg-[#222] text-white shadow-md")}>
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking & submitting…</>
                  : <><ChevronRight className="w-4 h-4" /> Submit Registration</>
                }
              </button>

              <p className="text-center text-xs text-[#BCBCBC] mt-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                All fields are checked for duplicates before submission.
              </p>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
