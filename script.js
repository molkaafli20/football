/* ==========================================================================
   FOOTBALL JOURNEY — script.js
   Le site a 7 fichiers HTML (index, mission1, mission2, mission3, quiz, pendu,
   parametres) reliés par de simples liens <a href>. Ils utilisent tous ce fichier.

   Ce fichier n'utilise que des instructions de base :
   variables, if / else, fonctions, getElementById, getElementsByClassName,
   textContent, classList, addEventListener, et les méthodes du cours
   (Drag & Drop, Web Storage, géolocalisation).
   Pour parcourir une liste d'éléments de la page, on utilise forEach :
     Array.from(document.getElementsByClassName('...')).forEach(function (element) { ... });
   (getElementsByClassName renvoie une collection ; Array.from la transforme en tableau
   pour pouvoir appeler forEach, qui exécute la fonction pour chaque élément.)
   ========================================================================== */


/* ==========================================================================
   1. DONNÉES DU JEU
   ========================================================================== */
// Nom de la page ouverte, écrit dans <body data-page="..."> de chaque fichier HTML :
// home, mission, quiz, hangman ou settings.
const PAGE = document.body.dataset.page;

// Pour mission1.html, mission2.html et mission3.html : numéro de la mission (0, 1 ou 2).
const MISSION = Number(document.body.dataset.mission);

// Numéro de la bonne réponse (0 = A, 1 = B, 2 = C, 3 = D) pour les 10 questions du quiz.
const BONNES_REPONSES = [2, 3, 1, 2, 0, 3, 1, 2, 0, 3];

// Mots du pendu.
const MOTS = ['FOOTBALL', 'STADE', 'BALLON', 'GARDIEN', 'ARBITRE', 'BUT', 'JOUEUR', 'MATCH', 'COUPE', 'PENALTY'];


/* ==========================================================================
   2. DONNÉES DU JOUEUR
   Ces variables sont remplies au démarrage avec le localStorage (readState),
   puis enregistrées après chaque changement (saveState).
   ========================================================================== */
let joueur = null;                              // { prenom, nom, pseudo, age } ou null
let volume = 0.35;                              // volume de la musique, de 0 à 1
let mode = 'dark';                              // 'dark' (sombre) ou 'light' (clair)
let luminosite = 100;                           // de 60 à 120 %
let position = null;                            // { latitude, longitude, precision } ou null
let missionsPlacees = [[], [], []];             // id des éléments bien placés, pour chaque mission
let missionsTerminees = [false, false, false];  // mission terminée ou non
let dernierScoreQuiz = null;                    // score sur 10, ou null si le quiz n'a pas été fait


/* ==========================================================================
   3. MESSAGE EN BAS DE L'ÉCRAN
   ========================================================================== */
let minuteur = null;

function notify(message, type) {
  const bulle = document.getElementById('toast');
  document.getElementById('toast-text').textContent = message;
  bulle.classList.add('visible');
  // En rouge seulement pour une erreur.
  if (type === 'error') {
    bulle.classList.add('error');
  } else {
    bulle.classList.remove('error');
  }
  // On annule l'ancien minuteur, puis on cache la bulle après 5 secondes.
  clearTimeout(minuteur);
  minuteur = setTimeout(function () {
    bulle.classList.remove('visible');
  }, 5000);
}


/* ==========================================================================
   4. WEB STORAGE (cours)
   Chaque information a sa propre clé dans le localStorage :
   pseudo, nom, prenom, age, volume, mode, luminosite, latitude, longitude,
   precision, mission0Placees, mission0Terminee (idem 1 et 2), dernierScoreQuiz,
   dernierResultatPendu, dernierScorePendu, dernierMotPendu.
   ========================================================================== */
// Test du cours : le navigateur supporte-t-il le Web Storage ?
function storageSupported() {
  return typeof(Storage) !== 'undefined';
}

// Lecture avec getItem() au démarrage de la page.
// Le localStorage ne contient que du texte : on le transforme en nombres avec Number().
function readState() {
  if (!storageSupported()) {
    return;
  }

  // Joueur : gardé seulement s'il est valide.
  if (localStorage.getItem('pseudo') !== null) {
    const prenom = localStorage.getItem('prenom');
    const nom = localStorage.getItem('nom');
    const pseudo = localStorage.getItem('pseudo');
    const age = Number(localStorage.getItem('age'));
    if (profileIsValid(checkProfile(prenom, nom, pseudo, age))) {
      joueur = { prenom: prenom, nom: nom, pseudo: pseudo, age: age };
    }
  }

  // Volume entre 0 et 1.
  if (localStorage.getItem('volume') !== null) {
    const v = Number(localStorage.getItem('volume'));
    if (v >= 0 && v <= 1) {
      volume = v;
    }
  }

  // Luminosité entre 60 et 120.
  const l = Number(localStorage.getItem('luminosite'));
  if (l >= 60 && l <= 120) {
    luminosite = l;
  }

  // Thème : clair seulement si c'est écrit « light ».
  if (localStorage.getItem('mode') === 'light') {
    mode = 'light';
  }

  // Position (géolocalisation).
  if (localStorage.getItem('latitude') !== null) {
    position = {
      latitude: Number(localStorage.getItem('latitude')),
      longitude: Number(localStorage.getItem('longitude')),
      precision: Number(localStorage.getItem('precision'))
    };
  }

  // Missions : les éléments placés sont séparés par des virgules (« drag-0-ball,drag-0-boots »).
  [0, 1, 2].forEach(function (i) {
    const placees = localStorage.getItem('mission' + i + 'Placees');
    if (placees) {
      missionsPlacees[i] = placees.split(',');
    }
    if (localStorage.getItem('mission' + i + 'Terminee') === 'true') {
      missionsTerminees[i] = true;
    }
  });

  // Dernier score du quiz.
  if (localStorage.getItem('dernierScoreQuiz') !== null) {
    dernierScoreQuiz = Number(localStorage.getItem('dernierScoreQuiz'));
  }
}

