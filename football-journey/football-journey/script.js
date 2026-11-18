'use strict';

/* ==========================================================================
   FOOTBALL JOURNEY — script.js
   - Sélection des éléments : getElementById, getElementsByClassName, getElementsByTagName.
   - Événements : uniquement addEventListener.
   - Contenu des pages : créé avec createElement, createTextNode et textContent.
   ========================================================================== */

/* ==========================================================================
   1. DONNÉES DU JEU : missions, questions du quiz, mots du pendu, badges
   ========================================================================== */
const STORAGE_KEY = 'footballJourney.v1';
const SESSION_KEY = 'footballJourney.quizResult';
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
  },
  {
    id: 3, title: 'Le premier contrat', age: '17 - 20 ans', type: 'timeline', icon: 'file',
    image: 'https://images.pexels.com/photos/37313578/pexels-photo-37313578.jpeg?auto=compress&cs=tinysrgb&w=650',
    intro: 'Le travail paie : un club croit en toi. Découvre les coulisses d’une carrière professionnelle.',
    objective: 'Reconnaître cinq moments clés de la vie d’un joueur professionnel.',
    instruction: 'Reconstitue cette première saison. Associe chaque notion à la situation correspondante sur la frise.',
    targets: [
      { id: 'sign', title: 'Tu officialises ton engagement avec ton premier club.', description: 'Étape 1 : une nouvelle aventure.' },
      { id: 'train', title: 'Tu répètes les passes et les schémas tactiques avec le groupe.', description: 'Étape 2 : progresser ensemble.' },
      { id: 'prepare', title: 'Tu développes ton endurance, ta force et ta récupération.', description: 'Étape 3 : construire ton moteur.' },
      { id: 'compete', title: 'Tu affrontes d’autres clubs dans un championnat officiel.', description: 'Étape 4 : place aux rencontres.' },
      { id: 'transfer', title: 'Tu quittes ton club pour rejoindre une autre équipe.', description: 'Étape 5 : un nouveau défi.' }
    ],
    items: [
      { id: 'fitness', label: 'Préparation physique', icon: 'training', target: 'prepare', explanation: 'La préparation physique développe les capacités du joueur et aide à prévenir les blessures.' },
      { id: 'transfer', label: 'Transfert', icon: 'exchange', target: 'transfer', explanation: 'Un transfert désigne le passage d’un joueur d’un club à un autre.' },
      { id: 'contract', label: 'Contrat professionnel', icon: 'file', target: 'sign', explanation: 'Le contrat formalise l’engagement, les droits et les obligations du joueur et du club.' },
      { id: 'competition', label: 'Compétition', icon: 'trophy', target: 'compete', explanation: 'Un championnat est une compétition officielle organisée entre plusieurs clubs.' },
      { id: 'training', label: 'Entraînement', icon: 'ball', target: 'train', explanation: 'L’entraînement permet de travailler la technique, les automatismes et la tactique collective.' }
    ]
  },
  {
    id: 4, title: 'La légende du football', age: '21 ans et plus', type: 'legend', icon: 'trophy',
    image: 'https://images.pexels.com/photos/36737326/pexels-photo-36737326.jpeg?auto=compress&cs=tinysrgb&w=650',
    intro: 'Les projecteurs sont sur toi. Une légende ne fait pas que jouer : elle prend les bonnes décisions.',
    objective: 'Mobiliser les règles, les rôles et l’esprit collectif dans six situations de haut niveau.',
    instruction: 'Lis chaque situation de match, puis associe-lui la responsabilité, la décision ou le trophée qui convient.',
    targets: [
      { id: 'feet', title: 'Le gardien sort de sa surface avec le ballon.', description: 'Quelle règle doit-il respecter ?' },
      { id: 'build', title: 'Le milieu récupère le ballon et lève la tête.', description: 'Quelle est sa responsabilité ?' },
      { id: 'referee', title: 'Un joueur commet une faute dangereuse.', description: 'Qui fait appliquer les règles ?' },
      { id: 'worldcup', title: 'Ta sélection gagne la finale du Mondial.', description: 'Quel trophée remporte-t-elle ?' },
      { id: 'pass', title: 'Un partenaire est démarqué devant le but, toi non.', description: 'Quel choix privilégie le collectif ?' },
      { id: 'shoot', title: 'L’attaquant est seul face au gardien, en bonne position.', description: 'Comment concrétiser l’occasion ?' }
    ],
    items: [
      { id: 'pass', label: 'Faire une passe', icon: 'exchange', target: 'pass', explanation: 'Servir un partenaire mieux placé augmente les chances de marquer : le collectif passe avant l’exploit individuel.' },
      { id: 'trophy', label: 'La Coupe du monde', icon: 'trophy', target: 'worldcup', explanation: 'La sélection qui remporte la finale du Mondial gagne le trophée de la Coupe du monde.' },
      { id: 'feet', label: 'Jouer avec les pieds', icon: 'boot', target: 'feet', explanation: 'Hors de sa surface de réparation, le gardien est soumis aux mêmes restrictions de main que les autres joueurs.' },
      { id: 'shoot', label: 'Tenter un tir placé', icon: 'goal', target: 'shoot', explanation: 'Seul en bonne position, l’attaquant cherche à marquer en plaçant son tir hors de portée du gardien.' },
      { id: 'referee', label: 'L’arbitre intervient', icon: 'whistle', target: 'referee', explanation: 'L’arbitre sanctionne les fautes et adapte la sanction disciplinaire à leur gravité.' },
      { id: 'build', label: 'Construire l’action', icon: 'midfield', target: 'build', explanation: 'Le milieu organise la transition vers l’attaque en recherchant une passe utile.' }
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

const BADGES = [
  { id: 'first', label: 'Premier pas', description: 'Terminer la mission 1', icon: 'flag', condition: s => s.missions[0].completed },
  { id: 'promising', label: 'Joueur prometteur', description: 'Terminer la mission 2', icon: 'boot', condition: s => s.missions[1].completed },
  { id: 'talent', label: 'Jeune talent', description: 'Terminer la mission 3', icon: 'star', condition: s => s.missions[2].completed },
  { id: 'professional', label: 'Professionnel', description: 'Terminer la mission 4', icon: 'shield', condition: s => s.missions[3].completed },
  { id: 'legend', label: 'Légende du football', description: 'Terminer les 5 missions', icon: 'trophy', condition: s => s.missions.every(m => m.completed) },
  { id: 'quiz', label: 'Champion du quiz', description: 'Obtenir au moins 8/10', icon: 'check-circle', condition: s => s.quiz.claimed && s.quiz.bestScore >= 8 },
  { id: 'hangman', label: 'Maître du Pendu', description: 'Gagner une partie', icon: 'pendu', condition: s => s.hangman.bonusAwarded }
];

// Carte interactive du formulaire (Europe et Afrique du Nord) : la position de chaque stade est dans style.css.
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
    version: 1, profile: null,
    settings: { volume: .35, musicEnabled: false, theme: 'dark', brightness: 100, location: null },
    missions: MISSIONS.map(() => ({ answers: {}, completed: false, score: 0 })),
    quiz: { claimed: false, firstScore: null, lastScore: null, bestScore: null, lastAnswers: [], attempts: 0, completedAt: null },
    hangman: { game: null, lastResult: null, bonusAwarded: false },
    totalPoints: 0, rewards: {}, badges: [], unlockedMissions: [0], progressPercent: 0
  };
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isScore = value => Number.isInteger(value) && value >= 0 && value <= 10;
const completedCount = (s = state) => s.missions.filter(m => m.completed).length;
const canAccessMission = (id, s = state) => Number.isInteger(id) && id >= 0 && id < 5 && (id === 0 || s.missions.slice(0, id).every(m => m.completed));
// Le quiz final est accessible à tout moment depuis le menu.
const canAccessQuiz = () => true;
const correctCount = (id, s = state) => MISSIONS[id].items.filter(item => s.missions[id].answers[item.id] === item.target).length;
const levelName = (s = state) => ['Débutant', 'Apprenti', 'Joueur prometteur', 'Jeune talent', 'Professionnel', 'Légende'][completedCount(s)];
const formatPoints = n => Number(n).toLocaleString('fr-FR');
const nextMission = () => state.missions.findIndex(m => !m.completed);

function validateProfile(input) {
  const profile = {
    firstName: String(input.firstName ?? '').trim().replace(/\s+/g, ' '),
    lastName: String(input.lastName ?? '').trim().replace(/\s+/g, ' '),
    nickname: String(input.nickname ?? '').trim(),
    age: Number(input.age),
    // Stade de cœur choisi sur la carte (facultatif) : seul un identifiant connu est accepté.
    stadium: STADIUMS.some(s => s.id === input.stadium) ? input.stadium : ''
  };
  const errors = {};
  const namePattern = /^[\p{L}][\p{L}\p{M}' -]{0,39}$/u;
  if (!namePattern.test(profile.firstName)) errors.firstName = 'Entre un prénom valide (40 caractères maximum).';
  if (!namePattern.test(profile.lastName)) errors.lastName = 'Entre un nom valide (40 caractères maximum).';
  if (!/^[\p{L}\p{N}_-]{3,20}$/u.test(profile.nickname)) errors.nickname = '3 à 20 lettres, chiffres, tirets ou underscores, sans espace.';
  if (!Number.isInteger(profile.age) || profile.age < 5 || profile.age > 100 || String(input.age).trim() === '') errors.age = 'Entre un âge entier entre 5 et 100 ans.';
  return { profile, errors, valid: Object.keys(errors).length === 0 };
}

function deriveState(s) {
  const rewards = {};
  let previousComplete = true;
  s.missions.forEach((mission, index) => {
    const cleanAnswers = {};
    if (previousComplete) {
      MISSIONS[index].items.forEach(item => {
        if (mission.answers[item.id] === item.target) {
          cleanAnswers[item.id] = item.target;
          rewards[`mission:${index}:answer:${item.id}`] = 10;
        }
      });
    }
    mission.answers = cleanAnswers;
    mission.completed = previousComplete && mission.completed === true && Object.keys(cleanAnswers).length === MISSIONS[index].items.length;
    if (mission.completed) rewards[`mission:${index}:complete`] = 100;
    mission.score = Object.keys(cleanAnswers).length * 10 + (mission.completed ? 100 : 0);
    previousComplete = mission.completed;
  });
  if (!canAccessQuiz(s)) s.quiz = freshState().quiz;
  if (s.quiz.claimed && isScore(s.quiz.firstScore)) rewards['quiz:first-attempt'] = s.quiz.firstScore * 10;
  if (s.hangman.bonusAwarded) rewards['hangman:first-victory'] = 50;
  s.rewards = rewards;
  s.totalPoints = Object.values(rewards).reduce((sum, points) => sum + points, 0);
  s.unlockedMissions = MISSIONS.filter(m => canAccessMission(m.id, s)).map(m => m.id);
  s.progressPercent = completedCount(s) * 20;
  s.badges = BADGES.filter(badge => badge.condition(s)).map(badge => badge.id);
  return s;
}

function normalizeState(raw) {
  const s = freshState();
  if (!isObject(raw)) return s;
  if (isObject(raw.profile)) {
    const checked = validateProfile(raw.profile);
    if (checked.valid) s.profile = checked.profile;
  }
  if (isObject(raw.settings)) {
    const r = raw.settings;
    if (typeof r.volume === 'number' && Number.isFinite(r.volume)) s.settings.volume = clamp(r.volume, 0, 1);
    if (typeof r.brightness === 'number' && Number.isFinite(r.brightness)) s.settings.brightness = clamp(Math.round(r.brightness), 60, 120);
    s.settings.theme = r.theme === 'light' ? 'light' : 'dark';
    s.settings.musicEnabled = r.musicEnabled === true;
    const loc = r.location;
    if (isObject(loc) && typeof loc.latitude === 'number' && typeof loc.longitude === 'number' && Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude) && Math.abs(loc.latitude) <= 90 && Math.abs(loc.longitude) <= 180) {
      s.settings.location = { latitude: loc.latitude, longitude: loc.longitude, accuracy: Number.isFinite(loc.accuracy) ? Math.max(0, loc.accuracy) : null, timestamp: Number.isFinite(loc.timestamp) ? loc.timestamp : null };
    }
  }
  if (Array.isArray(raw.missions)) {
    MISSIONS.forEach((_, index) => {
      const saved = raw.missions[index];
      if (isObject(saved)) {
        s.missions[index].answers = isObject(saved.answers) ? saved.answers : {};
        s.missions[index].completed = saved.completed === true;
      }
    });
  }
  deriveState(s);
  if (canAccessQuiz(s) && isObject(raw.quiz) && raw.quiz.claimed === true && isScore(raw.quiz.firstScore)) {
    const q = raw.quiz;
    s.quiz.claimed = true;
    s.quiz.firstScore = q.firstScore;
    s.quiz.lastScore = isScore(q.lastScore) ? q.lastScore : q.firstScore;
    s.quiz.bestScore = Math.max(s.quiz.firstScore, s.quiz.lastScore, isScore(q.bestScore) ? q.bestScore : 0);
    s.quiz.attempts = Number.isInteger(q.attempts) ? clamp(q.attempts, 1, 100000) : 1;
    s.quiz.completedAt = typeof q.completedAt === 'string' && !Number.isNaN(Date.parse(q.completedAt)) ? q.completedAt : null;
    if (Array.isArray(q.lastAnswers) && q.lastAnswers.length === 10 && q.lastAnswers.every(a => Number.isInteger(a) && a >= 0 && a < 4)) {
      const verifiedScore = q.lastAnswers.filter((a, i) => a === QUESTIONS[i].correct).length;
      if (verifiedScore === s.quiz.lastScore) s.quiz.lastAnswers = q.lastAnswers.slice();
    }
  }
  if (isObject(raw.hangman)) {
    s.hangman.bonusAwarded = raw.hangman.bonusAwarded === true;
    const game = raw.hangman.game;
    if (isObject(game) && WORDS.includes(game.word) && Array.isArray(game.guesses)) {
      const guesses = [];
      for (const letter of [...new Set(game.guesses.filter(l => typeof l === 'string' && /^[A-Z]$/.test(l)))]) {
        if (getHangmanStatus({ word: game.word, guesses }).finished) break;
        guesses.push(letter);
      }
      s.hangman.game = {
        id: typeof game.id === 'string' ? game.id.slice(0, 80) : 'recovered-game', word: game.word,
        guesses, settled: game.settled === true
      };
      const status = getHangmanStatus(s.hangman.game);
      if (!status.finished) s.hangman.game.settled = false;
    }
    const last = raw.hangman.lastResult;
    if (isObject(last) && WORDS.includes(last.word) && typeof last.won === 'boolean' && Number.isInteger(last.errors) && last.errors >= 0 && (last.won ? last.errors < 6 : last.errors === 6)) {
      s.hangman.lastResult = { won: last.won, word: last.word, errors: last.errors, date: typeof last.date === 'string' && !Number.isNaN(Date.parse(last.date)) ? last.date : null };
    }
  }
  return deriveState(s);
}

let loadWarning = '';
let storageAvailable = true;
function readState() {
  let saved;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    storageAvailable = false;
    loadWarning = 'Le stockage local est bloqué par le navigateur. Tu peux jouer, mais ta progression ne sera pas conservée à la fermeture.';
    return freshState();
  }
  try {
    return saved ? normalizeState(JSON.parse(saved)) : freshState();
  } catch (error) {
    loadWarning = 'La sauvegarde contient des données illisibles. Un parcours vierge a été ouvert pour te permettre de recommencer.';
    return freshState();
  }
}

