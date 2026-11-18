'use strict';

/* ==========================================================================
   FOOTBALL JOURNEY — script.js
   - Sélection des éléments : getElementById, getElementsByClassName, getElementsByTagName.
   - Événements : uniquement addEventListener.
   - Contenu des pages : créé avec createElement, createTextNode et textContent.
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DU JEU : missions, questions du quiz, mots du pendu, stades
   ========================================================================== */
// Web Storage (cours) : chaque information a sa propre clé dans le localStorage.
const LOCAL_KEYS = ['pseudo', 'nom', 'prenom', 'age', 'volume', 'mode', 'luminosite',
  'latitude', 'longitude', 'precision', 'datePosition',
  'dernierResultatPendu', 'dernierScorePendu', 'dernierMotPendu', 'progression'];
// Score du quiz : sessionStorage (effacé à la fermeture de l'onglet) avec les clés scoreQuiz et pseudoQuiz.
const WORDS = ['FOOTBALL', 'STADE', 'BALLON', 'GARDIEN', 'ARBITRE', 'BUT', 'JOUEUR', 'MATCH', 'COUPE', 'PENALTY'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const HERO_IMAGE = 'https://images.pexels.com/photos/36737326/pexels-photo-36737326.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1800';
const VIDEO_URL = 'https://videos.pexels.com/video-files/6077691/6077691-uhd_3840_2160_25fps.mp4';
const VIDEO_POSTER = 'https://images.pexels.com/videos/6077691/pexels-photo-6077691.jpeg?auto=compress&cs=tinysrgb&w=1000';
const MISSIONS = [
  {
    id: 0, title: 'Le rêve commence', age: '5 - 8 ans', type: 'discovery', icon: 'ball',
    image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=650',
    intro: 'Un ballon, des amis et un grand rêve. Ton histoire commence sur le terrain du quartier.',
    objective: 'Reconnaître les trois équipements essentiels du footballeur.',
    instruction: 'Associe chaque équipement à son utilité. Trois passes faciles pour entrer dans le match !',
    targets: [
      { id: 'play', title: 'Pour jouer et marquer des buts', description: 'L’objet au centre du jeu.' },
      { id: 'grip', title: 'Pour bien adhérer au terrain', description: 'L’équipement que tu portes aux pieds.' },
      { id: 'team', title: 'Pour reconnaître ton équipe', description: 'Il porte les couleurs de ton club.' }
    ],
    items: [
      { id: 'ball', label: 'Le ballon', icon: 'ball', target: 'play', explanation: 'Le ballon est l’objet que les joueurs font circuler pour marquer des buts.' },
      { id: 'boots', label: 'Les crampons', icon: 'boot', target: 'grip', explanation: 'Les crampons sous les chaussures aident le joueur à adhérer à la pelouse.' },
      { id: 'jersey', label: 'Le maillot', icon: 'shirt', target: 'team', explanation: 'Le maillot permet de distinguer les coéquipiers des adversaires.' }
    ]
  },
  {
    id: 1, title: 'L’école de football', age: '9 - 12 ans', type: 'sorting', icon: 'boot',
    image: 'https://images.pexels.com/photos/19582958/pexels-photo-19582958.jpeg?auto=compress&cs=tinysrgb&w=650',
    intro: 'Bienvenue au club ! Tu découvres l’entraînement, les règles et la vie d’équipe.',
    objective: 'Distinguer l’équipement du joueur et le matériel de l’arbitre.',
    instruction: 'Fais glisser les six images dans les deux vestiaires. Chaque vestiaire accueille trois objets.',
    targets: [
      { id: 'player', title: 'L’équipement du joueur', description: 'Ce que le joueur porte sur lui pour jouer.', capacity: 3 },
      { id: 'referee', title: 'Le matériel de l’arbitre', description: 'Ce qui sert à diriger le match et à gérer le temps.', capacity: 3 }
    ],
    items: [
      { id: 'jersey', label: 'Maillot', icon: 'shirt', art: 'maillot', target: 'player', wrong: 'Non, le maillot n’est pas un outil d’arbitre !', explanation: 'Le maillot fait partie de la tenue que porte chaque joueur.' },
      { id: 'whistle', label: 'Sifflet', icon: 'whistle', art: 'sifflet', target: 'referee', wrong: 'Non, le sifflet appartient à l’arbitre, pas au joueur !', explanation: 'L’arbitre utilise le sifflet pour signaler les arrêts et les reprises du jeu.' },
      { id: 'boots', label: 'Crampons', icon: 'boot', art: 'crampons', target: 'player', wrong: 'Non, les crampons sont les chaussures du joueur !', explanation: 'Les crampons sont adaptés à la surface du terrain pour ne pas glisser.' },
      { id: 'timer', label: 'Chronomètre', icon: 'clock', art: 'chronometre', target: 'referee', wrong: 'Non, c’est l’arbitre qui gère le temps de jeu !', explanation: 'L’arbitre mesure le temps de jeu à l’aide de sa montre ou de son chronomètre.' },
      { id: 'shinguards', label: 'Protège-tibias', icon: 'shield', art: 'protege-tibias', target: 'player', wrong: 'Non, les protège-tibias protègent les jambes du joueur !', explanation: 'Les protège-tibias se portent sous les chaussettes et sont obligatoires en match.' },
      { id: 'cards', label: 'Cartons jaune et rouge', icon: 'file', art: 'cartons', target: 'referee', wrong: 'Non, seul l’arbitre peut montrer un carton !', explanation: 'L’arbitre sort un carton jaune pour avertir et un carton rouge pour exclure.' }
    ]
  },
  {
    id: 2, title: 'Le jeune talent', age: '13 - 16 ans', type: 'pitch', icon: 'star',
    image: 'https://images.pexels.com/photos/12616082/pexels-photo-12616082.jpeg?auto=compress&cs=tinysrgb&w=650',
    intro: 'Ta technique s’affine. Il est temps de trouver ta place et de comprendre le collectif.',
    objective: 'Associer les quatre grandes familles de postes à leurs responsabilités.',
    instruction: 'Compose ton équipe : place chaque poste sur la zone du terrain qui décrit son rôle.',
    targets: [
      { id: 'attack', title: 'Finir les actions et marquer', description: 'Au plus près du but adverse.' },
      { id: 'midfield', title: 'Relier la défense à l’attaque', description: 'Récupérer, organiser et distribuer.' },
      { id: 'defense', title: 'Stopper les attaques adverses', description: 'Protéger la zone devant le but.' },
      { id: 'keeper', title: 'Protéger le but avec les mains', description: 'Uniquement dans sa propre surface, selon les règles.' }
    ],
    items: [
      { id: 'defender', label: 'Défenseur', icon: 'shield', target: 'defense', explanation: 'Le défenseur freine les attaques adverses et protège l’accès à son but.' },
      { id: 'striker', label: 'Attaquant', icon: 'goal', target: 'attack', explanation: 'L’attaquant cherche principalement à se créer des occasions et à marquer.' },
      { id: 'goalkeeper', label: 'Gardien', icon: 'glove', target: 'keeper', explanation: 'Le gardien peut utiliser ses mains dans sa propre surface de réparation, sauf dans certaines situations prévues par les règles.' },
      { id: 'midfielder', label: 'Milieu de terrain', icon: 'midfield', target: 'midfield', explanation: 'Le milieu fait le lien entre les lignes, récupère le ballon et construit les actions.' }
    ]
  }
];

const QUESTIONS = [
  { question: 'Combien de joueurs une équipe aligne-t-elle au début d’un match standard ?', options: ['9 joueurs', '10 joueurs', '11 joueurs', '12 joueurs'], correct: 2, explanation: 'Une équipe commence normalement avec onze joueurs, dont un gardien.' },
  { question: 'Qui peut utiliser ses mains dans sa propre surface de réparation, sous certaines conditions ?', options: ['Le capitaine', 'Le défenseur', 'L’attaquant', 'Le gardien'], correct: 3, explanation: 'Seul le gardien dispose de ce droit dans sa propre surface, avec les restrictions prévues par les règles.' },
  { question: 'Quelle est la durée réglementaire d’un match senior, hors temps additionnel et prolongation ?', options: ['60 minutes', '90 minutes', '80 minutes', '120 minutes'], correct: 1, explanation: 'Un match senior comporte deux mi-temps de 45 minutes, soit 90 minutes.' },
  { question: 'Que signifie un carton rouge pour un joueur sur le terrain ?', options: ['Un simple avertissement', 'Une pause de cinq minutes', 'Son exclusion définitive du match', 'Un remplacement obligatoire'], correct: 2, explanation: 'Le joueur est exclu et ne peut pas être remplacé : son équipe joue en infériorité numérique.' },
  { question: 'Quel est le rôle principal de l’arbitre ?', options: ['Faire respecter les règles', 'Entraîner les deux équipes', 'Choisir le capitaine', 'Compter les supporters'], correct: 0, explanation: 'L’arbitre fait appliquer les Lois du Jeu et veille au bon déroulement de la rencontre.' },
  { question: 'Quel équipement protège les tibias du joueur ?', options: ['Le maillot', 'Les gants', 'Le brassard', 'Les protège-tibias'], correct: 3, explanation: 'Les protège-tibias se portent sous les chaussettes et font partie de l’équipement obligatoire.' },
  { question: 'Quel est le rôle principal d’un attaquant ?', options: ['Diriger l’arbitrage', 'Marquer des buts', 'Protéger le but avec les mains', 'Chronométrer le match'], correct: 1, explanation: 'L’attaquant cherche à créer et à conclure les occasions de but.' },
  { question: 'Qu’est-ce qu’un penalty ?', options: ['Un remplacement de gardien', 'Une remise en touche', 'Un coup de pied de réparation tiré à 11 mètres', 'Un coup de pied de coin'], correct: 2, explanation: 'Le penalty est accordé pour une faute passible d’un coup franc direct commise par un défenseur dans sa propre surface, sous réserve des Lois du Jeu.' },
  { question: 'Combien de mi-temps comporte un match standard ?', options: ['Deux', 'Trois', 'Quatre', 'Une seule'], correct: 0, explanation: 'Un match standard se joue en deux mi-temps de 45 minutes chez les seniors.' },
  { question: 'Quel est l’objectif principal d’une équipe pendant un match ?', options: ['Faire le plus de remplacements', 'Garder le ballon sans attaquer', 'Obtenir le plus de cartons', 'Marquer plus de buts que l’adversaire'], correct: 3, explanation: 'Le vainqueur est l’équipe qui a inscrit le plus de buts à la fin de la rencontre.' }
];

// Carte interactive de l'accueil (Europe et Afrique du Nord) : la position de chaque stade est dans style.css.
const STADIUMS = [
  { id: 'old-trafford', name: 'Old Trafford', city: 'Manchester', country: 'Angleterre', club: 'Manchester United', opened: 1910, fact: 'Surnommé « le théâtre des rêves », c’est l’un des plus anciens grands stades d’Angleterre.' },
  { id: 'parc-des-princes', name: 'Parc des Princes', city: 'Paris', country: 'France', club: 'Paris Saint-Germain', opened: 1972, fact: 'Son architecture en béton et ses tribunes très proches du terrain créent une ambiance réputée.' },
  { id: 'allianz-arena', name: 'Allianz Arena', city: 'Munich', country: 'Allemagne', club: 'Bayern Munich', opened: 2005, fact: 'Sa façade peut s’illuminer de différentes couleurs selon l’équipe qui joue.' },
  { id: 'san-siro', name: 'San Siro', city: 'Milan', country: 'Italie', club: 'AC Milan et Inter', opened: 1926, fact: 'Deux grands clubs rivaux partagent ce même stade pour leurs matchs à domicile.' },
  { id: 'camp-nou', name: 'Camp Nou', city: 'Barcelone', country: 'Espagne', club: 'FC Barcelone', opened: 1957, fact: 'C’est le stade de football qui accueille le plus de spectateurs en Europe.' },
  { id: 'bernabeu', name: 'Santiago Bernabéu', city: 'Madrid', country: 'Espagne', club: 'Real Madrid', opened: 1947, fact: 'Il porte le nom d’un ancien président qui a marqué l’histoire du club.' },
  { id: 'rades', name: 'Stade Hammadi-Agrebi', city: 'Radès (Tunis)', country: 'Tunisie', club: 'Sélection tunisienne, Espérance, Club Africain', opened: 2001, fact: 'Construit pour les Jeux méditerranéens de 2001, il accueille les grands matchs du pays.' },
  { id: 'mohammed-v', name: 'Stade Mohammed-V', city: 'Casablanca', country: 'Maroc', club: 'Wydad et Raja', opened: 1955, fact: 'Il est célèbre pour le derby de Casablanca, l’un des plus chauds d’Afrique.' }
];

/* ==========================================================================
   2. ÉTAT DU JOUEUR : création, validation, calcul des scores, chargement
   ========================================================================== */
function freshState() {
  return {
    profile: null,
    settings: { volume: .35, theme: 'dark', brightness: 100, location: null },
    missions: MISSIONS.map(() => ({ answers: {}, completed: false })),
    quiz: { lastScore: null },                      // dernier score du quiz (sur 10)
    hangman: { lastResult: null },                  // dernier résultat du pendu
    progressPercent: 0
  };
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isScore = value => Number.isInteger(value) && value >= 0 && value <= 10;
const completedCount = (s = state) => s.missions.filter(m => m.completed).length;
// Une mission est ouverte quand toutes les précédentes sont terminées.
const canAccessMission = (id, s = state) => Number.isInteger(id) && id >= 0 && id < MISSIONS.length && s.missions.slice(0, id).every(m => m.completed);
const correctCount = (id, s = state) => MISSIONS[id].items.filter(item => s.missions[id].answers[item.id] === item.target).length;
const nextMission = () => state.missions.findIndex(m => !m.completed);

function validateProfile(input) {
  const profile = {
    firstName: String(input.firstName ?? '').trim().replace(/\s+/g, ' '),
    lastName: String(input.lastName ?? '').trim().replace(/\s+/g, ' '),
    nickname: String(input.nickname ?? '').trim(),
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

// Garde seulement les bonnes réponses et calcule la progression du parcours.
function deriveState(s) {
  let previousComplete = true;
  s.missions.forEach((mission, index) => {
    const answers = {};
    MISSIONS[index].items.forEach(item => { if (previousComplete && mission.answers[item.id] === item.target) answers[item.id] = item.target; });
    mission.answers = answers;
    mission.completed = previousComplete && mission.completed === true && Object.keys(answers).length === MISSIONS[index].items.length;
    previousComplete = mission.completed;
  });
  s.progressPercent = Math.round(completedCount(s) / MISSIONS.length * 100);
  return s;
}

// Remet en forme les données lues dans le stockage (valeurs manquantes ou fausses ignorées).
function normalizeState(raw) {
  const s = freshState();
  if (isObject(raw.profile)) {
    const checked = validateProfile(raw.profile);
    if (checked.valid) s.profile = checked.profile;
  }
  const r = isObject(raw.settings) ? raw.settings : {};
  if (Number.isFinite(r.volume)) s.settings.volume = clamp(r.volume, 0, 1);
  if (Number.isFinite(r.brightness)) s.settings.brightness = clamp(Math.round(r.brightness), 60, 120);
  s.settings.theme = r.theme === 'light' ? 'light' : 'dark';
  if (isObject(r.location) && Number.isFinite(r.location.latitude) && Number.isFinite(r.location.longitude)) s.settings.location = r.location;
  if (Array.isArray(raw.missions)) {
    MISSIONS.forEach((_, index) => {
      const saved = raw.missions[index];
      if (isObject(saved)) {
        s.missions[index].answers = isObject(saved.answers) ? saved.answers : {};
        s.missions[index].completed = saved.completed === true;
      }
    });
  }
  if (isObject(raw.quiz) && isScore(raw.quiz.lastScore)) s.quiz.lastScore = raw.quiz.lastScore;
  if (isObject(raw.hangman)) {
    const last = raw.hangman.lastResult;
    if (isObject(last) && typeof last.won === 'boolean' && typeof last.word === 'string' && Number.isInteger(last.errors)) s.hangman.lastResult = last;
  }
  return deriveState(s);
}


// Test du cours : le navigateur supporte-t-il localStorage et sessionStorage ?
function storageSupported() {
  return typeof(Storage) !== 'undefined';
}

// Lecture de la sauvegarde avec getItem(), clé par clé.
function readState() {
  if (!storageSupported()) return freshState();
  const raw = {};
  if (localStorage.getItem('pseudo') !== null) {
    raw.profile = {
      firstName: localStorage.getItem('prenom'), lastName: localStorage.getItem('nom'),
      nickname: localStorage.getItem('pseudo'), age: localStorage.getItem('age')
    };
  }
  raw.settings = {
    volume: localStorage.getItem('volume') === null ? .35 : Number(localStorage.getItem('volume')),
    brightness: localStorage.getItem('luminosite') === null ? 100 : Number(localStorage.getItem('luminosite')),
    theme: localStorage.getItem('mode')
  };
  if (localStorage.getItem('latitude') !== null) {
    raw.settings.location = {
      latitude: Number(localStorage.getItem('latitude')), longitude: Number(localStorage.getItem('longitude')),
      accuracy: localStorage.getItem('precision') === null ? null : Number(localStorage.getItem('precision')),
      timestamp: localStorage.getItem('datePosition') === null ? null : Number(localStorage.getItem('datePosition'))
    };
  }
  const progression = localStorage.getItem('progression');
  if (progression !== null) {
    try {
      const saved = JSON.parse(progression);
      raw.missions = saved.missions;
      raw.quiz = saved.quiz;
      raw.hangman = saved.hangman;
    } catch (error) { /* progression illisible : on repart de zéro */ }
  }
  if (localStorage.getItem('dernierResultatPendu') !== null) {
    raw.hangman = isObject(raw.hangman) ? raw.hangman : {};
    raw.hangman.lastResult = {
      won: localStorage.getItem('dernierResultatPendu') === 'gagné', word: localStorage.getItem('dernierMotPendu'),
      errors: Number(localStorage.getItem('dernierScorePendu'))
    };
  }
  return normalizeState(raw);
}

let state = readState();
let route = 'home';
let activeMission = 0;
let missionFeedback = null;
let quizRun = null;
let toastTimer = null;
let locationBusy = false;
let locationMessage = null;
let musicPlaying = false;
const main = document.getElementById('main-content');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ==========================================================================
   3. OUTILS DOM : création et recherche d'éléments
   ========================================================================== */
const SVG_NS = 'http://www.w3.org/2000/svg';
const byId = id => document.getElementById(id);
const listOf = collection => Array.prototype.slice.call(collection);
const byClass = (className, root = document) => listOf(root.getElementsByClassName(className));

// Ajoute des enfants (texte, nœuds ou tableaux de nœuds) à un élément.
function appendChildren(node, children) {
  children.forEach(child => {
    if (Array.isArray(child)) { appendChildren(node, child); return; }
    if (child === null || child === undefined || child === false || child === '') return;
    node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return node;
}

// Applique des attributs. Clés spéciales : className, text, dataset.
function setProps(node, props) {
  if (!props) return node;
  Object.keys(props).forEach(key => {
    const value = props[key];
    if (value === null || value === undefined || value === false) return;
    if (key === 'className') node.setAttribute('class', value);
    else if (key === 'text') node.textContent = value;
    else if (key === 'dataset') Object.keys(value).forEach(name => { node.dataset[name] = value[name]; });
    else node.setAttribute(key, value === true ? '' : String(value));
  });
  return node;
}

// el('button', { className: 'button' }, 'Texte', icon('arrow')) crée un élément HTML.
function el(tag, props, ...children) {
  return appendChildren(setProps(document.createElement(tag), props), children);
}

// Même chose pour les éléments SVG (dessin du pendu, anneau du score...).
function svgEl(tag, props, ...children) {
  return appendChildren(setProps(document.createElementNS(SVG_NS, tag), props), children);
}

// Image d'objet du Drag & Drop (dessin SVG défini dans index.html : #obj-maillot, #obj-sifflet...).
function objectImage(name, className) {
  return svgEl('svg', { className, viewBox: '0 0 240 240', role: 'img', 'aria-hidden': 'true' }, svgEl('use', { href: '#obj-' + name }));
}

// Icône tirée du sprite SVG présent dans index.html.
function icon(name, extraClass = '') {
  return svgEl('svg', { className: ('icon ' + extraClass).trim(), 'aria-hidden': 'true' }, svgEl('use', { href: '#i-' + name }));
}

// Remplace tout le contenu d'un élément par de nouveaux nœuds.
function setContent(node, ...children) {
  node.replaceChildren();
  return appendChildren(node, children);
}

// Remonte les parents jusqu'à trouver un élément qui vérifie le test.
function findUp(node, test) {
  while (node && node.nodeType === 1) {
    if (test(node)) return node;
    node = node.parentNode;
  }
  return null;
}
const upData = (node, key) => findUp(node, n => n.dataset !== undefined && n.dataset[key] !== undefined);

// Élément HTML à l'origine d'un événement (ignore les nœuds texte).
function eventElement(event) {
  let node = event.target;
  if (node && node.nodeType === 3) node = node.parentNode;
  return node && node.nodeType === 1 ? node : null;
}

/* ==========================================================================
   4. SAUVEGARDE, MESSAGES ET RÉGLAGES D'AFFICHAGE
   ========================================================================== */
// Écriture de la sauvegarde avec setItem() / removeItem(), une clé par information.
function saveState(s) {
  const p = s.profile;
  if (p) {
    localStorage.setItem('pseudo', p.nickname);
    localStorage.setItem('nom', p.lastName);
    localStorage.setItem('prenom', p.firstName);
    localStorage.setItem('age', p.age);
  } else {
    ['pseudo', 'nom', 'prenom', 'age'].forEach(key => localStorage.removeItem(key));
  }
  localStorage.setItem('volume', s.settings.volume);
  localStorage.setItem('mode', s.settings.theme);
  localStorage.setItem('luminosite', s.settings.brightness);
  const loc = s.settings.location;
  if (loc) {
    localStorage.setItem('latitude', loc.latitude);
    localStorage.setItem('longitude', loc.longitude);
    if (loc.accuracy !== null) localStorage.setItem('precision', loc.accuracy); else localStorage.removeItem('precision');
    if (loc.timestamp !== null) localStorage.setItem('datePosition', loc.timestamp); else localStorage.removeItem('datePosition');
  } else {
    ['latitude', 'longitude', 'precision', 'datePosition'].forEach(key => localStorage.removeItem(key));
  }
  const last = s.hangman.lastResult;
  if (last) {
    localStorage.setItem('dernierResultatPendu', last.won ? 'gagné' : 'perdu');
    localStorage.setItem('dernierScorePendu', last.errors);
    localStorage.setItem('dernierMotPendu', last.word);
  } else {
    ['dernierResultatPendu', 'dernierScorePendu', 'dernierMotPendu'].forEach(key => localStorage.removeItem(key));
  }
  // Missions et dernier score du quiz : une seule chaîne de caractères (JSON).
  localStorage.setItem('progression', JSON.stringify({ missions: s.missions, quiz: s.quiz }));
}

function persist() {
  deriveState(state);
  if (storageSupported()) saveState(state);
  // La liste « Mes données » des paramètres est mise à jour à chaque sauvegarde.
  const list = document.getElementById('stored-data');
  if (list) setContent(list, storedDataItems());
}

function notify(message, type = 'info') {
  const toast = byId('toast');
  clearTimeout(toastTimer);
  byId('toast-text').textContent = message;
  toast.className = 'toast visible' + (type === 'error' ? ' error' : '');
  byId('toast-icon-use').setAttribute('href', '#i-' + (type === 'success' ? 'check-circle' : 'info'));
  toastTimer = setTimeout(() => toast.classList.remove('visible'), type === 'error' ? 8500 : 6500);
}

function applySettings() {
  document.documentElement.dataset.theme = state.settings.theme;
  // Luminosité : une classe CSS par palier de 5 % (html.brightness-60 ... html.brightness-120).
  const root = document.documentElement;
  listOf(root.classList).filter(name => name.startsWith('brightness-')).forEach(name => root.classList.remove(name));
  root.classList.add('brightness-' + clamp(Math.round(state.settings.brightness / 5) * 5, 60, 120));
  byId('meta-theme-color').setAttribute('content', state.settings.theme === 'dark' ? '#0b1217' : '#f1f5f0');
  const audio = document.getElementById('musique');
  if (audio) audio.volume = state.settings.volume;
}
function getHangmanStatus(game) {
  if (!game) return { errors: 0, won: false, lost: false, finished: false };
  const errors = game.guesses.filter(letter => !game.word.includes(letter)).length;
  const won = [...game.word].every(letter => game.guesses.includes(letter));
  return { errors, won, lost: errors >= 6 && !won, finished: won || errors >= 6 };
}

/* ==========================================================================
   5. AFFICHAGE : en-tête et pages (construites avec createElement)
   ========================================================================== */
const NAVIGATION = [
  ['home', 'Accueil', 'home'],
  ['quiz', 'Quiz final', 'trophy'], ['hangman', 'Pendu', 'pendu'],
  ['settings', 'Paramètres', 'settings']
];
const PROFILE_FIELDS = [
  ['firstName', 'Prénom', 'text', 'Ex. Alex', 'given-name'],
  ['lastName', 'Nom', 'text', 'Ex. Martin', 'family-name'],
  ['nickname', 'Pseudo', 'text', 'Ex. Alex10', 'nickname'],
  ['age', 'Âge', 'number', '5 à 100 ans', 'off']
];
const SOURCE_LABELS = { discovery: 'LES ÉQUIPEMENTS', sorting: 'LES SIX IMAGES À CLASSER', pitch: 'TON EFFECTIF' };
const TARGET_LABELS = { discovery: 'CHAQUE ÉQUIPEMENT A SON RÔLE', sorting: 'LES DEUX VESTIAIRES', pitch: 'LE TABLEAU TACTIQUE' };
const HANGMAN_PARTS = [
  ['circle', { cx: 151, cy: 79, r: 18 }], ['path', { d: 'M151 97v67' }],
  ['path', { d: 'm151 116-34 24' }], ['path', { d: 'm151 116 34 24' }],
  ['path', { d: 'm151 164-28 40' }], ['path', { d: 'm151 164 28 40' }]
];

const audioStatusText = () => musicPlaying ? 'La bande-son de ton aventure' : 'Musique d’ambiance · Lecture manuelle';
const initialsOf = profile => ([...profile.firstName][0] + [...profile.lastName][0]).toUpperCase();
const eyebrow = text => el('div', { className: 'eyebrow' }, text);

function renderHeader() {
  const active = route === 'mission' ? 'home' : route;
  const nav = el('nav', { className: 'primary-nav', id: 'primary-nav', 'aria-label': 'Navigation principale' },
    NAVIGATION.map(([id, label, symbol]) => el('button', {
      type: 'button', className: 'nav-button' + (active === id ? ' active' : ''), dataset: { route: id },
      'aria-current': active === id ? 'page' : null
    }, icon(symbol), label)));

  setContent(byId('site-header'), el('div', { className: 'header-inner' },
    el('button', { className: 'brand', type: 'button', dataset: { route: 'home' }, 'aria-label': 'Football Journey, accueil' },
      el('span', { className: 'brand-mark' }, icon('crest')),
      el('span', { className: 'brand-words' }, 'FOOTBALL', el('span', null, 'JOURNEY'))),
    nav,
    el('div', { className: 'header-actions' },
      el('button', { type: 'button', className: 'icon-button header-music', dataset: { action: 'music' }, 'aria-label': musicPlaying ? 'Mettre la musique en pause' : 'Lire la musique d’ambiance', title: musicPlaying ? 'Mettre en pause' : 'Lancer la musique' }, icon(musicPlaying ? 'volume' : 'volume-off')),
      el('button', { type: 'button', className: 'icon-button header-theme', dataset: { action: 'theme' }, 'aria-label': 'Passer en mode ' + (state.settings.theme === 'dark' ? 'clair' : 'sombre'), title: 'Changer de thème' }, icon(state.settings.theme === 'dark' ? 'sun' : 'moon')),
      el('span', { className: 'header-divider', 'aria-hidden': 'true' }),
      el('button', { type: 'button', className: 'profile-button', dataset: state.profile ? { route: 'settings' } : { action: 'register' }, 'aria-label': state.profile ? 'Modifier mon profil' : 'Créer mon joueur' },
        el('span', { className: 'avatar' }, state.profile ? initialsOf(state.profile) : icon('user')),
        el('span', { className: 'profile-label' }, state.profile ? state.profile.nickname : 'Mon joueur'),
        icon('chevron')),
      el('button', { type: 'button', className: 'icon-button menu-button', id: 'menu-button', dataset: { action: 'menu' }, 'aria-label': 'Ouvrir le menu', 'aria-expanded': 'false', 'aria-controls': 'primary-nav' }, icon('menu')))));
}

function profileForm() {
  return el('form', { id: 'register-form', novalidate: true },
    el('p', { className: 'form-summary', id: 'register-summary', role: 'alert', hidden: true }),
    el('div', { className: 'form-grid' }, PROFILE_FIELDS.map(([name, label, type, placeholder, autocomplete]) => {
      const inputProps = { id: `register-${name}`, name, type, placeholder, autocomplete, required: true, 'aria-describedby': `register-${name}-error` };
      if (type === 'number') Object.assign(inputProps, { min: 5, max: 100, step: 1, inputmode: 'numeric' });
      else inputProps.maxlength = name === 'nickname' ? 20 : 40;
      return el('div', { className: 'field' },
        el('label', { for: `register-${name}` }, label + ' ', el('span', { className: 'accent', 'aria-hidden': 'true' }, '*')),
        el('input', inputProps),
        el('span', { id: `register-${name}-error`, className: 'field-error' }));
    })),
    el('div', { className: 'form-bottom' },
      el('span', { className: 'privacy-note' }, icon('shield'), 'Ton profil reste sur cet appareil.'),
      el('button', { type: 'submit', className: 'button' }, 'CRÉER MON JOUEUR', icon('arrow'))));
}

/* ---------- Carte interactive des stades (section de l'accueil) ---------- */
const stadiumById = id => STADIUMS.find(s => s.id === id) || null;

function renderStadiumInfo(stadium) {
  if (!stadium) {
    return [
      el('span', { className: 'map-info-tag' }, 'CARTE INTERACTIVE'),
      el('strong', { className: 'map-info-title' }, 'Huit stades de légende'),
      el('p', null, 'Clique sur un point lumineux de la carte pour découvrir le stade.')
    ];
  }
  return [
    el('span', { className: 'map-info-tag' }, stadium.country.toUpperCase()),
    el('strong', { className: 'map-info-title' }, stadium.name),
    el('p', { className: 'map-info-place' }, stadium.city),
    el('p', null, el('strong', null, 'Club : '), stadium.club),
    el('p', null, el('strong', null, 'Inauguré en : '), String(stadium.opened)),
    el('p', null, stadium.fact)
  ];
}

function renderStadiumMap() {
  const markers = STADIUMS.map(stadium => el('button', {
    type: 'button', className: 'map-marker', dataset: { stadium: stadium.id }, 'aria-label': `${stadium.name}, ${stadium.city}`
  }, el('span', { className: 'map-marker-label' }, stadium.city)));
  return el('section', { className: 'container home-map', 'aria-labelledby': 'map-title' },
    el('div', { className: 'section-heading' },
      el('div', null, eyebrow('DÉCOUVRE LES GRANDS STADES'), el('h2', { className: 'display', id: 'map-title' }, 'LA CARTE DES LÉGENDES.'))),
    el('div', { className: 'map-layout' },
      el('div', { className: 'map-canvas', id: 'stadium-map' },
        svgEl('svg', { className: 'map-land', viewBox: '0 0 532 520', 'aria-hidden': 'true', preserveAspectRatio: 'none' }, svgEl('use', { href: '#map-land' })),
        markers),
      el('div', { className: 'map-info', id: 'map-info', 'aria-live': 'polite' }, renderStadiumInfo(null))));
}

// Clic sur un stade : on allume son point et on affiche sa fiche, sans recharger la page.
function showStadium(id) {
  byClass('map-marker', byId('stadium-map')).forEach(marker => marker.classList.toggle('active', marker.dataset.stadium === id));
  setContent(byId('map-info'), renderStadiumInfo(stadiumById(id)));
}

function progressTrack(percent, label, max = 100, now = percent) {
  const fill = el('span', { className: 'pct-' + clamp(Math.round(percent / 10) * 10, 0, 100) });
  return el('div', { className: 'progress-track', role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': now }, fill);
}

function renderMissionCard(mission) {
  const done = state.missions[mission.id].completed;
  const available = canAccessMission(mission.id);
  const status = done ? 'complete' : available ? 'available' : 'locked';
  return el('button', {
    type: 'button', className: 'mission-card ' + status, dataset: { action: 'mission', id: mission.id },
    'aria-disabled': available ? null : 'true',
    'aria-label': `Mission ${mission.id + 1} : ${mission.title}, ${done ? 'terminée' : available ? 'disponible' : 'verrouillée'}`
  },
    el('div', { className: 'mission-card-image' },
      el('img', { src: mission.image, alt: '', loading: 'lazy' }),
      el('span', { className: 'mission-number' }, '0' + (mission.id + 1)),
      el('span', { className: 'mission-status' }, icon(done ? 'check' : available ? 'play' : 'lock'))),
    el('div', { className: 'mission-card-body' },
      el('span', { className: 'mission-age' }, mission.age),
      el('h3', null, mission.title),
      el('div', { className: 'mission-card-footer' },
        el('span', null, done ? 'Mission accomplie' : available ? 'Le coup d’envoi t’attend' : 'Chaque chose en son temps'),
        icon(done ? 'check' : available ? 'arrow' : 'lock'))));
}

function renderAudioPlayer() {
  const volume = Math.round(state.settings.volume * 100);
  return el('div', { className: 'audio-player' },
    el('div', { className: 'audio-top' },
      el('button', { type: 'button', className: 'audio-play js-audio-play', dataset: { action: 'music' }, 'aria-label': musicPlaying ? 'Mettre la musique en pause' : 'Lire la musique' }, icon(musicPlaying ? 'pause' : 'play')),
      el('div', { className: 'audio-title' }, el('strong', null, 'Road to Glory'), el('small', { className: 'js-audio-status' }, audioStatusText())),
      el('div', { className: 'equalizer js-equalizer' + (musicPlaying ? ' is-playing' : ''), 'aria-hidden': 'true' },
        Array.from({ length: 9 }, () => el('i')))),
    el('div', { className: 'volume-control' },
      icon('volume'),
      el('input', { id: 'home-volume', type: 'range', min: 0, max: 100, step: 1, value: volume, className: 'js-volume-input', dataset: { setting: 'volume' }, 'aria-label': 'Volume de la musique' }),
      el('span', { className: 'volume-value js-volume-value' }, volume + ' %')),
    el('p', { className: 'audio-disclaimer' }, 'Fichier audio/road-to-glory.mp3 · lecture uniquement quand tu cliques.'));
}

function renderHome() {
  const hero = el('section', { className: 'hero', id: 'hero', 'aria-labelledby': 'hero-title' },
    el('img', { className: 'hero-image', src: HERO_IMAGE, alt: 'Un footballeur de dos, sous les projecteurs d’un stade', fetchpriority: 'high' }),
    el('div', { className: 'stadium-beam', 'aria-hidden': 'true' }),
    el('div', { className: 'stadium-beam second', 'aria-hidden': 'true' }),
    el('div', { className: 'container hero-inner' },
      eyebrow(state.profile ? 'BIENVENUE SUR LE TERRAIN, ' + state.profile.nickname : 'LE COUP D’ENVOI DE TON HISTOIRE'),
      el('h1', { id: 'hero-title', className: 'hero-title', 'aria-label': 'FOOTBALL JOURNEY - Deviens une légende !' }, 'FOOTBALL', el('span', null, 'JOURNEY')),
      el('p', { className: 'hero-tagline' }, 'Deviens une légende !', el('span', { className: 'animated-ball', 'aria-hidden': 'true' }, icon('ball'))),
      el('p', { className: 'hero-copy' }, 'Du terrain du quartier aux plus grands stades.', el('br'), 'Apprends, relève les défis et écris ta propre histoire.'),
      el('div', { className: 'hero-actions' },
        el('button', { type: 'button', className: 'button', dataset: { action: 'start' } }, 'COMMENCER MON VOYAGE ', icon('arrow')))));

  const path = el('section', { className: 'container home-path', 'aria-labelledby': 'home-path-title' },
    el('div', { className: 'section-heading' },
      el('div', null, eyebrow('TON PARCOURS VERS LA GLOIRE'), el('h2', { className: 'display', id: 'home-path-title' }, 'TROIS ÉTAPES. UN RÊVE.'))),
    el('div', { className: 'mission-grid' }, MISSIONS.map(renderMissionCard)));

  const player = state.profile ? renderHomePlayer() : el('section', { className: 'registration-section', id: 'registration', 'aria-labelledby': 'registration-title' },
    el('div', { className: 'container registration-layout' },
      el('div', null,
        eyebrow('AVANT D’ENTRER SUR LE TERRAIN'),
        el('h2', { className: 'display', id: 'registration-title' }, 'TON MAILLOT', el('br'), 'T’ATTEND.'),
        el('p', null, 'Crée ton joueur pour commencer. Un pseudo, un objectif et toute une carrière à construire. Tous les champs sont obligatoires.')),
      profileForm()));

  const immersion = el('section', { className: 'container immersion', id: 'immersion', 'aria-labelledby': 'immersion-title' },
    el('div', { className: 'video-wrap' },
      el('video', { id: 'football-video', controls: true, playsinline: true, preload: 'none', poster: VIDEO_POSTER, 'aria-label': 'Séquence de football : des joueurs sur le terrain', 'aria-describedby': 'video-note' },
        el('source', { src: VIDEO_URL, type: 'video/mp4' }),
        'Ton navigateur ne prend pas en charge la vidéo HTML5.')),
    el('div', null,
      eyebrow('PLUS QU’UN JEU, UNE PASSION'),
      el('h2', { className: 'display', id: 'immersion-title' }, 'LE FRISSON', el('br'), 'DU TERRAIN.'),
      el('p', { className: 'immersion-copy', id: 'video-note' }, 'La pelouse, les projecteurs, le premier coup de sifflet. Mets-toi dans l’ambiance : ton aventure ne fait que commencer.'),
      renderAudioPlayer()));

  return [hero, path, renderStadiumMap(), player, immersion];
}

function renderHomePlayer() {
  const p = state.profile;
  return el('section', { className: 'player-home' },
    el('div', { className: 'container player-home-inner' },
      el('div', null,
        eyebrow('DANS TON VESTIAIRE'),
        el('h2', { className: 'display' }, 'BIENVENUE, ' + p.nickname + '.'),
        el('p', { className: 'player-home-identity' }, `${p.firstName} ${p.lastName} · ${p.age} ans`)),
      el('div', { className: 'home-metrics' },
        el('div', { className: 'home-metric' }, el('strong', null, completedCount(), el('small', { className: 'unit muted' }, ' / ' + MISSIONS.length)), el('span', null, 'Missions terminées')),
        el('div', { className: 'home-metric' }, el('strong', null, state.progressPercent, el('small', { className: 'unit' }, ' %')), el('span', null, 'Progression du parcours')),
        el('button', { className: 'button secondary', type: 'button', dataset: { action: 'start' } }, 'CONTINUER ', icon('arrow')))),
    el('div', { className: 'container player-progress' }, progressTrack(state.progressPercent, 'Progression globale')));
}

// Un élément déplaçable : attribut draggable="true" (étape 1 du cours) et un id unique.
function renderDragItem(item, placed) {
  return el('div', {
    id: 'drag-' + item.id, className: 'drag-item' + (placed ? ' placed' : ''),
    draggable: placed ? 'false' : 'true', title: placed ? item.label + ' : bien placé' : 'Fais glisser ' + item.label
  }, item.art ? objectImage(item.art, 'drag-image') : icon(placed ? 'check-circle' : item.icon), el('span', null, item.label), icon(placed ? 'check' : 'grip', 'drag-handle'));
}

function renderMission() {
  const m = MISSIONS[activeMission];
  const saved = state.missions[activeMission];
  const count = correctCount(activeMission);
  const allCorrect = count === m.items.length;
  const feedback = missionFeedback && missionFeedback.mission === m.id ? missionFeedback : null;

  // Les éléments pas encore placés restent à gauche ; les éléments bien placés sont dans leur zone.
  const items = m.items.filter(item => saved.answers[item.id] !== item.target).map(item => renderDragItem(item, false));

  const zones = m.targets.map((target, i) => {
    const assigned = m.items.filter(item => saved.answers[item.id] === target.id);
    const capacity = target.capacity || 1;
    const full = assigned.length === capacity;
    const isError = feedback && feedback.type === 'error' && feedback.target === target.id;
    return el('div', { id: 'zone-' + target.id, className: 'drop-zone' + (full ? ' is-full' : '') + (isError ? ' is-error' : '') },
      el('span', { className: 'zone-number' }, full ? icon('check') : String(i + 1).padStart(2, '0')),
      el('div', { className: 'zone-content' },
        el('span', { className: 'zone-title' }, target.title),
        el('span', { className: 'zone-description' }, target.description + (target.capacity ? ' · ' + assigned.length + '/' + target.capacity : '')),
        el('div', { className: 'zone-answers', id: 'answers-' + target.id }, assigned.map(item => renderDragItem(item, true)))),
      full ? null : icon('download', 'drop-placeholder'));
  });

  const feedbackType = feedback ? feedback.type : saved.completed ? 'success' : '';
  const feedbackIcon = feedback ? (feedback.type === 'success' ? 'check-circle' : 'info') : saved.completed ? 'check-circle' : 'info';
  const feedbackText = feedback ? feedback.message
    : saved.completed ? 'Mission accomplie ! Ta progression est enregistrée.'
    : 'Une erreur ? Lis l’explication, puis réessaie.';
  const helpText = allCorrect
    ? 'Toutes les associations sont correctes. ' + (saved.completed ? 'Tu peux continuer ton parcours.' : 'Valide maintenant ta mission pour débloquer la suite.')
    : 'Fais glisser chaque élément avec la souris et lâche-le dans la bonne zone.';

  return el('div', { className: 'container page' },
    el('button', { type: 'button', className: 'text-button back-link', dataset: { route: 'home' } }, icon('arrow'), 'Retour à l’accueil'),
    el('div', { className: 'mission-heading' },
      el('div', null, eyebrow(`MISSION 0${m.id + 1} / 0${MISSIONS.length} · ${m.age}`), el('h1', { className: 'display' }, m.title), el('p', null, m.intro)),
),
    el('div', { className: 'mission-objective' }, icon('flag'), el('span', null, el('strong', null, 'Ton objectif :'), ' ' + m.objective)),
    el('section', { className: 'activity activity-' + m.type, 'aria-labelledby': 'activity-title' },
      el('div', { className: 'activity-heading' },
        el('div', null, el('h2', { className: 'display', id: 'activity-title' }, 'À TOI DE JOUER.'), el('p', null, m.instruction)),
        el('span', { className: 'activity-counter' }, `${count} / ${m.items.length}`, el('small', null, 'associations'))),
      el('div', { className: 'activity-layout' },
        el('div', { className: 'source-panel' },
          el('div', { className: 'panel-label' }, SOURCE_LABELS[m.type]),
          el('div', { className: 'source-items' }, items),
          el('p', { className: 'source-help' }, helpText)),
        el('div', { className: 'target-panel' },
          el('div', { className: 'panel-label' }, TARGET_LABELS[m.type]),
          el('div', { className: 'target-zones' }, zones))),
      el('div', { className: 'feedback' + (feedbackType ? ' ' + feedbackType : ''), role: 'status', 'aria-live': 'polite' }, icon(feedbackIcon), el('span', null, feedbackText)),
      el('div', { className: 'mission-bottom' },
        el('p', null, saved.completed ? 'Mission déjà terminée.' : 'Place tous les éléments pour terminer la mission.'),
        saved.completed
          ? el('button', { type: 'button', className: 'button', dataset: { action: 'next-mission', id: m.id } }, m.id === MISSIONS.length - 1 ? 'LE QUIZ FINAL M’ATTEND' : 'MISSION SUIVANTE', icon('arrow'))
          : el('button', { type: 'button', className: 'button', id: 'finish-mission', dataset: { action: 'finish-mission', id: m.id }, disabled: !allCorrect }, 'TERMINER LA MISSION ', icon('check')))));
}

function renderQuiz() {
  if (!quizRun && state.quiz.lastScore !== null) return renderQuizResult();
  if (!quizRun) quizRun = { index: 0, answers: Array(10).fill(null) };
  const q = QUESTIONS[quizRun.index];
  const selected = quizRun.answers[quizRun.index];
  const step = quizRun.index + 1;
  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro' },
      eyebrow('LE DERNIER DÉFI'),
      el('h1', { className: 'display' }, 'LE QUIZ DES ', el('span', { className: 'accent' }, 'LÉGENDES.')),
      el('p', null, 'Dix questions sur le football.')),
    el('div', { className: 'quiz-shell' },
      el('div', { className: 'quiz-topline' }, el('span', null, `QUESTION ${step} SUR 10`), el('span', null, step * 10 + ' %')),
      progressTrack(step * 10, 'Progression du quiz', 10, step),
      el('section', { className: 'quiz-card', 'aria-labelledby': 'quiz-question' },
        el('div', { className: 'quiz-number' }, 'FOOTBALL : LES FONDAMENTAUX'),
        el('h2', { className: 'quiz-question', id: 'quiz-question' }, q.question),
        el('div', { className: 'quiz-options', role: 'group', 'aria-label': 'Choisis une réponse' },
          q.options.map((answer, i) => el('button', {
            type: 'button', id: 'quiz-option-' + i, className: 'quiz-option' + (selected === i ? ' selected' : ''),
            dataset: { quizOption: i }, 'aria-pressed': String(selected === i)
          }, el('span', { className: 'option-letter' }, 'ABCD'[i]), el('span', null, answer))))),
      el('div', { className: 'quiz-bottom' },
        el('p', null, 'Choisis une réponse, puis passe à la question suivante.'),
        el('button', { type: 'button', className: 'button', dataset: { action: 'quiz-next' }, disabled: selected === null }, quizRun.index === 9 ? 'DÉCOUVRIR MON SCORE' : 'QUESTION SUIVANTE', icon('arrow')))));
}

function renderQuizResult() {
  const score = state.quiz.lastScore;
  const percentage = score * 10;
  const ring = svgEl('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true' },
    svgEl('circle', { className: 'ring-track', cx: 60, cy: 60, r: 54 }),
    svgEl('circle', { className: 'ring-value', cx: 60, cy: 60, r: 54, 'stroke-dasharray': 339.3, 'stroke-dashoffset': 339.3 * (1 - score / 10) }));
  return el('div', { className: 'container page' },
    el('section', { className: 'result-hero' },
      eyebrow('LE QUIZ FINAL EST TERMINÉ'),
      el('h1', { className: 'display' }, score >= 8
        ? ['TU AS L’ÉTOFFE D’UNE ', el('span', { className: 'accent' }, 'LÉGENDE.')]
        : ['LE TALENT ', el('span', { className: 'accent' }, 'SE TRAVAILLE.')]),
      el('div', { className: 'result-ring', 'aria-label': `${score} bonnes réponses sur 10, soit ${percentage} pour cent` },
        ring, el('span', { className: 'ring-text' }, score, el('small', null, ' / 10'))),
      // Message final demandé par le sujet : « Bravo [pseudo], tu as réussi [X]% de ta mission ! »
      el('p', { className: 'result-message' }, el('strong', null, `Bravo ${state.profile.nickname}, tu as réussi ${percentage}% de ta mission !`)),
      el('div', { className: 'result-actions' },
        el('button', { type: 'button', className: 'button', dataset: { route: 'hangman' } }, 'JOUER AU PENDU', icon('arrow')),
        el('button', { type: 'button', className: 'button secondary', dataset: { action: 'quiz-retry' } }, icon('replay'), 'REJOUER'))));
}

function renderHangman() {
  if (!hangmanGame) newHangmanGame();
  const game = hangmanGame;
  const status = getHangmanStatus(game);
  const plural = status.errors > 1 ? 's' : '';
  const letters = [...game.word];
  const drawing = svgEl('svg', { className: 'gallows', viewBox: '0 0 240 270', role: 'img', 'aria-label': `${status.errors} partie${plural} du pendu dessinée${plural} sur 6` },
    svgEl('path', { d: 'M25 245h180M58 245V27h93v34M58 63l36-36' }),
    HANGMAN_PARTS.slice(0, status.errors).map(([tag, attrs]) => svgEl(tag, Object.assign({ className: 'person mistake' }, attrs))));

  let message;
  if (status.won) message = [el('strong', null, `Bravo ${state.profile.nickname} !`), `Tu as trouvé ${game.word}.`];
  else if (status.lost) message = [el('strong', null, `Perdu ! Le mot était : ${game.word}`), 'Clique sur Rejouer pour prendre ta revanche.'];
  else message = `Un indice : ${game.word.length} lettres, une seule passion. Les lettres déjà proposées sont désactivées.`;

  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro' },
      eyebrow('LA PAUSE AU VESTIAIRE'),
      el('h1', { className: 'display' }, 'UN MOT. SIX CHANCES.', el('br'), el('span', { className: 'accent' }, 'À TOI DE JOUER.')),
      el('p', null, 'Retrouve un mot de l’univers du football en cliquant sur les lettres.')),
    el('section', { className: 'hangman-layout', 'aria-label': 'Jeu du Pendu football' },
      el('div', { className: 'hangman-drawing' }, drawing),
      el('div', null,
        el('div', { className: 'game-status' },
          el('span', null, 'ESSAIS RESTANTS : ', el('strong', { id: 'attempts-left' }, String(6 - status.errors)), ' · erreurs : ' + status.errors + ' / 6'),
          el('div', { className: 'error-dots', 'aria-hidden': 'true' }, Array.from({ length: 6 }, (_, i) => el('i', { className: i < status.errors ? 'used' : null })))),
        el('div', { className: 'word-slots', 'aria-label': 'Mot à trouver : ' + letters.map(l => game.guesses.includes(l) || status.finished ? l : 'tiret').join(' ') },
          letters.map(l => el('span', { className: 'word-slot' + (game.guesses.includes(l) ? ' revealed' : status.lost ? ' missed' : ''), 'aria-hidden': 'true' }, game.guesses.includes(l) || status.finished ? l : '_'))),
        el('div', { className: 'keyboard', role: 'group', 'aria-label': 'Les 26 lettres de l’alphabet' },
          ALPHABET.map(l => el('button', {
            type: 'button', id: 'key-' + l, className: 'letter-key' + (game.guesses.includes(l) ? (game.word.includes(l) ? ' good' : ' bad') : ''),
            dataset: { letter: l }, disabled: game.guesses.includes(l) || status.finished, 'aria-label': 'Lettre ' + l
          }, l))),
        el('div', { className: 'hangman-message' + (status.won ? ' won' : status.lost ? ' lost' : ''), role: 'status', 'aria-live': 'polite' }, message),
        el('div', { className: 'game-bottom' },
          el('button', { type: 'button', id: 'hangman-replay', className: 'button' + (status.finished ? '' : ' secondary'), dataset: { action: 'hangman-replay' } }, icon('replay'), 'REJOUER'),
          el('p', null, 'Ton dernier résultat est enregistré dans le localStorage.')))));
}

// Liste des données du localStorage, parcourue avec length et key(i) comme dans le cours.
function storedDataItems() {
  const items = [];
  if (storageSupported()) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!LOCAL_KEYS.includes(key)) continue;
      const value = key === 'progression' ? 'missions, dernier score du quiz' : localStorage.getItem(key);
      items.push({ key, item: el('li', null, el('strong', null, key + ' : '), value) });
    }
  }
  items.sort((a, b) => LOCAL_KEYS.indexOf(a.key) - LOCAL_KEYS.indexOf(b.key));
  return items.length ? items.map(entry => entry.item) : el('li', null, 'Aucune donnée enregistrée.');
}

