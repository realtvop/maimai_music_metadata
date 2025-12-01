import type { ArcadeSongsData } from "./types";

const DATA_URL = "https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json";

export async function fetchArcadeSongsData(): Promise<ArcadeSongsData> {
    const response = await fetch(DATA_URL);
    const data = await response.json() as ArcadeSongsData;
    return data;
}

function convertArcadeSongsData(data: ArcadeSongsData) {
    return data;
}