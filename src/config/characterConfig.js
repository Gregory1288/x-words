
import anyaImg from '../assets/anya.png';
import anyaPraiseImg from '../assets/anya-praise.png';
import anyaPanicImg from '../assets/anya-panic.png';
import anyaConcernImg from '../assets/anya-concern.png';
import anyaTauntImg from '../assets/anya-taunt.png';
import anyaSmugImg from '../assets/anya-smug.png';

export const characters = [
  {
    id: "anya",
    name: "Anya",
    image: anyaImg,
    personalityType: "genki",
    spriteMap: {
      praise:  anyaPraiseImg,
      panic:   anyaPanicImg,
      concern: anyaConcernImg,
      taunt:   anyaTauntImg,
      smug:    anyaSmugImg,
    }
  },
];