function renderSettings() {
  const loc = state.settings.location;
  const volume = Math.round(state.settings.volume * 100);
  const group = (title, ...content) => el('section', { className: 'settings-group' }, el('h2', { className: 'display' }, title), content);

  const p = state.profile;
  const playerGroup = group('MON JOUEUR',
    el('ul', { className: 'stored-data' },
      [['Prénom', p.firstName], ['Nom', p.lastName], ['Pseudo', p.nickname], ['Âge', p.age + ' ans']].map(([label, value]) => el('li', null, el('strong', null, label + ' : '), value))));

  const locationGroup = group('MA POSITION',
    el('div', { className: 'location-actions' },
      el('button', { type: 'button', className: 'button secondary', dataset: { action: 'geolocation' }, disabled: locationBusy },
        icon('location'), locationBusy ? 'LOCALISATION EN COURS...' : loc ? 'ACTUALISER MA POSITION' : 'AUTORISER MA LOCALISATION'),
      loc ? el('button', { type: 'button', className: 'text-button', dataset: { action: 'clear-location' } }, 'Effacer') : null),
    loc ? el('p', { className: 'location-output success' }, `Latitude : ${loc.latitude.toFixed(4)} · Longitude : ${loc.longitude.toFixed(4)}`) : null,
    locationMessage ? el('p', { id: 'location-output', className: 'location-output' + (locationMessage.type ? ' ' + locationMessage.type : ''), role: 'status' }, locationMessage.text) : null);

  const musicGroup = group('MUSIQUE',
    el('div', { className: 'setting-row' },
      el('span', { className: 'setting-label' }, 'Road to Glory'),
      el('button', { type: 'button', className: 'audio-play js-audio-play', dataset: { action: 'music' }, 'aria-label': musicPlaying ? 'Mettre la musique en pause' : 'Lire la musique' }, icon(musicPlaying ? 'pause' : 'play'))),
    el('div', { className: 'setting-row' },
      el('label', { className: 'setting-label', for: 'settings-volume' }, 'Volume'),
      el('div', { className: 'setting-range' },
        el('input', { type: 'range', id: 'settings-volume', min: 0, max: 100, value: volume, className: 'js-volume-input', dataset: { setting: 'volume' } }),
        el('span', { className: 'volume-value js-volume-value' }, volume + ' %'))));

  const displayGroup = group('AFFICHAGE',
    el('div', { className: 'setting-row' },
      el('span', { className: 'setting-label', id: 'theme-label' }, 'Mode'),
      el('div', { className: 'theme-control', role: 'group', 'aria-labelledby': 'theme-label' },
        [['dark', 'moon', 'Sombre'], ['light', 'sun', 'Clair']].map(([choice, symbol, label]) => el('button', {
          type: 'button', className: 'js-theme-choice' + (state.settings.theme === choice ? ' active' : ''),
          dataset: { action: 'set-theme', themeChoice: choice }, 'aria-pressed': String(state.settings.theme === choice)
        }, icon(symbol), label)))),
    el('div', { className: 'setting-row' },
      el('label', { className: 'setting-label', for: 'brightness-range' }, 'Luminosité'),
      el('div', { className: 'setting-range' },
        el('input', { type: 'range', id: 'brightness-range', min: 60, max: 120, step: 5, value: state.settings.brightness, dataset: { setting: 'brightness' } }),
        el('span', { className: 'volume-value', id: 'brightness-value' }, state.settings.brightness + ' %'))));

  const dataGroup = group('MES DONNÉES',
    el('p', { className: 'setting-help wide' }, 'Ce qui est enregistré dans le localStorage de ce navigateur :'),
    el('ul', { className: 'stored-data', id: 'stored-data' }, storedDataItems()),
    el('button', { type: 'button', className: 'text-button danger-text', dataset: { action: 'clear-all' } }, icon('close'), 'Supprimer toutes mes données'));

  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro' },
      eyebrow('PARAMÈTRES'),
      el('h1', { className: 'display' }, 'TON JOUEUR.', el('br'), el('span', { className: 'accent' }, 'TES RÉGLAGES.')),
      el('p', null, 'Chaque réglage est enregistré automatiquement sur cet appareil.')),
    el('div', { className: 'settings-layout' },
      el('div', null, playerGroup, locationGroup),
      el('div', null, musicGroup, displayGroup, dataGroup)));
}

