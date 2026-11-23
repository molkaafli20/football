# FOOTBALL JOURNEY

Site web éducatif autour du football, réalisé pour le cours de **Programmation Web avancée**.
Le joueur crée son profil, découvre des stades sur une carte interactive, relève trois missions en
Drag & Drop, passe un quiz final et joue au Pendu.

## Lancer le projet

1. Ouvrir le dossier dans VS Code.
2. Clic droit sur `index.html` → **Open with Live Server**.

Les photos et la vidéo viennent de Pexels (liens en ligne) : une connexion internet est nécessaire pour les afficher.

## Structure

```
index.html       → accueil : bannière, 3 missions, carte des stades, inscription, vidéo, musique
mission1.html    → mission 1 (Drag & Drop : 3 équipements)
mission2.html    → mission 2 (Drag & Drop : 6 images, 2 vestiaires)
mission3.html    → mission 3 (Drag & Drop : 4 postes)
quiz.html        → quiz final (10 questions)
pendu.html       → jeu du pendu
parametres.html  → profil, géolocalisation, musique, thème, données enregistrées
style.css        → tout le style (thème sombre/clair, animations, responsive)
script.js        → les fonctionnalités, communes aux 7 pages : textes (textContent), Drag & Drop,
                   quiz, pendu, Web Storage, géolocalisation

On passe d'une page à l'autre avec de simples liens <a href="quiz.html">.
Chaque page indique son nom dans <body data-page="...">, et script.js n'exécute
que ce qui la concerne. Les données passent d'une page à l'autre par le localStorage.
audio/       → road-to-glory.mp3, la musique d'ambiance (balise <audio>)
```

## Fonctionnalités

| Partie | Contenu |
| --- | --- |
| Premier chargement | Formulaire nom, prénom, pseudo, âge (entier) avec validation |
| localStorage | Une clé par information : `pseudo`, `nom`, `prenom`, `age`, `volume`, `mode`, `luminosite`, `latitude`, `longitude`, `precision`, `dernierResultatPendu`, `dernierScorePendu`, `dernierMotPendu` + `progression` (missions, dernier score du quiz) |
| Accueil | Cartes CSS3 3D, animations CSS3, texte néon, vidéo, musique (balise `<audio>`) avec boutons lecture / pause / volume personnalisés, bouton « Commencer mon voyage », carte interactive des 8 stades (clic = fiche du stade) |
| Drag & Drop | 3 missions débloquées une par une ; mission 2 : 6 images, 3 + 3, dans 2 zones, « Bravo ! » ou message d'erreur explicatif |
| Quiz | 10 questions, score dans le sessionStorage (`scoreQuiz`, `pseudoQuiz`), message « Bravo [pseudo], tu as réussi [X]% de ta mission ! » |
| Pendu | Mot au hasard, mot en tirets, clavier virtuel de 26 lettres, 6 erreurs max, essais restants, dessin progressif, Rejouer, dernier résultat sauvegardé |
| Paramètres | Profil (affichage), géolocalisation (avec accord), musique et volume, mode sombre/clair, luminosité, liste des données enregistrées, suppression de toutes les données |

## Règles techniques respectées

- Un seul fichier HTML, un seul CSS, un seul JavaScript ; aucun framework, aucune police importée.
- Pas de `querySelector` / `querySelectorAll` : `getElementById`, `getElementsByClassName`, `getElementsByTagName`.
- Pas de `onclick` ni d'attribut `on…` : uniquement `addEventListener`.
- Pas d'`innerHTML` : le contenu est créé avec `createElement` et `textContent`.
- Pas de style en ligne : tout le style est dans `style.css`.
- Drag & Drop selon la méthode du cours : `draggable="true"`, `dragstart` + `dataTransfer.setData()`,
  `dragover` + `preventDefault()`, `drop` + `getData()` + `getElementById()` + `appendChild()`, `dragend` + `clearData()`.
- Web Storage selon le cours : test `typeof(Storage) !== "undefined"`, `setItem()`, `getItem()`, `removeItem()`,
  `clear()`, `key(index)` et `length` (liste « Mes données » des paramètres), événement `storage` entre onglets.
- Géolocalisation selon le cours : `navigator.geolocation.getCurrentPosition(showPosition, showError, options)`
  avec `maximumAge`, `timeout`, `enableHighAccuracy` et gestion des erreurs `PERMISSION_DENIED`,
  `POSITION_UNAVAILABLE`, `TIMEOUT`.
