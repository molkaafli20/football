'use strict';

/* ==========================================================================
   FOOTBALL JOURNEY — script.js
   Tout le HTML des pages est écrit dans index.html.
   Ce fichier gère seulement les fonctionnalités :
   - afficher la bonne page (attribut hidden) et mettre à jour les textes (textContent) ;
   - Drag & Drop, quiz, pendu, carte des stades, musique ;
   - Web Storage (localStorage / sessionStorage) et géolocalisation.
   Sélection : document.getElementById et document.getElementsByClassName (sans raccourci).
   Événements : chaque bouton a son propre addEventListener (section 13).
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DU JEU
   ========================================================================== */
const NB_MISSIONS = 3;
const PAGES = ['home', 'mission-0', 'mission-1', 'mission-2', 'quiz', 'hangman', 'settings'];
const TITRES = { home: 'Deviens une légende !', 'mission-0': 'Le rêve commence', 'mission-1': 'L’école de football', 'mission-2': 'Le jeune talent', quiz: 'Quiz final', hangman: 'Pendu football', settings: 'Paramètres' };
// Numéro de la bonne réponse (0 = A, 1 = B, 2 = C, 3 = D) pour chacune des 10 questions du quiz.
const BONNES_REPONSES = [2, 3, 1, 2, 0, 3, 1, 2, 0, 3];
const MOTS = ['FOOTBALL', 'STADE', 'BALLON', 'GARDIEN', 'ARBITRE', 'BUT', 'JOUEUR', 'MATCH', 'COUPE', 'PENALTY'];

/* ==========================================================================
   2. OUTILS
   ========================================================================== */
// Petit message en bas de l'écran.
let minuteur = null;

function notify(message, type) {
  const bulle = document.getElementById('toast');
  document.getElementById('toast-text').textContent = message;
  bulle.classList.add('visible');
  bulle.classList.toggle('error', type === 'error');   // rouge seulement pour une erreur
  clearTimeout(minuteur);                               // annule l'ancien minuteur
  minuteur = setTimeout(function () {
    bulle.classList.remove('visible');
  }, 5000);
}

/* ==========================================================================
   3. ÉTAT DU JOUEUR ET WEB STORAGE
   Chaque information a sa propre clé dans le localStorage (que des chaînes
   simples, comme dans le cours) :
   pseudo, nom, prenom, age, volume, mode, luminosite, latitude, longitude,
   precision, dernierResultatPendu, dernierScorePendu, dernierMotPendu,
   mission0Placees, mission0Terminee (idem 1 et 2), dernierScoreQuiz.
   ========================================================================== */
function freshState() {
  return {
    profile: null,
    settings: { volume: 0.35, theme: 'dark', brightness: 100, location: null },
    missions: [{ placed: [], completed: false }, { placed: [], completed: false }, { placed: [], completed: false }],
    quiz: { lastScore: null },
    hangman: { lastResult: null }
  };
}

// Test du cours : le navigateur supporte-t-il le Web Storage ?
function storageSupported() {
  return typeof(Storage) !== 'undefined';
}

// Lecture avec getItem(), clé par clé.
function readState() {
  const s = freshState();
  if (!storageSupported()) return s;
  if (localStorage.getItem('pseudo') !== null) {
    const checked = validateProfile({
      firstName: localStorage.getItem('prenom'), lastName: localStorage.getItem('nom'),
      nickname: localStorage.getItem('pseudo'), age: localStorage.getItem('age')
    });
    if (checked.valid) s.profile = checked.profile;
  }
  // On garde la valeur enregistrée seulement si elle est valide (volume entre 0 et 1, luminosité entre 60 et 120).
  const volume = Number(localStorage.getItem('volume'));
  if (localStorage.getItem('volume') !== null && volume >= 0 && volume <= 1) s.settings.volume = volume;
  const luminosite = Number(localStorage.getItem('luminosite'));
  if (luminosite >= 60 && luminosite <= 120) s.settings.brightness = luminosite;
  s.settings.theme = localStorage.getItem('mode') === 'light' ? 'light' : 'dark';
  if (localStorage.getItem('latitude') !== null) {
    s.settings.location = {
      latitude: Number(localStorage.getItem('latitude')),
      longitude: Number(localStorage.getItem('longitude')),
      accuracy: Number(localStorage.getItem('precision'))
    };
  }
  if (localStorage.getItem('dernierResultatPendu') !== null) {
    s.hangman.lastResult = {
      won: localStorage.getItem('dernierResultatPendu') === 'gagné',
      word: localStorage.getItem('dernierMotPendu'),
      errors: Number(localStorage.getItem('dernierScorePendu'))
    };
  }
  // Missions : les éléments placés sont séparés par des virgules (« drag-0-ball,drag-0-boots »).
  for (let i = 0; i < NB_MISSIONS; i++) {
    const placees = localStorage.getItem('mission' + i + 'Placees');
    s.missions[i].placed = placees ? placees.split(',') : [];
    s.missions[i].completed = localStorage.getItem('mission' + i + 'Terminee') === 'true';
  }
  // Dernier score du quiz.
  const score = localStorage.getItem('dernierScoreQuiz');
  if (score !== null && Number.isInteger(Number(score))) s.quiz.lastScore = Number(score);
  return s;
}