const RENDERERS = { home: renderHome, mission: renderMission, quiz: renderQuiz, hangman: renderHangman, settings: renderSettings };

function renderCurrent(scrollToTop = false) {
  if (!state.profile && route !== 'home') route = 'home';
  if (route === 'mission' && !canAccessMission(activeMission)) route = 'home';
  renderHeader();
  setContent(main, RENDERERS[route]());
  const titles = { home: 'Deviens une légende !', mission: MISSIONS[activeMission].title, quiz: 'Quiz final', hangman: 'Pendu football', settings: 'Paramètres' };
  document.title = 'FOOTBALL JOURNEY - ' + titles[route];
  if (route === 'mission') activerDragAndDrop();
  if (scrollToTop) window.scrollTo(0, 0);
}

/* ==========================================================================
   6. NAVIGATION ENTRE LES PAGES (sans rechargement)
   ========================================================================== */
function requestProfile() {
  if (state.profile) return true;
  if (route !== 'home') { route = 'home'; renderCurrent(true); }
  const section = document.getElementById('registration');
  if (section) {
    section.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
    document.getElementById('register-firstName')?.focus({ preventScroll: true });
  }
  notify('Premier coup de sifflet : crée ton joueur pour commencer ton aventure.');
  return false;
}

function navigate(destination, missionId = 0) {
  if (!['home', 'mission', 'quiz', 'hangman', 'settings'].includes(destination)) return;
  if (destination !== 'home' && !requestProfile()) return;
  if (destination === 'mission' && !canAccessMission(missionId)) {
    notify('Cette mission est encore verrouillée. Termine d’abord la mission précédente.', 'error');
    return;
  }
  const video = document.getElementById('football-video');
  if (video) video.pause();
  missionFeedback = null;
  route = destination;
  if (destination === 'mission') activeMission = missionId;
  renderCurrent(true);
}

