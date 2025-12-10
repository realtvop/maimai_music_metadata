import type { Chart, Music, Version } from "../../../types";
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
    const baseVersion = sheet.version;

    const avalibleRegions = Object.entries(sheet.regions)
        .filter(([, available]) => available)
        .map(([region]) => region === "usa" ? "us" : region) as Chart["avalibleRegions"]; // normalize region key

    const regionVersionOverride: Chart["regionVersionOverride"] = {};

    const intlOverride = sheet.regionOverrides?.intl?.version;
    if (intlOverride && intlOverride !== baseVersion && avalibleRegions.includes("intl")) {
        regionVersionOverride.intl = intlOverride;
    }

    if (cnVersion !== null && cnVersion !== -1) {
        regionVersionOverride.cn = cnVersion;
        if (!avalibleRegions.includes("cn")) avalibleRegions.push("cn");
    }

    return {
        type: sheet.type.replace("std", "sd") as Chart["type"],
        difficulty: difficulty == -1 ? 10 : difficulty,
        level: difficulty == -1 ? sheet.difficulty : sheet.level,
        internalLevel: sheet.internalLevelValue,
        version: baseVersion,
        regionVersionOverride: Object.keys(regionVersionOverride).length ? regionVersionOverride : undefined,

        noteDesigner: sheet.noteDesigner,
        noteCounts: sheet.noteCounts,

        avalibleRegions,
    };
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