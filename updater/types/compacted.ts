import type { AvalibleRegion, MusicDifficultyID } from "./data";

export type MusicCompacted = [
    number, // id: < 10000, same for sd and dx
    string, // title
    string, // artist
    number, // bpm

    number, // categoryIndex
    boolean, // isLocked

    ChartCompacted[], // charts
    string[] | null, // aliasesCn
]

export type ChartCompacted = [
    number, // type: [sd, dx, utage]
    MusicDifficultyID,
    string, // levelString
    number, // internalLevel
    number, // versionIndex

    string, // noteDesigner
    [number, number, number | null, number, number], // noteCounts: [tap, hold, slide, touch, break]

    AvalibleRegion[],
]

export type VersionCompacted = [
    string, // version
    string, // word: 一个字简称
    string, // releaseDate
    number | null, // cnVerOverride: 中国版特有的版本名年份
]