export interface Regions {
    jp: boolean;
    intl: boolean;
    usa: boolean;
    cn: boolean;
}

export interface RegionInfo {
    region: "jp" | "intl" | "usa" | "cn";
    name: string;
}
