import data from "../../songidsource/songid.json";

const SongIDs = Object.entries(data).map(([id, value]) => [id, decodeBase64(value)]);

export function matchSongID(name: string): number | null {
    const matchedEntry = SongIDs.find(([id, value]) => {
        if (value === name) return true;
        return false;
    });

    return matchedEntry ? Number(matchedEntry[0]) % 1e4 : null;
}

function decodeBase64(base64Str: string): string {
  const binaryString = atob(base64Str); // 解码为二进制字符串
  const utf8String = decodeURIComponent(
    Array.from(binaryString)
      .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
  return utf8String;
}