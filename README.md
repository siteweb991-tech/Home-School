# Home School

Site pédagogique responsive de Med Amine Hdioud : mathématiques et physique-chimie, du collège au baccalauréat marocain.

## Lancer en local

Depuis le dossier du dépôt, avec Python 3 installé :

```sh
python -m http.server 8765
```

Ouvrir ensuite http://localhost:8765/. Un serveur HTTP est nécessaire pour charger les catalogues JSON et le lecteur PDF.

## Pages et fonctionnalités

- `index.html` : accueil, recherche avec suggestions, niveaux et présentation du professeur.
- `cours.html` : sélection du niveau, puis chapitres et documents PDF.
- `examens.html` : annales régionales et nationales, par matière, année et région ou filière.
- `lecteur.html` : lecteur PDF local avec navigation entre les pages, zoom et téléchargement.
- Connexion : maquette de présentation, sans authentification ni création de compte.

Les niveaux et matières sans cours sont désactivés automatiquement à partir de `courses.json`. Les années d’examens sans document ne sont pas proposées. Les animations respectent la préférence de réduction des mouvements.

## Documents

- 26 supports de cours locaux dans `pdf/`, décrits par `courses.json`.
- 195 annales locales dans `public/examens/`, décrites par `exams.json`.
- Les annales nationales référencées couvrent 2020 à 2025. Les archives régionales disponibles couvrent 2021 et 2022.

Les annales proviennent des archives de Moutamadris.ma. Leur provenance est conservée dans les champs `source` et `sourceUrl` du catalogue. Les documents gardent les droits de leurs auteurs respectifs ; ce dépôt ne leur attribue pas de nouvelle licence.

## Ajouter des ressources

Placer le PDF dans le dossier approprié puis ajouter une entrée dans le catalogue correspondant. Pour les examens locaux, conserver `local: true`, le chemin dans `url`, la provenance dans `sourceUrl`, ainsi que le type, la matière, l’année, la filière ou région, la langue et la session.

## Lecteur PDF

PDF.js 5.6.205 est fourni localement dans `public/vendor/pdfjs/`, avec sa licence Apache-2.0. Les fichiers PDF et le lecteur sont servis depuis le site, sans dépendance à un service externe. Les polices décoratives peuvent être chargées depuis Google Fonts.

## Hébergement

Le dépôt contient un site statique, sans étape de compilation. Servir le dossier racine avec un hébergement statique compatible avec les modules JavaScript. Les fichiers PDF sont inclus dans le dépôt.