// Écriture avec setItem() / removeItem().
function saveState() {
  const p = state.profile;
  if (p) {
    localStorage.setItem('pseudo', p.nickname);
    localStorage.setItem('nom', p.lastName);
    localStorage.setItem('prenom', p.firstName);
    localStorage.setItem('age', p.age);
  }
  localStorage.setItem('volume', state.settings.volume);
  localStorage.setItem('mode', state.settings.theme);
  localStorage.setItem('luminosite', state.settings.brightness);
  const loc = state.settings.location;
  if (loc) {
    localStorage.setItem('latitude', loc.latitude);
    localStorage.setItem('longitude', loc.longitude);
    localStorage.setItem('precision', loc.accuracy);
  } else {
    localStorage.removeItem('latitude');
    localStorage.removeItem('longitude');
    localStorage.removeItem('precision');
  }
  const last = state.hangman.lastResult;
  if (last) {
    localStorage.setItem('dernierResultatPendu', last.won ? 'gagné' : 'perdu');
    localStorage.setItem('dernierScorePendu', last.errors);
    localStorage.setItem('dernierMotPendu', last.word);
  }
  state.missions.forEach((m, i) => {
    localStorage.setItem('mission' + i + 'Placees', m.placed.join(','));
    localStorage.setItem('mission' + i + 'Terminee', m.completed);
  });
  if (state.quiz.lastScore !== null) localStorage.setItem('dernierScoreQuiz', state.quiz.lastScore);
}

function persist() {
  if (storageSupported()) saveState();
  updateStoredData();
}

