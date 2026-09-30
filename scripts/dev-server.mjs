// Serveur local : sert dist/ et exécute les fonctions Netlify avec un stockage Blobs local.
// Usage : npm run build && node scripts/dev-server.mjs   (e-mails affichés dans le terminal)
import http from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { BlobsServer } from "@netlify/blobs/server";

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json", ".csv": "text/csv; charset=utf-8" };

export async function start({ port = 8888, directory = ".netlify/blobs-dev" } = {}) {
  process.env.MAIL_DRY_RUN ??= "1";
  process.env.ADMIN_KEY ??= "admin-dev";
  const blobs = new BlobsServer({ directory, token: "dev" });
  const { port: bport } = await blobs.start();
  const url = `http://localhost:${bport}`;
  process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify({ edgeURL: url, uncachedEdgeURL: url, siteID: "dev", token: "dev" })).toString("base64");

  const routes = {};
  for (const f of await readdir("netlify/functions")) {
    const mod = await import(new URL(`../netlify/functions/${f}`, import.meta.url));
    routes[mod.config.path] = mod.default;
  }
  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, `http://${req.headers.host}`);
    const fn = routes[u.pathname];
    if (fn) {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const r = await fn(new Request(u, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) }));
      res.writeHead(r.status, Object.fromEntries(r.headers));
      res.end(Buffer.from(await r.arrayBuffer()));
      return;
    }
    if (u.pathname.startsWith("/api/")) { res.writeHead(404, { "Content-Type": "application/json" }); res.end('{"error":"not_found"}'); return; }
    const path = join("dist", u.pathname === "/" ? "index.html" : decodeURIComponent(u.pathname));
    try { const data = await readFile(path); res.writeHead(200, { "Content-Type": TYPES[extname(path)] ?? "application/octet-stream" }); res.end(data); }
    catch { res.writeHead(404); res.end("Introuvable"); }
  });
  await new Promise((r) => server.listen(port, r));
  return { url: `http://localhost:${server.address().port}`, close: async () => { server.close(); await blobs.stop(); } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { url } = await start();
  console.log(`Atelier Données : ${url}  (console admin : ${url}/#admin, clé « ${process.env.ADMIN_KEY} »)`);
}
