import type { AvailableRegion, ChartNext, MusicMetadataNext, MusicNext, Version } from "../../../types";
import { matchSongID } from "../songid";
import type { ArcadeSongsData, Sheet, Song, Version as VersionOri } from "./types";

export async function convertArcadeSongsData(
    data: ArcadeSongsData,
    cnVersionMap: Map<string, number>,
): Promise<MusicMetadataNext> {
    return {
        musics: (await Promise.all(data.songs.map(song => convertMusic(song, cnVersionMap)))).filter(music => music.charts.length && music.id !== -1).sort((a, b) => a.id - b.id),
        versions: convertVersions(data.versions),
    };
}

function normalizeRegion(region: string): AvailableRegion {
    return (region === "usa" ? "us" : region) as AvailableRegion;
}

function getBaseLevel(sheet: Sheet): string {
    const difficulty = ["basic", "advanced", "expert", "master", "remaster"].indexOf(sheet.difficulty);
    return difficulty == -1 ? sheet.difficulty : sheet.level;
}

function getRegionOverride(sheet: Sheet, region: AvailableRegion): Partial<{
    level: string;
    internalLevel: number;
    internalLevelValue: number;
    version: string | number;
}> {
    const sourceRegion = region === "us" ? "usa" : region;
    return (sheet.regionOverrides as Record<string, unknown> | undefined)?.[sourceRegion] as Partial<{
        level: string;
        internalLevel: number;
        internalLevelValue: number;
        version: string | number;
    }> | undefined ?? {};
}

function convertChart(sheet: Sheet, cnVersion: number | null): ChartNext {
    const difficulty = ["basic", "advanced", "expert", "master", "remaster"].indexOf(sheet.difficulty);
    const baseLevel = getBaseLevel(sheet);
    const baseInternalLevel = sheet.internalLevelValue;
    const baseVersion = sheet.version;

    const regions: ChartNext["regions"] = {};

    for (const [regionRaw, available] of Object.entries(sheet.regions)) {
        if (!available) continue;

        const region = normalizeRegion(regionRaw);
        const override = getRegionOverride(sheet, region);
        regions[region] = {
            level: override.level ?? baseLevel,
            internalLevel: override.internalLevelValue ?? override.internalLevel ?? baseInternalLevel,
            version: override.version ?? baseVersion,
        };
    }

    if (cnVersion !== null && cnVersion !== -1) {
        regions.cn = {
            level: regions.cn?.level ?? baseLevel,
            internalLevel: regions.cn?.internalLevel ?? baseInternalLevel,
            version: cnVersion,
        };
    }

    return {
        type: sheet.type.replace("std", "sd") as ChartNext["type"],
        difficulty: difficulty == -1 ? 10 : difficulty,
        noteDesigner: sheet.noteDesigner,
        noteCounts: sheet.noteCounts,
        regions,
    };
}

async function convertMusic(song: Song, cnVersionMap: Map<string, number>): Promise<MusicNext> {
    const cnVersion = cnVersionMap.get(song.title.trim()) ?? null;

    return {
        id: await matchSongID(song.title) ?? -1,
        title: song.title,
        artist: song.artist,
        bpm: song.bpm,

        category: song.category,
        isLocked: song.isLocked,

        charts: song.sheets.map(sheet => convertChart(sheet, cnVersion)).filter(chart => Object.values(chart.regions).some(Boolean)),
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
