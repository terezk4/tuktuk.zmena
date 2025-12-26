import { Episode, Challenge, Comment } from './types';

export const APP_NAME = "ŤUK ŤUK. ZMĚNA!";

export const ADMIN_EMAILS = [
  'admin@tuktukzmena.cz',
  'producer@tuktukzmena.cz',
  'demo@user.com', // Added for testing purposes as per typical MVP flows
  'tuktuk.zmena@gmail.com'
];

export const MOCK_EPISODES: Episode[] = [
  {
    id: '1',
    title: 'JAK SE NEPOSRAT Z ÚSPĚCHU',
    spotifyUrl: 'https://open.spotify.com/episode/3gYycz6GaOMLBzcBlZ0Pul', // Example ID
    bonusText: `
# 5 Pravidel pro uzemnění

Tady je to, co se do epizody nevešlo. Pokud cítíš, že ti ego stoupá do hlavy, zkus tohle:

1. **Studená sprcha každé ráno.** Bez výjimek.
2. **Vypni telefon hodinu před spaním.** Svět se nezboří.
3. **Napiš si tři věci, za které jsi vděčný.**
    `,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isNew: true,
  },
  {
    id: '2',
    title: 'PROČ TI NIKDO NEVĚŘÍ',
    spotifyUrl: 'https://open.spotify.com/episode/4hYycz6GaOMLBzcBlZ0Pul',
    bonusText: `
## Důvěra se buduje roky, ztrácí se vteřinu.

Klíčové body:
- Nelži sám sobě.
- Drž slovo, i když se nikdo nedívá.
    `,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isNew: false,
  },
  {
    id: '3',
    title: 'STARTUPY A DEPRESE',
    spotifyUrl: 'https://open.spotify.com/episode/5iYycz6GaOMLBzcBlZ0Pul',
    bonusText: `
# Je to jen práce.

Nezapomeň, že tvoje hodnota není v tvém obratu.
    `,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    isNew: false,
  }
];

export const MOCK_CHALLENGE: Challenge = {
  id: 'c1',
  title: 'PIŠ SI DENÍK!',
  content: 'Každý den napiš alespoň 3 věty o tom, co jsi se naučil. Žádné výmluvy. 7 dní v kuse.',
  createdAt: new Date().toISOString(),
};

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'cm1',
    userId: 'u1',
    username: 'Jan Novák',
    content: 'Tohle mi fakt otevřelo oči. Díky moc!',
    createdAt: 'Před 2 hodinami',
    episodeId: '1'
  },
  {
    id: 'cm2',
    userId: 'u2',
    username: 'Petra S.',
    content: 'Zkouším tu studenou sprchu a je to peklo, ale funguje to.',
    createdAt: 'Před 30 minutami',
    episodeId: '1'
  }
];