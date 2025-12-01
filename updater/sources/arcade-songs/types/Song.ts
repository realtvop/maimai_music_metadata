import type { Sheet } from "./Sheet";

export interface Song {
    songId: string;
    category: string;
    title: string;
    artist: string;
    bpm: number;
    imageName: string;
    version: string;
    releaseDate: string;
    isNew: boolean;
    isLocked: boolean;
    comment: string | null;
    sheets: Sheet[];
}
