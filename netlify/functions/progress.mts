import type { Config } from "@netlify/functions";
import { authenticate, json, saveProfile, states, type Summary } from "../lib/common.mts";
import { syncBrevoContact } from "../lib/mail.mts";

const MAX_BYTES = 1_000_000;

// PUT : sauvegarde de la progression (état + résumé pour la console admin et Brevo)
export default async (req: Request) => {
  if (req.method !== "PUT") return json(405, { error: "method_not_allowed" });
  const auth = await authenticate(req);
  if (auth instanceof Response) return auth;
  const { profile, email } = auth;

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json(413, { error: "too_large" });
  let body: { state?: Record<string, unknown>; summary?: Summary; updatedAt?: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "bad_request" });
  }
  if (!body.state || !body.summary) return json(400, { error: "bad_request" });

  const updatedAt = body.updatedAt ?? new Date().toISOString();
  await states().setJSON(email, body.state);
  const prev = profile.summary;
  profile.summary = body.summary;
  profile.updatedAt = updatedAt;
  profile.lastSeen = new Date().toISOString();
  await saveProfile(profile);

  // Contact Brevo mis à jour quand un compteur change
  const s = body.summary;
  if (!prev || prev.lessonsRead !== s.lessonsRead || prev.challengesDone !== s.challengesDone || prev.quizCorrect !== s.quizCorrect) await syncBrevoContact(email, s);
  return json(200, { ok: true, updatedAt });
};

export const config: Config = { path: "/api/progress" };
