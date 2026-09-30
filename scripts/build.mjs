// Construit dist/ pour Netlify : ajoute l'en-tête HTML à index.html et copie les fichiers publics.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
const page = readFileSync("index.html", "utf8");
const head = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
`;
writeFileSync("dist/index.html", head + page + "\n</html>\n");
for (const f of ["icon.svg", "icon-192.png", "icon-512.png", "manifest.webmanifest", "sw.js"]) cpSync(f, `dist/${f}`);
cpSync("donnees", "dist/donnees", { recursive: true });
console.log("dist/ prêt");
