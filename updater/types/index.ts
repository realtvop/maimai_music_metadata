import type { ChartCompacted, MusicCompacted, VersionCompacted } from "./compacted";
import type { Music, Version } from "./normal";
import { categories } from "./data";

export type { Music, Chart, Version } from "./normal";
export type { MusicCompacted, ChartCompacted, VersionCompacted } from "./compacted";
export type { AvalibleRegion, MusicDifficultyID } from "./data";

export { categories } from "./data";

export interface MusicMetadata {
    musics: Music[];
    versions: Version[];
}

export interface MusicMetadataCompacted {
    musics: MusicCompacted[];
    versions: VersionCompacted[];
}

export function compactMusicMetadata(metadata: MusicMetadata): MusicMetadataCompacted {
    const versionIndexMap = new Map<string, number>();
    metadata.versions.forEach((version, index) => versionIndexMap.set(version.version, index));

    const versions: VersionCompacted[] = metadata.versions.map(version => [
        version.version,
        version.word,
        version.releaseDate,
        version.cnVerOverride,
    ]);

    const musics: MusicCompacted[] = metadata.musics.map(music => {
        const categoryIndex = categories.indexOf(music.category);

        const charts: ChartCompacted[] = music.charts.map(chart => {
            const typeIndex = chart.type === "sd" ? 0 : chart.type === "dx" ? 1 : 2;
            const versionIndex = versionIndexMap.get(chart.version) ?? -1;

            return [
                typeIndex,
                chart.difficulty,
                chart.level,
                chart.internalLevel,
                versionIndex,
                chart.noteDesigner,
                [
                    chart.noteCounts.tap,
                    chart.noteCounts.hold,
                    chart.noteCounts.slide,
                    chart.noteCounts.touch ?? 0,
                    chart.noteCounts.break,
                ],
                chart.avalibleRegions,
            ];
        });

        return [
            music.id,
            music.title,
            music.artist,
            music.bpm,
            categoryIndex,
            music.isLocked,
            charts,
        ];
    });

    return { musics, versions };
}