function startJourney() {
  if (!requestProfile()) return;
  const next = nextMission();
  if (next === -1) navigate('quiz');
  else navigate('mission', next);
}

function setMenuButton(button, expanded) {
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-label', expanded ? 'Fermer le menu' : 'Ouvrir le menu');
  setContent(button, icon(expanded ? 'close' : 'menu'));
}

function closeMobileMenu() {
  const nav = byId('primary-nav');
  if (!nav || !nav.classList.contains('open')) return;
  nav.classList.remove('open');
  setMenuButton(byId('menu-button'), false);
}

/* ==========================================================================
   7. INSCRIPTION DU JOUEUR
   ========================================================================== */
function submitProfile(form) {
  if (state.profile) return;
  const checked = validateProfile(Object.fromEntries(new FormData(form).entries()));
  PROFILE_FIELDS.forEach(([name]) => {
    byId(`register-${name}-error`).textContent = checked.errors[name] || '';
    byId(`register-${name}`).setAttribute('aria-invalid', String(Boolean(checked.errors[name])));
  });
  const summary = byId('register-summary');
  summary.hidden = checked.valid;
  if (!checked.valid) {
    summary.textContent = 'Encore un petit effort : vérifie les champs indiqués.';
    byId('register-' + Object.keys(checked.errors)[0]).focus();
    return;
  }
  state.profile = checked.profile;
  persist();
  route = 'home';
  renderCurrent(true);
  notify('Bienvenue ' + state.profile.nickname + ' ! Ton maillot est prêt.', 'success');
}

