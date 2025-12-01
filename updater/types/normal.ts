import type { AvalibleRegion, MusicDifficultyID } from "./data";

export interface Music {
    id: number;       // < 10000, same for sd and dx
    title: string;
    artist: string;
    bpm: number;

    // releaseDate: string;
    category: string;
    isLocked: boolean; // needs unlocking

    charts: Chart[];
}

export interface Chart {
    type: "sd" | "dx" | "utage";
    difficulty: MusicDifficultyID;
    level: string;
    internalLevel: number;
    version: string;

    noteDesigner: string;
    noteCounts: {
        tap: number;
        hold: number;
        slide: number;
        touch: number;
        break: number;
        total: number;
    };

    avalibleRegions: AvalibleRegion[];
    // isSpecial: boolean;
}

export interface Version {
    version: string;
    word: string; // 一个字简称
    releaseDate: string;
}