let state = readState();
let route = 'home';
let activeMission = 0;
let selectedItem = null;
let missionFeedback = null;
let quizRun = null;
let dialogConfirm = null;
let toastTimer = null;
let touchDrag = null;
let suppressClickUntil = 0;
let locationBusy = false;
let locationMessage = null;
let musicPlaying = false;
let audioContext = null;
let masterGain = null;
let audioTimer = null;
let audioBeat = 0;
let nextBeatTime = 0;
let musicStarting = false;
const activeAudioNodes = new Set();
const main = document.getElementById('main-content');
const appDialog = document.getElementById('app-dialog');
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

function focusById(id) {
  const node = byId(id);
  if (node) node.focus({ preventScroll: true });
}

/* ==========================================================================
   4. SAUVEGARDE, MESSAGES ET RÉGLAGES D'AFFICHAGE
   ========================================================================== */
function persist() {
  deriveState(state);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    storageAvailable = true;
  } catch (error) {
    if (storageAvailable) notify('La sauvegarde locale est indisponible. Ta progression reste active ici, mais peut être perdue à la fermeture.', 'error');
    storageAvailable = false;
  }
  updateStorageStatus();
  return storageAvailable;
}

function updateStorageStatus() {
  byClass('storage-status').forEach(node => {
    node.textContent = storageAvailable ? (state.profile ? 'Progression sauvegardée sur cet appareil' : 'Projet éducatif · 2026') : 'Sauvegarde indisponible';
  });
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
  if (masterGain && audioContext && audioContext.state !== 'closed') masterGain.gain.setTargetAtTime(state.settings.volume * .42, audioContext.currentTime, .04);
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
  ['home', 'Accueil', 'home'], ['journey', 'Football Journey', 'route'],
  ['quiz', 'Quiz final', 'trophy'], ['hangman', 'Pendu', 'pendu'],
  ['dashboard', 'Tableau de bord', 'chart'], ['settings', 'Paramètres', 'settings']
];
const PROFILE_FIELDS = [
  ['firstName', 'Prénom', 'text', 'Ex. Alex', 'given-name'],
  ['lastName', 'Nom', 'text', 'Ex. Martin', 'family-name'],
  ['nickname', 'Pseudo', 'text', 'Ex. Alex10', 'nickname'],
  ['age', 'Âge', 'number', '5 à 100 ans', 'off']
];
const SOURCE_LABELS = { discovery: 'LES ÉQUIPEMENTS', sorting: 'LES SIX IMAGES À CLASSER', pitch: 'TON EFFECTIF', timeline: 'LES MOMENTS DE TA CARRIÈRE', legend: 'TES DÉCISIONS' };
const TARGET_LABELS = { discovery: 'CHAQUE ÉQUIPEMENT A SON RÔLE', sorting: 'LES DEUX VESTIAIRES', pitch: 'LE TABLEAU TACTIQUE', timeline: 'TA PREMIÈRE SAISON', legend: 'LES SITUATIONS DE MATCH' };
const HANGMAN_PARTS = [
  ['circle', { cx: 151, cy: 79, r: 18 }], ['path', { d: 'M151 97v67' }],
  ['path', { d: 'm151 116-34 24' }], ['path', { d: 'm151 116 34 24' }],
  ['path', { d: 'm151 164-28 40' }], ['path', { d: 'm151 164 28 40' }]
];

const audioStatusText = () => musicPlaying ? 'La bande-son de ton aventure' : 'Ambiance originale · Lecture manuelle';
const musicHelpText = () => musicPlaying ? 'Lecture en cours. Fais vibrer le vestiaire.' : state.settings.musicEnabled ? 'Préférence activée. Utilise la lecture en haut pour reprendre.' : 'Une composition originale, lancée seulement avec ton accord.';
const initialsOf = profile => ([...profile.firstName][0] + [...profile.lastName][0]).toUpperCase();
const eyebrow = text => el('div', { className: 'eyebrow' }, text);

