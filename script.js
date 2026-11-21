'use strict';

/* ==========================================================================
   FOOTBALL JOURNEY — script.js
   Tout le HTML des pages est écrit dans index.html.
   Ce fichier gère seulement les fonctionnalités :
   - afficher la bonne page (attribut hidden) et mettre à jour les textes (textContent) ;
   - Drag & Drop, quiz, pendu, carte des stades, musique ;
   - Web Storage (localStorage / sessionStorage) et géolocalisation.
   Sélection : getElementById et getElementsByClassName. Événements : addEventListener.
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
// Web Storage (cours) : chaque information a sa propre clé dans le localStorage.
const LOCAL_KEYS = ['pseudo', 'nom', 'prenom', 'age', 'volume', 'mode', 'luminosite',
  'latitude', 'longitude', 'precision', 'dernierResultatPendu', 'dernierScorePendu', 'dernierMotPendu', 'progression'];

/* ==========================================================================
   2. OUTILS
   ========================================================================== */
const byId = id => document.getElementById(id);
const byClass = (name, root = document) => Array.from(root.getElementsByClassName(name));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Remonte les parents d'un élément jusqu'à trouver celui qui a l'attribut data-<cle>.
function findData(node, cle) {
  while (node && node.nodeType === 1) {
    if (node.dataset && node.dataset[cle] !== undefined) return node;
    node = node.parentNode;
  }
  return null;
}

// Change l'icône d'un <use> (les icônes sont définies dans index.html : #i-play, #i-pause...).
function setIcon(use, name) {
  use.setAttribute('href', '#i-' + name);
}

// Petit message en bas de l'écran.
let toastTimer = null;
function notify(message, type = 'info') {
  clearTimeout(toastTimer);
  byId('toast-text').textContent = message;
  byId('toast').className = 'toast visible' + (type === 'error' ? ' error' : '');
  setIcon(byId('toast-icon-use'), type === 'success' ? 'check-circle' : 'info');
  toastTimer = setTimeout(() => byId('toast').classList.remove('visible'), 6500);
}

/* ==========================================================================
   3. ÉTAT DU JOUEUR ET WEB STORAGE
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
  if (localStorage.getItem('volume') !== null) s.settings.volume = clamp(Number(localStorage.getItem('volume')) || 0, 0, 1);
  if (localStorage.getItem('luminosite') !== null) s.settings.brightness = clamp(Number(localStorage.getItem('luminosite')) || 100, 60, 120);
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
  // Missions et dernier score du quiz : une seule chaîne JSON (clé « progression »).
  try {
    const saved = JSON.parse(localStorage.getItem('progression'));
    if (saved && Array.isArray(saved.missions)) {
      saved.missions.slice(0, NB_MISSIONS).forEach((m, i) => {
        s.missions[i].placed = Array.isArray(m.placed) ? m.placed : [];
        s.missions[i].completed = m.completed === true;
      });
    }
    if (saved && saved.quiz && Number.isInteger(saved.quiz.lastScore)) s.quiz.lastScore = saved.quiz.lastScore;
  } catch (error) { /* progression illisible : on repart de zéro */ }
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
  localStorage.setItem('progression', JSON.stringify({ missions: state.missions, quiz: state.quiz }));
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

const completedCount = () => state.missions.filter(m => m.completed).length;
// Une mission est ouverte quand toutes les précédentes sont terminées.
const canAccessMission = id => state.missions.slice(0, id).every(m => m.completed);

/* ==========================================================================
   4. AFFICHAGE : montrer une page et mettre à jour les textes
   ========================================================================== */