// Écriture avec setItem() et removeItem().
function saveState() {
  if (joueur) {
    localStorage.setItem('pseudo', joueur.pseudo);
    localStorage.setItem('nom', joueur.nom);
    localStorage.setItem('prenom', joueur.prenom);
    localStorage.setItem('age', joueur.age);
  }
  localStorage.setItem('volume', volume);
  localStorage.setItem('mode', mode);
  localStorage.setItem('luminosite', luminosite);

  if (position) {
    localStorage.setItem('latitude', position.latitude);
    localStorage.setItem('longitude', position.longitude);
    localStorage.setItem('precision', position.precision);
  } else {
    localStorage.removeItem('latitude');
    localStorage.removeItem('longitude');
    localStorage.removeItem('precision');
  }

  missionsPlacees.forEach(function (placees, i) {
    localStorage.setItem('mission' + i + 'Placees', placees.join(','));
    localStorage.setItem('mission' + i + 'Terminee', missionsTerminees[i]);
  });

  if (dernierScoreQuiz !== null) {
    localStorage.setItem('dernierScoreQuiz', dernierScoreQuiz);
  }
}

// Sauvegarder après chaque changement.
function persist() {
  if (storageSupported()) {
    saveState();
  }
  if (PAGE === 'settings') {
    updateStoredData();
  }
}


/* ==========================================================================
   5. VÉRIFICATION DU JOUEUR
   ========================================================================== */
// Renvoie un message d'erreur pour chaque champ ('' = le champ est correct).
function checkProfile(prenom, nom, pseudo, age) {
  const erreurs = { prenom: '', nom: '', pseudo: '', age: '' };
  // Prénom et nom : 1 à 40 lettres (accents compris), apostrophes, espaces ou tirets.
  const modeleNom = /^[a-zA-ZÀ-ÿ' -]{1,40}$/;
  if (!modeleNom.test(prenom)) {
    erreurs.prenom = 'Entre un prénom valide (40 caractères maximum).';
  }
  if (!modeleNom.test(nom)) {
    erreurs.nom = 'Entre un nom valide (40 caractères maximum).';
  }
  // Pseudo : 3 à 20 lettres sans accent, chiffres, tirets ou underscores.
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(pseudo)) {
    erreurs.pseudo = '3 à 20 lettres, chiffres, tirets ou underscores, sans espace.';
  }
  // Âge : nombre entier entre 5 et 100 (un champ vide donne 0, donc il est refusé).
  if (!Number.isInteger(age) || age < 5 || age > 100) {
    erreurs.age = 'Entre un âge entier entre 5 et 100 ans.';
  }
  return erreurs;
}

// Le joueur est valide quand il n'y a aucun message d'erreur.
function profileIsValid(erreurs) {
  return erreurs.prenom === '' && erreurs.nom === '' && erreurs.pseudo === '' && erreurs.age === '';
}

// Nombre de missions terminées.
function completedCount() {
  let total = 0;
  missionsTerminees.forEach(function (terminee) {
    if (terminee) {
      total = total + 1;
    }
  });
  return total;
}

// Une mission est ouverte quand la précédente est terminée (la mission 1 est toujours ouverte).
function canAccessMission(numero) {
  if (numero === 0) {
    return true;
  }
  return missionsTerminees[numero - 1];
}


/* ==========================================================================
   6. AFFICHAGE : mettre à jour les textes de la page ouverte
   ========================================================================== */
// Appelée au chargement et après chaque changement.
function refreshAll() {
  updateHeader();
  if (PAGE === 'home') {
    updateHome();
  }
  if (PAGE === 'mission') {
    updateMission();
  }
  if (PAGE === 'settings') {
    updateSettings();
  }
  // Curseur du volume : il existe seulement sur l'accueil et les paramètres.
  const curseur = document.getElementById('volume');
  if (curseur) {
    curseur.value = Math.round(volume * 100);
    document.getElementById('volume-value').textContent = curseur.value + ' %';
  }
}

// En-tête (présent sur toutes les pages) : pseudo, initiales et icône du thème.
function updateHeader() {
  if (joueur) {
    document.getElementById('header-pseudo').textContent = joueur.pseudo;
    document.getElementById('avatar-initials').textContent = (joueur.prenom[0] + joueur.nom[0]).toUpperCase();
    document.getElementById('avatar-initials').hidden = false;
    document.getElementById('avatar-icon').setAttribute('hidden', '');   // l'icône est un SVG : setAttribute
  } else {
    document.getElementById('header-pseudo').textContent = 'Mon joueur';
    document.getElementById('avatar-initials').hidden = true;
    document.getElementById('avatar-icon').removeAttribute('hidden');
  }
  if (mode === 'dark') {
    document.getElementById('header-theme-icon').setAttribute('href', '#i-sun');
  } else {
    document.getElementById('header-theme-icon').setAttribute('href', '#i-moon');
  }
}

