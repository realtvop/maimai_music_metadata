import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getImageUrl } from "./sources/aquadx";
import type { Music } from "../types";

export const COVERS_DIR = new URL("../covers/", import.meta.url);

function buildCoverName(id: number) {
	const imageId = `00${id.toString().padStart(6, "0").substring(2)}`;
	return `${imageId}.png`;
}

async function downloadCover(id: number) {
	const fileName = buildCoverName(id);
	const filePath = fileURLToPath(new URL(fileName, COVERS_DIR));
	const target = Bun.file(filePath);

	if (await target.exists()) return;

	const response = await fetch(getImageUrl(id));
	if (!response.ok) {
		console.warn(`Skip cover ${fileName}: HTTP ${response.status}`);
		return;
	}

	await Bun.write(target, response);
}

export async function downloadCovers(musics: Music[]) {
	await mkdir(fileURLToPath(COVERS_DIR), { recursive: true });
	const ids = Array.from(new Set(musics.map(music => music.id).filter(id => id > 0)));

	const concurrency = 8;
	const queue = ids.slice();
	const workers = Array.from({ length: concurrency }, async () => {
		while (queue.length) {
			const next = queue.shift();
			if (next === undefined) break;
			try {
				await downloadCover(next);
			} catch (error) {
				console.warn(`Failed to download cover for ${next}:`, error);
			}
		}
	});

	await Promise.all(workers);
}
