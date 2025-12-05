import data from "../../songidsource/songid.json";

const SongIDs = Object.entries(data);

export function matchSongID(name: string): number | null {
    const nameB64 = btoa(name);

    const matchedEntry = SongIDs.find(([id, value]) => {
        if (value === nameB64) return true;
        return false;
    });

    return matchedEntry ? Number(matchedEntry[0]) % 1e4 : null;
}