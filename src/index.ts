import { categories, compactMusicMetadata } from "../types";
import type {
    AvailableRegion,
    Chart,
    ChartCompacted,
    Music,
    MusicCompacted,
    MusicDifficultyID,
    MusicMetadata,
    MusicMetadataCompacted,
    Version,
    VersionCompacted,
} from "../types";

const typeIndexToName = ["sd", "dx", "utage"] as const;

type ChartType = typeof typeIndexToName[number];

const compactedChartTupleLength = 9;

function resolveChartType(typeIndex: number, musicId: number): ChartType {
    const type = typeIndexToName[typeIndex];
    if (!type) {
        throw new Error(`Chart type index ${typeIndex} not found for music ${musicId}`);
    }
    return type;
}

function resolveVersion(versions: Version[], versionIndex: number, musicId: number): Version | null {
    if (versionIndex === -1) {
        return null;
    }
    const version = versions[versionIndex];
    if (!version) {
        throw new Error(`Version index ${versionIndex} not found for music ${musicId}`);
    }
    return version;
}

function expandChart(compacted: ChartCompacted, versions: Version[], musicId: number): Chart {
    if (!Array.isArray(compacted) || compacted.length < compactedChartTupleLength) {
        throw new Error(`Invalid chart payload for music ${musicId}`);
    }

    const [
        typeIndex,
        difficulty,
        level,
        internalLevel,
        versionIndex,
        regionVersionOverrideCompacted,
        noteDesigner,
        noteCountsCompacted,
        availableRegions,
    ] = compacted;

    const type = resolveChartType(typeIndex, musicId);
    const version = resolveVersion(versions, versionIndex, musicId);

    const regionVersionOverride = regionVersionOverrideCompacted?.length
        ? (Object.fromEntries(regionVersionOverrideCompacted) as Partial<Record<AvailableRegion, string | number>>)
        : undefined;

    if (!Array.isArray(noteCountsCompacted) || noteCountsCompacted.length < 5) {
        throw new Error(`Invalid note counts for music ${musicId}`);
    }

    const [tap, hold, slideRaw, touchRaw, breakCount] = noteCountsCompacted;
    const slide = slideRaw ?? 0;
    const touch = type === "sd" ? null : touchRaw ?? 0;
    const total = tap + hold + slide + (touch ?? 0) + breakCount;

    return {
        type,
        difficulty,
        level,
        internalLevel,
        version: version ? version.version : null,
        regionVersionOverride,
        noteDesigner,
        noteCounts: {
            tap,
            hold,
            slide,
            touch,
            break: breakCount,
            total,
        },
        availableRegions,
    };
}

function expandVersion(compacted: VersionCompacted): Version {
    const [version, word, releaseDate, cnVerOverride] = compacted;
    return { version, word, releaseDate, cnVerOverride };
}

function expandMusic(compacted: MusicCompacted, versions: Version[]): Music {
    const [id, title, artist, bpm, categoryIndex, isLocked, chartsCompacted, aliasesCn] = compacted;

    if (categoryIndex < 0 || categoryIndex >= categories.length) {
        throw new Error(`Category index ${categoryIndex} not found for music ${id}`);
    }

    const category = categories[categoryIndex];
    const aliases = aliasesCn && aliasesCn.length ? { cn: aliasesCn } : undefined;
    const charts = chartsCompacted.map(chart => expandChart(chart, versions, id));

    const base: Music = { id, title, artist, bpm, category, isLocked, charts };
    return aliases ? { ...base, aliases } : base;
}

export function convertCompactedToNormal(compacted: MusicMetadataCompacted): MusicMetadata {
    if (!compacted || !Array.isArray(compacted.musics) || !Array.isArray(compacted.versions)) {
        throw new Error("Invalid compacted metadata payload");
    }

    const versions = compacted.versions.map(expandVersion);
    const musics = compacted.musics.map(music => expandMusic(music, versions));

    return { musics, versions };
}

export async function loadFullMetadata(
    url = "https://meta.salt.realtvop.top/meta.compacted.json",
): Promise<MusicMetadata> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load compacted metadata: ${response.status} ${response.statusText}`);
    }

    const compacted = (await response.json()) as MusicMetadataCompacted;
    return convertCompactedToNormal(compacted);
}

export { compactMusicMetadata, categories };
export type {
    AvailableRegion,
    Chart,
    ChartCompacted,
    Music,
    MusicCompacted,
    MusicDifficultyID,
    MusicMetadata,
    MusicMetadataCompacted,
    Version,
    VersionCompacted,
};