/* ==========================================================================
   8. MISSIONS : DRAG & DROP ET VALIDATION
   ========================================================================== */
/* Méthode du cours « Drag & Drop » :
   Étape 1 : élément draggable (draggable="true") + écouteur dragstart.
   Étape 2 : dragstart stocke l'id de l'élément avec dataTransfer.setData().
   Étape 3 : la zone de drop autorise le dépôt avec dragover + preventDefault().
   Étape 4 : drop récupère l'id avec getData(), retrouve l'élément avec
             getElementById() et l'ajoute dans la zone avec appendChild(). */

// Étape 2 : dragstart, on indique ce que l'on déplace (l'id de l'élément).
function drag(ev) {
  ev.dataTransfer.setData('text/plain', ev.target.id);
  ev.dataTransfer.effectAllowed = 'move';
  ev.target.classList.add('dragging');
}

// dragend : le déplacement est terminé (réussi ou non).
function finDrag(ev) {
  ev.target.classList.remove('dragging');
  byClass('drag-over', main).forEach(zone => zone.classList.remove('drag-over'));
  removeDragData(ev);
}

// Annuler le déplacement : on supprime les données de glissement.
function removeDragData(ev) {
  ev.dataTransfer.clearData();
}

// Étape 3 : autoriser le drop (par défaut le navigateur l'interdit).
function allowDrop(ev) {
  ev.preventDefault();
}

