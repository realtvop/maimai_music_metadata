import type { Chart, Music } from "../../types";
import { matchSongID } from "../songid";
import type { ArcadeSongsData, Sheet, Song } from "./types";

export function convertArcadeSongsData(data: ArcadeSongsData) {}

function convertChart(sheet: Sheet): Chart {
    const difficulty = ["basic", "advanced", "expert", "master", "remaster"].indexOf(sheet.difficulty);

    return {
        type: sheet.type.replace("std", "sd") as Chart["type"],
        difficulty: difficulty == -1 ? 10 : difficulty,
        level: difficulty == -1 ? sheet.difficulty : sheet.level,
        internalLevel: sheet.internalLevelValue,
        version: sheet.version,

        noteDesigner: sheet.noteDesigner,
        noteCounts: sheet.noteCounts,

        avalibleRegions: Object.entries(sheet.regions).filter(([_, available]) => available).map(([region, _]) => region as Chart["avalibleRegions"][number]),
    }
}

function convertMusic(song: Song): Music {
    return {
        id: matchSongID(song.title) ?? -1,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,

        category: song.category,
        isLocked: song.isLocked,

        charts: song.sheets.map(convertChart),
    }
}