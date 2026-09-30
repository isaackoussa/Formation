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

- **Atelier** : construisez un pipeline d'étapes. Cliquez sur une étape pour voir le tableau à ce moment-là et régler ses paramètres. 21 types d'étapes :
  - *Sélectionner* : choisir des colonnes, filtrer, trier, top N ;
  - *Nettoyer* : doublons, valeurs manquantes (valeur, moyenne, médiane, mode, recopie), texte, rechercher/remplacer, séparer une colonne, changer le type, valeurs aberrantes (IQR ou z-score : signaler, retirer, plafonner) ;
  - *Transformer* : renommer, colonne calculée, colonne conditionnelle, extraire d'une date, découper en classes ;
  - *Calculer* : rang, cumul, part du total, écart à la moyenne (avec ou sans groupe) ;
  - *Agréger, Remodeler, Combiner* : regrouper, tableau croisé, dépivoter, jointure.
- **Cours** : 27 leçons en 6 parties (démarrer, préparer, transformer et combiner, Excel et Power BI avancés, analyser et communiquer, bonnes pratiques). Chaque leçon contient explications, tableaux comparatifs, exemples de code dans les 5 outils, « À retenir », « Pièges fréquents » et un lien vers un exercice. La progression est mémorisée.
- **Explorer** : diagnostic qualité automatique (doublons, vides, valeurs écrites de plusieurs façons, nombres stockés en texte, valeurs aberrantes) avec ajout de l'étape de correction en un clic ; profil de chaque colonne, corrélations, code d'exploration.
- **Graphiques** : barres, courbe, nuage de points, histogramme, avec le code matplotlib, ggplot2, SQL, et les étapes Excel/Power BI.
- **Fonctions** : dictionnaire d'environ 200 fonctions (Excel FR/EN, DAX, Power Query M, pandas, R, SQL) avec exemple et recherche.
- **Défis** : 15 exercices corrigés automatiquement (débutant → avancé).
- **Mémo** : table de correspondance d'environ 70 opérations dans les 5 outils, guide « quel outil pour quoi » et lexique de 36 termes.
- **Quiz** : 40 questions avec explications.

## Vos propres données

Bouton **Importer…** (CSV, TSV, Excel `.xlsx`) ou **Coller** (copier une plage depuis Excel). Le séparateur `;` et la virgule décimale des fichiers français sont détectés automatiquement. Le résultat se recopie dans Excel avec **Copier pour Excel**.

## Données d'exemple

Le dossier `donnees/` contient les jeux d'exemple fictifs utilisés par l'application, pour rejouer le code généré dans vos outils :

- `ventes.csv` : 156 commandes avec de vrais défauts à corriger (doublons, noms mal saisis, quantités manquantes) ;
- `produits.csv` : table de référence pour les jointures ;
- `notes.csv` : notes d'étudiants au format large, pour le dépivotage.

Le code Python et SQL généré pour la démo et les 15 défis a été exécuté sur ces fichiers (pandas 3.0, DuckDB 1.5) et donne les mêmes résultats que l'application.