// Accueil (index.html) : inscription OU carte du joueur, et état des 3 missions.
function updateHome() {
  if (joueur) {
    const pourcentage = Math.round(completedCount() / 3 * 100);
    document.getElementById('hero-eyebrow').textContent = 'BIENVENUE SUR LE TERRAIN, ' + joueur.pseudo;
    document.getElementById('registration').hidden = true;
    document.getElementById('player-home').hidden = false;
    document.getElementById('player-title').textContent = 'BIENVENUE, ' + joueur.pseudo + '.';
    document.getElementById('player-identity').textContent = joueur.prenom + ' ' + joueur.nom + ' · ' + joueur.age + ' ans';
    document.getElementById('player-missions').textContent = completedCount();
    document.getElementById('player-percent').textContent = pourcentage;
    // Barre de progression : classe pct-0, pct-10 ... pct-100 (la largeur est dans le CSS).
    document.getElementById('player-bar').className = 'pct-' + Math.round(pourcentage / 10) * 10;
  } else {
    document.getElementById('hero-eyebrow').textContent = 'LE COUP D’ENVOI DE TON HISTOIRE';
    document.getElementById('registration').hidden = false;
    document.getElementById('player-home').hidden = true;
  }

  // Les 3 cartes de mission : terminée, ouverte ou verrouillée.
  // forEach donne chaque carte et son numéro i (0, 1, 2).
  Array.from(document.getElementsByClassName('mission-card')).forEach(function (carte, i) {
    const icone = document.getElementById('carte-mission-' + i + '-icone');
    const fleche = document.getElementById('carte-mission-' + i + '-fleche');
    const texte = document.getElementById('carte-mission-' + i + '-texte');
    if (missionsTerminees[i]) {
      carte.className = 'mission-card complete';
      icone.setAttribute('href', '#i-check');
      fleche.setAttribute('href', '#i-check');
      texte.textContent = 'Mission accomplie';
    } else if (canAccessMission(i)) {
      carte.className = 'mission-card available';
      icone.setAttribute('href', '#i-play');
      fleche.setAttribute('href', '#i-arrow');
      texte.textContent = 'Le coup d’envoi t’attend';
    } else {
      carte.className = 'mission-card locked';
      icone.setAttribute('href', '#i-lock');
      fleche.setAttribute('href', '#i-lock');
      texte.textContent = 'Chaque chose en son temps';
    }
  });
}

// Paramètres (parametres.html).
function updateSettings() {
  document.getElementById('info-firstName').textContent = joueur.prenom;
  document.getElementById('info-lastName').textContent = joueur.nom;
  document.getElementById('info-nickname').textContent = joueur.pseudo;
  document.getElementById('info-age').textContent = joueur.age;
  updateLocation();
  if (mode === 'dark') {
    document.getElementById('theme-dark').classList.add('active');
    document.getElementById('theme-light').classList.remove('active');
  } else {
    document.getElementById('theme-light').classList.add('active');
    document.getElementById('theme-dark').classList.remove('active');
  }
  document.getElementById('brightness-range').value = luminosite;
  document.getElementById('brightness-value').textContent = luminosite + ' %';
  updateStoredData();
}

// Thème, luminosité et volume.
function applySettings() {
  document.documentElement.dataset.theme = mode;                // <html data-theme="light">
  document.documentElement.dataset.brightness = luminosite;     // <html data-brightness="90">
  document.getElementById('musique').volume = volume;           // volume de <audio> (0 à 1)
}


/* ==========================================================================
   7. ACCÈS AUX PAGES
   On change de page avec de simples liens <a href="quiz.html">.
   Le JS vérifie seulement que le joueur a le droit d'ouvrir la page.
   ========================================================================== */
// Au chargement : il faut un joueur inscrit, et une mission doit être débloquée.
// Sinon, retour à l'accueil (replace : la page refusée ne reste pas dans l'historique).
function checkAccess() {
  if (PAGE === 'home') {
    return true;
  }
  if (!joueur) {
    location.replace('index.html#registration');   // directement sur le formulaire
    return false;
  }
  if (PAGE === 'mission' && !canAccessMission(MISSION)) {
    location.replace('index.html');
    return false;
  }
  return true;
}

// Accueil sans joueur : on descend jusqu'au formulaire d'inscription.
function askRegistration() {
  document.getElementById('registration').scrollIntoView({ block: 'center' });
  document.getElementById('register-firstName').focus({ preventScroll: true });
  notify('Premier coup de sifflet : crée ton joueur pour commencer ton aventure.');
}

// « Commencer mon voyage » : première mission pas encore terminée, sinon le quiz.
function startJourney() {
  if (!joueur) {
    askRegistration();
    return;
  }
  // indexOf(false) : numéro de la première mission pas encore terminée (-1 si toutes le sont).
  const suivante = missionsTerminees.indexOf(false);
  if (suivante === -1) {
    location.href = 'quiz.html';
  } else {
    location.href = 'mission' + (suivante + 1) + '.html';
  }
}

// Menu sur téléphone : ouvrir ou fermer.
function toggleMenu() {
  const menu = document.getElementById('primary-nav');
  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    document.getElementById('menu-icon').setAttribute('href', '#i-menu');
  } else {
    menu.classList.add('open');
    document.getElementById('menu-icon').setAttribute('href', '#i-close');
  }
}


/* ==========================================================================
   8. INSCRIPTION DU JOUEUR (index.html)
   ========================================================================== */
