const CN_MAIDATA_URL = "https://raw.githubusercontent.com/CrazyKidCN/maimaiDX-CN-songs-database/refs/heads/main/maidata.json";

interface MaidataEntry {
    title: string;
    version?: string;
}

function normalizeTitle(title: string): string {
    return title.trim();
}

function parseCnVersion(versionRaw: string | undefined): number | null {
    if (!versionRaw) return null;
    const version = versionRaw.trim();

    if (!version.startsWith("\u821e\u840cDX")) return -1;
    if (version === "\u821e\u840cDX") return 0;

    const match = version.match(/(\d{4})/);
    if (!match) return -1;

    return Number(match[1]);
}

export async function fetchChineseChartVersions(): Promise<Map<string, number>> {
    const response = await fetch(CN_MAIDATA_URL);
    const data = await response.json() as MaidataEntry[];

    const versionMap = new Map<string, number>();
    for (const entry of data) {
        const title = normalizeTitle(entry.title);
        if (!title) continue;

        const parsedVersion = parseCnVersion(entry.version);
        if (parsedVersion === null) continue;

        versionMap.set(title, parsedVersion);
    }

    return versionMap;
}
