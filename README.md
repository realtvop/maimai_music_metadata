# maimai Music Metadata

English | [中文](./README.CN.md)

maimai DX music metadata and cover images.

## Table of Contents

- [File Types](#file-types)
  - [meta.json / meta.unformatted.json](#metajson--metaunformattedjson)
  - [meta.compacted.json](#metacompactedjson)
- [Cover Images](#cover-images)
- [Data Structure](#data-structure)
  - [Enums & Constants](#enums--constants)
  - [Normal Format](#normal-format)
    - [Music](#music)
    - [Chart](#chart)
    - [Version](#version)
  - [Compacted Format](#compacted-format)
    - [MusicCompacted](#musiccompacted)
    - [ChartCompacted](#chartcompacted)
    - [VersionCompacted](#versioncompacted)

## File Types

### meta.json / meta.unformatted.json

URL: `https://meta.salt.realtvop.top/meta.json` `https://meta.salt.realtvop.top/meta.unformatted.json`

```typescript
export interface MusicMetadata {
    musics: Music[];
    versions: Version[];
}
```

### meta.compacted.json

URL: `https://meta.salt.realtvop.top/meta.compacted.json`

```typescript
export interface MusicMetadataCompacted {
    musics: MusicCompacted[];
    versions: VersionCompacted[];
}
```

## Cover Images

```typescript
const getImageUrl = (id: string | number) => `http://meta.salt.realtvop.top/covers/00${id.toString().padStart(6, '0').substring(2)}.png`;
```

## Data Structure

### Enums & Constants

#### MusicDifficultyID

| Value | Difficulty |
| :--- | :--- |
| 0 | Basic |
| 1 | Advanced |
| 2 | Expert |
| 3 | Master |
| 4 | ReMaster |
| 10 | Utage |

#### AvalibleRegion

| Value | Region |
| :--- | :--- |
| "jp" | Japan |
| "intl" | International |
| "cn" | China |
| "us" | USA |

#### Categories

```typescript
export const categories: string[] = [
    "POPS＆アニメ",
    "niconico＆ボーカロイド",
    "東方Project",
    "ゲーム＆バラエティ",
    "maimai",
    "オンゲキ＆CHUNITHM",
    "宴会場",
];
```

### Normal Format

Corresponds to `meta.json` and `meta.unformatted.json`.

#### Music

```typescript
interface Music {
    id: number;       // < 10000, same for sd and dx
    title: string;
    artist: string;
    bpm: number;

    aliases?: {
        cn: string[]; // Chinese aliases
    };

    category: string; // String from Categories
    isLocked: boolean; // Needs unlocking

    charts: Chart[];
}
```

#### Chart

```typescript
interface Chart {
    type: "sd" | "dx" | "utage";
    difficulty: MusicDifficultyID;
    level: string; // Display level, e.g. "14+"
    internalLevel: number; // Internal level value
    version: string; // Version name
    regionVersionOverride?: Partial<Record<AvalibleRegion, string | number>>; // Region-specific version overrides when different from `version`

    noteDesigner: string;
    noteCounts: {
        tap: number;
        hold: number;
        slide: number;
        touch: number | null; // null for standard (sd) charts
        break: number;
        total: number;
    };

    avalibleRegions: AvalibleRegion[];
}
```

#### Version

```typescript
interface Version {
    version: string; // Full version name
    word: string; // One-character abbreviation
    releaseDate: string; // YYYY-MM-DD
    cnVerOverride: number | null; // Year for Chinese version specific naming
}
```

### Compacted Format

Corresponds to `meta.compacted.json`. Uses arrays to store data for smaller file size.

#### MusicCompacted

```typescript
type MusicCompacted = [
    number, // 0. id
    string, // 1. title
    string, // 2. artist
    number, // 3. bpm

    number, // 4. categoryIndex (index in categories array)
    boolean, // 5. isLocked

    ChartCompacted[], // 6. charts
    string[] | null, // 7. aliasesCn
]
```

#### ChartCompacted

```typescript
type ChartCompacted = [
    number, // 0. type: 0=sd, 1=dx, 2=utage
    MusicDifficultyID, // 1. difficulty
    string, // 2. levelString
    number, // 3. internalLevel
    number, // 4. versionIndex (index in versions array)
    [AvalibleRegion, string | number][] | null, // 5. regionVersionOverrides as [region, overrideVersion]

    string, // 6. noteDesigner
    [number, number, number | null, number, number], // 7. noteCounts: [tap, hold, slide, touch, break]

    AvalibleRegion[], // 8. avalibleRegions
]
```

#### VersionCompacted

```typescript
type VersionCompacted = [
    string, // 0. version
    string, // 1. word
    string, // 2. releaseDate
    number | null, // 3. cnVerOverride
]
```
