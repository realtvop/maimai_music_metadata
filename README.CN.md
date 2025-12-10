# maimai Music Metadata

[English](./README.md) | 中文

maimai DX 歌曲元数据和封面图片。

## 目录

- [文件类型](#文件类型)
  - [meta.json / meta.unformatted.json](#metajson--metaunformattedjson)
  - [meta.compacted.json](#metacompactedjson)
- [封面图片](#封面图片)
- [数据结构](#数据结构)
  - [枚举与常量](#枚举与常量)
  - [普通格式](#普通格式)
    - [Music](#music)
    - [Chart](#chart)
    - [Version](#version)
  - [压缩格式](#压缩格式)
    - [MusicCompacted](#musiccompacted)
    - [ChartCompacted](#chartcompacted)
    - [VersionCompacted](#versioncompacted)

## 文件类型

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

## 封面图片

```typescript
const getImageUrl = (id: string | number) => `http://meta.salt.realtvop.top/covers/00${id.toString().padStart(6, '0').substring(2)}.png`;
```

## 数据结构

### 枚举与常量

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

### 普通格式

对应 `meta.json` 和 `meta.unformatted.json`。

#### Music

```typescript
interface Music {
    id: number;       // < 10000，sd 和 dx 相同
    title: string;
    artist: string;
    bpm: number;

    aliases?: {
        cn: string[]; // 中文别名
    };

    category: string; // 对应 Categories 中的字符串
    isLocked: boolean; // 是否需要解锁

    charts: Chart[];
}
```

#### Chart

```typescript
interface Chart {
    type: "sd" | "dx" | "utage";
    difficulty: MusicDifficultyID;
    level: string; // 显示等级，如 "14+"
    internalLevel: number; // 内部定数
    version: string; // 版本名称
    regionVersionOverride?: Partial<Record<AvalibleRegion, string | number>>; // 当某区域与 version 不一致时的覆盖表

    noteDesigner: string;
    noteCounts: {
        tap: number;
        hold: number;
        slide: number;
        touch: number | null; // 标准谱面 (sd) 为 null
        break: number;
        total: number;
    };

    avalibleRegions: AvalibleRegion[];
}
```

#### Version

```typescript
interface Version {
    version: string; // 版本全名
    word: string; // 一个字简称
    releaseDate: string; // 发布日期 YYYY-MM-DD
    cnVerOverride: number | null; // 中国版特有的版本名年份
}
```

### 压缩格式

对应 `meta.compacted.json`。为了减小文件体积，使用数组存储数据。

#### MusicCompacted

```typescript
type MusicCompacted = [
    number, // 0. id
    string, // 1. 标题
    string, // 2. 艺术家
    number, // 3. bpm

    number, // 4. 分类索引 (categories 数组中的索引)
    boolean, // 5. 是否锁定

    ChartCompacted[], // 6. 谱面列表
    string[] | null, // 7. 中文别名
]
```

#### ChartCompacted

```typescript
type ChartCompacted = [
    number, // 0. 类型: 0=sd, 1=dx, 2=utage
    MusicDifficultyID, // 1. 难度
    string, // 2. 等级字符串
    number, // 3. 内部定数
    number, // 4. 版本索引 (versions 数组中的索引)
    [AvalibleRegion, string | number][] | null, // 5. 区域版本覆盖 [region, overrideVersion]

    string, // 6. 谱面设计者
    [number, number, number | null, number, number], // 7. 物量: [tap, hold, slide, touch, break]

    AvalibleRegion[], // 8. 可用区域
]
```

#### VersionCompacted

```typescript
type VersionCompacted = [
    string, // 0. 版本全名
    string, // 1. 简称
    string, // 2. 发布日期
    number | null, // 3. 国服版本
]
```