function renderHeader() {
  const active = route === 'mission' ? 'journey' : route;
  const quizLocked = !canAccessQuiz();
  const nav = el('nav', { className: 'primary-nav', id: 'primary-nav', 'aria-label': 'Navigation principale' },
    NAVIGATION.map(([id, label, symbol]) => el('button', {
      type: 'button', className: 'nav-button' + (active === id ? ' active' : ''), dataset: { route: id },
      'aria-current': active === id ? 'page' : null, 'aria-disabled': id === 'quiz' && quizLocked ? 'true' : null
    }, icon(symbol), label, id === 'quiz' && quizLocked ? icon('lock', 'nav-lock') : null)));

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

function profileForm(mode) {
  const p = mode === 'profile' ? state.profile : { firstName: '', lastName: '', nickname: '', age: '', stadium: '' };
  if (p.stadium) discoveredStadiums.add(p.stadium);
  return el('form', { id: mode + '-form', dataset: { form: mode }, novalidate: true },
    el('p', { className: 'form-summary', id: mode + '-summary', role: 'alert', hidden: true }),
    el('div', { className: 'form-grid' }, PROFILE_FIELDS.map(([name, label, type, placeholder, autocomplete]) => {
      const inputProps = { id: `${mode}-${name}`, name, type, value: p[name], placeholder, autocomplete, required: true, 'aria-describedby': `${mode}-${name}-error` };
      if (type === 'number') Object.assign(inputProps, { min: 5, max: 100, step: 1, inputmode: 'numeric' });
      else {
        inputProps.maxlength = name === 'nickname' ? 20 : 40;
        if (name === 'nickname') Object.assign(inputProps, { minlength: 3, spellcheck: 'false', autocapitalize: 'off' });
      }
      return el('div', { className: 'field' },
        el('label', { for: `${mode}-${name}` }, label + ' ', el('span', { className: 'accent', 'aria-hidden': 'true' }, '*')),
        el('input', inputProps),
        el('span', { id: `${mode}-${name}-error`, className: 'field-error' }));
    })),
    renderStadiumMap(mode, p.stadium || ''),
    el('div', { className: 'form-bottom' },
      el('span', { className: 'privacy-note' }, icon('shield'), mode === 'profile' ? 'Ta progression reste inchangée.' : 'Ton profil reste sur cet appareil.'),
      el('button', { type: 'submit', className: 'button' }, mode === 'profile' ? 'ENREGISTRER MON PROFIL' : 'CRÉER MON JOUEUR', icon(mode === 'profile' ? 'check' : 'arrow'))));
}

/* ---------- Carte interactive des stades (dans le formulaire) ---------- */
const discoveredStadiums = new Set();
const stadiumById = id => STADIUMS.find(s => s.id === id) || null;
const stadiumCountText = () => `Stades découverts : ${discoveredStadiums.size} / ${STADIUMS.length}`;

function renderStadiumInfo(stadium, mode) {
  if (!stadium) {
    return [
      el('span', { className: 'map-info-tag' }, 'CARTE INTERACTIVE'),
      el('strong', { className: 'map-info-title' }, 'Choisis ton stade de cœur'),
      el('p', null, 'Huit stades mythiques t’attendent. Touche un point lumineux pour découvrir son histoire.')
    ];
  }
  return [
    el('span', { className: 'map-info-tag' }, 'TON STADE DE CŒUR'),
    el('strong', { className: 'map-info-title' }, stadium.name),
    el('p', { className: 'map-info-place' }, `${stadium.city} · ${stadium.country}`),
    el('p', null, el('strong', null, 'Club : '), stadium.club),
    el('p', null, el('strong', null, 'Inauguré en : '), String(stadium.opened)),
    el('p', null, stadium.fact),
    el('button', { type: 'button', className: 'text-button', dataset: { stadiumClear: mode } }, icon('close'), 'Retirer mon choix')
  ];
}

function renderStadiumMap(mode, selectedId) {
  const markers = STADIUMS.map(stadium => el('button', {
      type: 'button',
      className: 'map-marker' + (stadium.id === selectedId ? ' active' : '') + (discoveredStadiums.has(stadium.id) ? ' visited' : ''),
      dataset: { stadium: stadium.id, mode }, 'aria-pressed': String(stadium.id === selectedId),
      'aria-label': `${stadium.name}, ${stadium.city}`
    }, el('span', { className: 'map-marker-label' }, stadium.city)));
  return el('fieldset', { className: 'stadium-map' },
    el('legend', null, 'Ton stade de cœur ', el('span', { className: 'muted' }, '(facultatif)')),
    el('p', { className: 'map-help' }, 'Explore la carte : touche un stade pour le découvrir, puis garde-le comme stade de cœur.'),
    el('div', { className: 'map-layout' },
      el('div', { className: 'map-canvas', id: mode + '-map' },
        svgEl('svg', { className: 'map-land', viewBox: '0 0 532 520', 'aria-hidden': 'true', preserveAspectRatio: 'none' }, svgEl('use', { href: '#map-land' })),
        markers),
      el('div', { className: 'map-info', id: mode + '-map-info', 'aria-live': 'polite' }, renderStadiumInfo(stadiumById(selectedId), mode))),
    el('p', { className: 'map-count', id: mode + '-map-count' }, stadiumCountText()),
    el('input', { type: 'hidden', id: mode + '-stadium', name: 'stadium', value: selectedId }));
}

// Met à jour la carte sans reconstruire le formulaire (les champs déjà remplis sont conservés).
function refreshStadiumMap(mode) {
  const input = byId(mode + '-stadium');
  const canvas = byId(mode + '-map');
  if (!input || !canvas) return;
  const selectedId = input.value;
  byClass('map-marker', canvas).forEach(marker => {
    const active = marker.dataset.stadium === selectedId;
    marker.classList.toggle('active', active);
    marker.classList.toggle('visited', discoveredStadiums.has(marker.dataset.stadium));
    marker.setAttribute('aria-pressed', String(active));
  });
  setContent(byId(mode + '-map-info'), renderStadiumInfo(stadiumById(selectedId), mode));
  byId(mode + '-map-count').textContent = stadiumCountText();
}

function selectStadium(mode, id) {
  const input = byId(mode + '-stadium');
  if (!input || !stadiumById(id)) return;
  discoveredStadiums.add(id);
  input.value = id;
  refreshStadiumMap(mode);
}

function clearStadium(mode) {
  const input = byId(mode + '-stadium');
  if (!input) return;
  input.value = '';
  refreshStadiumMap(mode);
}

function progressTrack(percent, label, max = 100, now = percent) {
  const fill = el('span', { className: 'pct-' + clamp(Math.round(percent / 10) * 10, 0, 100) });
  return el('div', { className: 'progress-track', role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': now }, fill);
}

function progressBlock(percent, label = 'Progression du parcours') {
  return el('div', { className: 'progress-block' },
    el('div', { className: 'progress-label' }, el('span', null, label), el('strong', null, percent + ' %')),
    progressTrack(percent, label));
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
    el('p', { className: 'audio-disclaimer' }, 'Composition synthétisée sur ton appareil. Aucun son sans ton accord.'));
}

function renderHome() {
  const hero = el('section', { className: 'hero', id: 'hero', 'aria-labelledby': 'hero-title' },
    el('img', { className: 'hero-image', id: 'hero-image', src: HERO_IMAGE, alt: 'Un footballeur de dos, sous les projecteurs d’un stade', fetchpriority: 'high' }),
    el('div', { className: 'stadium-beam', 'aria-hidden': 'true' }),
    el('div', { className: 'stadium-beam second', 'aria-hidden': 'true' }),
    el('div', { className: 'container hero-inner' },
      eyebrow(state.profile ? 'BIENVENUE SUR LE TERRAIN, ' + state.profile.nickname : 'LE COUP D’ENVOI DE TON HISTOIRE'),
      el('h1', { id: 'hero-title', className: 'hero-title', 'aria-label': 'FOOTBALL JOURNEY - Deviens une légende !' }, 'FOOTBALL', el('span', null, 'JOURNEY')),
      el('p', { className: 'hero-tagline' }, 'Deviens une légende !', el('span', { className: 'animated-ball', 'aria-hidden': 'true' }, icon('ball'))),
      el('p', { className: 'hero-copy' }, 'Du terrain du quartier aux plus grands stades.', el('br'), 'Apprends, relève les défis et écris ta propre histoire.'),
      el('div', { className: 'hero-actions' },
        el('button', { type: 'button', className: 'button', dataset: { action: 'start' } }, 'COMMENCER MON VOYAGE ', icon('arrow')),
        el('button', { type: 'button', className: 'text-button', dataset: { action: 'watch-video' } }, icon('play-circle'), 'Découvrir l’ambiance'))));

  const path = el('section', { className: 'container home-path', 'aria-labelledby': 'home-path-title' },
    el('div', { className: 'section-heading' },
      el('div', null, eyebrow('TON PARCOURS VERS LA GLOIRE'), el('h2', { className: 'display', id: 'home-path-title' }, 'CINQ ÉTAPES. UNE LÉGENDE.')),
      el('button', { type: 'button', className: 'text-button', dataset: { route: 'journey' } }, 'Tout le parcours ', icon('arrow'))),
    el('div', { className: 'mission-grid' }, MISSIONS.map(renderMissionCard)));

  const player = state.profile ? renderHomePlayer() : el('section', { className: 'registration-section', id: 'registration', 'aria-labelledby': 'registration-title' },
    el('div', { className: 'container registration-layout' },
      el('div', null,
        eyebrow('AVANT D’ENTRER SUR LE TERRAIN'),
        el('h2', { className: 'display', id: 'registration-title' }, 'TON MAILLOT', el('br'), 'T’ATTEND.'),
        el('p', null, 'Crée ton joueur pour commencer. Un pseudo, un objectif et toute une carrière à construire. Tous les champs sont obligatoires.')),
      profileForm('register')));

  const immersion = el('section', { className: 'container immersion', id: 'immersion', 'aria-labelledby': 'immersion-title' },
    el('div', { className: 'video-wrap' },
      el('video', { id: 'football-video', controls: true, playsinline: true, preload: 'none', poster: VIDEO_POSTER, 'aria-label': 'Séquence de football : des joueurs sur le terrain', 'aria-describedby': 'video-note' },
        el('source', { src: VIDEO_URL, type: 'video/mp4' }),
        'Ton navigateur ne prend pas en charge la vidéo HTML5.'),
      el('div', { className: 'video-error', id: 'video-error', role: 'status', hidden: true },
        'La vidéo est momentanément indisponible. Ton parcours reste accessible.', el('br'),
        el('a', { href: 'https://www.pexels.com/video/people-playing-soccer-6077691/', target: '_blank', rel: 'noopener noreferrer' }, 'Retrouver la vidéo sur Pexels'))),
    el('div', null,
      eyebrow('PLUS QU’UN JEU, UNE PASSION'),
      el('h2', { className: 'display', id: 'immersion-title' }, 'LE FRISSON', el('br'), 'DU TERRAIN.'),
      el('p', { className: 'immersion-copy', id: 'video-note' }, 'La pelouse, les projecteurs, le premier coup de sifflet. Mets-toi dans l’ambiance : ton aventure ne fait que commencer.'),
      renderAudioPlayer()));

  return [hero, path, player, immersion];
}

function renderHomePlayer() {
  const p = state.profile;
  return el('section', { className: 'player-home' },
    el('div', { className: 'container player-home-inner' },
      el('div', null,
        eyebrow('DANS TON VESTIAIRE'),
        el('h2', { className: 'display' }, 'BIENVENUE, ' + p.nickname + '.'),
        el('p', { className: 'player-home-identity' }, `${p.firstName} ${p.lastName} · ${p.age} ans · ${levelName()}` + (stadiumById(p.stadium) ? ' · Stade de cœur : ' + stadiumById(p.stadium).name : ''))),
      el('div', { className: 'home-metrics' },
        el('div', { className: 'home-metric' }, el('strong', { className: 'accent' }, formatPoints(state.totalPoints)), el('span', null, 'Points au compteur')),
        el('div', { className: 'home-metric' }, el('strong', null, completedCount(), el('small', { className: 'unit muted' }, ' / 5')), el('span', null, 'Missions terminées')),
        el('div', { className: 'home-metric' }, el('strong', null, state.progressPercent, el('small', { className: 'unit' }, ' %')), el('span', null, 'Progression du parcours')),
        el('button', { className: 'button secondary', type: 'button', dataset: { route: 'dashboard' } }, 'MON TABLEAU DE BORD ', icon('arrow')))),
    el('div', { className: 'container player-progress' }, progressTrack(state.progressPercent, 'Progression globale')));
}

function renderJourneyRow(m) {
  const done = state.missions[m.id].completed;
  const available = canAccessMission(m.id);
  const scoreText = done ? state.missions[m.id].score + ' points obtenus · Mission accomplie'
    : available ? '+' + (m.items.length * 10 + 100) + ' points à décrocher'
    : 'Termine la mission ' + m.id + ' pour continuer';
  const action = available
    ? el('button', { type: 'button', className: 'button' + (done ? ' secondary' : ''), dataset: { action: 'mission', id: m.id } },
        done ? 'REVOIR' : correctCount(m.id) > 0 ? 'REPRENDRE' : 'C’EST PARTI', icon(done ? 'check' : 'arrow'))
    : el('button', { type: 'button', className: 'locked-label', dataset: { action: 'mission', id: m.id }, 'aria-disabled': 'true' }, icon('lock'), 'Verrouillée');
  return el('article', { className: 'journey-row ' + (done ? 'complete' : available ? 'available' : 'locked') },
    el('img', { src: m.image, alt: '', loading: 'lazy' }),
    el('div', { className: 'journey-row-content' },
      el('span', { className: 'mission-age' }, `MISSION 0${m.id + 1} · ${m.age}`),
      el('h2', { className: 'display' }, m.title),
      el('p', null, m.intro),
      el('div', { className: 'row-score' }, scoreText)),
    action);
}

function renderJourney() {
  const count = completedCount();
  const plural = count > 1 ? 's' : '';
  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro page-intro-row' },
      el('div', null,
        eyebrow('FOOTBALL JOURNEY'),
        el('h1', { className: 'display' }, 'LA ROUTE VERS', el('br'), el('span', { className: 'accent' }, 'TA LÉGENDE.')),
        el('p', { className: 'muted journey-tagline' }, 'Chaque étape se mérite. Commence petit, rêve grand, joue collectif.')),
      progressBlock(state.progressPercent, `${count} mission${plural} terminée${plural} sur 5`)),
    el('div', { className: 'journey-list' }, MISSIONS.map(renderJourneyRow)),
    completedCount() === 5 ? el('div', { className: 'mission-bottom quiz-cta' },
      el('p', null, 'Les cinq missions sont terminées. ', el('strong', null, 'Le dernier défi t’attend.')),
      el('button', { className: 'button', type: 'button', dataset: { route: 'quiz' } }, state.quiz.claimed ? 'REVOIR MON QUIZ' : 'ACCÉDER AU QUIZ FINAL', icon('trophy'))) : null);
}

function renderMission() {
  const m = MISSIONS[activeMission];
  const saved = state.missions[activeMission];
  const count = correctCount(activeMission);
  const allCorrect = count === m.items.length;
  const feedback = missionFeedback && missionFeedback.mission === m.id ? missionFeedback : null;

  const items = m.items.map(item => {
    const placed = saved.answers[item.id] === item.target;
    const selected = !!(selectedItem && selectedItem.mission === m.id && selectedItem.id === item.id);
    return el('button', {
      type: 'button', id: 'drag-' + item.id, className: 'drag-item' + (placed ? ' placed' : '') + (selected ? ' selected' : ''),
      draggable: String(!placed), dataset: { dragItem: item.id, mission: m.id }, 'aria-pressed': String(selected), disabled: placed,
      'aria-label': item.label + (placed ? ', correctement associé' : ', sélectionner puis choisir une destination')
    }, item.art ? objectImage(item.art, 'drag-image') : icon(placed ? 'check-circle' : item.icon), el('span', null, item.label), icon(placed ? 'check' : 'grip', 'drag-handle'));
  });

  const zones = m.targets.map((target, i) => {
    const assigned = m.items.filter(item => saved.answers[item.id] === target.id);
    const capacity = target.capacity || 1;
    const full = assigned.length === capacity;
    const plural = target.capacity > 1 ? 's' : '';
    const isError = feedback && feedback.type === 'error' && feedback.target === target.id;
    return el('button', {
      type: 'button', id: 'zone-' + target.id, className: 'drop-zone' + (full ? ' is-full' : '') + (isError ? ' is-error' : ''),
      dataset: { dropTarget: target.id, mission: m.id },
      'aria-label': `Destination : ${target.title}. ${assigned.length} sur ${capacity} élément${plural} placé${plural}.`
    },
      el('span', { className: 'zone-number' }, full ? icon('check') : String(i + 1).padStart(2, '0')),
      el('span', { className: 'zone-content' },
        el('span', { className: 'zone-title' }, target.title),
        el('span', { className: 'zone-description' }, target.description + (target.capacity ? ' · ' + assigned.length + '/' + target.capacity : '')),
        el('span', { className: 'zone-answers' }, assigned.map(item => el('span', { className: 'dropped-item' }, item.art ? objectImage(item.art, 'dropped-image') : icon('check'), item.label)))),
      full ? null : icon('download', 'drop-placeholder'));
  });

  const feedbackType = feedback ? feedback.type : saved.completed ? 'success' : '';
  const feedbackIcon = feedback ? (feedback.type === 'success' ? 'check-circle' : 'info') : saved.completed ? 'check-circle' : 'info';
  const feedbackText = feedback ? feedback.message
    : saved.completed ? 'Mission accomplie ! Tes points et ton badge sont déjà enregistrés.'
    : 'Chaque bonne association rapporte 10 points. Une erreur ? Prends le temps de comprendre, puis réessaie.';
  const helpText = allCorrect
    ? 'Toutes les associations sont correctes. ' + (saved.completed ? 'Tu peux continuer ton parcours.' : 'Valide maintenant ta mission pour débloquer la suite.')
    : 'Glisse un élément, ou touche-le puis choisis sa destination. Fonctionne aussi avec Tab et Entrée.';

  return el('div', { className: 'container page' },
    el('button', { type: 'button', className: 'text-button back-link', dataset: { route: 'journey' } }, icon('arrow'), 'Retour au parcours'),
    el('div', { className: 'mission-heading' },
      el('div', null, eyebrow(`MISSION 0${m.id + 1} / 05 · ${m.age}`), el('h1', { className: 'display' }, m.title), el('p', null, m.intro)),
      el('div', { className: 'mission-points' },
        el('strong', null, saved.score, el('small', null, ' PTS')),
        el('span', null, `sur ${m.items.length * 10 + 100} possibles`))),
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
        el('p', null, saved.completed ? 'Bonus de mission déjà obtenu. Revoir ne rapporte pas de points supplémentaires.' : [el('strong', null, '+100 points bonus'), ' en terminant cette mission.']),
        saved.completed
          ? el('button', { type: 'button', className: 'button', dataset: { action: 'next-mission', id: m.id } }, m.id === 4 ? 'LE QUIZ FINAL M’ATTEND' : 'MISSION SUIVANTE', icon('arrow'))
          : el('button', { type: 'button', className: 'button', id: 'finish-mission', dataset: { action: 'finish-mission', id: m.id }, disabled: !allCorrect }, 'TERMINER LA MISSION ', icon('check')))));
}

