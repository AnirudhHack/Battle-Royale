// backgrounds
// import saiman from './background/saiman.jpg';
// import astral from './background/astral.jpg';
// import eoaalien from './background/eoaalien.jpg';
import panight from './background/panight.jpg';
import heroImg from './background/hero-img.png';

// cards
import f2 from './f2.png';
import f3 from './f3.png';
import f4 from './f4.png';
import f5 from './f5.png';

// logo
import logo from './logo.png';

// icon
import attack from './attack.png';
import defense from './defense.png';
import alertIcon from './alertIcon.svg';
import AlertIcon from './AlertIcon.jsx';

// players
import player01 from './player01.png';
import player02 from './player02.png';

// sounds
import attackSound from './sounds/attack.wav';
import defenseSound from './sounds/defense.mp3';
import explosion from './sounds/explosion.mp3';

export const allCards = [
  f2,
  f3,
  f4,
  f5
];

export {
  // saiman,
  // astral,
  // eoaalien,
  panight,
  heroImg,

  f2, f3, f4 ,f5,

  logo,

  attack,
  defense,
  alertIcon,
  AlertIcon,

  player01,
  player02,

  attackSound,
  defenseSound,
  explosion,
};

export const battlegrounds = [
  // { id: 'bg-saiman', image: saiman, name: 'Saiman' },
  // { id: 'bg-astral', image: astral, name: 'Astral' },
  // { id: 'bg-eoaalien', image: eoaalien, name: 'Eoaalien' },
  { id: 'bg-panight', image: panight, name: 'Panight' },
];

export const gameRules = [
  'Card with the same defense and attack point will cancel each other out.',
  'Attack points from the attacking card will deduct the opposing player’s health points.',
  'If P1 does not defend, their health wil be deducted by P2’s attack.',
  'If P1 defends, P2’s attack is equal to P2’s attack - P1’s defense.',
  'If a player defends, they refill 3 Mana',
  'If a player attacks, they spend 3 Mana',
];