function validateProfile(input) {
  const profile = {
    firstName: String(input.firstName || '').trim().replace(/\s+/g, ' '),
    lastName: String(input.lastName || '').trim().replace(/\s+/g, ' '),
    nickname: String(input.nickname || '').trim(),
    age: Number(input.age)
  };
  const errors = {};
  const namePattern = /^[\p{L}][\p{L}\p{M}' -]{0,39}$/u;
  if (!namePattern.test(profile.firstName)) errors.firstName = 'Entre un prénom valide (40 caractères maximum).';
  if (!namePattern.test(profile.lastName)) errors.lastName = 'Entre un nom valide (40 caractères maximum).';
  if (!/^[\p{L}\p{N}_-]{3,20}$/u.test(profile.nickname)) errors.nickname = '3 à 20 lettres, chiffres, tirets ou underscores, sans espace.';
  if (!Number.isInteger(profile.age) || profile.age < 5 || profile.age > 100 || String(input.age).trim() === '') errors.age = 'Entre un âge entier entre 5 et 100 ans.';
  return { profile, errors, valid: Object.keys(errors).length === 0 };
}

let state = readState();
let currentPage = 'home';

function completedCount() {
  return state.missions.filter(m => m.completed).length;
}
// Une mission est ouverte quand toutes les précédentes sont terminées.
function canAccessMission(id) {
  return state.missions.slice(0, id).every(m => m.completed);
}

/* ==========================================================================
   4. AFFICHAGE : montrer une page et mettre à jour les textes
   ========================================================================== */
// Montre une seule page de <main> et cache les autres (attribut hidden).
function showPage(name) {
  currentPage = name;
  PAGES.forEach(page => { document.getElementById('page-' + page).hidden = page !== name; });
  const menu = name.startsWith('mission') ? 'home' : name;
  Array.from(document.getElementsByClassName('nav-button')).forEach(button => {
    button.classList.toggle('active', button.dataset.route === menu);
    if (button.dataset.route === menu) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  document.title = 'FOOTBALL JOURNEY - ' + TITRES[name];
  window.scrollTo(0, 0);
}

// Met à jour tout ce qui dépend du joueur (appelée après chaque changement).
function refreshAll() {
  const p = state.profile;
  // En-tête
  document.getElementById('header-pseudo').textContent = p ? p.nickname : 'Mon joueur';
  document.getElementById('avatar-initials').textContent = p ? (p.firstName[0] + p.lastName[0]).toUpperCase() : '';
  document.getElementById('avatar-initials').hidden = !p;
  document.getElementById('avatar-icon').toggleAttribute('hidden', Boolean(p));
  document.getElementById('header-theme-icon').setAttribute('href', '#i-' + (state.settings.theme === 'dark' ? 'sun' : 'moon'));

  // Accueil : inscription OU carte du joueur
  document.getElementById('hero-eyebrow').textContent = p ? 'BIENVENUE SUR LE TERRAIN, ' + p.nickname : 'LE COUP D’ENVOI DE TON HISTOIRE';
  document.getElementById('registration').hidden = Boolean(p);
  document.getElementById('player-home').hidden = !p;
  const percent = Math.round(completedCount() / NB_MISSIONS * 100);
  if (p) {
    document.getElementById('player-title').textContent = 'BIENVENUE, ' + p.nickname + '.';
    document.getElementById('player-identity').textContent = p.firstName + ' ' + p.lastName + ' · ' + p.age + ' ans';
    document.getElementById('player-missions').textContent = completedCount();
    document.getElementById('player-percent').textContent = percent;
    document.getElementById('player-bar').className = 'pct-' + Math.round(percent / 10) * 10;
  }

  // Cartes des missions : verrouillée, ouverte ou terminée
  for (let i = 0; i < NB_MISSIONS; i++) {
    const done = state.missions[i].completed;
    const open = canAccessMission(i);
    document.getElementById('carte-mission-' + i).className = 'mission-card ' + (done ? 'complete' : open ? 'available' : 'locked');
    document.getElementById('carte-mission-' + i + '-icone').setAttribute('href', '#i-' + (done ? 'check' : open ? 'play' : 'lock'));
    document.getElementById('carte-mission-' + i + '-fleche').setAttribute('href', '#i-' + (done ? 'check' : open ? 'arrow' : 'lock'));
    document.getElementById('carte-mission-' + i + '-texte').textContent = done ? 'Mission accomplie' : open ? 'Le coup d’envoi t’attend' : 'Chaque chose en son temps';
    updateMission(i);
  }

  // Paramètres
  if (p) {
    document.getElementById('info-firstName').textContent = p.firstName;
    document.getElementById('info-lastName').textContent = p.lastName;
    document.getElementById('info-nickname').textContent = p.nickname;
    document.getElementById('info-age').textContent = p.age;
  }
  updateLocation();
  document.getElementById('theme-dark').classList.toggle('active', state.settings.theme === 'dark');
  document.getElementById('theme-light').classList.toggle('active', state.settings.theme === 'light');
  document.getElementById('brightness-range').value = state.settings.brightness;
  document.getElementById('brightness-value').textContent = state.settings.brightness + ' %';
  const volume = Math.round(state.settings.volume * 100);
  Array.from(document.getElementsByClassName('js-volume-input')).forEach(input => { input.value = volume; });
  Array.from(document.getElementsByClassName('js-volume-value')).forEach(span => { span.textContent = volume + ' %'; });
  updateStoredData();
}

// Thème, luminosité et volume.
function applySettings() {
  const root = document.documentElement;
  root.dataset.theme = state.settings.theme;
  Array.from(root.classList).filter(name => name.startsWith('brightness-')).forEach(name => root.classList.remove(name));
  root.classList.add('brightness-' + Math.round(state.settings.brightness / 5) * 5);
  document.getElementById('meta-theme-color').setAttribute('content', state.settings.theme === 'dark' ? '#0b1217' : '#f1f5f0');
  document.getElementById('musique').volume = state.settings.volume;
}

/* ==========================================================================
   5. NAVIGATION ENTRE LES PAGES (sans rechargement)
   ========================================================================== */
// Sans joueur, on ramène au formulaire d'inscription.
function requestProfile() {
  if (state.profile) return true;
  showPage('home');
  document.getElementById('registration').scrollIntoView({ block: 'center' });
  document.getElementById('register-firstName').focus({ preventScroll: true });
  notify('Premier coup de sifflet : crée ton joueur pour commencer ton aventure.');
  return false;
}

function navigate(page, missionId = 0) {
  toggleMenu(false);
  if (page !== 'home' && !requestProfile()) return;
  if (page === 'mission') {
    if (!canAccessMission(missionId)) {
      notify('Cette mission est encore verrouillée. Termine d’abord la mission précédente.', 'error');
      return;
    }
    page = 'mission-' + missionId;
  }
  if (page === 'quiz') openQuiz();
  document.getElementById('football-video').pause();
  showPage(page);
}

// « Commencer mon voyage » : première mission pas encore terminée, sinon le quiz.
function startJourney() {
  if (!requestProfile()) return;
  const next = state.missions.findIndex(m => !m.completed);
  if (next === -1) navigate('quiz');
  else navigate('mission', next);
}

function toggleMenu(open) {
  document.getElementById('primary-nav').classList.toggle('open', open);
  document.getElementById('menu-button').setAttribute('aria-expanded', String(open));
  document.getElementById('menu-icon').setAttribute('href', '#i-' + (open ? 'close' : 'menu'));
}

/* ==========================================================================
   6. INSCRIPTION DU JOUEUR
   ========================================================================== */
function submitProfile(form) {
  if (state.profile) return;
  const checked = validateProfile(Object.fromEntries(new FormData(form).entries()));
  ['firstName', 'lastName', 'nickname', 'age'].forEach(name => {
    document.getElementById('register-' + name + '-error').textContent = checked.errors[name] || '';
    document.getElementById('register-' + name).setAttribute('aria-invalid', String(Boolean(checked.errors[name])));
  });
  document.getElementById('register-summary').hidden = checked.valid;
  if (!checked.valid) {
    document.getElementById('register-summary').textContent = 'Encore un petit effort : vérifie les champs indiqués.';
    document.getElementById('register-' + Object.keys(checked.errors)[0]).focus();
    return;
  }
  state.profile = checked.profile;
  persist();
  refreshAll();
  showPage('home');
  notify('Bienvenue ' + state.profile.nickname + ' ! Ton maillot est prêt.', 'success');
}

/* ==========================================================================
   7. CARTE INTERACTIVE DES STADES
   ========================================================================== */
// Clic sur un point : on l'allume et on affiche la fiche du stade (les fiches sont dans index.html).
function showStadium(id) {
  Array.from(document.getElementsByClassName('map-marker')).forEach(marker => marker.classList.toggle('active', marker.dataset.stadium === id));
  Array.from(document.getElementsByClassName('map-fiche')).forEach(fiche => { fiche.hidden = fiche.id !== 'fiche-' + id; });
}

/* ==========================================================================
   8. MISSIONS : DRAG & DROP (méthode du cours)
   Étape 1 : élément draggable="true" (dans index.html) + écouteur dragstart.
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
  Array.from(document.getElementsByClassName('drag-over')).forEach(zone => zone.classList.remove('drag-over'));
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
function drop(ev, container) {
  ev.preventDefault();
  container.classList.remove('drag-over');
  const id = ev.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(id);
  if (draggedElement) verifierDepot(draggedElement, container);
}

// Les éléments et les zones sont déjà dans le HTML : on ajoute les écouteurs une seule fois.
function activerDragAndDrop() {
  Array.from(document.getElementsByClassName('drag-item')).forEach(item => {
    item.addEventListener('dragstart', drag);
    item.addEventListener('dragend', finDrag);
  });
  Array.from(document.getElementsByClassName('drop-zone')).forEach(container => {
    container.addEventListener('dragenter', ev => { ev.preventDefault(); container.classList.add('drag-over'); });
    container.addEventListener('dragover', allowDrop);
    container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
    container.addEventListener('drop', ev => drop(ev, container));
  });
}

// Bonne zone : l'élément devient un fils de la zone (appendChild) et ne se déplace plus.
function placeItem(item) {
  document.getElementById('answers-' + item.dataset.cible).appendChild(item);
  item.setAttribute('draggable', 'false');
  item.classList.add('placed');
}

function setFeedback(mission, type, message) {
  document.getElementById('feedback-' + mission).className = 'feedback ' + type;
  document.getElementById('feedback-' + mission + '-icone').setAttribute('href', '#i-' + (type === 'success' ? 'check-circle' : 'info'));
  document.getElementById('feedback-' + mission + '-texte').textContent = message;
}

// Vérifie le dépôt : « Bravo ! » ou message d'erreur qui explique la bonne réponse.
function verifierDepot(item, zone) {
  const mission = Number(zone.dataset.mission);
  if (!state.profile || item.dataset.mission !== zone.dataset.mission || item.getAttribute('draggable') !== 'true') return;
  Array.from(document.getElementById('page-mission-' + mission).getElementsByClassName('drop-zone')).forEach(z => z.classList.remove('is-error'));
  if (item.dataset.cible !== zone.id.replace('zone-', '')) {
    zone.classList.add('is-error');
    setFeedback(mission, 'error', item.dataset.erreur + ' ' + item.dataset.explication + ' Réessaie !');
    return;
  }
  placeItem(item);
  state.missions[mission].placed.push(item.id);
  persist();
  setFeedback(mission, 'success', 'Bravo ! ' + item.dataset.explication);
  updateMission(mission);
}

// Compteur, zones pleines et boutons d'une mission.
function updateMission(mission) {
  const page = document.getElementById('page-mission-' + mission);
  const items = Array.from(page.getElementsByClassName('drag-item'));
  const placed = items.filter(item => item.classList.contains('placed')).length;
  const done = state.missions[mission].completed;
  document.getElementById('compteur-' + mission).textContent = placed;
  Array.from(page.getElementsByClassName('drop-zone')).forEach(zone => {
    const cible = zone.id.replace('zone-', '');
    const expected = items.filter(item => item.dataset.cible === cible).length;
    const inside = document.getElementById('answers-' + cible).children.length;
    zone.classList.toggle('is-full', inside === expected);
    if (document.getElementById('nombre-' + cible)) document.getElementById('nombre-' + cible).textContent = inside;
  });
  document.getElementById('terminer-' + mission).hidden = done;
  document.getElementById('terminer-' + mission).disabled = placed < items.length;
  document.getElementById('suivant-' + mission).hidden = !done;
  document.getElementById('aide-' + mission).textContent = placed < items.length
    ? 'Fais glisser chaque élément avec la souris et lâche-le dans la bonne zone.'
    : 'Toutes les associations sont correctes. ' + (done ? 'Tu peux continuer ton parcours.' : 'Valide maintenant ta mission pour débloquer la suite.');
  document.getElementById('bas-' + mission).textContent = done ? 'Mission déjà terminée.' : 'Place tous les éléments pour terminer la mission.';
}

function finishMission(mission) {
  const items = Array.from(document.getElementById('page-mission-' + mission).getElementsByClassName('drag-item'));
  if (!items.every(item => item.classList.contains('placed'))) return;
  state.missions[mission].completed = true;
  persist();
  const next = mission === NB_MISSIONS - 1 ? 'Les trois missions sont terminées : place au quiz final !' : 'La mission suivante est débloquée.';
  setFeedback(mission, 'success', 'Mission accomplie ! Bravo ' + state.profile.nickname + '. ' + next);
  refreshAll();
}

function goToNextMission(mission) {
  if (mission === NB_MISSIONS - 1) navigate('quiz');
  else navigate('mission', mission + 1);
}

// Au chargement : on remet dans leur zone les éléments déjà bien placés (sauvegarde).
function restoreMissions() {
  state.missions.forEach((m, mission) => {
    m.placed = m.placed.filter(id => {
      const item = document.getElementById(id);
      if (!item || item.dataset.mission !== String(mission) || !canAccessMission(mission)) return false;
      placeItem(item);
      return true;
    });
    const total = Array.from(document.getElementById('page-mission-' + mission).getElementsByClassName('drag-item')).length;
    m.completed = m.completed && m.placed.length === total;
    if (m.completed) setFeedback(mission, 'success', 'Mission accomplie ! Ta progression est enregistrée.');
  });
}

/* ==========================================================================
   9. QUIZ FINAL (score dans le sessionStorage)
   ========================================================================== */
let quizIndex = 0;
let quizAnswers = [];
let quizRunning = false;

// À l'ouverture : le résultat s'il existe déjà, sinon la première question.
function openQuiz() {
  if (quizRunning) return;
  if (state.quiz.lastScore !== null) showQuizResult();
  else startQuiz();
}

function startQuiz() {
  quizRunning = true;
  quizIndex = 0;
  quizAnswers = [];
  Array.from(document.getElementsByClassName('quiz-option')).forEach(button => button.classList.remove('selected'));
  document.getElementById('quiz-game').hidden = false;
  document.getElementById('quiz-result').hidden = true;
  showQuestion();
}

function showQuestion() {
  for (let i = 0; i < 10; i++) document.getElementById('question-' + i).hidden = i !== quizIndex;
  document.getElementById('quiz-step').textContent = 'QUESTION ' + (quizIndex + 1) + ' SUR 10';
  document.getElementById('quiz-percent').textContent = (quizIndex + 1) * 10 + ' %';
  document.getElementById('quiz-bar').className = 'pct-' + (quizIndex + 1) * 10;
  document.getElementById('quiz-next').disabled = quizAnswers[quizIndex] === undefined;
  document.getElementById('quiz-next-label').textContent = quizIndex === 9 ? 'DÉCOUVRIR MON SCORE' : 'QUESTION SUIVANTE';
}

function chooseQuizAnswer(button) {
  const question = Number(button.dataset.question);
  if (question !== quizIndex) return;
  quizAnswers[question] = Number(button.dataset.quizOption);
  Array.from(document.getElementById('question-' + question).getElementsByClassName('quiz-option')).forEach(b => b.classList.toggle('selected', b === button));
  document.getElementById('quiz-next').disabled = false;
}

function advanceQuiz() {
  if (quizAnswers[quizIndex] === undefined) return;
  if (quizIndex < 9) {
    quizIndex++;
    showQuestion();
    return;
  }
  const score = quizAnswers.filter((answer, i) => answer === BONNES_REPONSES[i]).length;
  state.quiz.lastScore = score;
  // Score du quiz dans le sessionStorage (cours : sessionStorage.setItem("score", 120)).
  if (storageSupported()) {
    sessionStorage.setItem('scoreQuiz', score * 10);
    sessionStorage.setItem('pseudoQuiz', state.profile.nickname);
  }
  persist();
  quizRunning = false;
  showQuizResult();
  window.scrollTo(0, 0);
}

function showQuizResult() {
  const score = state.quiz.lastScore;
  document.getElementById('quiz-game').hidden = true;
  document.getElementById('quiz-result').hidden = false;
  document.getElementById('result-title-good').hidden = score < 8;
  document.getElementById('result-title-work').hidden = score >= 8;
  document.getElementById('result-score').textContent = score;
  document.getElementById('result-ring').setAttribute('stroke-dashoffset', 339.3 * (1 - score / 10));
  // Message demandé par le sujet : « Bravo [pseudo], tu as réussi [X]% de ta mission ! »
  document.getElementById('result-message').textContent = 'Bravo ' + state.profile.nickname + ', tu as réussi ' + score * 10 + '% de ta mission !';
}

/* ==========================================================================
   10. JEU DU PENDU
   ========================================================================== */
let word = '';
let guesses = [];

function hangmanStatus() {
  const errors = guesses.filter(letter => !word.includes(letter)).length;
  const won = word.split('').every(letter => guesses.includes(letter));
  return { errors, won, lost: errors >= 6 && !won, finished: won || errors >= 6 };
}

function newHangmanGame() {
  const choices = MOTS.filter(m => m !== word);
  word = choices[Math.floor(Math.random() * choices.length)];
  guesses = [];
  Array.from(document.getElementsByClassName('letter-key')).forEach(key => {
    key.disabled = false;
    key.classList.remove('good', 'bad');
  });
  updateHangman();
}

function guessLetter(key) {
  const status = hangmanStatus();
  if (!state.profile || status.finished || key.disabled) return;
  const letter = key.dataset.letter;
  guesses.push(letter);
  key.disabled = true;
  key.classList.add(word.includes(letter) ? 'good' : 'bad');
  const after = hangmanStatus();
  if (after.finished) {
    state.hangman.lastResult = { won: after.won, word, errors: after.errors };
    persist();
    notify(after.won ? 'Bravo ' + state.profile.nickname + ' !' : 'Perdu ! Le mot était : ' + word, after.won ? 'success' : 'info');
  }
  updateHangman();
}

function updateHangman() {
  const status = hangmanStatus();
  document.getElementById('attempts-left').textContent = 6 - status.errors;
  document.getElementById('errors-count').textContent = status.errors;
  Array.from(document.getElementById('error-dots').children).forEach((dot, i) => dot.classList.toggle('used', i < status.errors));
  // Une partie du bonhomme par erreur.
  Array.from(document.getElementById('gallows').getElementsByClassName('person')).forEach((part, i) => part.toggleAttribute('hidden', i >= status.errors));
  // Une case par lettre du mot : « _ » tant que la lettre n'est pas trouvée.
  Array.from(document.getElementById('word-slots').children).forEach((slot, i) => {
    const letter = word[i];
    slot.hidden = !letter;
    if (!letter) return;
    const found = guesses.includes(letter);
    slot.textContent = found || status.finished ? letter : '_';
    slot.className = 'word-slot' + (found ? ' revealed' : status.lost ? ' missed' : '');
  });
  if (status.finished) Array.from(document.getElementsByClassName('letter-key')).forEach(key => { key.disabled = true; });
  document.getElementById('hangman-message').className = 'hangman-message' + (status.won ? ' won' : status.lost ? ' lost' : '');
  document.getElementById('hangman-title').textContent = status.won ? 'Bravo ' + state.profile.nickname + ' !' : status.lost ? 'Perdu ! Le mot était : ' + word : '';
  document.getElementById('hangman-text').textContent = status.won ? 'Tu as trouvé ' + word + '.'
    : status.lost ? 'Clique sur Rejouer pour prendre ta revanche.'
    : 'Un indice : ' + word.length + ' lettres, une seule passion. Les lettres déjà proposées sont désactivées.';
  document.getElementById('hangman-replay').className = 'button' + (status.finished ? '' : ' secondary');
}

/* ==========================================================================
   11. PARAMÈTRES : thème, géolocalisation, données
   ========================================================================== */
function setTheme(theme) {
  state.settings.theme = theme;
  applySettings();
  persist();
  refreshAll();
}

/* Géolocalisation (cours) : navigator.geolocation.getCurrentPosition(succès, erreur, options).
   La position n'est demandée qu'après un clic, avec l'accord de l'utilisateur. */
let locationBusy = false;

function showGeoMessage(message, type) {
  locationBusy = false;
  document.getElementById('location-output').hidden = false;
  document.getElementById('location-output').className = 'location-output ' + type;
  document.getElementById('location-output').textContent = message;
  updateLocation();
  notify(message, type);
}

function getLocation() {
  if (locationBusy) return;
  if (navigator.geolocation) {
    locationBusy = true;
    document.getElementById('location-output').hidden = false;
    document.getElementById('location-output').className = 'location-output';
    document.getElementById('location-output').textContent = 'En attente de ton autorisation et de la position du navigateur...';
    updateLocation();
    navigator.geolocation.getCurrentPosition(showPosition, showError, { maximumAge: 60000, timeout: 12000, enableHighAccuracy: false });
  } else {
    showGeoMessage('La géolocalisation n’est pas prise en charge par ce navigateur.', 'error');
  }
}

// Succès : latitude, longitude et précision (position.coords).
function showPosition(position) {
  state.settings.location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy };
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
  state.settings.location = null;
  persist();
  showGeoMessage('Ta position a été effacée.', 'success');
}

function updateLocation() {
  const loc = state.settings.location;
  document.getElementById('geo-button').disabled = locationBusy;
  document.getElementById('geo-label').textContent = locationBusy ? 'LOCALISATION EN COURS...' : loc ? 'ACTUALISER MA POSITION' : 'AUTORISER MA LOCALISATION';
  document.getElementById('geo-clear').hidden = !loc;
  document.getElementById('geo-coords').hidden = !loc;
  if (loc) document.getElementById('geo-coords').textContent = 'Latitude : ' + loc.latitude.toFixed(4) + ' · Longitude : ' + loc.longitude.toFixed(4);
}

// Liste des données du localStorage, parcourue avec length et key(i) comme dans le cours (slide 12).
function updateStoredData() {
  const list = document.getElementById('stored-data');
  list.textContent = '';
  if (!storageSupported()) return;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const li = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = key + ' : ';
    li.appendChild(label);
    li.appendChild(document.createTextNode(localStorage.getItem(key)));
    list.appendChild(li);
  }
  if (!list.children.length) {
    const li = document.createElement('li');
    li.textContent = 'Aucune donnée enregistrée.';
    list.appendChild(li);
  }
}

// Supprime tout avec localStorage.clear() et sessionStorage.clear(), puis recharge la page.
function clearAllData() {
  if (!confirm('Supprimer ton joueur, ta progression et tes réglages de cet appareil ?')) return;
  if (storageSupported()) {
    localStorage.clear();
    sessionStorage.clear();
  }
  location.reload();
}

/* ==========================================================================
   12. MUSIQUE : balise <audio id="musique"> (fichier audio/road-to-glory.mp3)
   ========================================================================== */
const musique = document.getElementById('musique');

function toggleMusic() {
  if (musique.paused) {
    musique.volume = state.settings.volume;
    // play() renvoie une promesse, refusée si le navigateur bloque le son.
    const lecture = musique.play();
    if (lecture) lecture.catch(() => notify('Le navigateur a bloqué la lecture. Clique de nouveau sur le bouton.', 'error'));
  } else {
    musique.pause();
  }
}

// Les événements play / pause de la balise mettent à jour les boutons.
function updateMusicButtons() {
  const playing = !musique.paused;
  document.getElementById('header-music-icon').setAttribute('href', '#i-' + (playing ? 'volume' : 'volume-off'));
  Array.from(document.getElementsByClassName('js-audio-icon')).forEach(use => use.setAttribute('href', '#i-' + (playing ? 'pause' : 'play')));
  document.getElementById('equalizer').classList.toggle('is-playing', playing);
  document.getElementById('audio-status').textContent = playing ? 'La bande-son de ton aventure' : 'Musique d’ambiance · Lecture manuelle';
}
musique.addEventListener('play', () => { document.getElementById('football-video').pause(); updateMusicButtons(); });
musique.addEventListener('pause', updateMusicButtons);
document.getElementById('football-video').addEventListener('play', () => musique.pause());

/* ==========================================================================
   13. ÉCOUTEURS D'ÉVÉNEMENTS
   Méthode du cours : element.addEventListener('click', function () { ... });
   Chaque bouton de index.html reçoit ici son propre écouteur.
   ========================================================================== */

// ---------- En-tête ----------
document.getElementById('menu-button').addEventListener('click', function () {
  const ouvert = document.getElementById('primary-nav').classList.contains('open');
  toggleMenu(!ouvert);
});
document.getElementById('header-theme').addEventListener('click', function () {
  if (state.settings.theme === 'dark') setTheme('light');
  else setTheme('dark');
});
document.getElementById('profile-button').addEventListener('click', function () {
  navigate('settings');
});

// ---------- Liens vers les pages (menu, logo, « Retour à l’accueil »...) ----------
// Chaque lien a la classe « lien-page » et le nom de la page dans data-route.
Array.from(document.getElementsByClassName('lien-page')).forEach(function (lien) {
  lien.addEventListener('click', function () {
    navigate(lien.dataset.route);
  });
});

// ---------- Accueil ----------
// Deux boutons : « Commencer mon voyage » et « Continuer ».
Array.from(document.getElementsByClassName('btn-commencer')).forEach(function (bouton) {
  bouton.addEventListener('click', startJourney);
});

// Les 3 cartes de mission.
for (let i = 0; i < NB_MISSIONS; i++) {
  document.getElementById('carte-mission-' + i).addEventListener('click', function () {
    navigate('mission', i);
  });
}

// Les 8 points de la carte des stades.
Array.from(document.getElementsByClassName('map-marker')).forEach(function (point) {
  point.addEventListener('click', function () {
    showStadium(point.dataset.stadium);
  });
});

// Formulaire d'inscription.
document.getElementById('register-form').addEventListener('submit', function (event) {
  event.preventDefault(); // empêche le rechargement de la page
  submitProfile(event.target);
});

// ---------- Missions : boutons « Terminer » et « Mission suivante » ----------
for (let i = 0; i < NB_MISSIONS; i++) {
  document.getElementById('terminer-' + i).addEventListener('click', function () {
    finishMission(i);
  });
  document.getElementById('suivant-' + i).addEventListener('click', function () {
    goToNextMission(i);
  });
}

// ---------- Quiz ----------
Array.from(document.getElementsByClassName('quiz-option')).forEach(function (reponse) {
  reponse.addEventListener('click', function () {
    chooseQuizAnswer(reponse);
  });
});
document.getElementById('quiz-next').addEventListener('click', advanceQuiz);
document.getElementById('quiz-retry').addEventListener('click', startQuiz);

// ---------- Pendu ----------
Array.from(document.getElementsByClassName('letter-key')).forEach(function (touche) {
  touche.addEventListener('click', function () {
    guessLetter(touche);
  });
});
document.getElementById('hangman-replay').addEventListener('click', newHangmanGame);

// ---------- Musique (3 boutons : en-tête, accueil, paramètres) ----------
Array.from(document.getElementsByClassName('btn-musique')).forEach(function (bouton) {
  bouton.addEventListener('click', toggleMusic);
});

// Curseurs du volume (accueil et paramètres) : événement « input » à chaque mouvement.
Array.from(document.getElementsByClassName('js-volume-input')).forEach(function (curseur) {
  curseur.addEventListener('input', function () {
    state.settings.volume = Number(curseur.value) / 100;
    applySettings();
    persist();
    refreshAll();
  });
});

// ---------- Paramètres ----------
document.getElementById('geo-button').addEventListener('click', getLocation);
document.getElementById('geo-clear').addEventListener('click', clearLocation);
document.getElementById('theme-dark').addEventListener('click', function () {
  setTheme('dark');
});
document.getElementById('theme-light').addEventListener('click', function () {
  setTheme('light');
});
document.getElementById('brightness-range').addEventListener('input', function () {
  state.settings.brightness = Number(document.getElementById('brightness-range').value);
  applySettings();
  persist();
  refreshAll();
});
document.getElementById('clear-all').addEventListener('click', clearAllData);

// ---------- Message en bas de l'écran ----------
document.getElementById('toast-close').addEventListener('click', function () {
  document.getElementById('toast').classList.remove('visible');
});

// Événement storage (cours) : un AUTRE onglet du site a modifié le localStorage.
window.addEventListener('storage', event => {
  if (event.storageArea === localStorage) location.reload();
});

/* ==========================================================================
   14. DÉMARRAGE DU SITE
   ========================================================================== */
applySettings();
restoreMissions();
activerDragAndDrop();
newHangmanGame();
refreshAll();
showPage('home');