function submitProfile() {
  // 1. Lire les 4 champs du formulaire.
  const prenom = document.getElementById('register-firstName').value.trim();
  const nom = document.getElementById('register-lastName').value.trim();
  const pseudo = document.getElementById('register-nickname').value.trim();
  const age = Number(document.getElementById('register-age').value);

  // 2. Afficher le message d'erreur sous chaque champ ('' = pas d'erreur).
  const erreurs = checkProfile(prenom, nom, pseudo, age);
  document.getElementById('register-firstName-error').textContent = erreurs.prenom;
  document.getElementById('register-lastName-error').textContent = erreurs.nom;
  document.getElementById('register-nickname-error').textContent = erreurs.pseudo;
  document.getElementById('register-age-error').textContent = erreurs.age;

  // 3. S'il y a une erreur : message général et curseur dans le premier champ faux.
  const resume = document.getElementById('register-summary');
  if (!profileIsValid(erreurs)) {
    resume.hidden = false;
    resume.textContent = 'Encore un petit effort : vérifie les champs indiqués.';
    if (erreurs.prenom !== '') {
      document.getElementById('register-firstName').focus();
    } else if (erreurs.nom !== '') {
      document.getElementById('register-lastName').focus();
    } else if (erreurs.pseudo !== '') {
      document.getElementById('register-nickname').focus();
    } else {
      document.getElementById('register-age').focus();
    }
    return;
  }

  // 4. Tout est correct : on crée le joueur et on l'enregistre.
  resume.hidden = true;
  joueur = { prenom: prenom, nom: nom, pseudo: pseudo, age: age };
  persist();
  refreshAll();
  window.scrollTo(0, 0);
  notify('Bienvenue ' + joueur.pseudo + ' ! Ton maillot est prêt.', 'success');
}


/* ==========================================================================
   9. CARTE INTERACTIVE DES STADES (index.html)
   ========================================================================== */
// Clic sur un point : on l'allume et on affiche la fiche du stade (les fiches sont dans index.html).
function showStadium(id) {
  Array.from(document.getElementsByClassName('map-marker')).forEach(function (point) {
    if (point.dataset.stadium === id) {
      point.classList.add('active');
    } else {
      point.classList.remove('active');
    }
  });
  Array.from(document.getElementsByClassName('map-fiche')).forEach(function (fiche) {
    fiche.hidden = (fiche.id !== 'fiche-' + id);
  });
}


/* ==========================================================================
   10. MISSIONS : DRAG & DROP (méthode du cours)
   Étape 1 : élément draggable="true" (dans le HTML) + écouteur dragstart.
   Étape 2 : dragstart garde l'id de l'élément avec dataTransfer.setData().
   Étape 3 : la zone autorise le dépôt avec dragover + preventDefault().
   Étape 4 : drop récupère l'id avec getData(), retrouve l'élément avec
             getElementById() et l'ajoute dans la zone avec appendChild().
   ========================================================================== */
// Étape 2
function drag(ev) {
  ev.dataTransfer.setData('text/plain', ev.target.id);
  ev.target.classList.add('dragging');
}

// Fin du déplacement (réussi ou non).
function finDrag(ev) {
  ev.target.classList.remove('dragging');
  Array.from(document.getElementsByClassName('drop-zone')).forEach(function (zone) {
    zone.classList.remove('drag-over');
  });
  removeDragData(ev);
}

function removeDragData(ev) {
  ev.dataTransfer.clearData();
}

// Étape 3
function allowDrop(ev) {
  ev.preventDefault();
}

// Étape 4
function drop(ev) {
  ev.preventDefault();
  const zone = ev.currentTarget;   // la zone qui reçoit l'élément
  zone.classList.remove('drag-over');
  const id = ev.dataTransfer.getData('text/plain');
  const element = document.getElementById(id);
  if (element) {
    verifierDepot(element, zone);
  }
}

// Surbrillance de la zone survolée.
function entrerZone(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add('drag-over');
}

function quitterZone(ev) {
  ev.currentTarget.classList.remove('drag-over');
}

// Les éléments et les zones sont déjà dans le HTML : on leur ajoute les écouteurs.
function activerDragAndDrop() {
  Array.from(document.getElementsByClassName('drag-item')).forEach(function (element) {
    element.addEventListener('dragstart', drag);
    element.addEventListener('dragend', finDrag);
  });
  Array.from(document.getElementsByClassName('drop-zone')).forEach(function (zone) {
    zone.addEventListener('dragenter', entrerZone);
    zone.addEventListener('dragover', allowDrop);
    zone.addEventListener('dragleave', quitterZone);
    zone.addEventListener('drop', drop);
  });
}

// Bonne zone : l'élément devient un enfant de la zone (appendChild) et ne se déplace plus.
function placeItem(element) {
  document.getElementById('answers-' + element.dataset.cible).appendChild(element);
  element.setAttribute('draggable', 'false');
  element.classList.add('placed');
}

// Message sous les zones : vert (« success ») ou rouge (« error »).
function setFeedback(type, message) {
  document.getElementById('feedback-' + MISSION).className = 'feedback ' + type;
  if (type === 'success') {
    document.getElementById('feedback-' + MISSION + '-icone').setAttribute('href', '#i-check-circle');
  } else {
    document.getElementById('feedback-' + MISSION + '-icone').setAttribute('href', '#i-info');
  }
  document.getElementById('feedback-' + MISSION + '-texte').textContent = message;
}

// Vérifie le dépôt : « Bravo ! » ou message d'erreur qui explique la bonne réponse.
function verifierDepot(element, zone) {
  if (element.getAttribute('draggable') !== 'true') {
    return;   // élément déjà placé
  }
  Array.from(document.getElementsByClassName('drop-zone')).forEach(function (z) {
    z.classList.remove('is-error');
  });
  // La bonne zone de l'élément est écrite dans son attribut data-cible.
  if ('zone-' + element.dataset.cible !== zone.id) {
    zone.classList.add('is-error');
    setFeedback('error', element.dataset.erreur + ' ' + element.dataset.explication + ' Réessaie !');
    return;
  }
  placeItem(element);
  missionsPlacees[MISSION].push(element.id);
  persist();
  setFeedback('success', 'Bravo ! ' + element.dataset.explication);
  updateMission();
}

