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
```

## Fonctionnalités

| Partie | Contenu |
| --- | --- |
| Premier chargement | Formulaire nom, prénom, pseudo, âge (entier) avec validation + carte interactive des stades |
| localStorage | Profil, volume audio, position (si autorisée), dernier score du pendu, mode sombre/clair, luminosité |
| Accueil | Cartes CSS3 3D, animations CSS3, texte néon, vidéo, musique avec boutons personnalisés, bouton « Commencer mon voyage » |
| Drag & Drop | 5 missions ; mission 2 : 6 images, 3 + 3, dans 2 zones, « Bravo ! » ou message d'erreur explicatif |
| Quiz | 10 questions, score dans le sessionStorage, message « Bravo [pseudo], tu as réussi [X]% de ta mission ! » |
| Pendu | Mot au hasard, mot en tirets, clavier de 26 lettres, 6 erreurs max, essais restants, dessin progressif, Rejouer, dernier résultat sauvegardé |
| Paramètres | Thème, luminosité, volume, musique, profil, géolocalisation (avec accord), réinitialisation |

## Règles techniques respectées

- Un seul fichier HTML, un seul CSS, un seul JavaScript ; aucun framework, aucune police importée.
- Pas de `querySelector` / `querySelectorAll` : `getElementById`, `getElementsByClassName`, `getElementsByTagName`.
- Pas de `onclick` ni d'attribut `on…` : uniquement `addEventListener`.
- Pas d'`innerHTML` : le contenu est créé avec `createElement` et `textContent`.
- Pas de style en ligne : tout le style est dans `style.css`.
- Drag & Drop selon la méthode du cours : `draggable="true"`, `dragstart` + `dataTransfer.setData()`,
  `dragover` + `preventDefault()`, `drop` + `getData()` + `getElementById()` + `appendChild()`, `dragend` + `clearData()`.
