import localData from "../../songidsource/songid.json";
import { fetchMusicIDList } from "./aquadx";

// 合并本地数据和 AquaDX 数据的缓存（使用 Promise 缓存避免并发重复 fetch）
let songIDsCachePromise: Promise<Map<string, string>> | null = null;

async function getSongIDs(): Promise<Map<string, string>> {
  if (songIDsCachePromise) return songIDsCachePromise;

  songIDsCachePromise = (async () => {
    const mergedMap = new Map<string, string>();

    // 先加载 AquaDX 数据
    try {
      const aquadxData = await fetchMusicIDList();
      for (const [id, name] of Object.entries(aquadxData)) {
        mergedMap.set(id, name);
      }
    } catch (error) {
      console.warn("Failed to fetch AquaDX data, using local data only:", error);
    }

    // 再加载本地数据（本地数据优先覆盖）
    for (const [id, value] of Object.entries(localData)) {
      mergedMap.set(id, decodeBase64(value));
    }

    return mergedMap;
  })();

  return songIDsCachePromise;
}

export async function matchSongID(name: string): Promise<number | null> {
  const songIDs = await getSongIDs();

  for (const [id, value] of songIDs) {
    if (value === name) {
      return Number(id) % 1e4;
    }
  }

  return null;
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