// type ResponseData = Record<string, Music>;

// interface Music {
//     name: string;
//     ver: string;
//     composer: string;
//     genre: string;
//     notes: { lv: number; }[];
// }

// const MUSIC_DATA_URL = 'http://aquadx.net/d/mai2/00/all-music.json';
const getImageUrl = (id: string | number) => `http://aquadx.net/d/mai2/music/00${id.toString().padStart(6, '0').substring(2)}.png`;
