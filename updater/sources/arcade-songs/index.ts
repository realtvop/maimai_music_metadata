import type { Music, Version } from "../../../types";
import { convertArcadeSongsData } from "./converter";
import type { ArcadeSongsData } from "./types";
import { fetchChineseChartVersions } from "../cn-version";

const DATA_URL = "https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json";

async function fetchArcadeSongsData(): Promise<ArcadeSongsData> {
    const response = await fetch(DATA_URL);
    const data = await response.json() as ArcadeSongsData;
    return data;
}

export function getArcadeSongsData(): Promise<{
    musics: Music[];
    versions: Version[];
}> {
    return Promise.all([
        fetchArcadeSongsData(),
        fetchChineseChartVersions(),
    ]).then(([arcadeData, cnVersionMap]) =>
        convertArcadeSongsData(arcadeData, cnVersionMap),
    );
}
