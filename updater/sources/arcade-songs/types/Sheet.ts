import type { NoteCounts } from "./NoteCounts";
import type { Regions } from "./Regions";

export type SheetType = "std" | "dx";

export type Difficulty = "basic" | "advanced" | "expert" | "master" | "remaster";

export interface Sheet {
    type: SheetType;
    difficulty: Difficulty;
    level: string;
    levelValue: number;
    internalLevel: string | null;
    internalLevelValue: number;
    noteDesigner: string;
    noteCounts: NoteCounts;
    regions: Regions;
    regionOverrides: {
        intl: Record<string, unknown>;
    };
    isSpecial: boolean;
    version: string;
}