// Étape 4 : que faire dans le drop.
function drop(ev, container) {
  ev.preventDefault();
  container.classList.remove('drag-over');
  const id = ev.dataTransfer.getData('text/plain'); // récupère l'id
  const draggedElement = document.getElementById(id);
  if (draggedElement) verifierDepot(draggedElement, container);
}

// On accroche les écouteurs après chaque affichage d'une mission.
function activerDragAndDrop() {
  byClass('drag-item', main).forEach(dragItem => {
    if (dragItem.getAttribute('draggable') !== 'true') return;
    dragItem.addEventListener('dragstart', drag);
    dragItem.addEventListener('dragend', finDrag);
  });
  byClass('drop-zone', main).forEach(container => {
    container.addEventListener('dragenter', function (ev) { ev.preventDefault(); container.classList.add('drag-over'); });
    container.addEventListener('dragover', allowDrop);
    container.addEventListener('dragleave', function () { container.classList.remove('drag-over'); });
    container.addEventListener('drop', function (ev) { drop(ev, container); });
  });
}

// Vérifie si l'élément est déposé dans la bonne zone : « Bravo ! » ou message d'erreur explicatif.
function verifierDepot(draggedElement, container) {
  if (!state.profile || route !== 'mission' || !canAccessMission(activeMission)) return;
  const mission = MISSIONS[activeMission];
  const item = mission.items.find(i => 'drag-' + i.id === draggedElement.id);
  const target = mission.targets.find(t => 'zone-' + t.id === container.id);
  if (!item || !target || state.missions[activeMission].answers[item.id]) return;
  if (item.target !== target.id) {
    missionFeedback = { mission: activeMission, target: target.id, type: 'error', message: (item.wrong || 'Non, ce n’est pas la bonne zone !') + ' ' + item.explanation + ' Réessaie, tu ne perds aucun point.' };
    renderCurrent(false);
    return;
  }
  // Bonne zone : l'élément déplacé devient un fils de la zone (appendChild, comme dans le cours).
  byId('answers-' + target.id).appendChild(draggedElement);
  draggedElement.setAttribute('draggable', 'false');
  draggedElement.classList.add('placed');
  state.missions[activeMission].answers[item.id] = target.id;
  persist();
  missionFeedback = { mission: activeMission, target: target.id, type: 'success', message: 'Bravo ! ' + item.explanation };
  renderCurrent(false);
}

