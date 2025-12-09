import type { Chart, Music, Version } from "../../types";
import { matchSongID } from "../songid";
import type { ArcadeSongsData, Sheet, Song, Version as VersionOri } from "./types";

export async function convertArcadeSongsData(data: ArcadeSongsData): Promise<{
    musics: Music[];
    versions: Version[];
}> {
    return {
        musics: await Promise.all(data.songs.map(convertMusic)),
        versions: convertVersions(data.versions),
    };
}

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

async function convertMusic(song: Song): Promise<Music> {
    return {
        id: await matchSongID(song.title) ?? -1,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,

        category: song.category,
        isLocked: song.isLocked,

        charts: song.sheets.map(convertChart),
    }
}

function convertVersions(versions: VersionOri[]): Version[] {
    const data = [];
    for (const version of versions) {
        data.push({
            version: version.version,
            word: version.abbr.match(/\((.*?)\)/)?.[1] ?? "",
            releaseDate: version.releaseDate,
            cnVerOverride: null,
        });
    }
    return data;
}