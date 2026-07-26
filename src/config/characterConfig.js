
import anyaImg from '../assets/anya.png';
import anyaPraiseImg from '../assets/anya-praise.png';
import anyaPanicImg from '../assets/anya-panic.png';
import anyaConcernImg from '../assets/anya-concern.png';
import anyaTauntImg from '../assets/anya-taunt.png';
import anyaSmugImg from '../assets/anya-smug.png';
import kaguyaImg from '../assets/kaguya.png';
import kaguyaPraiseImg from '../assets/kaguya-praise.png';
import kaguyaSmugImg from '../assets/kaguya-smug.png';
import kaguyaPanicImg from '../assets/kaguya-panic.png';

export const characters = [
  {
    id: "anya",
    name: "Anya",
    image: anyaImg,
    personalityType: "genki",
    unlockCondition: null, //always unlocked
    spriteMap: {
      praise:  anyaPraiseImg,
      panic:   anyaPanicImg,
      concern: anyaConcernImg,
      taunt:   anyaTauntImg,
      smug:    anyaSmugImg,
    }
  },
  {
    id: "kaguya",
    name: "Kaguya",
    image: kaguyaImg,
    personalityType: "tsundere",
    unlockCondition: {
      type: 'highScore',
      value: 10,
      description: 'Achieve a high score of 10 or above'
    },
    spriteMap: {
      praise:  kaguyaPraiseImg,
      panic:   kaguyaPanicImg,
      concern: kaguyaPraiseImg,
      taunt:   kaguyaSmugImg,
      smug:    kaguyaSmugImg,
    }
  },
];