function renderQuiz() {
  if (!quizRun && state.quiz.claimed) return renderQuizResult();
  if (!quizRun) quizRun = { index: 0, answers: Array(10).fill(null), finished: false };
  const q = QUESTIONS[quizRun.index];
  const selected = quizRun.answers[quizRun.index];
  const step = quizRun.index + 1;
  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro' },
      eyebrow('LE DERNIER DÉFI'),
      el('h1', { className: 'display' }, 'LE QUIZ DES ', el('span', { className: 'accent' }, 'LÉGENDES.')),
      el('p', null, 'Dix questions. Tout ce que tu as appris. Montre que tu as l’étoffe d’un grand joueur.')),
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
        el('p', null, state.quiz.claimed
          ? 'Nouvel entraînement : ton meilleur score et tes badges peuvent progresser, mais le bonus ne sera pas versé une seconde fois.'
          : '10 points par bonne réponse. La récompense est attribuée une seule fois, à la fin de ta première tentative.'),
        el('button', { type: 'button', className: 'button', dataset: { action: 'quiz-next' }, disabled: selected === null }, quizRun.index === 9 ? 'DÉCOUVRIR MON SCORE' : 'QUESTION SUIVANTE', icon('arrow')))));
}

function renderQuizResult() {
  const score = state.quiz.lastScore;
  const percentage = score * 10;
  const great = score >= 8;
  const nickname = state.profile.nickname;
  const ring = svgEl('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true' },
    svgEl('circle', { className: 'ring-track', cx: 60, cy: 60, r: 54 }),
    svgEl('circle', { className: 'ring-value', cx: 60, cy: 60, r: 54, 'stroke-dasharray': 339.3, 'stroke-dashoffset': 339.3 * (1 - score / 10) }));
  // Message final demandé par le sujet : « Bravo [pseudo], tu as réussi [X]% de ta mission ! »
  const message = [el('strong', null, `Bravo ${nickname}, tu as réussi ${percentage}% de ta mission !`), el('br'),
    great ? 'Tu es sur le chemin de devenir une légende.' : `${score} bonnes réponses sur 10 : chaque entraînement te rapproche de ton objectif.`];

  return el('div', { className: 'container page' },
    el('section', { className: 'result-hero' },
      eyebrow('LE QUIZ FINAL EST TERMINÉ'),
      el('h1', { className: 'display' }, great
        ? ['TU AS L’ÉTOFFE D’UNE ', el('span', { className: 'accent' }, 'LÉGENDE.')]
        : ['LE TALENT ', el('span', { className: 'accent' }, 'SE TRAVAILLE.')]),
      el('div', { className: 'result-ring', 'aria-label': `${score} bonnes réponses sur 10, soit ${percentage} pour cent` },
        ring, el('span', { className: 'ring-text' }, score, el('small', null, ' / 10'))),
      el('p', { className: 'result-message' }, message),
      el('p', { className: 'result-note' }, `Meilleur score : ${state.quiz.bestScore}/10 · ${state.quiz.attempts} tentative${state.quiz.attempts > 1 ? 's' : ''} · Récompense unique : ${state.quiz.firstScore * 10} points`),
      el('p', { className: 'result-total' }, 'Ton score global : ', el('strong', null, formatPoints(state.totalPoints) + ' points')),
      el('div', { className: 'result-actions' },
        el('button', { type: 'button', className: 'button', dataset: { route: 'dashboard' } }, 'MON TABLEAU DE BORD', icon('arrow')),
        el('button', { type: 'button', className: 'button secondary', dataset: { action: 'quiz-retry' } }, icon('replay'), 'REPASSER LE QUIZ'))),
    el('details', { className: 'quiz-correction' },
      el('summary', null, 'VOIR LA CORRECTION ET LES BONNES RÉPONSES'),
      QUESTIONS.map((q, i) => {
        const choice = state.quiz.lastAnswers[i];
        const known = Number.isInteger(choice);
        const right = known && choice === q.correct;
        return el('div', { className: 'correction-item' + (right ? '' : ' wrong') },
          icon(right ? 'check-circle' : 'info'),
          el('div', null,
            el('h3', null, `${i + 1}. ${q.question}`),
            known ? el('p', null, 'Ta réponse : ' + q.options[choice]) : null,
            el('p', { className: 'correct-answer' }, 'Bonne réponse : ' + q.options[q.correct]),
            el('p', null, q.explanation)));
      })));
}

function renderHangman() {
  ensureHangmanGame();
  const game = state.hangman.game;
  const status = getHangmanStatus(game);
  const plural = status.errors > 1 ? 's' : '';
  const letters = [...game.word];
  const drawing = svgEl('svg', { className: 'gallows', viewBox: '0 0 240 270', role: 'img', 'aria-label': `${status.errors} partie${plural} du pendu dessinée${plural} sur 6` },
    svgEl('path', { d: 'M25 245h180M58 245V27h93v34M58 63l36-36' }),
    HANGMAN_PARTS.slice(0, status.errors).map(([tag, attrs]) => svgEl(tag, Object.assign({ className: 'person mistake' }, attrs))));

  let message;
  if (status.won) message = [el('strong', null, `Bravo ${state.profile.nickname} !`), `Tu as trouvé ${game.word}. ` + (state.rewards['hangman:first-victory'] ? 'Ton bonus unique de 50 points est enregistré.' : '')];
  else if (status.lost) message = [el('strong', null, `Perdu ! Le mot était : ${game.word}`), 'Clique sur Rejouer pour prendre ta revanche.'];
  else message = `Un indice : ${game.word.length} lettres, une seule passion. Les lettres déjà proposées sont désactivées.`;

  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro' },
      eyebrow('LA PAUSE AU VESTIAIRE'),
      el('h1', { className: 'display' }, 'UN MOT. SIX CHANCES.', el('br'), el('span', { className: 'accent' }, 'À TOI DE JOUER.')),
      el('p', null, 'Retrouve un mot de l’univers du football. Clique sur les lettres ou utilise ton clavier.')),
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
          el('p', null, state.hangman.bonusAwarded ? 'Bonus de première victoire déjà obtenu. Les parties suivantes sont sans bonus.' : '+50 points pour ta première victoire. Un seul bonus, autant de parties que tu veux.')))));
}

function renderDashboard() {
  const p = state.profile;
  const next = nextMission();
  const last = state.hangman.lastResult;
  const metric = (label, ...content) => el('div', { className: 'dashboard-metric' }, el('span', null, label), content);

  const rows = MISSIONS.map(m => {
    const done = state.missions[m.id].completed;
    const available = canAccessMission(m.id);
    return el('tr', null,
      el('td', null, el('span', { className: 'table-mission' }, el('span', { className: 'table-number' }, '0' + (m.id + 1)), m.title)),
      el('td', null, `${correctCount(m.id)} / ${m.items.length}`),
      el('td', null, done ? '+100 pts' : '-'),
      el('td', null, `${state.missions[m.id].score} / ${m.items.length * 10 + 100} pts`),
      el('td', null, el('span', { className: 'status-text' + (done ? ' done' : '') }, icon(done ? 'check-circle' : available ? 'play' : 'lock'), done ? 'Terminée' : available ? 'Disponible' : 'Verrouillée')),
      el('td', null, el('button', { className: 'text-button', type: 'button', dataset: { action: 'mission', id: m.id }, 'aria-label': `${done ? 'Revoir' : 'Ouvrir'} la mission ${m.id + 1}` }, icon('arrow'))));
  });
  const table = el('table', { className: 'mission-table' },
    el('thead', null, el('tr', null, ['MISSION', 'ASSOCIATIONS', 'BONUS', 'SCORE', 'STATUT'].map(title => el('th', null, title)), el('th', null, el('span', { 'aria-label': 'Action' })))),
    el('tbody', null, rows));

  const quizTitle = state.quiz.claimed ? `Dernière tentative : ${state.quiz.lastScore}/10 (${state.quiz.lastScore * 10} %)` : canAccessQuiz() ? 'Le dernier défi est disponible.' : 'Termine les cinq missions pour jouer.';
  const quizInfo = state.quiz.claimed ? `Meilleur score : ${state.quiz.bestScore}/10 · Bonus unique : ${state.quiz.firstScore * 10} pts` : '10 questions · Jusqu’à 100 points';
  const hangTitle = last ? (last.won ? 'Victoire' : 'Défaite') + ' · ' + last.word : 'Ton premier mot t’attend.';
  const hangInfo = (last ? last.errors + ' erreur' + (last.errors > 1 ? 's' : '') + ' sur 6' + (last.date ? ' · ' + new Date(last.date).toLocaleDateString('fr-FR') : '') : 'Un mot mystère, six chances.')
    + ' · ' + (state.hangman.bonusAwarded ? 'Bonus unique obtenu' : '+50 pts à ta première victoire');
  const resultBlock = (title, line, info, side, routeName, linkLabel) => el('section', { className: 'dashboard-result' },
    el('h2', { className: 'display' }, title),
    el('div', { className: 'dashboard-result-line' }, el('div', null, el('strong', null, line), el('p', null, info)), el('span', null, side)),
    el('button', { type: 'button', className: 'text-button result-link', dataset: { route: routeName } }, linkLabel, icon('arrow')));

  return el('div', { className: 'container page' },
    el('div', { className: 'dashboard-profile' },
      el('div', { className: 'dashboard-identity' },
        el('span', { className: 'avatar dashboard-avatar' }, initialsOf(p)),
        el('div', null, eyebrow('TON TABLEAU DE BORD'), el('h1', null, p.nickname), el('p', null, `${p.firstName} ${p.lastName} · ${p.age} ans` + (stadiumById(p.stadium) ? ' · ' + stadiumById(p.stadium).name : '')))),
      el('div', { className: 'dashboard-level' }, eyebrow('TON NIVEAU ACTUEL'), el('strong', null, levelName()))),
    el('div', { className: 'dashboard-metrics' },
      metric('POINTS AU COMPTEUR', el('strong', { className: 'accent' }, formatPoints(state.totalPoints) + ' ', el('small', null, 'PTS'))),
      metric('MISSIONS TERMINÉES', el('strong', null, completedCount() + ' ', el('small', null, '/ 5'))),
      metric('PROGRESSION DU PARCOURS', el('strong', null, state.progressPercent + ' ', el('small', null, '%')), progressTrack(state.progressPercent, 'Progression du parcours')),
      metric(next === -1 ? 'PROCHAIN DÉFI' : 'MISSION ACTUELLE DÉBLOQUÉE', el('strong', null, next === -1 ? 'QUIZ FINAL' : '0' + (next + 1)))),
    el('section', { className: 'dashboard-section' },
      el('div', { className: 'dashboard-section-heading' },
        el('h2', { className: 'display' }, 'CHAQUE EFFORT COMPTE.'),
        el('button', { type: 'button', className: 'text-button', dataset: { action: 'start' } }, next === -1 ? 'Mon quiz final' : 'Reprendre le parcours', icon('arrow'))),
      el('div', { className: 'table-scroll' }, table)),
    el('div', { className: 'dashboard-results' },
      resultBlock('LE QUIZ FINAL', quizTitle, quizInfo, state.quiz.claimed ? state.quiz.lastScore + '/10' : icon(canAccessQuiz() ? 'trophy' : 'lock'), 'quiz', state.quiz.claimed ? 'Voir le résultat' : 'Accéder au quiz'),
      resultBlock('LE PENDU FOOTBALL', hangTitle, hangInfo, state.hangman.bonusAwarded ? '+50' : icon('pendu'), 'hangman', 'Jouer au Pendu')),
    el('section', { className: 'dashboard-section' },
      el('div', { className: 'dashboard-section-heading' },
        el('h2', { className: 'display' }, 'TES INSIGNES DE LÉGENDE.'),
        el('span', null, `${state.badges.length} / ${BADGES.length} débloqués`)),
      el('div', { className: 'badge-grid' }, BADGES.map(badge => {
        const earned = state.badges.includes(badge.id);
        return el('div', { className: 'badge' + (earned ? ' earned' : ''), title: badge.description },
          el('div', { className: 'badge-symbol' }, icon(earned ? badge.icon : 'lock')),
          el('strong', null, badge.label),
          el('p', null, badge.description + (earned ? ' · Obtenu' : '')));
      }))));
}