// Compteur, zones pleines, boutons et textes de la mission ouverte.
function updateMission() {
  const elements = Array.from(document.getElementsByClassName('drag-item'));
  let places = 0;
  elements.forEach(function (element) {
    if (element.classList.contains('placed')) {
      places = places + 1;
    }
  });
  const tousPlaces = (places === elements.length);
  const terminee = missionsTerminees[MISSION];
  document.getElementById('compteur-' + MISSION).textContent = places;

  // Chaque zone : combien d'éléments attendus, combien déjà dedans.
  Array.from(document.getElementsByClassName('drop-zone')).forEach(function (zone) {
    const cible = zone.id.replace('zone-', '');
    let attendus = 0;
    elements.forEach(function (element) {
      if (element.dataset.cible === cible) {
        attendus = attendus + 1;
      }
    });
    const dedans = document.getElementById('answers-' + cible).children.length;
    if (dedans === attendus) {
      zone.classList.add('is-full');
    } else {
      zone.classList.remove('is-full');
    }
    // Compteur « 0/3 » des vestiaires (mission 2 seulement).
    const nombre = document.getElementById('nombre-' + cible);
    if (nombre) {
      nombre.textContent = dedans;
    }
  });

  // Boutons : « Terminer » cliquable quand tout est placé, « Suivant » quand la mission est terminée.
  document.getElementById('terminer-' + MISSION).hidden = terminee;
  document.getElementById('terminer-' + MISSION).disabled = !tousPlaces;
  document.getElementById('suivant-' + MISSION).hidden = !terminee;

  // Textes d'aide.
  const aide = document.getElementById('aide-' + MISSION);
  if (!tousPlaces) {
    aide.textContent = 'Fais glisser chaque élément avec la souris et lâche-le dans la bonne zone.';
  } else if (terminee) {
    aide.textContent = 'Toutes les associations sont correctes. Tu peux continuer ton parcours.';
  } else {
    aide.textContent = 'Toutes les associations sont correctes. Valide maintenant ta mission pour débloquer la suite.';
  }
  if (terminee) {
    document.getElementById('bas-' + MISSION).textContent = 'Mission déjà terminée.';
  } else {
    document.getElementById('bas-' + MISSION).textContent = 'Place tous les éléments pour terminer la mission.';
  }
}

// Bouton « Terminer la mission » (cliquable seulement quand tout est placé).
function finishMission() {
  missionsTerminees[MISSION] = true;
  persist();
  if (MISSION === 2) {
    setFeedback('success', 'Mission accomplie ! Bravo ' + joueur.pseudo + '. Les trois missions sont terminées : place au quiz final !');
  } else {
    setFeedback('success', 'Mission accomplie ! Bravo ' + joueur.pseudo + '. La mission suivante est débloquée.');
  }
  refreshAll();
}

// Au chargement : on remet dans leur zone les éléments déjà bien placés.
function restoreMission() {
  missionsPlacees[MISSION].forEach(function (id) {
    const element = document.getElementById(id);
    if (element) {
      placeItem(element);
    }
  });
  if (missionsTerminees[MISSION]) {
    setFeedback('success', 'Mission accomplie ! Ta progression est enregistrée.');
  }
}


/* ==========================================================================
   11. QUIZ FINAL (quiz.html) — score aussi dans le sessionStorage
   ========================================================================== */
let question = 0;      // numéro de la question affichée (0 à 9)
let reponses = [];     // réponse choisie pour chaque question

// À l'ouverture : le résultat s'il existe déjà, sinon la première question.
function openQuiz() {
  if (dernierScoreQuiz !== null) {
    showQuizResult();
  } else {
    startQuiz();
  }
}

function startQuiz() {
  question = 0;
  reponses = [];
  Array.from(document.getElementsByClassName('quiz-option')).forEach(function (option) {
    option.classList.remove('selected');
  });
  document.getElementById('quiz-game').hidden = false;
  document.getElementById('quiz-result').hidden = true;
  showQuestion();
}

// Affiche seulement la question en cours.
function showQuestion() {
  Array.from(document.getElementsByClassName('quiz-card')).forEach(function (carte, i) {
    carte.hidden = (i !== question);
  });
  document.getElementById('quiz-step').textContent = 'QUESTION ' + (question + 1) + ' SUR 10';
  document.getElementById('quiz-percent').textContent = (question + 1) * 10 + ' %';
  document.getElementById('quiz-bar').className = 'pct-' + (question + 1) * 10;
  // « Suivant » est désactivé tant qu'aucune réponse n'est choisie.
  document.getElementById('quiz-next').disabled = (reponses[question] === undefined);
  if (question === 9) {
    document.getElementById('quiz-next-label').textContent = 'DÉCOUVRIR MON SCORE';
  } else {
    document.getElementById('quiz-next-label').textContent = 'QUESTION SUIVANTE';
  }
}

// Clic sur une réponse : on la retient et on l'allume.
function chooseQuizAnswer(bouton) {
  reponses[question] = Number(bouton.dataset.quizOption);
  Array.from(document.getElementById('question-' + question).getElementsByClassName('quiz-option')).forEach(function (option) {
    option.classList.remove('selected');
  });
  bouton.classList.add('selected');
  document.getElementById('quiz-next').disabled = false;
}

