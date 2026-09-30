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

Aucune installation : ouvrez `index.html` dans un navigateur (Chrome, Edge, Firefox).

## Les onglets

- **Atelier** : construisez un pipeline d'étapes. Cliquez sur une étape pour voir le tableau à ce moment-là et régler ses paramètres. 16 types d'étapes : choisir des colonnes, filtrer, trier, top N, doublons, valeurs manquantes (valeur, moyenne, médiane, mode, recopie), nettoyage de texte, changement de type, renommage, colonne calculée, colonne conditionnelle, extraction de date, regroupement/agrégation, tableau croisé, dépivotage, jointure.
- **Explorer** : profil de chaque colonne (vides, valeurs distinctes, moyenne, écart-type, quartiles, distribution, valeurs les plus fréquentes), doublons, matrice de corrélation, et le code d'exploration dans chaque outil.
- **Graphiques** : barres, courbe, nuage de points, histogramme, avec le code matplotlib, ggplot2, SQL, et les étapes Excel/Power BI.
- **Défis** : 9 exercices corrigés automatiquement (débutant → avancé).
- **Mémo** : table de correspondance de ~50 opérations dans les 5 outils, avec recherche, plus un guide « quel outil pour quoi » et un lexique.
- **Quiz** : 16 questions avec explications.

## Vos propres données

Bouton **Importer…** (CSV, TSV, Excel `.xlsx`) ou **Coller** (copier une plage depuis Excel). Le séparateur `;` et la virgule décimale des fichiers français sont détectés automatiquement. Le résultat se recopie dans Excel avec **Copier pour Excel**.

## Données d'exemple

Le dossier `donnees/` contient les jeux d'exemple fictifs utilisés par l'application, pour rejouer le code généré dans vos outils :

- `ventes.csv` : 156 commandes avec de vrais défauts à corriger (doublons, noms mal saisis, quantités manquantes) ;
- `produits.csv` : table de référence pour les jointures ;
- `notes.csv` : notes d'étudiants au format large, pour le dépivotage.

Le code Python et SQL généré pour la démo et les 9 défis a été exécuté sur ces fichiers (pandas 3.0, DuckDB 1.5) et donne les mêmes résultats que l'application.