// Montre une seule page de <main> et cache les autres (attribut hidden).
function showPage(name) {
  currentPage = name;
  PAGES.forEach(page => { byId('page-' + page).hidden = page !== name; });
  const menu = name.startsWith('mission') ? 'home' : name;
  byClass('nav-button').forEach(button => {
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
  byId('header-pseudo').textContent = p ? p.nickname : 'Mon joueur';
  byId('avatar-initials').textContent = p ? (p.firstName[0] + p.lastName[0]).toUpperCase() : '';
  byId('avatar-initials').hidden = !p;
  byId('avatar-icon').toggleAttribute('hidden', Boolean(p));
  setIcon(byId('header-theme-icon'), state.settings.theme === 'dark' ? 'sun' : 'moon');

  // Accueil : inscription OU carte du joueur
  byId('hero-eyebrow').textContent = p ? 'BIENVENUE SUR LE TERRAIN, ' + p.nickname : 'LE COUP D’ENVOI DE TON HISTOIRE';
  byId('registration').hidden = Boolean(p);
  byId('player-home').hidden = !p;
  const percent = Math.round(completedCount() / NB_MISSIONS * 100);
  if (p) {
    byId('player-title').textContent = 'BIENVENUE, ' + p.nickname + '.';
    byId('player-identity').textContent = p.firstName + ' ' + p.lastName + ' · ' + p.age + ' ans';
    byId('player-missions').textContent = completedCount();
    byId('player-percent').textContent = percent;
    byId('player-bar').className = 'pct-' + Math.round(percent / 10) * 10;
  }

  // Cartes des missions : verrouillée, ouverte ou terminée
  for (let i = 0; i < NB_MISSIONS; i++) {
    const done = state.missions[i].completed;
    const open = canAccessMission(i);
    byId('carte-mission-' + i).className = 'mission-card ' + (done ? 'complete' : open ? 'available' : 'locked');
    setIcon(byId('carte-mission-' + i + '-icone'), done ? 'check' : open ? 'play' : 'lock');
    setIcon(byId('carte-mission-' + i + '-fleche'), done ? 'check' : open ? 'arrow' : 'lock');
    byId('carte-mission-' + i + '-texte').textContent = done ? 'Mission accomplie' : open ? 'Le coup d’envoi t’attend' : 'Chaque chose en son temps';
    updateMission(i);
  }

  // Paramètres
  if (p) {
    byId('info-firstName').textContent = p.firstName;
    byId('info-lastName').textContent = p.lastName;
    byId('info-nickname').textContent = p.nickname;
    byId('info-age').textContent = p.age;
  }
  updateLocation();
  byId('theme-dark').classList.toggle('active', state.settings.theme === 'dark');
  byId('theme-light').classList.toggle('active', state.settings.theme === 'light');
  byId('brightness-range').value = state.settings.brightness;
  byId('brightness-value').textContent = state.settings.brightness + ' %';
  const volume = Math.round(state.settings.volume * 100);
  byClass('js-volume-input').forEach(input => { input.value = volume; });
  byClass('js-volume-value').forEach(span => { span.textContent = volume + ' %'; });
  updateStoredData();
}

// Thème, luminosité et volume.
function applySettings() {
  const root = document.documentElement;
  root.dataset.theme = state.settings.theme;
  Array.from(root.classList).filter(name => name.startsWith('brightness-')).forEach(name => root.classList.remove(name));
  root.classList.add('brightness-' + Math.round(state.settings.brightness / 5) * 5);
  byId('meta-theme-color').setAttribute('content', state.settings.theme === 'dark' ? '#0b1217' : '#f1f5f0');
  byId('musique').volume = state.settings.volume;
}

/* ==========================================================================
   5. NAVIGATION ENTRE LES PAGES (sans rechargement)
   ========================================================================== */
// Sans joueur, on ramène au formulaire d'inscription.
function requestProfile() {
  if (state.profile) return true;
  showPage('home');
  byId('registration').scrollIntoView({ block: 'center' });
  byId('register-firstName').focus({ preventScroll: true });
  notify('Premier coup de sifflet : crée ton joueur pour commencer ton aventure.');
  return false;
}

function navigate(page, missionId = 0) {
  if (page !== 'home' && !requestProfile()) return;
  if (page === 'mission') {
    if (!canAccessMission(missionId)) {
      notify('Cette mission est encore verrouillée. Termine d’abord la mission précédente.', 'error');
      return;
    }
    page = 'mission-' + missionId;
  }
  if (page === 'quiz') openQuiz();
  byId('football-video').pause();
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
  byId('primary-nav').classList.toggle('open', open);
  byId('menu-button').setAttribute('aria-expanded', String(open));
  setIcon(byId('menu-icon'), open ? 'close' : 'menu');
}

/* ==========================================================================
   6. INSCRIPTION DU JOUEUR
   ========================================================================== */
function submitProfile(form) {
  if (state.profile) return;
  const checked = validateProfile(Object.fromEntries(new FormData(form).entries()));
  ['firstName', 'lastName', 'nickname', 'age'].forEach(name => {
    byId('register-' + name + '-error').textContent = checked.errors[name] || '';
    byId('register-' + name).setAttribute('aria-invalid', String(Boolean(checked.errors[name])));
  });
  byId('register-summary').hidden = checked.valid;
  if (!checked.valid) {
    byId('register-summary').textContent = 'Encore un petit effort : vérifie les champs indiqués.';
    byId('register-' + Object.keys(checked.errors)[0]).focus();
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
  byClass('map-marker').forEach(marker => marker.classList.toggle('active', marker.dataset.stadium === id));
  byClass('map-fiche').forEach(fiche => { fiche.hidden = fiche.id !== 'fiche-' + id; });
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
  byClass('drag-over').forEach(zone => zone.classList.remove('drag-over'));
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
  byClass('drag-item').forEach(item => {
    item.addEventListener('dragstart', drag);
    item.addEventListener('dragend', finDrag);
  });
  byClass('drop-zone').forEach(container => {
    container.addEventListener('dragenter', ev => { ev.preventDefault(); container.classList.add('drag-over'); });
    container.addEventListener('dragover', allowDrop);
    container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
    container.addEventListener('drop', ev => drop(ev, container));
  });
}

// Bonne zone : l'élément devient un fils de la zone (appendChild) et ne se déplace plus.
function placeItem(item) {
  byId('answers-' + item.dataset.cible).appendChild(item);
  item.setAttribute('draggable', 'false');
  item.classList.add('placed');
}

function setFeedback(mission, type, message) {
  byId('feedback-' + mission).className = 'feedback ' + type;
  setIcon(byId('feedback-' + mission + '-icone'), type === 'success' ? 'check-circle' : 'info');
  byId('feedback-' + mission + '-texte').textContent = message;
}

// Vérifie le dépôt : « Bravo ! » ou message d'erreur qui explique la bonne réponse.
function verifierDepot(item, zone) {
  const mission = Number(zone.dataset.mission);
  if (!state.profile || item.dataset.mission !== zone.dataset.mission || item.getAttribute('draggable') !== 'true') return;
  byClass('drop-zone', byId('page-mission-' + mission)).forEach(z => z.classList.remove('is-error'));
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
  const page = byId('page-mission-' + mission);
  const items = byClass('drag-item', page);
  const placed = items.filter(item => item.classList.contains('placed')).length;
  const done = state.missions[mission].completed;
  byId('compteur-' + mission).textContent = placed;
  byClass('drop-zone', page).forEach(zone => {
    const cible = zone.id.replace('zone-', '');
    const expected = items.filter(item => item.dataset.cible === cible).length;
    const inside = byId('answers-' + cible).children.length;
    zone.classList.toggle('is-full', inside === expected);
    if (byId('nombre-' + cible)) byId('nombre-' + cible).textContent = inside;
  });
  byId('terminer-' + mission).hidden = done;
  byId('terminer-' + mission).disabled = placed < items.length;
  byId('suivant-' + mission).hidden = !done;
  byId('aide-' + mission).textContent = placed < items.length
    ? 'Fais glisser chaque élément avec la souris et lâche-le dans la bonne zone.'
    : 'Toutes les associations sont correctes. ' + (done ? 'Tu peux continuer ton parcours.' : 'Valide maintenant ta mission pour débloquer la suite.');
  byId('bas-' + mission).textContent = done ? 'Mission déjà terminée.' : 'Place tous les éléments pour terminer la mission.';
}

function finishMission(mission) {
  const items = byClass('drag-item', byId('page-mission-' + mission));
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
      const item = byId(id);
      if (!item || item.dataset.mission !== String(mission) || !canAccessMission(mission)) return false;
      placeItem(item);
      return true;
    });
    const total = byClass('drag-item', byId('page-mission-' + mission)).length;
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
  byClass('quiz-option').forEach(button => button.classList.remove('selected'));
  byId('quiz-game').hidden = false;
  byId('quiz-result').hidden = true;
  showQuestion();
}

function showQuestion() {
  for (let i = 0; i < 10; i++) byId('question-' + i).hidden = i !== quizIndex;
  byId('quiz-step').textContent = 'QUESTION ' + (quizIndex + 1) + ' SUR 10';
  byId('quiz-percent').textContent = (quizIndex + 1) * 10 + ' %';
  byId('quiz-bar').className = 'pct-' + (quizIndex + 1) * 10;
  byId('quiz-next').disabled = quizAnswers[quizIndex] === undefined;
  byId('quiz-next-label').textContent = quizIndex === 9 ? 'DÉCOUVRIR MON SCORE' : 'QUESTION SUIVANTE';
}

function chooseQuizAnswer(button) {
  const question = Number(button.dataset.question);
  if (question !== quizIndex) return;
  quizAnswers[question] = Number(button.dataset.quizOption);
  byClass('quiz-option', byId('question-' + question)).forEach(b => b.classList.toggle('selected', b === button));
  byId('quiz-next').disabled = false;
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
  byId('quiz-game').hidden = true;
  byId('quiz-result').hidden = false;
  byId('result-title-good').hidden = score < 8;
  byId('result-title-work').hidden = score >= 8;
  byId('result-score').textContent = score;
  byId('result-ring').setAttribute('stroke-dashoffset', 339.3 * (1 - score / 10));
  // Message demandé par le sujet : « Bravo [pseudo], tu as réussi [X]% de ta mission ! »
  byId('result-message').textContent = 'Bravo ' + state.profile.nickname + ', tu as réussi ' + score * 10 + '% de ta mission !';
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
  byClass('letter-key').forEach(key => {
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
  byId('attempts-left').textContent = 6 - status.errors;
  byId('errors-count').textContent = status.errors;
  Array.from(byId('error-dots').children).forEach((dot, i) => dot.classList.toggle('used', i < status.errors));
  // Une partie du bonhomme par erreur.
  byClass('person', byId('gallows')).forEach((part, i) => part.toggleAttribute('hidden', i >= status.errors));
  // Une case par lettre du mot : « _ » tant que la lettre n'est pas trouvée.
  Array.from(byId('word-slots').children).forEach((slot, i) => {
    const letter = word[i];
    slot.hidden = !letter;
    if (!letter) return;
    const found = guesses.includes(letter);
    slot.textContent = found || status.finished ? letter : '_';
    slot.className = 'word-slot' + (found ? ' revealed' : status.lost ? ' missed' : '');
  });
  if (status.finished) byClass('letter-key').forEach(key => { key.disabled = true; });
  byId('hangman-message').className = 'hangman-message' + (status.won ? ' won' : status.lost ? ' lost' : '');
  byId('hangman-title').textContent = status.won ? 'Bravo ' + state.profile.nickname + ' !' : status.lost ? 'Perdu ! Le mot était : ' + word : '';
  byId('hangman-text').textContent = status.won ? 'Tu as trouvé ' + word + '.'
    : status.lost ? 'Clique sur Rejouer pour prendre ta revanche.'
    : 'Un indice : ' + word.length + ' lettres, une seule passion. Les lettres déjà proposées sont désactivées.';
  byId('hangman-replay').className = 'button' + (status.finished ? '' : ' secondary');
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
  byId('location-output').hidden = false;
  byId('location-output').className = 'location-output ' + type;
  byId('location-output').textContent = message;
  updateLocation();
  notify(message, type);
}

function getLocation() {
  if (locationBusy) return;
  if (navigator.geolocation) {
    locationBusy = true;
    byId('location-output').hidden = false;
    byId('location-output').className = 'location-output';
    byId('location-output').textContent = 'En attente de ton autorisation et de la position du navigateur...';
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
  byId('geo-button').disabled = locationBusy;
  byId('geo-label').textContent = locationBusy ? 'LOCALISATION EN COURS...' : loc ? 'ACTUALISER MA POSITION' : 'AUTORISER MA LOCALISATION';
  byId('geo-clear').hidden = !loc;
  byId('geo-coords').hidden = !loc;
  if (loc) byId('geo-coords').textContent = 'Latitude : ' + loc.latitude.toFixed(4) + ' · Longitude : ' + loc.longitude.toFixed(4);
}

// Liste des données du localStorage, parcourue avec length et key(i) comme dans le cours.
function updateStoredData() {
  const list = byId('stored-data');
  list.textContent = '';
  if (!storageSupported()) return;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!LOCAL_KEYS.includes(key)) continue;
    const li = document.createElement('li');
    const label = document.createElement('strong');
    label.textContent = key + ' : ';
    li.appendChild(label);
    li.appendChild(document.createTextNode(key === 'progression' ? 'missions, dernier score du quiz' : localStorage.getItem(key)));
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
const musique = byId('musique');

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
  setIcon(byId('header-music-icon'), playing ? 'volume' : 'volume-off');
  byClass('js-audio-icon').forEach(use => setIcon(use, playing ? 'pause' : 'play'));
  byId('equalizer').classList.toggle('is-playing', playing);
  byId('audio-status').textContent = playing ? 'La bande-son de ton aventure' : 'Musique d’ambiance · Lecture manuelle';
}
musique.addEventListener('play', () => { byId('football-video').pause(); updateMusicButtons(); });
musique.addEventListener('pause', updateMusicButtons);
byId('football-video').addEventListener('play', () => musique.pause());

/* ==========================================================================
   13. ÉCOUTEURS D'ÉVÉNEMENTS (addEventListener sur document)
   ========================================================================== */
byId('register-form').addEventListener('submit', event => {
  event.preventDefault();
  submitProfile(event.target);
});

document.addEventListener('click', event => {
  const target = event.target;
  if (!byId('site-header').contains(target)) toggleMenu(false);

  const stadium = findData(target, 'stadium');
  if (stadium) { showStadium(stadium.dataset.stadium); return; }
  const option = findData(target, 'quizOption');
  if (option) { chooseQuizAnswer(option); return; }
  const key = findData(target, 'letter');
  if (key) { guessLetter(key); return; }
  const link = findData(target, 'route');
  if (link) { toggleMenu(false); navigate(link.dataset.route); return; }
  const button = findData(target, 'action');
  if (!button || button.disabled) return;
  switch (button.dataset.action) {
    case 'start': startJourney(); break;
    case 'profile': if (requestProfile()) navigate('settings'); break;
    case 'mission': navigate('mission', Number(button.dataset.id)); break;
    case 'finish-mission': finishMission(Number(button.dataset.id)); break;
    case 'next-mission': goToNextMission(Number(button.dataset.id)); break;
    case 'quiz-next': advanceQuiz(); break;
    case 'quiz-retry': startQuiz(); break;
    case 'hangman-replay': newHangmanGame(); break;
    case 'music': toggleMusic(); break;
    case 'theme': setTheme(state.settings.theme === 'dark' ? 'light' : 'dark'); break;
    case 'set-theme': setTheme(button.dataset.themeChoice); break;
    case 'menu': toggleMenu(!byId('primary-nav').classList.contains('open')); break;
    case 'geolocation': getLocation(); break;
    case 'clear-location': clearLocation(); break;
    case 'clear-all': clearAllData(); break;
    case 'dismiss-toast': byId('toast').classList.remove('visible'); break;
  }
});

// Curseurs du volume et de la luminosité.
document.addEventListener('input', event => {
  const input = event.target;
  if (input.dataset.setting === 'volume') {
    state.settings.volume = Number(input.value) / 100;
  } else if (input.dataset.setting === 'brightness') {
    state.settings.brightness = Number(input.value);
  } else {
    return;
  }
  applySettings();
  persist();
  refreshAll();
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