// Bouton « Suivant » : question suivante, ou calcul du score après la 10e.
function advanceQuiz() {
  if (question < 9) {
    question = question + 1;
    showQuestion();
    return;
  }
  let score = 0;
  reponses.forEach(function (reponse, i) {
    if (reponse === BONNES_REPONSES[i]) {
      score = score + 1;
    }
  });
  dernierScoreQuiz = score;
  // Score du quiz dans le sessionStorage (cours : sessionStorage.setItem("score", 120)).
  if (storageSupported()) {
    sessionStorage.setItem('scoreQuiz', score * 10);
    sessionStorage.setItem('pseudoQuiz', joueur.pseudo);
  }
  persist();
  showQuizResult();
  window.scrollTo(0, 0);
}

function showQuizResult() {
  const score = dernierScoreQuiz;
  document.getElementById('quiz-game').hidden = true;
  document.getElementById('quiz-result').hidden = false;
  // Titre : « légende » à partir de 8/10, sinon « le talent se travaille ».
  if (score >= 8) {
    document.getElementById('result-title-good').hidden = false;
    document.getElementById('result-title-work').hidden = true;
  } else {
    document.getElementById('result-title-good').hidden = true;
    document.getElementById('result-title-work').hidden = false;
  }
  document.getElementById('result-score').textContent = score;
  // Anneau SVG : 339.3 = tour complet du cercle.
  document.getElementById('result-ring').setAttribute('stroke-dashoffset', 339.3 * (1 - score / 10));
  // Message demandé par le sujet : « Bravo [pseudo], tu as réussi [X]% de ta mission ! »
  document.getElementById('result-message').textContent = 'Bravo ' + joueur.pseudo + ', tu as réussi ' + score * 10 + '% de ta mission !';
}


/* ==========================================================================
   12. JEU DU PENDU (pendu.html)
   ========================================================================== */
let mot = '';          // mot à trouver
let lettres = [];      // lettres déjà proposées

// Nombre de lettres proposées qui ne sont pas dans le mot.
function countErrors() {
  let erreurs = 0;
  lettres.forEach(function (lettre) {
    if (!mot.includes(lettre)) {
      erreurs = erreurs + 1;
    }
  });
  return erreurs;
}

// Gagné quand toutes les lettres du mot ont été proposées.
function isWon() {
  let gagne = true;
  // split('') découpe le mot en lettres : 'BUT' → ['B', 'U', 'T'].
  mot.split('').forEach(function (lettre) {
    if (!lettres.includes(lettre)) {
      gagne = false;
    }
  });
  return gagne;
}

// Nouvelle partie avec un mot différent du précédent.
function newHangmanGame() {
  let nouveau = mot;
  while (nouveau === mot) {
    nouveau = MOTS[Math.floor(Math.random() * MOTS.length)];
  }
  mot = nouveau;
  lettres = [];
  Array.from(document.getElementsByClassName('letter-key')).forEach(function (touche) {
    touche.disabled = false;
    touche.classList.remove('good');
    touche.classList.remove('bad');
  });
  updateHangman();
}

// Clic sur une lettre (une lettre déjà jouée est désactivée, on ne peut pas la recliquer).
function guessLetter(touche) {
  const lettre = touche.dataset.letter;
  lettres.push(lettre);
  touche.disabled = true;
  if (mot.includes(lettre)) {
    touche.classList.add('good');
  } else {
    touche.classList.add('bad');
  }

  const gagne = isWon();
  const perdu = countErrors() >= 6;
  if (gagne || perdu) {
    // Dernier résultat enregistré directement dans le localStorage (setItem du cours).
    if (storageSupported()) {
      if (gagne) {
        localStorage.setItem('dernierResultatPendu', 'gagné');
      } else {
        localStorage.setItem('dernierResultatPendu', 'perdu');
      }
      localStorage.setItem('dernierScorePendu', countErrors());
      localStorage.setItem('dernierMotPendu', mot);
    }
    if (gagne) {
      notify('Bravo ' + joueur.pseudo + ' !', 'success');
    } else {
      notify('Perdu ! Le mot était : ' + mot);
    }
  }
  updateHangman();
}

function updateHangman() {
  const erreurs = countErrors();
  const gagne = isWon();
  const perdu = (erreurs >= 6);
  const fini = (gagne || perdu);

  document.getElementById('attempts-left').textContent = 6 - erreurs;
  document.getElementById('errors-count').textContent = erreurs;

  // Les 6 petits points : un point « used » par erreur.
  Array.from(document.getElementById('error-dots').children).forEach(function (point, i) {
    if (i < erreurs) {
      point.classList.add('used');
    } else {
      point.classList.remove('used');
    }
  });

  // Le bonhomme : une partie de plus par erreur (éléments SVG : setAttribute / removeAttribute).
  Array.from(document.getElementById('gallows').getElementsByClassName('person')).forEach(function (partie, i) {
    if (i < erreurs) {
      partie.removeAttribute('hidden');
    } else {
      partie.setAttribute('hidden', '');
    }
  });

  // Les cases du mot : « _ » tant que la lettre n'est pas trouvée.
  Array.from(document.getElementById('word-slots').children).forEach(function (caseLettre, i) {
    if (i >= mot.length) {
      caseLettre.hidden = true;      // case en trop pour ce mot
    } else {
      caseLettre.hidden = false;
      const trouvee = lettres.includes(mot[i]);
      if (trouvee) {
        caseLettre.textContent = mot[i];
        caseLettre.className = 'word-slot revealed';
      } else if (fini) {
        caseLettre.textContent = mot[i];
        caseLettre.className = 'word-slot missed';
      } else {
        caseLettre.textContent = '_';
        caseLettre.className = 'word-slot';
      }
    }
  });

  // Partie finie : toutes les lettres sont bloquées.
  if (fini) {
    Array.from(document.getElementsByClassName('letter-key')).forEach(function (touche) {
      touche.disabled = true;
    });
  }

  // Message sous le clavier.
  const message = document.getElementById('hangman-message');
  if (gagne) {
    message.className = 'hangman-message won';
    document.getElementById('hangman-title').textContent = 'Bravo ' + joueur.pseudo + ' !';
    document.getElementById('hangman-text').textContent = 'Tu as trouvé ' + mot + '.';
  } else if (perdu) {
    message.className = 'hangman-message lost';
    document.getElementById('hangman-title').textContent = 'Perdu ! Le mot était : ' + mot;
    document.getElementById('hangman-text').textContent = 'Clique sur Rejouer pour prendre ta revanche.';
  } else {
    message.className = 'hangman-message';
    document.getElementById('hangman-title').textContent = '';
    document.getElementById('hangman-text').textContent = 'Un indice : ' + mot.length + ' lettres, une seule passion. Les lettres déjà proposées sont désactivées.';
  }

  // Bouton « Rejouer » mis en avant quand la partie est finie.
  if (fini) {
    document.getElementById('hangman-replay').className = 'button';
  } else {
    document.getElementById('hangman-replay').className = 'button secondary';
  }
}