function renderSettings() {
  const loc = state.settings.location;
  const volume = Math.round(state.settings.volume * 100);

  const identityGroup = el('section', { className: 'settings-group' }, el('h2', { className: 'display' }, 'MON IDENTITÉ'), profileForm('profile'));

  const locationGroup = el('section', { className: 'settings-group' },
    el('h2', { className: 'display' }, 'MA POSITION'),
    el('p', null, 'Facultatif. Ta position n’est demandée qu’avec ton accord et reste sur cet appareil. Cette fonction nécessite HTTPS ou localhost.'),
    el('div', { className: 'location-actions' },
      el('button', { type: 'button', className: 'button secondary', dataset: { action: 'geolocation' }, disabled: locationBusy, 'aria-busy': locationBusy ? 'true' : null },
        icon('location'), locationBusy ? 'LOCALISATION EN COURS...' : loc ? 'ACTUALISER MA POSITION' : 'AUTORISER MA LOCALISATION'),
      loc ? el('button', { type: 'button', className: 'text-button', dataset: { action: 'clear-location' } }, 'Effacer ma position') : null),
    loc ? el('p', { className: 'location-output success' },
      `Latitude : ${loc.latitude.toFixed(4)} · Longitude : ${loc.longitude.toFixed(4)}`,
      loc.accuracy !== null ? [el('br'), 'Précision estimée : ' + Math.round(loc.accuracy) + ' m'] : null) : null,
    el('p', { id: 'location-output', className: 'location-output' + (locationMessage && locationMessage.type ? ' ' + locationMessage.type : ''), role: 'status' },
      locationMessage ? locationMessage.text : 'Aucune demande automatique, aucun suivi en arrière-plan.'));

  const soundGroup = el('section', { className: 'settings-group' },
    el('h2', { className: 'display' }, 'L’AMBIANCE SONORE'),
    el('div', { className: 'setting-row' },
      el('div', null, el('span', { className: 'setting-label', id: 'music-setting-label' }, 'Musique d’ambiance'), el('p', { className: 'setting-help js-music-help' }, musicHelpText())),
      el('button', { type: 'button', className: 'toggle js-music-toggle', role: 'switch', 'aria-checked': String(state.settings.musicEnabled), 'aria-labelledby': 'music-setting-label', dataset: { action: 'music-preference' } })),
    el('div', { className: 'setting-row' },
      el('label', { className: 'setting-label', for: 'settings-volume' }, 'Volume'),
      el('div', { className: 'setting-range' },
        el('input', { type: 'range', id: 'settings-volume', min: 0, max: 100, value: volume, className: 'js-volume-input', dataset: { setting: 'volume' } }),
        el('span', { className: 'volume-value js-volume-value' }, volume + ' %'))));

  const visualGroup = el('section', { className: 'settings-group' },
    el('h2', { className: 'display' }, 'LE CONFORT VISUEL'),
    el('div', { className: 'setting-row' },
      el('span', { className: 'setting-label', id: 'theme-label' }, 'Apparence'),
      el('div', { className: 'theme-control', role: 'group', 'aria-labelledby': 'theme-label' },
        [['dark', 'moon', 'Sombre'], ['light', 'sun', 'Clair']].map(([choice, symbol, label]) => el('button', {
          type: 'button', className: 'js-theme-choice' + (state.settings.theme === choice ? ' active' : ''),
          dataset: { action: 'set-theme', themeChoice: choice }, 'aria-pressed': String(state.settings.theme === choice)
        }, icon(symbol), label)))),
    el('div', { className: 'setting-row' },
      el('div', null, el('label', { className: 'setting-label', for: 'brightness-range' }, 'Luminosité'), el('p', { className: 'setting-help' }, 'Ajuste l’intensité de l’interface, de 60 à 120 %.')),
      el('div', { className: 'setting-range' },
        el('input', { type: 'range', id: 'brightness-range', min: 60, max: 120, step: 5, value: state.settings.brightness, dataset: { setting: 'brightness' } }),
        el('span', { className: 'volume-value', id: 'brightness-value' }, state.settings.brightness + ' %'))));

  const dataGroup = el('section', { className: 'settings-group' },
    el('h2', { className: 'display' }, 'MES DONNÉES'),
    el('p', null, 'Profil, scores, badges et réglages sont conservés dans le stockage local. Le résultat du quiz est aussi enregistré dans le stockage de session.'),
    el('button', { type: 'button', className: 'button secondary', dataset: { action: 'diagnostics' } }, icon('shield'), 'VÉRIFIER MA SAUVEGARDE'),
    el('p', { className: 'diagnostic-result', id: 'diagnostic-result', role: 'status' }),
    el('div', { className: 'danger-zone' },
      el('p', { className: 'setting-help wide' }, 'Repartir de zéro efface les missions, les points, le quiz, le Pendu et les badges. Ton profil et tes réglages sont conservés.'),
      el('button', { type: 'button', className: 'text-button danger-text', dataset: { action: 'reset' } }, icon('replay'), 'Réinitialiser mon parcours')));

  return el('div', { className: 'container page' },
    el('div', { className: 'page-intro' },
      eyebrow('LES RÉGLAGES DU VESTIAIRE'),
      el('h1', { className: 'display' }, 'TON JOUEUR.', el('br'), el('span', { className: 'accent' }, 'TES RÈGLES.')),
      el('p', null, 'Personnalise ton expérience. Tes préférences sont enregistrées automatiquement sur cet appareil.')),
    el('div', { className: 'settings-layout' },
      el('div', null, identityGroup, locationGroup),
      el('div', null, soundGroup, visualGroup, dataGroup)));
}

const RENDERERS = { home: renderHome, journey: renderJourney, mission: renderMission, quiz: renderQuiz, hangman: renderHangman, dashboard: renderDashboard, settings: renderSettings };

function renderCurrent(scrollToTop = false) {
  if (!state.profile && route !== 'home') route = 'home';
  if (route === 'mission' && !canAccessMission(activeMission)) route = 'journey';
  if (route === 'quiz' && !canAccessQuiz()) route = 'journey';
  const oldY = window.scrollY;
  const oldFocus = document.activeElement ? document.activeElement.id : '';
  const form = route === 'settings' && !scrollToTop ? byId('profile-form') : null;
  const draft = form ? Object.fromEntries(new FormData(form).entries()) : null;
  renderHeader();
  setContent(main, RENDERERS[route]());
  if (draft) {
    Object.keys(draft).forEach(name => { const field = byId('profile-' + name); if (field) field.value = draft[name]; });
    refreshStadiumMap('profile');
  }
  const titles = { home: 'Deviens une légende !', journey: 'Le parcours', mission: MISSIONS[activeMission].title, quiz: 'Quiz final', hangman: 'Pendu football', dashboard: 'Tableau de bord', settings: 'Paramètres' };
  document.title = 'FOOTBALL JOURNEY - ' + titles[route];
  attachMediaHandlers();
  updateStorageStatus();
  if (scrollToTop) {
    main.classList.remove('view-enter');
    void main.offsetWidth;
    main.classList.add('view-enter');
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    if (oldFocus && byId(oldFocus)) focusById(oldFocus);
    window.scrollTo({ top: oldY, behavior: 'instant' });
  }
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

const ROUTE_HASHES = { home: 'accueil', journey: 'parcours', quiz: 'quiz-final', hangman: 'pendu', dashboard: 'tableau-de-bord', settings: 'parametres' };

function parseRouteHash() {
  const hash = window.location.hash.slice(1).toLowerCase();
  const mission = hash.match(/^mission-([1-5])$/);
  if (mission) return { route: 'mission', missionId: Number(mission[1]) - 1 };
  const entry = Object.entries(ROUTE_HASHES).find(([, value]) => value === hash);
  return entry ? { route: entry[0], missionId: 0 } : null;
}

function syncHistory(mode = 'replace') {
  const hash = '#' + (route === 'mission' ? 'mission-' + (activeMission + 1) : ROUTE_HASHES[route]);
  try {
    if (mode === 'push' && window.location.hash !== hash) history.pushState(null, '', hash);
    else if (mode === 'replace') history.replaceState(null, '', hash);
  } catch (error) { /* Navigation still works when history access is restricted. */ }
}

function navigate(destination, missionId = 0, recordHistory = true) {
  if (!['home', 'journey', 'mission', 'quiz', 'hangman', 'dashboard', 'settings'].includes(destination)) return;
  if (destination !== 'home' && !requestProfile()) return;
  if (destination === 'mission' && !canAccessMission(missionId)) {
    notify('Cette mission est encore verrouillée. Termine d’abord la mission précédente.', 'error');
    return;
  }
  if (destination === 'quiz' && !canAccessQuiz()) {
    notify('Le quiz final se débloque après les cinq missions. Tu en as terminé ' + completedCount() + ' sur 5.', 'error');
    return;
  }
  const video = document.getElementById('football-video');
  if (video) video.pause();
  selectedItem = null;
  missionFeedback = null;
  route = destination;
  if (destination === 'mission') activeMission = missionId;
  renderCurrent(true);
  syncHistory(recordHistory ? 'push' : 'replace');
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

function closeMobileMenu(focusButton = false) {
  const nav = byId('primary-nav');
  if (!nav || !nav.classList.contains('open')) return false;
  nav.classList.remove('open');
  const button = byId('menu-button');
  if (button) {
    setMenuButton(button, false);
    if (focusButton) button.focus();
  }
  return true;
}

/* ==========================================================================
   7. FENÊTRES DE DIALOGUE ET INSCRIPTION DU JOUEUR
   ========================================================================== */
function closeDialog() {
  dialogConfirm = null;
  if (appDialog.open) appDialog.close();
}

// copy et actions sont des nœuds (ou tableaux de nœuds / textes), jamais du HTML en texte.
function openDialog(title, copy, actions, kind = 'info') {
  closeDialog();
  appDialog.className = 'app-dialog' + (kind === 'success' ? ' success-dialog' : '');
  setContent(byId('dialog-content'),
    kind === 'success' ? el('div', { className: 'confetti', 'aria-hidden': 'true' }, Array.from({ length: 20 }, () => el('i'))) : null,
    el('div', { className: 'dialog-icon' }, icon(kind === 'success' ? 'trophy' : kind === 'danger' ? 'info' : 'shield')),
    el('h2', { id: 'dialog-title' }, title),
    el('div', { className: 'dialog-copy' }, copy),
    el('div', { className: 'dialog-actions' }, actions));
  appDialog.showModal();
}

function confirmAction(title, copy, buttonLabel, callback, danger = false) {
  openDialog(title, copy, [
    el('button', { type: 'button', className: 'button secondary', dataset: { action: 'close-dialog' }, autofocus: true }, 'ANNULER'),
    el('button', { type: 'button', className: 'button' + (danger ? ' danger' : ''), dataset: { action: 'confirm-dialog' } }, buttonLabel)
  ], danger ? 'danger' : 'info');
  dialogConfirm = callback;
}

function submitProfile(form) {
  const mode = form.dataset.form;
  if (!['register', 'profile'].includes(mode)) return;
  if (mode === 'profile' && !state.profile) { requestProfile(); return; }
  if (mode === 'register' && state.profile) { notify('Ton joueur existe déjà. Tu peux le modifier dans les paramètres.'); return; }
  const checked = validateProfile(Object.fromEntries(new FormData(form).entries()));
  PROFILE_FIELDS.forEach(([name]) => {
    byId(`${mode}-${name}-error`).textContent = '';
    byId(`${mode}-${name}`).removeAttribute('aria-invalid');
  });
  const summary = byId(mode + '-summary');
  summary.hidden = checked.valid;
  if (!checked.valid) {
    summary.textContent = 'Encore un petit effort : vérifie les champs indiqués.';
    Object.keys(checked.errors).forEach(name => {
      byId(`${mode}-${name}-error`).textContent = checked.errors[name];
      byId(`${mode}-${name}`).setAttribute('aria-invalid', 'true');
    });
    byId(`${mode}-${Object.keys(checked.errors)[0]}`).focus();
    return;
  }
  const save = () => {
    state.profile = checked.profile;
    const saved = persist();
    if (mode === 'register') { route = 'home'; renderCurrent(true); }
    else renderCurrent(false);
    notify(mode === 'register'
      ? 'Bienvenue ' + state.profile.nickname + ' ! Ton maillot est prêt.' + (saved ? ' À toi d’écrire l’histoire.' : ' Attention : le navigateur ne permet pas de sauvegarder ce profil.')
      : saved ? 'Profil enregistré. Tes points et ta progression sont conservés.' : 'Profil modifié pour cette visite. La sauvegarde locale est indisponible.', saved ? 'success' : 'error');
  };
  if (mode === 'register') save();
  else if (JSON.stringify(checked.profile) === JSON.stringify(state.profile)) notify('Ton profil est déjà à jour.');
  else confirmAction('UN NOUVEAU MAILLOT ?', 'Enregistrer les modifications de ton profil ? Ton parcours, tes points et tes badges resteront inchangés.', 'ENREGISTRER', save);
}

/* ==========================================================================
   8. MISSIONS : DRAG & DROP ET VALIDATION
   ========================================================================== */
function selectItem(missionId, itemId) {
  if (!state.profile || route !== 'mission' || activeMission !== missionId || !canAccessMission(missionId)) return;
  const item = MISSIONS[missionId].items.find(i => i.id === itemId);
  if (!item || state.missions[missionId].answers[item.id]) return;
  selectedItem = selectedItem && selectedItem.mission === missionId && selectedItem.id === itemId ? null : { mission: missionId, id: itemId };
  renderCurrent(false);
  focusById('drag-' + itemId);
}

function tryDrop(missionId, itemId, targetId) {
  if (!state.profile || route !== 'mission' || activeMission !== missionId || !canAccessMission(missionId)) return;
  const mission = MISSIONS[missionId];
  const item = mission.items.find(i => i.id === itemId);
  const target = mission.targets.find(t => t.id === targetId);
  if (!item || !target) return;
  if (state.missions[missionId].answers[item.id]) { notify('Cet élément est déjà correctement associé.'); return; }
  if (item.target !== target.id) {
    missionFeedback = { mission: missionId, target: targetId, type: 'error', message: (item.wrong || 'Non, ce n’est pas la bonne zone !') + ' ' + item.explanation + ' Réessaie, tu ne perds aucun point.' };
    selectedItem = { mission: missionId, id: itemId };
    renderCurrent(false);
    focusById('zone-' + targetId);
    return;
  }
  const before = state.totalPoints;
  state.missions[missionId].answers[item.id] = target.id;
  persist();
  const awarded = state.totalPoints - before;
  selectedItem = null;
  missionFeedback = { mission: missionId, target: targetId, type: 'success', message: 'Bravo ! ' + (awarded > 0 ? '+10 points. ' : '') + item.explanation + (storageAvailable ? '' : ' Attention : ces points ne sont pas sauvegardés par le navigateur.') };
  renderCurrent(false);
  const next = byClass('drag-item', main).find(button => !button.disabled) || byId('finish-mission');
  if (next) next.focus({ preventScroll: true });
}

function finishMission(id) {
  if (!state.profile || route !== 'mission' || activeMission !== id || !canAccessMission(id)) return;
  if (state.missions[id].completed) { notify('Mission déjà validée : le bonus a déjà été attribué.'); return; }
  if (correctCount(id) !== MISSIONS[id].items.length) { notify('Associe correctement tous les éléments avant de terminer la mission.', 'error'); return; }
  state.missions[id].completed = true;
  persist();
  selectedItem = null;
  missionFeedback = null;
  renderCurrent(false);
  openDialog('MISSION ACCOMPLIE !', [
    el('strong', { className: 'accent' }, '+100 points bonus'), el('br'),
    `Bien joué, ${state.profile.nickname} ! Tu as gagné ${state.missions[id].score} points sur cette mission.`, el('br'),
    id < 4
      ? ['La mission suivante est maintenant débloquée : ', el('strong', null, MISSIONS[id + 1].title + '.')]
      : ['Les cinq missions sont terminées. ', el('strong', null, 'Place au quiz final !')],
    el('br'), 'Ton score global : ', el('strong', null, formatPoints(state.totalPoints) + ' points.')
  ], [
    el('button', { type: 'button', className: 'button secondary', dataset: { route: 'dashboard' } }, 'MON BILAN'),
    el('button', { type: 'button', className: 'button', dataset: { action: 'next-mission', id } }, id < 4 ? 'MISSION SUIVANTE' : 'LE QUIZ FINAL', icon('arrow'))
  ], 'success');
}
function goToNextMission(id) {
  if (!Number.isInteger(id) || id < 0 || id >= 5 || !state.profile || !state.missions[id].completed) { notify('Valide d’abord la mission actuelle.', 'error'); return; }
  closeDialog();
  if (id === 4) navigate('quiz');
  else navigate('mission', id + 1);
}

/* ==========================================================================
   9. QUIZ FINAL (score enregistré dans le sessionStorage)
   ========================================================================== */
function chooseQuizAnswer(option) {
  if (!state.profile || route !== 'quiz' || !canAccessQuiz() || !quizRun || quizRun.finished || !Number.isInteger(option) || option < 0 || option > 3) return;
  quizRun.answers[quizRun.index] = option;
  renderCurrent(false);
  focusById('quiz-option-' + option);
}
function advanceQuiz() {
  if (!state.profile || route !== 'quiz' || !canAccessQuiz() || !quizRun || quizRun.finished) return;
  if (!Number.isInteger(quizRun.answers[quizRun.index])) { notify('Choisis une réponse avant de continuer.', 'error'); return; }
  if (quizRun.index < 9) {
    quizRun.index++;
    renderCurrent(false);
    const heading = document.getElementById('quiz-question');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
    return;
  }
  if (quizRun.answers.length !== 10 || quizRun.answers.some(a => !Number.isInteger(a) || a < 0 || a > 3)) return;
  quizRun.finished = true;
  const answers = quizRun.answers.slice();
  const score = answers.filter((answer, i) => answer === QUESTIONS[i].correct).length;
  const firstAttempt = !state.quiz.claimed;
  if (firstAttempt) { state.quiz.firstScore = score; state.quiz.claimed = true; }
  state.quiz.lastScore = score;
  state.quiz.bestScore = Math.max(state.quiz.bestScore ?? 0, score);
  state.quiz.lastAnswers = answers;
  state.quiz.attempts++;
  state.quiz.completedAt = new Date().toISOString();
  const sessionResult = { score, total: 10, percentage: score * 10, answers, nickname: state.profile.nickname, completedAt: state.quiz.completedAt };
  let sessionSaved = true;
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionResult)); }
  catch (error) { sessionSaved = false; }
  const localSaved = persist();
  quizRun = null;
  renderCurrent(true);
  notify(!sessionSaved ? 'Quiz terminé, mais le navigateur a refusé le stockage de session.' : !localSaved ? 'Quiz terminé. Le score de cette session est conservé, mais la sauvegarde locale est indisponible.' : firstAttempt ? 'Quiz terminé ! +' + score * 10 + ' points. Ton résultat est enregistré.' : 'Nouveau score enregistré. La récompense unique n’a pas été ajoutée une seconde fois.', sessionSaved && localSaved ? 'success' : 'error');
}

