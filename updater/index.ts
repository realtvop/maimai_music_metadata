import { writeFile } from "node:fs/promises";
import { getArcadeSongsData } from "./sources/arcade-songs";
import { downloadCovers, COVERS_DIR } from "./downloadCovers";
import { compactMusicMetadata } from "../types";
import { fetchChineseAliases } from "./sources/aliases";

const META_PATH = new URL("../meta.json", import.meta.url);
const META_COMPACTED_PATH = new URL("../meta.compacted.json", import.meta.url);
const META_UNFORMATTED_PATH = new URL("../meta.unformatted.json", import.meta.url);

async function main() {
	const [data, cnAliasMap] = await Promise.all([
		getArcadeSongsData(),
		fetchChineseAliases(),
	]);

	const dataWithAliases = {
		...data,
		musics: data.musics.map(music => {
			const aliases = cnAliasMap.get(music.id);
			return aliases?.length ? { ...music, aliases: { cn: aliases } } : music;
		}),
	};

	const compacted = compactMusicMetadata(dataWithAliases);

	await Promise.all([
		writeFile(META_PATH, JSON.stringify(dataWithAliases, null, 2), "utf8"),
		writeFile(META_COMPACTED_PATH, JSON.stringify(compacted), "utf8"),
		writeFile(META_UNFORMATTED_PATH, JSON.stringify(dataWithAliases), "utf8"),
	]);

	console.log(`meta.json updated at ${META_PATH.pathname}`);
	console.log(`meta.compacted.json updated at ${META_COMPACTED_PATH.pathname}`);
	console.log(`meta.unformatted.json updated at ${META_UNFORMATTED_PATH.pathname}`);
	
    await downloadCovers(dataWithAliases.musics);
    console.log(`covers downloaded to ${COVERS_DIR.pathname}`);
}

main().catch(error => {
	console.error("Failed to update meta.json:", error);
	process.exitCode = 1;
});