function finishMission(id) {
  if (!state.profile || route !== 'mission' || activeMission !== id || !canAccessMission(id)) return;
  if (state.missions[id].completed || correctCount(id) !== MISSIONS[id].items.length) return;
  state.missions[id].completed = true;
  persist();
  const next = id === MISSIONS.length - 1 ? 'Les trois missions sont terminées : place au quiz final !' : 'La mission suivante est débloquée : ' + MISSIONS[id + 1].title + '.';
  missionFeedback = { mission: id, type: 'success', message: `Mission accomplie ! Bravo ${state.profile.nickname}. ${next}` };
  renderCurrent(false);
}

function goToNextMission(id) {
  if (!state.missions[id] || !state.missions[id].completed) return;
  if (id === MISSIONS.length - 1) navigate('quiz');
  else navigate('mission', id + 1);
}

/* ==========================================================================
   9. QUIZ FINAL (score enregistré dans le sessionStorage)
   ========================================================================== */
function chooseQuizAnswer(option) {
  if (!state.profile || route !== 'quiz' || !quizRun || !Number.isInteger(option) || option < 0 || option > 3) return;
  quizRun.answers[quizRun.index] = option;
  renderCurrent(false);
}
function advanceQuiz() {
  if (!state.profile || route !== 'quiz' || !quizRun) return;
  if (quizRun.answers[quizRun.index] === null) { notify('Choisis une réponse avant de continuer.', 'error'); return; }
  if (quizRun.index < 9) {
    quizRun.index++;
    renderCurrent(false);
    return;
  }
  const score = quizRun.answers.filter((answer, i) => answer === QUESTIONS[i].correct).length;
  state.quiz.lastScore = score;
  // Score du quiz dans le sessionStorage (cours : sessionStorage.setItem("score", 120)).
  if (storageSupported()) {
    sessionStorage.setItem('scoreQuiz', score * 10);
    sessionStorage.setItem('pseudoQuiz', state.profile.nickname);
  }
  persist();
  quizRun = null;
  renderCurrent(true);
}