function retryQuiz() {
  if (!state.profile || !canAccessQuiz() || !state.quiz.claimed) return;
  confirmAction('ON REMET ÇA ?', 'Tu peux améliorer ton meilleur score et décrocher le badge Champion du quiz. Ton bonus de ' + state.quiz.firstScore * 10 + ' points a déjà été attribué : aucun point supplémentaire ne sera ajouté.', 'C’EST REPARTI', () => {
    quizRun = { index: 0, answers: Array(10).fill(null), finished: false };
    navigate('quiz');
  });
}

function readQuizSession() {
  try {
    const result = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (!isObject(result) || !isScore(result.score) || result.total !== 10 || !Array.isArray(result.answers) || result.answers.length !== 10 || !result.answers.every(a => Number.isInteger(a) && a >= 0 && a < 4)) return null;
    if (result.answers.filter((answer, i) => answer === QUESTIONS[i].correct).length !== result.score || result.percentage !== result.score * 10) return null;
    return result;
  } catch (error) { return null; }
}

/* ==========================================================================
   10. JEU DU PENDU
   ========================================================================== */
function newHangmanGame() {
  const previous = state.hangman.game?.word;
  const pool = WORDS.filter(word => word !== previous);
  state.hangman.game = { id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2), word: pool[Math.floor(Math.random() * pool.length)], guesses: [], settled: false };
  persist();
}

function settleHangmanGame() {
  const game = state.hangman.game;
  if (!game || game.settled) return false;
  const status = getHangmanStatus(game);
  if (!status.finished) return false;
  game.settled = true;
  state.hangman.lastResult = { won: status.won, word: game.word, errors: status.errors, date: new Date().toISOString() };
  const newBonus = status.won && !state.hangman.bonusAwarded;
  if (status.won) state.hangman.bonusAwarded = true;
  return newBonus;
}

function ensureHangmanGame() {
  if (!state.hangman.game) newHangmanGame();
  else if (getHangmanStatus(state.hangman.game).finished && !state.hangman.game.settled) { settleHangmanGame(); persist(); }
}

function guessLetter(letter) {
  if (!state.profile || route !== 'hangman' || !ALPHABET.includes(letter)) return;
  ensureHangmanGame();
  const game = state.hangman.game;
  if (getHangmanStatus(game).finished || game.guesses.includes(letter)) return;
  game.guesses.push(letter);
  const status = getHangmanStatus(game);
  const awarded = status.finished ? settleHangmanGame() : false;
  const saved = persist();
  renderCurrent(false);
  const nextKey = byClass('letter-key', main).find(key => !key.disabled) || byId('hangman-replay');
  if (nextKey) nextKey.focus({ preventScroll: true });
  if (status.won) notify(!saved ? 'Victoire ! Le navigateur ne permet pas de sauvegarder le résultat de cette partie.' : awarded ? 'Bravo ' + state.profile.nickname + ' ! +50 points et le badge Maître du Pendu.' : 'Victoire ! Ton résultat est enregistré. Le bonus unique a déjà été obtenu.', saved ? 'success' : 'error');
  else if (status.lost) notify('Perdu ! Le mot était : ' + game.word, 'info');
}
function replayHangman() {
  if (!state.profile || route !== 'hangman') return;
  const play = () => { newHangmanGame(); renderCurrent(false); };
  if (state.hangman.game && state.hangman.game.guesses.length && !getHangmanStatus(state.hangman.game).finished) confirmAction('UN NOUVEAU COUP D’ENVOI ?', 'La partie en cours sera abandonnée. Ton dernier résultat et ton éventuel bonus restent conservés.', 'NOUVELLE PARTIE', play);
  else play();
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
let geoRequestId = 0;
function requestGeolocation() {
  if (!state.profile || locationBusy) return;
  const report = (message, type) => {
    locationBusy = false;
    locationMessage = { text: message, type };
    if (route === 'settings') renderCurrent(false);
    notify(message, type);
  };
  if (!window.isSecureContext) { report('La géolocalisation nécessite HTTPS ou localhost. Ouvre le site avec Live Server sur ton ordinateur.', 'error'); return; }
  if (!navigator.geolocation) { report('Ce navigateur ne propose pas la géolocalisation. Le reste du parcours reste accessible.', 'error'); return; }
  locationBusy = true;
  locationMessage = { text: 'En attente de ton autorisation et de la position du navigateur...', type: '' };
  const requestId = ++geoRequestId;
  if (route === 'settings') renderCurrent(false);
  try {
    navigator.geolocation.getCurrentPosition(position => {
      if (requestId !== geoRequestId || !state.profile) return;
      state.settings.location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, timestamp: position.timestamp };
      const saved = persist();
      report(saved ? 'Position autorisée et enregistrée uniquement sur cet appareil.' : 'Position obtenue pour cette visite, mais la sauvegarde locale est indisponible.', saved ? 'success' : 'error');
    }, error => {
      if (requestId !== geoRequestId) return;
      const messages = { 1: 'Autorisation refusée. Aucune nouvelle position n’a été enregistrée. Tu peux modifier ce choix dans les permissions du navigateur.', 2: 'Ta position est momentanément indisponible. Vérifie les services de localisation puis réessaie.', 3: 'La recherche de position a pris trop de temps. Tu peux réessayer quand tu veux.' };
      report(messages[error.code] || 'La géolocalisation est bloquée par ce navigateur ou cette page.', 'error');
    }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 60000 });
  } catch (error) { report('La politique de sécurité de ce navigateur empêche la géolocalisation.', 'error'); }
}

function clearLocation() {
  if (!state.profile) return;
  ++geoRequestId;
  locationBusy = false;
  state.settings.location = null;
  const saved = persist();
  locationMessage = { text: saved ? 'Ta position a été effacée de la sauvegarde. Aucun suivi n’est actif.' : 'Position retirée pour cette visite uniquement. Le navigateur a refusé la modification de la sauvegarde ; efface les données du site dans ses paramètres pour la supprimer définitivement.', type: saved ? 'success' : 'error' };
  if (route === 'settings') renderCurrent(false);
  notify(locationMessage.text, locationMessage.type);
}

function resetProgress() {
  if (!state.profile) return;
  confirmAction('REPARTIR DE ZÉRO ?', 'Cette action est définitive : missions, points, quiz, parties de Pendu et badges seront effacés. Seuls ton profil et tes préférences seront conservés.', 'EFFACER MON PARCOURS', () => {
    const profile = state.profile;
    const settings = state.settings;
    state = freshState();
    state.profile = profile;
    state.settings = settings;
    quizRun = null;
    selectedItem = null;
    missionFeedback = null;
    locationBusy = false;
    ++geoRequestId;
    let sessionCleared = true;
    try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { sessionCleared = false; }
    const saved = persist();
    navigate('home');
    notify(saved && sessionCleared ? 'Nouveau départ ! La mission 1 t’attend, ' + profile.nickname + '.' : 'Le parcours est remis à zéro ici, mais le navigateur a refusé une opération de stockage.', saved && sessionCleared ? 'success' : 'error');
  }, true);
}

