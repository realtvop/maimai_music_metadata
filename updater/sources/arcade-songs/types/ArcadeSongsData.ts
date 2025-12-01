import type { Song } from "./Song";
import type { Version } from "./Version";
import type { Genre } from "./Genre";
import type { Type } from "./Type";
import type { DifficultyInfo } from "./DifficultyInfo";
import type { RegionInfo } from "./Regions";

export interface ArcadeSongsData {
    songs: Song[];
    versions: Version[];
    genres: Genre[];
    types: Type[];
    difficulties: DifficultyInfo[];
    regions: RegionInfo[];
    updateTime: string;
}
