const categories = [
    'POPS＆アニメ',
    'niconico＆ボーカロイド',
    '東方Project',
    'ゲーム＆バラエティ',
    'maimai',
    'オンゲキ＆CHUNITHM',
    '宴会場',
];

const typeIndexToName = ['sd', 'dx', 'utage'];

export function convertCompactedToNormal(compacted) {
    if (!compacted || !Array.isArray(compacted.musics) || !Array.isArray(compacted.versions)) {
        throw new Error('Invalid compacted metadata payload');
    }

    const versions = compacted.versions.map(version => ({
        version: version[0],
        word: version[1],
        releaseDate: version[2],
        cnVerOverride: version[3] ?? null,
    }));

    const musics = compacted.musics.map(music => {
        const [
            id,
            title,
            artist,
            bpm,
            categoryIndex,
            isLocked,
            chartsCompacted,
            aliasesCn,
        ] = music;

        if (categoryIndex < 0 || categoryIndex >= categories.length) {
            throw new Error(`Category index ${categoryIndex} not found for music ${id}`);
        }

        const category = categories[categoryIndex];
        const aliases = aliasesCn && aliasesCn.length ? { cn: aliasesCn } : undefined;

        const charts = chartsCompacted.map(chart => {
            const [
                typeIndex,
                difficulty,
                level,
                internalLevel,
                versionIndex,
                cnVersion,
                noteDesigner,
                noteCountsCompacted,
                avalibleRegions,
            ] = chart;

            const type = typeIndexToName[typeIndex];
            if (!type) {
                throw new Error(`Chart type index ${typeIndex} not found for music ${id}`);
            }
            const version = versions[versionIndex];
            if (!version) {
                throw new Error(`Version index ${versionIndex} not found for music ${id}`);
            }

            if (!Array.isArray(noteCountsCompacted) || noteCountsCompacted.length < 5) {
                throw new Error(`Invalid note counts for music ${id}`);
            }
            const [tap, hold, slide, touchRaw, breakCount] = noteCountsCompacted;
            const touch = type === 'sd' ? null : touchRaw ?? 0;
            const total = tap + hold + slide + (touch ?? 0) + breakCount;

            return {
                type,
                difficulty,
                level,
                internalLevel,
                version: version.version,
                cnVersion: cnVersion ?? null,
                noteDesigner,
                noteCounts: {
                    tap,
                    hold,
                    slide,
                    touch,
                    break: breakCount,
                    total,
                },
                avalibleRegions,
            };
        });

        const base = { id, title, artist, bpm, category, isLocked, charts };
        return aliases ? { ...base, aliases } : base;
    });

    return { musics, versions };
}

export async function loadFullMetadata(url = './meta.compacted.json') {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load compacted metadata: ${response.status} ${response.statusText}`);
    }

    const compacted = await response.json();
    return convertCompactedToNormal(compacted);
}
