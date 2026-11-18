# FOOTBALL JOURNEY

Site web éducatif autour du football, réalisé pour le cours de **Programmation Web avancée**.
Le joueur crée son profil, découvre des stades sur une carte interactive, relève cinq missions en
Drag & Drop, passe un quiz final et joue au Pendu.

## Lancer le projet

1. Ouvrir le dossier dans VS Code.
2. Clic droit sur `index.html` → **Open with Live Server**.

Les photos et la vidéo viennent de Pexels (liens en ligne) : une connexion internet est nécessaire pour les afficher.

## Structure

```
index.html   → la page unique (structure HTML5, icônes SVG et les 6 images du Drag & Drop)
style.css    → tout le style (thème sombre/clair, animations, responsive)
script.js    → toute la logique, organisée en sections commentées
audio/       → road-to-glory.mp3, la musique d'ambiance (balise <audio>)
```

## Fonctionnalités

| Partie | Contenu |
| --- | --- |
| Premier chargement | Formulaire nom, prénom, pseudo, âge (entier) avec validation + carte interactive des stades |
| localStorage | Une clé par information : `pseudo`, `nom`, `prenom`, `age`, `stade`, `volume`, `mode`, `luminosite`, `latitude`, `longitude`, `precision`, `dernierResultatPendu`, `dernierScorePendu`, `dernierMotPendu` + `progression` (missions, quiz, partie en cours) |
| Accueil | Cartes CSS3 3D, animations CSS3, texte néon, vidéo, musique (balise `<audio>`) avec boutons lecture / pause / volume personnalisés, bouton « Commencer mon voyage » |
| Drag & Drop | 5 missions ; mission 2 : 6 images, 3 + 3, dans 2 zones, « Bravo ! » ou message d'erreur explicatif |
| Quiz | 10 questions, score dans le sessionStorage (`scoreQuiz`, `reponsesQuiz`…), message « Bravo [pseudo], tu as réussi [X]% de ta mission ! » |
| Pendu | Mot au hasard, mot en tirets, clavier de 26 lettres, 6 erreurs max, essais restants, dessin progressif, Rejouer, dernier résultat sauvegardé |
| Paramètres | Profil, géolocalisation (avec accord), musique et volume, mode sombre/clair, luminosité, liste des données enregistrées, suppression de toutes les données |

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