/* ==========================================================================
   12. MUSIQUE D'AMBIANCE (générée avec Web Audio, sans fichier audio)
   ========================================================================== */
let musicRequestId = 0;
let noiseBuffer = null;
const beatDuration = 60 / 112;

function trackAudioNode(node, connectedNodes = []) {
  activeAudioNodes.add(node);
  node.addEventListener('ended', () => {
    activeAudioNodes.delete(node);
    try { node.disconnect(); connectedNodes.forEach(n => n.disconnect()); } catch (error) { /* Déjà déconnecté lors de la pause. */ }
  }, { once: true });
}
function scheduleTone(midi, time, duration, type, volume, cutoff = 2400) {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(440 * Math.pow(2, (midi - 69) / 12), time);
  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  envelope.gain.setValueAtTime(.0001, time);
  envelope.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), time + .025);
  envelope.gain.exponentialRampToValueAtTime(.0001, time + duration);
  oscillator.connect(filter);
  filter.connect(envelope);
  envelope.connect(masterGain);
  trackAudioNode(oscillator, [filter, envelope]);
  oscillator.start(time);
  oscillator.stop(time + duration + .025);
}

function scheduleKick(time) {
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.frequency.setValueAtTime(120, time);
  oscillator.frequency.exponentialRampToValueAtTime(42, time + .14);
  envelope.gain.setValueAtTime(.48, time);
  envelope.gain.exponentialRampToValueAtTime(.0001, time + .2);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  trackAudioNode(oscillator, [envelope]);
  oscillator.start(time);
  oscillator.stop(time + .22);
}

function scheduleNoise(time, snare = false) {
  const source = audioContext.createBufferSource();
  const envelope = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  source.buffer = noiseBuffer;
  filter.type = 'highpass';
  filter.frequency.value = snare ? 1200 : 7000;
  envelope.gain.setValueAtTime(snare ? .17 : .07, time);
  envelope.gain.exponentialRampToValueAtTime(.0001, time + (snare ? .12 : .045));
  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(masterGain);
  trackAudioNode(source, [filter, envelope]);
  source.start(time);
  source.stop(time + .14);
}

function scheduleMusicBeat(beat, time) {
  const chords = [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]];
  const chord = chords[Math.floor(beat / 4) % 4];
  const melody = [74, 77, 81, 77, 74, 77, 79, 77, 72, 77, 81, 84, 79, 76, 72, 76];
  if (beat % 4 === 0) chord.forEach(note => scheduleTone(note + 12, time, beatDuration * 3.95, 'triangle', .085, 1400));
  scheduleTone(chord[0] - 12, time, beatDuration * .8, 'triangle', .28, 650);
  scheduleTone(chord[beat % 3] + 24, time, beatDuration * .6, 'sine', .075);
  scheduleTone(chord[(beat + 1) % 3] + 24, time + beatDuration / 2, beatDuration * .4, 'sine', .06);
  if (beat >= 16) scheduleTone(melody[beat % 16], time, beatDuration * .85, 'triangle', .11, 2000);
  if (beat % 2 === 0) scheduleKick(time);
  else scheduleNoise(time, true);
  scheduleNoise(time + beatDuration / 2);
}

function musicScheduler() {
  if (!musicPlaying || !audioContext || audioContext.state !== 'running') return;
  if (nextBeatTime < audioContext.currentTime - .3) nextBeatTime = audioContext.currentTime + .04;
  while (nextBeatTime < audioContext.currentTime + .16) {
    scheduleMusicBeat(audioBeat, nextBeatTime);
    nextBeatTime += beatDuration;
    audioBeat = (audioBeat + 1) % 32;
  }
}

async function playMusic() {
  if (musicPlaying || musicStarting) return;
  musicStarting = true;
  const request = ++musicRequestId;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Web Audio unsupported');
    if (!audioContext || audioContext.state === 'closed') {
      audioContext = new AudioContextClass();
      masterGain = audioContext.createGain();
      masterGain.gain.value = state.settings.volume * .42;
      masterGain.connect(audioContext.destination);
      noiseBuffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * .15), audioContext.sampleRate);
      const samples = noiseBuffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      audioContext.addEventListener('statechange', () => {
        if (audioContext.state !== 'running' && musicPlaying) {
          pauseMusic(false);
        }
      });
    }
    await audioContext.resume();
    if (request !== musicRequestId) return;
    if (audioContext.state !== 'running') throw new Error('Playback blocked');
    document.getElementById('football-video')?.pause();
    musicPlaying = true;
    state.settings.musicEnabled = true;
    masterGain.gain.setValueAtTime(state.settings.volume * .42, audioContext.currentTime);
    nextBeatTime = audioContext.currentTime + .045;
    audioBeat = 0;
    musicScheduler();
    clearInterval(audioTimer);
    audioTimer = setInterval(musicScheduler, 35);
    persist();
    refreshAudioUI();
  } catch (error) {
    pauseMusic(false);
    state.settings.musicEnabled = false;
    persist();
    refreshAudioUI();
    notify('La lecture audio n’est pas disponible ou a été bloquée par le navigateur. Aucun son ne joue. Réessaie après une action sur Lecture.', 'error');
  } finally { musicStarting = false; }
}

function pauseMusic(savePreference = true) {
  ++musicRequestId;
  clearInterval(audioTimer);
  audioTimer = null;
  musicPlaying = false;
  activeAudioNodes.forEach(node => { try { node.stop(); } catch (error) { /* A scheduled note may already have ended. */ } });
  activeAudioNodes.clear();
  if (audioContext && audioContext.state === 'running') audioContext.suspend().catch(() => {});
  if (savePreference) { state.settings.musicEnabled = false; persist(); }
  refreshAudioUI();
}

function refreshAudioUI() {
  renderHeader();
  byClass('js-audio-play').forEach(button => {
    setContent(button, icon(musicPlaying ? 'pause' : 'play'));
    button.setAttribute('aria-label', musicPlaying ? 'Mettre la musique en pause' : 'Lire la musique');
  });
  byClass('js-equalizer').forEach(node => node.classList.toggle('is-playing', musicPlaying));
  byClass('js-audio-status').forEach(node => { node.textContent = audioStatusText(); });
  byClass('js-music-toggle').forEach(node => node.setAttribute('aria-checked', String(state.settings.musicEnabled)));
  byClass('js-music-help').forEach(node => { node.textContent = musicHelpText(); });
}

/* ==========================================================================
   13. IMAGES ET VIDÉO
   ========================================================================== */
function showVideoError() {
  const error = document.getElementById('video-error');
  if (error) error.hidden = false;
}

function attachMediaHandlers() {
  listOf(main.getElementsByTagName('img')).forEach(img => {
    const fallback = () => {
      img.classList.add('img-failed');
      if (img.id === 'hero-image' && !byId('hero-media-error')) {
        const hero = byId('hero');
        if (hero) hero.appendChild(el('p', { className: 'hero-media-error', id: 'hero-media-error' }, 'Photo du stade indisponible. L’aventure continue.'));
      }
    };
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fallback();
  });
  const video = byId('football-video');
  if (video) {
    video.addEventListener('error', showVideoError);
    const source = video.getElementsByTagName('source')[0];
    if (source) source.addEventListener('error', showVideoError);
    video.addEventListener('play', () => { if (musicPlaying || musicStarting) pauseMusic(false); });
    video.addEventListener('loadedmetadata', () => { const error = byId('video-error'); if (error) error.hidden = true; });
  }
}
function watchVideo() {
  if (route !== 'home') navigate('home');
  document.getElementById('immersion')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
  const video = document.getElementById('football-video');
  if (!video) return;
  const promise = video.play();
  if (promise) promise.catch(error => {
    if (error.name === 'AbortError') return;
    if (video.error) showVideoError();
    notify('La lecture n’a pas pu démarrer. Utilise les commandes de la vidéo ; si la source est indisponible, le lien Pexels est proposé.', 'error');
  });
}

function showCredits() {
  const link = (href, text) => el('a', { href, target: '_blank', rel: 'noopener noreferrer' }, text);
  openDialog('LA PASSION SE PARTAGE.', [
    'FOOTBALL JOURNEY est un projet éducatif indépendant, sans affiliation avec une fédération ou un club.',
    el('ul', null,
      el('li', null, 'Photographie principale : ', link('https://www.pexels.com/photo/soccer-player-in-blue-jersey-facing-spotlight-36737326/', 'Ilian Martin / Pexels'), '.'),
      el('li', null, 'Autres photographies : Pexels, Diego Santacruz, Chibili Mugala et Nguyễn Hoàng Văn.'),
      el('li', null, 'Vidéo : ', link('https://www.pexels.com/video/people-playing-soccer-6077691/', 'Tima Miroshnichenko / Pexels'), '.'),
      el('li', null, 'Objets du Drag & Drop : dessins SVG créés pour le projet.'),
      el('li', null, 'Road to Glory : composition instrumentale originale, générée localement avec Web Audio.'),
      el('li', null, 'Polices : celles déjà installées sur l’appareil (aucune police importée).')),
    'Les médias distants nécessitent une connexion. Profil et progression restent sur ton appareil. Un projet réalisé en HTML, CSS et JavaScript.'
  ], el('button', { type: 'button', className: 'button', dataset: { action: 'close-dialog' } }, 'RETOUR AU TERRAIN', icon('arrow')));
}

/* ==========================================================================
   14. CONTRÔLES INTERNES (vérifient les scores sans modifier la sauvegarde)
   ========================================================================== */
