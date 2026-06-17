import type { ChartNext } from "../../types";

const DF_MUSIC_DATA_API_URL = "https://www.diving-fish.com/api/maimaidxprober/music_data";

export interface ChineseChartMetadata {
    level: string;
    internalLevel: number;
    version: string;
}

interface DivingFishMusic {
    id: string;
    type: "SD" | "DX";
    ds: number[];
    level: string[];
    basic_info: {
        from: string;
    };
}

function normalizeMusicId(rawId: string): number | null {
    const id = Number(rawId);
    if (!Number.isFinite(id)) return null;
    return id >= 100000 ? id : id % 10000;
}

function getChartType(id: number, type: DivingFishMusic["type"]): ChartNext["type"] {
    if (id >= 100000) return "utage";
    return type === "DX" ? "dx" : "sd";
}

function getDifficulty(chartType: ChartNext["type"], index: number): ChartNext["difficulty"] {
    return chartType === "utage" ? 10 : index as ChartNext["difficulty"];
}

function normalizeVersion(version: string): string {
    return version.trim();
}

export function createChineseChartMetadataKey(
    musicId: number,
    chartType: ChartNext["type"],
    difficulty: ChartNext["difficulty"],
): string {
    return `${musicId}:${chartType}:${difficulty}`;
}

export async function fetchChineseChartMetadata(): Promise<Map<string, ChineseChartMetadata>> {
    const response = await fetch(DF_MUSIC_DATA_API_URL);
    const musicData = await response.json() as DivingFishMusic[];

    const metadata = new Map<string, ChineseChartMetadata>();
    for (const music of musicData) {
        const id = normalizeMusicId(music.id);
        if (id === null) continue;

        const chartType = getChartType(id, music.type);
        const version = normalizeVersion(music.basic_info.from);
        if (!version) continue;

        for (let index = 0; index < music.level.length; index++) {
            const level = music.level[index];
            const internalLevel = music.ds[index];
            if (!level || typeof internalLevel !== "number") continue;

            metadata.set(createChineseChartMetadataKey(id, chartType, getDifficulty(chartType, index)), {
                level,
                internalLevel,
                version,
            });
        }
    }

    return metadata;
}