/* ==========================================================================
   13. PARAMÈTRES (parametres.html) : thème, géolocalisation, données
   ========================================================================== */
function setTheme(nouveauMode) {
  mode = nouveauMode;
  applySettings();
  persist();
  refreshAll();
}

/* Géolocalisation (cours) : navigator.geolocation.getCurrentPosition(succès, erreur, options).
   La position n'est demandée qu'après un clic, avec l'accord de l'utilisateur. */
let rechercheEnCours = false;

function showGeoMessage(message, type) {
  rechercheEnCours = false;
  const sortie = document.getElementById('location-output');
  sortie.hidden = false;
  sortie.className = 'location-output ' + type;
  sortie.textContent = message;
  updateLocation();
  notify(message, type);
}

function getLocation() {
  if (rechercheEnCours) {
    return;
  }
  if (navigator.geolocation) {
    rechercheEnCours = true;
    const sortie = document.getElementById('location-output');
    sortie.hidden = false;
    sortie.className = 'location-output';
    sortie.textContent = 'En attente de ton autorisation et de la position du navigateur...';
    updateLocation();
    navigator.geolocation.getCurrentPosition(showPosition, showError, { maximumAge: 60000, timeout: 12000, enableHighAccuracy: false });
  } else {
    showGeoMessage('La géolocalisation n’est pas prise en charge par ce navigateur.', 'error');
  }
}

// Succès : latitude, longitude et précision (pos.coords).
function showPosition(pos) {
  position = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    precision: pos.coords.accuracy
  };
  persist();
  showGeoMessage('Position enregistrée sur cet appareil.', 'success');
}

// Erreur : codes du cours (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT).
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      showGeoMessage('Tu as refusé la géolocalisation. Aucune position n’a été enregistrée.', 'error');
      break;
    case error.POSITION_UNAVAILABLE:
      showGeoMessage('Ta position est indisponible pour le moment. Vérifie les services de localisation.', 'error');
      break;
    case error.TIMEOUT:
      showGeoMessage('La demande de position a pris trop de temps. Réessaie quand tu veux.', 'error');
      break;
    default:
      showGeoMessage('Une erreur inconnue est survenue pendant la géolocalisation.', 'error');
  }
}

function clearLocation() {
  position = null;
  persist();
  showGeoMessage('Ta position a été effacée.', 'success');
}

function updateLocation() {
  document.getElementById('geo-button').disabled = rechercheEnCours;
  const texte = document.getElementById('geo-label');
  if (rechercheEnCours) {
    texte.textContent = 'LOCALISATION EN COURS...';
  } else if (position) {
    texte.textContent = 'ACTUALISER MA POSITION';
  } else {
    texte.textContent = 'AUTORISER MA LOCALISATION';
  }
  if (position) {
    document.getElementById('geo-clear').hidden = false;
    document.getElementById('geo-coords').hidden = false;
    document.getElementById('geo-coords').textContent = 'Latitude : ' + position.latitude.toFixed(4) + ' · Longitude : ' + position.longitude.toFixed(4);
  } else {
    document.getElementById('geo-clear').hidden = true;
    document.getElementById('geo-coords').hidden = true;
  }
}

// Liste des données du localStorage, parcourue avec length et key(i) comme dans le cours.
function updateStoredData() {
  const liste = document.getElementById('stored-data');
  liste.textContent = '';
  if (!storageSupported()) {
    return;
  }
  for (let i = 0; i < localStorage.length; i++) {
    const cle = localStorage.key(i);
    const ligne = document.createElement('li');
    const nomCle = document.createElement('strong');
    nomCle.textContent = cle + ' : ';
    ligne.appendChild(nomCle);
    ligne.appendChild(document.createTextNode(localStorage.getItem(cle)));
    liste.appendChild(ligne);
  }
}

// Supprime tout avec localStorage.clear() et sessionStorage.clear(), puis retour à l'accueil.
function clearAllData() {
  if (!confirm('Supprimer ton joueur, ta progression et tes réglages de cet appareil ?')) {
    return;
  }
  if (storageSupported()) {
    localStorage.clear();
    sessionStorage.clear();
  }
  location.href = 'index.html';
}


/* ==========================================================================
   14. MUSIQUE : balise <audio id="musique"> (fichier audio/road-to-glory.mp3)
   ========================================================================== */
const musique = document.getElementById('musique');

function toggleMusic() {
  if (musique.paused) {
    musique.volume = volume;
    musique.play();
  } else {
    musique.pause();
  }
}

