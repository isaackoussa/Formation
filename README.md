# Atelier Données

Application de formation au traitement de données. Chaque manipulation (filtrer, nettoyer, regrouper, joindre, pivoter…) s'applique en direct sur un tableau, et l'application affiche l'équivalent exact dans **5 outils** :

| Outil | Ce qui est généré |
|---|---|
| **Python** | script pandas complet (`read_csv` → étapes → résultat) |
| **R** | pipeline tidyverse (`dplyr`, `tidyr`, `stringr`, `lubridate`) avec `\|>` |
| **SQL** | requête DuckDB en étapes `WITH` (quasi identique sous PostgreSQL) |
| **Excel** | formules en **français et en anglais** (FILTRE/FILTER, RECHERCHEX/XLOOKUP…) + chemin dans le ruban |
| **Power BI** | script Power Query (M) complet + mesures/colonnes DAX + manipulations dans l'interface |

## Lancer l'application

- **En ligne (Netlify)** : connexion obligatoire par e-mail + code, progression sauvegardée (voir « Compte » et « Déploiement »).
- **Sur l'ordinateur** : ouvrez `index.html` dans un navigateur. Sans serveur, l'écran d'accès propose « Continuer sans compte » : la progression reste sur l'appareil.

## Les onglets

- **Atelier** : construisez un pipeline d'étapes. Cliquez sur une étape pour voir le tableau à ce moment-là et régler ses paramètres. 21 types d'étapes :
  - *Sélectionner* : choisir des colonnes, filtrer, trier, top N ;
  - *Nettoyer* : doublons, valeurs manquantes (valeur, moyenne, médiane, mode, recopie), texte, rechercher/remplacer, séparer une colonne, changer le type, valeurs aberrantes (IQR ou z-score : signaler, retirer, plafonner) ;
  - *Transformer* : renommer, colonne calculée, colonne conditionnelle, extraire d'une date, découper en classes ;
  - *Calculer* : rang, cumul, part du total, écart à la moyenne (avec ou sans groupe) ;
  - *Agréger, Remodeler, Combiner* : regrouper, tableau croisé, dépivoter, jointure.
- **Cours** : 27 leçons en 6 parties (démarrer, préparer, transformer et combiner, Excel et Power BI avancés, analyser et communiquer, bonnes pratiques). Chaque leçon contient explications, tableaux comparatifs, exemples de code dans les 5 outils, « À retenir », « Pièges fréquents » et un lien vers un exercice. La progression est mémorisée.
- **Explorer** : diagnostic qualité automatique (doublons, vides, valeurs écrites de plusieurs façons, nombres stockés en texte, valeurs aberrantes) avec ajout de l'étape de correction en un clic ; profil de chaque colonne, corrélations, code d'exploration.
- **Graphiques** : barres, courbe, nuage de points, histogramme, avec le code matplotlib, ggplot2, SQL, et les étapes Excel/Power BI.
- **Fonctions** : dictionnaire de 183 fonctions (Excel FR/EN, DAX, Power Query M, pandas, R, SQL) avec exemple et recherche.
- **Défis** : 15 exercices corrigés automatiquement (débutant → avancé).
- **Mémo** : table de correspondance de 63 opérations dans les 5 outils, guide « quel outil pour quoi » et lexique de 36 termes.
- **Quiz** : 40 questions avec explications.

## Compte et accès (comme Anglais 365)

- **Barrière d'accès** : on entre avec son **e-mail + un code à 6 chiffres** envoyé par Brevo, sans mot de passe. Code valable 10 minutes, utilisable une seule fois, 5 essais maximum, 30 secondes entre deux envois. Seule l'empreinte du code est stockée.
- **Session** de 6 mois par appareil, bouton « Déconnexion » dans l'en-tête.
- **Progression sauvegardée en ligne** (Netlify Blobs) : leçons lues, défis réussis, réponses au quiz, pipelines de l'Atelier. Elle suit l'apprenant sur tous ses appareils ; la sauvegarde la plus avancée l'emporte à la connexion.
- **E-mail de bienvenue** au premier passage, et **contact Brevo** créé ou mis à jour avec les attributs `LECONS`, `DEFIS`, `QUIZ`, `PROGRESSION` (à créer dans Brevo → Contacts → Paramètres → Attributs pour qu'ils soient remplis).
- **Console admin** sur `/#admin` (clé `ADMIN_KEY`) : comptes, actifs sur 7 jours, progression de chaque apprenant, **blocage / déblocage d'un compte** (un compte bloqué ne peut plus ni se connecter ni sauvegarder).
- **Icône et installation** : l'app s'installe sur l'écran d'accueil du téléphone ou de l'ordinateur (manifeste + icônes) et fonctionne hors ligne après la première visite (service worker).

## Vos propres données

Bouton **Importer…** (CSV, TSV, Excel `.xlsx`) ou **Coller** (copier une plage depuis Excel). Le séparateur `;` et la virgule décimale des fichiers français sont détectés automatiquement. Le résultat se recopie dans Excel avec **Copier pour Excel**.

## Données d'exemple

Le dossier `donnees/` contient les jeux d'exemple fictifs utilisés par l'application, pour rejouer le code généré dans vos outils :

- `ventes.csv` : 156 commandes avec de vrais défauts à corriger (doublons, noms mal saisis, quantités manquantes) ;
- `produits.csv` : table de référence pour les jointures ;
- `notes.csv` : notes d'étudiants au format large, pour le dépivotage.

Le code Python et SQL généré pour la démo et les 15 défis a été exécuté sur ces fichiers (pandas 3.0, DuckDB 1.5) et donne les mêmes résultats que l'application.

## Déploiement (GitHub → Netlify, comme Anglais 365)

1. Sur Netlify, **Add new project → Import an existing project** et choisir le dépôt `Formation`. `netlify.toml` règle la construction (`node scripts/build.mjs`, dossier `dist`).
2. Dans Netlify → Project configuration → **Environment variables**, ajouter :
   - `BREVO_API_KEY` : ta clé API Brevo (app.brevo.com → SMTP & API → API Keys), la même qu'Anglais 365 convient ;
   - `MAIL_FROM` : l'adresse expéditrice validée dans Brevo (Senders & Domains) ;
   - `ADMIN_KEY` : un mot de passe long de ton choix pour la console admin ;
   - facultatif : `MAIL_FROM_NAME` (« Atelier Données » par défaut), `BREVO_LIST_ID`, `APP_URL` (lien du bouton dans l'e-mail de bienvenue) ;
   - seulement si les fonctions affichent « MissingBlobsEnvironmentError » : `NETLIFY_SITE_ID` et `NETLIFY_BLOBS_TOKEN`.
3. Redéployer.

Tant que `BREVO_API_KEY` et `MAIL_FROM` ne sont pas configurées, personne ne peut se connecter sur le site en ligne : c'est voulu (comme Anglais 365).

## Tester en local

Il faut [Node.js](https://nodejs.org) 22 ou plus.

```bash
npm install
npm test                          # teste l'API : codes, erreurs, session, sauvegarde, admin, blocage
npm run build && node scripts/dev-server.mjs
```

Le serveur local (http://localhost:8888) exécute les vraies fonctions avec un stockage local. Les e-mails, donc les codes de connexion, s'affichent dans le terminal. Console admin : http://localhost:8888/#admin, clé `admin-dev`.
