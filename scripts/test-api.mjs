// Test de bout en bout des fonctions : code e-mail, erreurs, session, progression, admin, blocage.
import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { start } from "./dev-server.mjs";

rmSync(".netlify/blobs-test", { recursive: true, force: true });
const mails = [];
const log = console.log;
console.log = (...a) => { const s = a.join(" "); if (s.startsWith("[MAIL_DRY_RUN]")) mails.push(s); else log(...a); };
const { url, close } = await start({ port: 0, directory: ".netlify/blobs-test" });
const call = async (path, { method = "GET", body, token, admin } = {}) => {
  const h = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  if (admin) h["x-admin-key"] = admin;
  const r = await fetch(`${url}/api/${path}`, { method, headers: h, body: body && JSON.stringify(body) });
  return { status: r.status, data: await r.json() };
};
const lastCode = () => mails.at(-1).match(/\b(\d{6})\b/)[1];
const email = "Lea.Test@Exemple.fr";
let r;
try {
  r = await call("config"); assert.equal(r.data.mail, true);
  r = await call("auth/send-code", { method: "POST", body: { email: "pas-un-email" } }); assert.equal(r.data.error, "invalid_email");
  r = await call("auth/send-code", { method: "POST", body: { email } }); assert.equal(r.status, 200);
  const code = lastCode();
  r = await call("auth/send-code", { method: "POST", body: { email } }); assert.equal(r.data.error, "too_soon");
  const wrong = code === "000000" ? "111111" : "000000";
  r = await call("auth/verify", { method: "POST", body: { email, code: wrong } }); assert.equal(r.data.error, "wrong_code"); assert.equal(r.data.remaining, 4);
  r = await call("auth/verify", { method: "POST", body: { email, code } }); assert.equal(r.status, 200); assert.equal(r.data.isNew, true); assert.equal(r.data.email, "lea.test@exemple.fr");
  assert.ok(mails.some((m) => m.includes("Bienvenue")), "e-mail de bienvenue");
  const token = r.data.token;
  r = await call("auth/verify", { method: "POST", body: { email, code } }); assert.equal(r.data.error, "no_code", "un code ne sert qu'une fois");
  r = await call("me"); assert.equal(r.status, 401);
  r = await call("me", { token: "faux" }); assert.equal(r.status, 401);
  r = await call("me?state=1", { token }); assert.equal(r.status, 200); assert.equal(r.data.state, null);
  const summary = { lessonsRead: 3, lessonsTotal: 27, challengesDone: 2, challengesTotal: 15, quizAnswered: 5, quizCorrect: 4, quizTotal: 40, pct: 11 };
  r = await call("progress", { method: "PUT", token, body: { state: { read: { l1: true } }, summary } }); assert.equal(r.status, 200);
  r = await call("me?state=1", { token }); assert.deepEqual(r.data.state, { read: { l1: true } });
  r = await call("admin"); assert.equal(r.status, 401);
  r = await call("admin", { admin: "mauvaise" }); assert.equal(r.status, 401);
  r = await call("admin", { admin: "admin-dev" }); assert.equal(r.data.users.length, 1); assert.equal(r.data.users[0].summary.lessonsRead, 3);
  r = await call("admin", { method: "POST", admin: "admin-dev", body: { email, blocked: true } }); assert.equal(r.status, 200);
  r = await call("me", { token }); assert.equal(r.status, 403); assert.equal(r.data.error, "blocked");
  r = await call("auth/send-code", { method: "POST", body: { email } }); assert.equal(r.data.error, "blocked");
  r = await call("admin", { method: "POST", admin: "admin-dev", body: { email, blocked: false } });
  r = await call("me", { token }); assert.equal(r.status, 200);
  r = await call("me", { method: "DELETE", token }); assert.equal(r.status, 200);
  r = await call("me", { token }); assert.equal(r.status, 401, "déconnecté");
  // 5 mauvais essais invalident le code
  const e2 = "bob@exemple.fr";
  await call("auth/send-code", { method: "POST", body: { email: e2 } });
  const c2 = lastCode(), bad = c2 === "000000" ? "111111" : "000000";
  for (let i = 0; i < 5; i++) await call("auth/verify", { method: "POST", body: { email: e2, code: bad } });
  r = await call("auth/verify", { method: "POST", body: { email: e2, code: c2 } }); assert.equal(r.data.error, "too_many_attempts");
  log("Tous les tests de l'API passent (" + mails.length + " e-mails simulés).");
} finally {
  await close();
  rmSync(".netlify/blobs-test", { recursive: true, force: true });
}