function runSelfTests() {
  const results = [];
  const test = (name, condition) => results.push({ name, passed: Boolean(condition) });
  try {
    test('5 missions, un seul quiz de 10 questions', MISSIONS.length === 5 && QUESTIONS.length === 10 && QUESTIONS.every(q => q.options.length === 4 && q.correct >= 0 && q.correct < 4));
    test('26 lettres et 10 mots', ALPHABET.length === 26 && new Set(ALPHABET).size === 26 && WORDS.length === 10);
    test('Toutes les associations ont une destination', MISSIONS.every(m => m.items.every(item => m.targets.some(t => t.id === item.target)) && m.targets.every(t => m.items.filter(item => item.target === t.id).length === (t.capacity || 1))));
    test('Stade de cœur : identifiant inconnu refusé', validateProfile({ firstName: 'Alex', lastName: 'Martin', nickname: 'Alex10', age: '18', stadium: 'faux' }).profile.stadium === '' && validateProfile({ firstName: 'Alex', lastName: 'Martin', nickname: 'Alex10', age: '18', stadium: 'camp-nou' }).profile.stadium === 'camp-nou');
    test('Validation du profil', validateProfile({ firstName: 'Alex', lastName: 'Martin', nickname: 'Alex10', age: '18' }).valid && !validateProfile({ firstName: '', lastName: 'Martin', nickname: 'a', age: '18.5' }).valid);
    const initial = deriveState(freshState());
    test('Verrouillage initial (quiz ouvert)', canAccessMission(0, initial) && !canAccessMission(1, initial) && canAccessQuiz(initial) && initial.totalPoints === 0);
    initial.missions[1].completed = true;
    MISSIONS[1].items.forEach(item => { initial.missions[1].answers[item.id] = item.target; });
    deriveState(initial);
    test('Validation forcee refusee', !initial.missions[1].completed && initial.missions[1].score === 0);
    const s = freshState();
    s.missions[0].answers.ball = 'wrong-answer';
    deriveState(s);
    test('Mauvaise reponse sans points', s.totalPoints === 0 && Object.keys(s.missions[0].answers).length === 0);
    let expected = 0;
    MISSIONS.forEach((m, index) => {
      m.items.forEach(item => { s.missions[index].answers[item.id] = item.target; });
      deriveState(s);
      test('Mission ' + (index + 1) + ' : associations', s.totalPoints === expected + m.items.length * 10);
      s.missions[index].completed = true;
      expected += m.items.length * 10 + 100;
      deriveState(s);
      test('Mission ' + (index + 1) + ' : validation et deblocage', s.totalPoints === expected && completedCount(s) === index + 1 && (index === 4 || canAccessMission(index + 1, s)));
    });
    deriveState(s);
    test('Pas de double bonus de mission', s.totalPoints === expected);
    s.quiz.claimed = true;
    s.quiz.firstScore = 9;
    s.quiz.lastScore = 9;
    s.quiz.bestScore = 9;
    s.quiz.attempts = 1;
    deriveState(s);
    test('Bonus du quiz', s.totalPoints === expected + 90);
    s.quiz.lastScore = 10;
    s.quiz.bestScore = 10;
    s.quiz.attempts = 2;
    deriveState(s);
    test('Nouvelle tentative sans double bonus', s.totalPoints === expected + 90);
    s.hangman.bonusAwarded = true;
    deriveState(s);
    deriveState(s);
    test('Bonus unique du Pendu', s.totalPoints === expected + 140);
    const recovered = normalizeState({ ...s, totalPoints: 999999, rewards: { forged: 999999 }, unlockedMissions: [0, 1, 2, 3, 4] });
    test('Score recalcule au chargement', recovered.totalPoints === expected + 140);
    test('Six erreurs maximum', getHangmanStatus({ word: 'BUT', guesses: ['A', 'C', 'D', 'E', 'F', 'G'] }).lost);
    test('Detection de victoire', getHangmanStatus({ word: 'BUT', guesses: ['B', 'U', 'T'] }).won);
    const repaired = normalizeState({ hangman: { game: { word: 'BUT', guesses: ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I'], settled: true } } });
    test('Sauvegarde du Pendu limitee a six erreurs', getHangmanStatus(repaired.hangman.game).errors === 6);
    const settingsTest = normalizeState({ settings: { volume: 25, brightness: -10, theme: 'invalid' } });
    test('Reglages hors limites corriges', settingsTest.settings.volume === 1 && settingsTest.settings.brightness === 60 && settingsTest.settings.theme === 'dark');
    test('Badges conditionnels', s.badges.length === 7 && initial.badges.length === 0);
    test('Donnees invalides recuperees', normalizeState(null).totalPoints === 0 && normalizeState({ missions: [null], profile: { age: 'oops' } }).profile === null);
  } catch (error) { results.push({ name: 'Exception interne : ' + error.message, passed: false }); }
  return { results, passed: results.filter(result => result.passed).length, total: results.length, failures: results.filter(result => !result.passed) };
}

function showDiagnostics() {
  if (!state.profile) return;
  const output = document.getElementById('diagnostic-result');
  if (!output) return;
  const checks = runSelfTests();
  let localValid = false;
  try {
    if (persist()) {
      const recovered = normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
      localValid = recovered.totalPoints === state.totalPoints && JSON.stringify(recovered.missions) === JSON.stringify(state.missions) && recovered.profile?.nickname === state.profile.nickname;
    }
  } catch (error) { localValid = false; }
  const session = readQuizSession();
  output.textContent = checks.passed + '/' + checks.total + ' contrôles internes réussis. ' + (localValid ? 'Sauvegarde locale relue : cohérente.' : 'Sauvegarde locale : indisponible ou incohérente.') + (session ? ' Score de cette session : ' + session.score + '/10, vérifié.' : ' Aucun quiz terminé dans cette session.') + ' Vidéo, audio et autorisation de localisation sont à vérifier dans ton navigateur.';

  const failed = checks.failures.length > 0 || !localValid;
  output.classList.toggle('is-ok', !failed);
  output.classList.toggle('is-ko', failed);
  if (checks.failures.length) console.error('Football Journey - diagnostics', checks.failures);
}

/* ==========================================================================
   15. ÉCOUTEURS D'ÉVÉNEMENTS (addEventListener uniquement, délégation sur document)
   ========================================================================== */
document.addEventListener('submit', event => {
  const form = findUp(eventElement(event), node => node.tagName === 'FORM' && node.dataset.form !== undefined);
  if (!form) return;
  event.preventDefault();
  submitProfile(form);
});

document.addEventListener('click', event => {
  const target = eventElement(event);
  if (!target) return;
  if (!byId('site-header').contains(target)) closeMobileMenu();

  const source = upData(target, 'dragItem');
  if (source) {
    if (Date.now() < suppressClickUntil && event.detail !== 0) return;
    if (!source.disabled) selectItem(Number(source.dataset.mission), source.dataset.dragItem);
    return;
  }
  const zone = upData(target, 'dropTarget');
  if (zone) {
    const id = Number(zone.dataset.mission);
    if (selectedItem && selectedItem.mission === id) tryDrop(id, selectedItem.id, zone.dataset.dropTarget);
    else if (route === 'mission' && canAccessMission(id)) notify('Sélectionne d’abord un élément à gauche, puis choisis sa destination.');
    return;
  }
  const marker = upData(target, 'stadium');
  if (marker) { selectStadium(marker.dataset.mode, marker.dataset.stadium); return; }
  const stadiumClear = upData(target, 'stadiumClear');
  if (stadiumClear) { clearStadium(stadiumClear.dataset.stadiumClear); return; }
  const quizOption = upData(target, 'quizOption');
  if (quizOption) { chooseQuizAnswer(Number(quizOption.dataset.quizOption)); return; }
  const letter = upData(target, 'letter');
  if (letter) { if (!letter.disabled) guessLetter(letter.dataset.letter); return; }
  const navButton = upData(target, 'route');
  if (navButton) {
    if (appDialog.contains(navButton)) closeDialog();
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
    case 'watch-video': watchVideo(); break;
    case 'music': if (musicPlaying) pauseMusic(); else playMusic(); break;
    case 'music-preference': if (state.settings.musicEnabled) pauseMusic(); else playMusic(); break;
    case 'theme': setTheme(state.settings.theme === 'dark' ? 'light' : 'dark'); break;
    case 'set-theme': setTheme(button.dataset.themeChoice); break;
    case 'menu': setMenuButton(button, byId('primary-nav').classList.toggle('open')); break;
    case 'quiz-next': advanceQuiz(); break;
    case 'quiz-retry': retryQuiz(); break;
    case 'hangman-replay': replayHangman(); break;
    case 'geolocation': requestGeolocation(); break;
    case 'clear-location': clearLocation(); break;
    case 'diagnostics': showDiagnostics(); break;
    case 'reset': resetProgress(); break;
    case 'credits': showCredits(); break;
    case 'close-dialog': closeDialog(); break;
    case 'confirm-dialog': { const callback = dialogConfirm; closeDialog(); if (callback) callback(); break; }
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

// Glisser-déposer natif (souris) + glisser au doigt et « toucher puis placer » (écrans tactiles).
const clearDragOver = except => byClass('drag-over').forEach(node => { if (node !== except) node.classList.remove('drag-over'); });

document.addEventListener('dragstart', event => {
  const source = upData(eventElement(event), 'dragItem');
  if (!source) return;
  const id = Number(source.dataset.mission);
  if (source.disabled || route !== 'mission' || !state.profile || activeMission !== id || !canAccessMission(id) || !event.dataTransfer) { event.preventDefault(); return; }
  selectedItem = { mission: id, id: source.dataset.dragItem };
  event.dataTransfer.setData('text/plain', 'fj:' + id + ':' + source.dataset.dragItem);
  event.dataTransfer.effectAllowed = 'move';
  source.classList.add('dragging');
});

document.addEventListener('dragover', event => {
  const zone = upData(eventElement(event), 'dropTarget');
  if (!zone || route !== 'mission' || !selectedItem || selectedItem.mission !== activeMission) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  clearDragOver(zone);
  zone.classList.add('drag-over');
});

document.addEventListener('dragleave', event => {
  const zone = upData(eventElement(event), 'dropTarget');
  if (zone && !zone.contains(event.relatedTarget)) zone.classList.remove('drag-over');
});

document.addEventListener('drop', event => {
  const zone = upData(eventElement(event), 'dropTarget');
  if (!zone || !event.dataTransfer) return;
  event.preventDefault();
  zone.classList.remove('drag-over');
  const data = event.dataTransfer.getData('text/plain').match(/^fj:([0-4]):([a-z-]+)$/);
  if (!data || Number(data[1]) !== Number(zone.dataset.mission)) return;
  tryDrop(Number(data[1]), data[2], zone.dataset.dropTarget);
});

document.addEventListener('dragend', () => {
  byClass('dragging').forEach(node => node.classList.remove('dragging'));
  clearDragOver(null);
});

function cleanupTouchDrag() {
  if (!touchDrag) return;
  touchDrag.source.classList.remove('dragging');
  touchDrag.source.classList.toggle('selected', !!(selectedItem && selectedItem.id === touchDrag.item && selectedItem.mission === touchDrag.mission));
  try { touchDrag.source.releasePointerCapture(touchDrag.pointerId); } catch (error) { /* La capture peut déjà être terminée. */ }
  clearDragOver(null);
  touchDrag = null;
}

const zoneAtPoint = (x, y) => upData(document.elementFromPoint(x, y), 'dropTarget');

document.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' || appDialog.open) return;
  const source = upData(eventElement(event), 'dragItem');
  if (!source || source.disabled || route !== 'mission' || !state.profile || !canAccessMission(Number(source.dataset.mission))) return;
  event.preventDefault();
  cleanupTouchDrag();
  touchDrag = { source, mission: Number(source.dataset.mission), item: source.dataset.dragItem, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  source.classList.add('selected');
  try { source.setPointerCapture(event.pointerId); } catch (error) { /* La sélection au toucher reste possible. */ }
}, { passive: false });

document.addEventListener('pointermove', event => {
  if (touchDrag && event.pointerId === touchDrag.pointerId) {
    if (!touchDrag.moved && Math.hypot(event.clientX - touchDrag.x, event.clientY - touchDrag.y) > 8) {
      touchDrag.moved = true;
      touchDrag.source.classList.add('dragging');
    }
    if (touchDrag.moved) {
      event.preventDefault();
      const zone = zoneAtPoint(event.clientX, event.clientY);
      clearDragOver(zone);
      if (zone && Number(zone.dataset.mission) === touchDrag.mission) zone.classList.add('drag-over');
    }
  }
}, { passive: false });

document.addEventListener('pointerup', event => {
  if (!touchDrag || event.pointerId !== touchDrag.pointerId) return;
  const drag = touchDrag;
  const zone = zoneAtPoint(event.clientX, event.clientY);
  event.preventDefault();
  suppressClickUntil = Date.now() + 450;
  cleanupTouchDrag();
  if (drag.moved && zone && Number(zone.dataset.mission) === drag.mission) tryDrop(drag.mission, drag.item, zone.dataset.dropTarget);
  else selectItem(drag.mission, drag.item);
}, { passive: false });

document.addEventListener('pointercancel', cleanupTouchDrag);

document.addEventListener('keydown', event => {
  if (appDialog.open) return;
  if (event.key === 'Escape' && closeMobileMenu(true)) { event.preventDefault(); return; }
  const target = eventElement(event);
  const inInput = target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
  if (inInput || event.ctrlKey || event.altKey || event.metaKey) return;
  const quizOption = upData(target, 'quizOption');
  if (route === 'hangman' && /^[a-zA-Z]$/.test(event.key)) {
    event.preventDefault();
    if (!event.repeat) guessLetter(event.key.toUpperCase());
  } else if (route === 'mission' && event.key === 'Escape' && selectedItem) {
    const item = selectedItem.id;
    selectedItem = null;
    renderCurrent(false);
    focusById('drag-' + item);
  } else if (route === 'quiz' && quizOption && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    const direction = ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 1;
    chooseQuizAnswer((Number(quizOption.dataset.quizOption) + direction + 4) % 4);
  }
});

appDialog.addEventListener('click', event => {
  if (event.target !== appDialog) return;
  const rect = appDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});
appDialog.addEventListener('close', () => { if (!appDialog.open) dialogConfirm = null; });
document.addEventListener('visibilitychange', () => { if (document.hidden && (musicPlaying || musicStarting)) pauseMusic(false); });
window.addEventListener('hashchange', () => {
  const requested = parseRouteHash();
  if (requested) navigate(requested.route, requested.missionId, false);
  syncHistory();
});
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  cleanupTouchDrag();
  closeDialog();
  const oldQuizClaimed = state.quiz.claimed;
  state = readState();
  if (!state.settings.musicEnabled && musicPlaying) pauseMusic(false);
  if (!canAccessQuiz() || (!oldQuizClaimed && state.quiz.claimed)) quizRun = null;
  applySettings();
  selectedItem = null;
  missionFeedback = null;
  renderCurrent(false);
  syncHistory();
  notify('Ta progression a été mise à jour depuis un autre onglet.');
});

/* ==========================================================================
   16. DÉMARRAGE DU SITE
   ========================================================================== */
deriveState(state);
applySettings();
const sessionResult = readQuizSession();
if (state.quiz.claimed && sessionResult && state.quiz.lastScore === sessionResult.score && state.quiz.completedAt === sessionResult.completedAt) state.quiz.lastAnswers = sessionResult.answers.slice();
const initialDestination = parseRouteHash();
if (state.profile && initialDestination) { route = initialDestination.route; activeMission = initialDestination.missionId; }
renderCurrent();
syncHistory();
if (loadWarning) notify(loadWarning, 'error');
const bootChecks = runSelfTests();
if (bootChecks.failures.length) console.error('Football Journey - internal checks', bootChecks.failures);