function retryQuiz() {
  quizRun = { index: 0, answers: Array(10).fill(null) };
  renderCurrent(true);
}

/* ==========================================================================
   10. JEU DU PENDU
   ========================================================================== */
// La partie en cours reste en mémoire ; seul le dernier résultat est enregistré.
let hangmanGame = null;

function newHangmanGame() {
  const previous = hangmanGame ? hangmanGame.word : '';
  const pool = WORDS.filter(word => word !== previous);
  hangmanGame = { word: pool[Math.floor(Math.random() * pool.length)], guesses: [] };
}

function guessLetter(letter) {
  if (!state.profile || route !== 'hangman' || !hangmanGame) return;
  if (getHangmanStatus(hangmanGame).finished || hangmanGame.guesses.includes(letter)) return;
  hangmanGame.guesses.push(letter);
  const status = getHangmanStatus(hangmanGame);
  if (status.finished) {
    state.hangman.lastResult = { won: status.won, word: hangmanGame.word, errors: status.errors };
    persist();
  }
  renderCurrent(false);
  if (status.won) notify('Bravo ' + state.profile.nickname + ' !', 'success');
  else if (status.lost) notify('Perdu ! Le mot était : ' + hangmanGame.word, 'info');
}

function replayHangman() {
  newHangmanGame();
  renderCurrent(false);
}

/* ==========================================================================
   11. PARAMÈTRES : thème, géolocalisation, remise à zéro
   ========================================================================== */
function setTheme(theme) {
  if (!['dark', 'light'].includes(theme)) return;
  state.settings.theme = theme;
  applySettings();
  persist();
  renderHeader();
  byClass('js-theme-choice').forEach(button => {
    const active = button.dataset.themeChoice === theme;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
/* Géolocalisation (cours) : navigator.geolocation.getCurrentPosition(success, error, options).
   La position n'est demandée qu'après un clic, avec l'accord de l'utilisateur. */
function showGeoMessage(message, type) {
  locationBusy = false;
  locationMessage = { text: message, type };
  if (route === 'settings') renderCurrent(false);
  notify(message, type);
}

function getLocation() {
  if (!state.profile || locationBusy) return;
  if (navigator.geolocation) {
    locationBusy = true;
    locationMessage = { text: 'En attente de ton autorisation et de la position du navigateur...', type: '' };
    if (route === 'settings') renderCurrent(false);
    navigator.geolocation.getCurrentPosition(showPosition, showError, { maximumAge: 60000, timeout: 12000, enableHighAccuracy: false });
  } else {
    showGeoMessage('La géolocalisation n’est pas prise en charge par ce navigateur.', 'error');
  }
}

// Succès : on garde latitude, longitude et précision (position.coords).
function showPosition(position) {
  if (!locationBusy || !state.profile) return;
  state.settings.location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, timestamp: position.timestamp };
  persist();
  showGeoMessage('Position enregistrée sur cet appareil.', 'success');
}

// Erreur : codes du cours (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT).
function showError(error) {
  if (!locationBusy) return;
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
  if (!state.profile) return;
  locationBusy = false;
  state.settings.location = null;
  persist();
  locationMessage = { text: 'Ta position a été effacée.', type: 'success' };
  if (route === 'settings') renderCurrent(false);
  notify(locationMessage.text, locationMessage.type);
}

// Supprime le joueur et toutes ses données : localStorage.clear() et sessionStorage.clear().
function clearAllData() {
  if (!state.profile) return;
  if (!confirm('Supprimer ton joueur, ta progression et tes réglages de cet appareil ?')) return;
  if (storageSupported()) {
    localStorage.clear();
    sessionStorage.clear();
  }
  pauseMusic();
  state = freshState();
  quizRun = null;
  missionFeedback = null;
  locationMessage = null;
  applySettings();
  navigate('home');
  notify('Toutes les données ont été effacées. Crée un nouveau joueur pour recommencer.', 'success');
}

/* ==========================================================================
   12. MUSIQUE D'AMBIANCE : balise <audio id="musique"> (fichier audio/road-to-glory.mp3)
   ========================================================================== */
const musique = document.getElementById('musique');

// Lecture : dans les navigateurs récents, play() renvoie une promesse, refusée si le son est bloqué.
function playMusic() {
  musique.volume = state.settings.volume;
  const lecture = musique.play();
  if (lecture) lecture.catch(() => notify('Le navigateur a bloqué la lecture. Clique de nouveau sur le bouton de lecture.', 'error'));
}

function pauseMusic() {
  musique.pause();
}

function toggleMusic() {
  if (musique.paused) playMusic();
  else pauseMusic();
}

// Les événements play / pause de la balise mettent à jour tous les boutons.
musique.addEventListener('play', () => {
  const video = document.getElementById('football-video');
  if (video) video.pause();
  musicPlaying = true;
  refreshAudioUI();
});
musique.addEventListener('pause', () => {
  musicPlaying = false;
  refreshAudioUI();
});
musique.addEventListener('error', () => notify('Le fichier audio/road-to-glory.mp3 est introuvable.', 'error'));

function refreshAudioUI() {
  renderHeader();
  byClass('js-audio-play').forEach(button => {
    setContent(button, icon(musicPlaying ? 'pause' : 'play'));
    button.setAttribute('aria-label', musicPlaying ? 'Mettre la musique en pause' : 'Lire la musique');
  });
  byClass('js-equalizer').forEach(node => node.classList.toggle('is-playing', musicPlaying));
  byClass('js-audio-status').forEach(node => { node.textContent = audioStatusText(); });
}

/* ==========================================================================
   13. ÉCOUTEURS D'ÉVÉNEMENTS (addEventListener uniquement, délégation sur document)
   ========================================================================== */
document.addEventListener('submit', event => {
  if (event.target.id !== 'register-form') return;
  event.preventDefault();
  submitProfile(event.target);
});

document.addEventListener('click', event => {
  const target = eventElement(event);
  if (!target) return;
  if (!byId('site-header').contains(target)) closeMobileMenu();

  const marker = upData(target, 'stadium');
  if (marker) { showStadium(marker.dataset.stadium); return; }
  const quizOption = upData(target, 'quizOption');
  if (quizOption) { chooseQuizAnswer(Number(quizOption.dataset.quizOption)); return; }
  const letter = upData(target, 'letter');
  if (letter) { if (!letter.disabled) guessLetter(letter.dataset.letter); return; }
  const navButton = upData(target, 'route');
  if (navButton) {
    navigate(navButton.dataset.route);
    return;
  }
  const button = upData(target, 'action');
  if (!button || button.disabled) return;
  switch (button.dataset.action) {
    case 'skip':
      event.preventDefault();
      main.focus({ preventScroll: true });
      main.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      break;
    case 'start': startJourney(); break;
    case 'register': requestProfile(); break;
    case 'mission': navigate('mission', Number(button.dataset.id)); break;
    case 'finish-mission': finishMission(Number(button.dataset.id)); break;
    case 'next-mission': goToNextMission(Number(button.dataset.id)); break;
    case 'music': toggleMusic(); break;
    case 'theme': setTheme(state.settings.theme === 'dark' ? 'light' : 'dark'); break;
    case 'set-theme': setTheme(button.dataset.themeChoice); break;
    case 'menu': setMenuButton(button, byId('primary-nav').classList.toggle('open')); break;
    case 'quiz-next': advanceQuiz(); break;
    case 'quiz-retry': retryQuiz(); break;
    case 'hangman-replay': replayHangman(); break;
    case 'geolocation': getLocation(); break;
    case 'clear-location': clearLocation(); break;
    case 'clear-all': clearAllData(); break;
    case 'dismiss-toast': byId('toast').classList.remove('visible'); break;
  }
});

document.addEventListener('input', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.dataset.setting === 'volume') {
    const value = Number(input.value);
    if (!Number.isFinite(value)) return;
    state.settings.volume = clamp(value / 100, 0, 1);
    applySettings();
    persist();
    const percent = Math.round(state.settings.volume * 100);
    byClass('js-volume-value').forEach(node => { node.textContent = percent + ' %'; });
    byClass('js-volume-input').forEach(node => { if (node !== input) node.value = percent; });
  } else if (input.dataset.setting === 'brightness') {
    const value = Number(input.value);
    if (!Number.isFinite(value)) return;
    state.settings.brightness = clamp(value, 60, 120);
    applySettings();
    persist();
    const label = byId('brightness-value');
    if (label) label.textContent = state.settings.brightness + ' %';
  }
});

// Événement storage (cours) : déclenché quand un AUTRE onglet du site modifie le localStorage.
window.addEventListener('storage', event => {
  if (event.storageArea !== localStorage) return;
  if (event.key !== null && !LOCAL_KEYS.includes(event.key)) return;
  state = readState();
  applySettings();
  missionFeedback = null;
  renderCurrent(false);
  notify(event.key === null ? 'Les données ont été effacées depuis un autre onglet.' : 'Changement détecté dans le stockage (« ' + event.key + ' ») depuis un autre onglet.');
});

/* ==========================================================================
   14. DÉMARRAGE DU SITE
   ========================================================================== */
deriveState(state);
applySettings();
renderCurrent();
