/**
 * registrations.ts
 * All Realtime Database interactions for the registrations collection.
 */

import {
  ref,
  set,
  push,
  get,
  update,
  onValue,
  serverTimestamp,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "./firebase";

export type MemberType = "ieee" | "internal" | "external";
export type TrackId    = "web" | "ai" | "robotics";
export type PayStatus  = "pending" | "confirmed";

export interface Member {
  id:         string;
  name:       string;
  email:      string;
  type:       MemberType;
  identifier: string; // IEEE ID / Uni ID / Uni name
}

export interface Registration {
  id?:       string; // RTDB key, absent before save
  teamName:  string;
  track:     TrackId;
  members:   Member[];
  totalFee:  number;
  status:    PayStatus;
  createdAt: number | object;
}

const PATH = "registrations";

// ── Duplicate checkers ────────────────────────────────────────────────────────

/** Returns true if a team with the same name already exists. */
export async function isTeamNameTaken(teamName: string): Promise<boolean> {
  const q = query(ref(db, PATH), orderByChild("teamName"), equalTo(teamName.trim()));
  const snap = await get(q);
  return snap.exists();
}

/**
 * Given a list of emails, returns any that are already present
 * in ANY member sub-array across all registrations.
 */
export async function findDuplicateEmails(emails: string[]): Promise<string[]> {
  const snap = await get(ref(db, PATH));
  if (!snap.exists()) return [];
  
  const usedEmails = new Set<string>();
  snap.forEach((d) => {
    const r = d.val() as Registration;
    r.members?.forEach((m) => usedEmails.add(m.email.toLowerCase()));
  });
  return emails.filter((e) => usedEmails.has(e.toLowerCase()));
}

/**
 * Given a list of IEEE IDs (from ieee-type members), returns any duplicates.
 */
export async function findDuplicateIEEEIds(ids: string[]): Promise<string[]> {
  const snap = await get(ref(db, PATH));
  if (!snap.exists()) return [];

  const usedIds = new Set<string>();
  snap.forEach((d) => {
    const r = d.val() as Registration;
    r.members?.filter((m) => m.type === "ieee").forEach((m) => usedIds.add(m.identifier));
  });
  return ids.filter((id) => usedIds.has(id));
}

// ── Write ─────────────────────────────────────────────────────────────────────

/** Saves a new registration and returns the RTDB key. */
export async function saveRegistration(data: Omit<Registration, "id" | "createdAt">): Promise<string> {
  const newListRef = push(ref(db, PATH));
  await set(newListRef, {
    ...data,
    status:    "pending",
    createdAt: serverTimestamp(),
  });
  return newListRef.key!;
}

// ── Read ──────────────────────────────────────────────────────────────────────

/** One-shot fetch of all registrations. */
export async function fetchRegistrations(): Promise<Registration[]> {
  const snap = await get(ref(db, PATH));
  if (!snap.exists()) return [];
  const out: Registration[] = [];
  snap.forEach((d) => {
    out.push({ id: d.key!, ...(d.val() as Omit<Registration, "id">) });
  });
  return out;
}

/**
 * Subscribes to real-time updates.
 */
export function subscribeToRegistrations(
  callback: (registrations: Registration[]) => void
): () => void {
  const r = ref(db, PATH);
  const unsub = onValue(r, (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const data: Registration[] = [];
    snap.forEach((d) => {
      data.push({
        id: d.key!,
        ...(d.val() as Omit<Registration, "id">),
      });
    });
    callback(data);
  });
  return () => unsub();
}

// ── Update ────────────────────────────────────────────────────────────────────

/** Toggles a registration's payment status in RTDB. */
export async function togglePaymentStatus(key: string, currentStatus: PayStatus): Promise<void> {
  const next: PayStatus = currentStatus === "confirmed" ? "pending" : "confirmed";
  await update(ref(db, `${PATH}/${key}`), { status: next });
}
