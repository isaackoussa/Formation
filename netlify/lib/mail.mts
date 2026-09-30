// Envoi d'e-mails via Brevo + gabarits HTML.
import { env, type Summary } from "./common.mts";

/** MAIL_DRY_RUN=1 : les e-mails sont écrits dans les logs au lieu d'être envoyés (tests locaux). */
const dryRun = () => env("MAIL_DRY_RUN") === "1";

export function mailConfigured(): boolean {
  return dryRun() || !!(env("BREVO_API_KEY") && env("MAIL_FROM"));
}

export function appUrl(): string {
  return (env("APP_URL") ?? env("URL") ?? "").replace(/\/$/, "");
}

export async function sendMail(to: string, subject: string, html: string): Promise<{ ok: boolean; status?: number; details?: string }> {
  if (dryRun()) {
    console.log(`[MAIL_DRY_RUN] à ${to} — ${subject}\n${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 600)}`);
    return { ok: true };
  }
  const key = env("BREVO_API_KEY");
  const from = env("MAIL_FROM");
  if (!key || !from) return { ok: false, details: "mail_not_configured" };
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ sender: { email: from, name: env("MAIL_FROM_NAME") ?? "Atelier Données" }, to: [{ email: to }], subject, htmlContent: html }),
  });
  if (!res.ok) {
    const details = await res.text().catch(() => "");
    console.error("Brevo : échec d'envoi", res.status, details);
    return { ok: false, status: res.status, details };
  }
  return { ok: true };
}

/** Ajoute ou met à jour le contact Brevo avec sa progression. Sans effet si Brevo n'est pas configuré. */
export async function syncBrevoContact(email: string, s: Summary | null) {
  const key = env("BREVO_API_KEY");
  if (!key || dryRun()) return;
  const listId = Number(env("BREVO_LIST_ID"));
  const attributes: Record<string, number> = s ? { LECONS: s.lessonsRead, DEFIS: s.challengesDone, QUIZ: s.quizCorrect, PROGRESSION: s.pct } : {};
  const post = (b: object) =>
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, updateEnabled: true, ...(listId ? { listIds: [listId] } : {}), ...b }),
    });
  try {
    let res = await post({ attributes });
    // Si les attributs n'existent pas encore dans Brevo, on enregistre au moins le contact
    if (!res.ok && res.status === 400) res = await post({});
    if (!res.ok) console.warn("Brevo contact :", res.status, await res.text().catch(() => ""));
  } catch (e) {
    console.warn("Brevo contact :", e);
  }
}

// ————— Gabarits —————

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout({ preheader, title, body, cta }: { preheader: string; title: string; body: string; cta?: { label: string; href: string } }) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f2f5f3;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#13201b">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f5f3;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #d3dcd8;border-radius:12px">
<tr><td style="padding:24px 28px 8px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:36px;height:36px;background:#0e6a55;border-radius:9px;color:#fff;font-weight:800;font-size:15px;text-align:center">AD</td>
<td style="padding-left:10px;font-weight:700;font-size:17px">Atelier <span style="color:#0e6a55">Données</span></td></tr></table></td></tr>
<tr><td style="padding:12px 28px 28px"><h1 style="font-size:22px;margin:0 0 14px">${esc(title)}</h1>${body}
${cta ? `<p style="margin:22px 0 0"><a href="${cta.href}" style="display:inline-block;background:#0e6a55;color:#fff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px">${esc(cta.label)}</a></p>` : ""}
</td></tr></table>
<p style="font-size:12px;color:#6f7f78;margin:16px 0 0">Atelier Données · formation au traitement de données</p>
</td></tr></table></body></html>`;
}

export function codeEmail(code: string) {
  return {
    subject: `${code} : ton code de connexion à l'Atelier Données`,
    html: layout({
      preheader: `Ton code : ${code} (valable 10 minutes)`,
      title: "Ton code de connexion",
      body: `<p style="margin:0 0 16px">Saisis ce code dans l'Atelier Données pour te connecter :</p>
<p style="margin:0 0 16px;font-size:34px;font-weight:800;letter-spacing:8px;font-family:Consolas,monospace;color:#0e6a55">${code}</p>
<p style="margin:0;font-size:14px;color:#46574f">Il est valable 10 minutes. Si tu n'as rien demandé, ignore simplement cet e-mail.</p>`,
    }),
  };
}

export function welcomeEmail() {
  const url = appUrl();
  return {
    subject: "Bienvenue dans l'Atelier Données",
    html: layout({
      preheader: "Python, R, SQL, Excel et Power BI : par où commencer.",
      title: "Bienvenue dans l'Atelier Données",
      body: `<p style="margin:0 0 12px">Ton espace est prêt : ta progression (leçons lues, défis réussis, quiz, pipelines) est sauvegardée et te suit sur tous tes appareils.</p>
<p style="margin:0 0 6px"><b>Par où commencer ?</b></p>
<ol style="margin:0 0 0 18px;padding:0;line-height:1.6">
<li>Onglet <b>Cours</b> : « La démarche d'analyse » (8 min).</li>
<li>Onglet <b>Atelier</b> : charge l'exemple et regarde le code généré dans chaque outil.</li>
<li>Onglet <b>Défis</b> : « Des commandes saisies deux fois » pour ta première correction automatique.</li>
</ol>`,
      cta: url ? { label: "Ouvrir l'Atelier", href: url } : undefined,
    }),
  };
}