// Les événements play / pause de la balise <audio> mettent à jour les icônes.
function updateMusicButtons() {
  let icone = 'play';
  let iconeEnTete = 'volume-off';
  if (!musique.paused) {
    icone = 'pause';
    iconeEnTete = 'volume';
  }
  document.getElementById('header-music-icon').setAttribute('href', '#i-' + iconeEnTete);
  Array.from(document.getElementsByClassName('js-audio-icon')).forEach(function (use) {
    use.setAttribute('href', '#i-' + icone);
  });
}
musique.addEventListener('play', updateMusicButtons);
musique.addEventListener('pause', updateMusicButtons);


/* ==========================================================================
   15. ÉCOUTEURS D'ÉVÉNEMENTS
   Méthode du cours : element.addEventListener('click', fonction);
   Les liens <a href> du menu n'ont besoin d'aucun écouteur.
   Chaque page n'ajoute que les écouteurs de ses propres boutons.
   ========================================================================== */

// ---------- Toutes les pages : en-tête, musique, message ----------
document.getElementById('menu-button').addEventListener('click', toggleMenu);

document.getElementById('header-theme').addEventListener('click', function () {
  if (mode === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

// Boutons de la musique (en-tête, accueil, paramètres).
Array.from(document.getElementsByClassName('btn-musique')).forEach(function (bouton) {
  bouton.addEventListener('click', toggleMusic);
});

// Curseur du volume (accueil et paramètres) : événement « input » à chaque mouvement.
const curseurVolume = document.getElementById('volume');
if (curseurVolume) {
  curseurVolume.addEventListener('input', function () {
    volume = Number(curseurVolume.value) / 100;
    applySettings();
    persist();
    refreshAll();
  });
}

document.getElementById('toast-close').addEventListener('click', function () {
  document.getElementById('toast').classList.remove('visible');
});

// Événement storage (cours) : un AUTRE onglet du site a modifié le localStorage.
window.addEventListener('storage', function () {
  location.reload();
});

// ---------- Accueil (index.html) ----------
if (PAGE === 'home') {
  // Deux boutons : « Commencer mon voyage » et « Continuer ».
  Array.from(document.getElementsByClassName('btn-commencer')).forEach(function (bouton) {
    bouton.addEventListener('click', startJourney);
  });

  // Les 3 cartes de mission sont des liens : on bloque seulement une mission verrouillée.
  Array.from(document.getElementsByClassName('mission-card')).forEach(function (carte, i) {
    carte.addEventListener('click', function (event) {
      if (!joueur) {
        event.preventDefault();   // le lien n'est pas suivi
        askRegistration();
      } else if (!canAccessMission(i)) {
        event.preventDefault();
        notify('Cette mission est encore verrouillée. Termine d’abord la mission précédente.', 'error');
      }
    });
  });

  // Les 8 points de la carte des stades.
  Array.from(document.getElementsByClassName('map-marker')).forEach(function (point) {
    point.addEventListener('click', function () {
      showStadium(point.dataset.stadium);
    });
  });

  // Formulaire d'inscription.
  document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();   // empêche le rechargement de la page
    submitProfile();
  });

  // La vidéo et la musique ne jouent pas en même temps.
  document.getElementById('football-video').addEventListener('play', function () {
    musique.pause();
  });
  musique.addEventListener('play', function () {
    document.getElementById('football-video').pause();
  });
}

// ---------- Missions (mission1.html, mission2.html, mission3.html) ----------
if (PAGE === 'mission') {
  document.getElementById('terminer-' + MISSION).addEventListener('click', finishMission);
}

// ---------- Quiz (quiz.html) ----------
if (PAGE === 'quiz') {
  Array.from(document.getElementsByClassName('quiz-option')).forEach(function (option) {
    option.addEventListener('click', function () {
      chooseQuizAnswer(option);
    });
  });
  document.getElementById('quiz-next').addEventListener('click', advanceQuiz);
  document.getElementById('quiz-retry').addEventListener('click', startQuiz);
}

// ---------- Pendu (pendu.html) ----------
if (PAGE === 'hangman') {
  Array.from(document.getElementsByClassName('letter-key')).forEach(function (touche) {
    touche.addEventListener('click', function () {
      guessLetter(touche);
    });
  });
  document.getElementById('hangman-replay').addEventListener('click', newHangmanGame);
}

// ---------- Paramètres (parametres.html) ----------
if (PAGE === 'settings') {
  document.getElementById('geo-button').addEventListener('click', getLocation);
  document.getElementById('geo-clear').addEventListener('click', clearLocation);
  document.getElementById('theme-dark').addEventListener('click', function () {
    setTheme('dark');
  });
  document.getElementById('theme-light').addEventListener('click', function () {
    setTheme('light');
  });
  document.getElementById('brightness-range').addEventListener('input', function () {
    luminosite = Number(document.getElementById('brightness-range').value);
    applySettings();
    persist();
    refreshAll();
  });
  document.getElementById('clear-all').addEventListener('click', clearAllData);
}


/* ==========================================================================
   16. DÉMARRAGE DE LA PAGE
   ========================================================================== */
readState();
applySettings();
if (checkAccess()) {
  if (PAGE === 'mission') {
    restoreMission();
    activerDragAndDrop();
  }
  if (PAGE === 'quiz') {
    openQuiz();
  }
  if (PAGE === 'hangman') {
    newHangmanGame();
  }
  // Arrivée sur l'accueil depuis une page protégée (index.html#registration) sans joueur.
  if (PAGE === 'home' && !joueur && location.hash === '#registration') {
    notify('Premier coup de sifflet : crée ton joueur pour commencer ton aventure.');
  }
  refreshAll();
}
