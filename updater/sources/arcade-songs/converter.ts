import type { Chart, Music, Version } from "../../types";
import { matchSongID } from "../songid";
import type { ArcadeSongsData, Sheet, Song, Version as VersionOri } from "./types";

export async function convertArcadeSongsData(
    data: ArcadeSongsData,
    cnVersionMap: Map<string, number>,
): Promise<{
    musics: Music[];
    versions: Version[];
}> {
    return {
        musics: (await Promise.all(data.songs.map(song => convertMusic(song, cnVersionMap)))).filter(music => music.charts.length && music.id !== -1).sort((a, b) => a.id - b.id),
        versions: convertVersions(data.versions),
    };
}

function convertChart(sheet: Sheet, cnVersion: number | null): Chart {
    const difficulty = ["basic", "advanced", "expert", "master", "remaster"].indexOf(sheet.difficulty);
    
    return {
        type: sheet.type.replace("std", "sd") as Chart["type"],
        difficulty: difficulty == -1 ? 10 : difficulty,
        level: difficulty == -1 ? sheet.difficulty : sheet.level,
        internalLevel: sheet.internalLevelValue,
        version: sheet.version,
        cnVersion,

        noteDesigner: sheet.noteDesigner,
        noteCounts: sheet.noteCounts,

        avalibleRegions: Object.entries(sheet.regions).filter(([_, available]) => available).map(([region, _]) => region as Chart["avalibleRegions"][number]),
    }
}

async function convertMusic(song: Song, cnVersionMap: Map<string, number>): Promise<Music> {
    const cnVersion = cnVersionMap.get(song.title.trim()) ?? null;

    return {
        id: await matchSongID(song.title) ?? -1,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,

        category: song.category,
        isLocked: song.isLocked,

        charts: song.sheets.map(sheet => convertChart(sheet, cnVersion)).filter(chart => chart.avalibleRegions.length),
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