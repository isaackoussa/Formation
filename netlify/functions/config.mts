import type { Config } from "@netlify/functions";
import { json } from "../lib/common.mts";
import { mailConfigured } from "../lib/mail.mts";

// Configuration publique pour l'app (le serveur répond, l'envoi d'e-mails est-il configuré ?)
export default async () => json(200, { ok: true, mail: mailConfigured() });

export const config: Config = { path: "/api/config" };
