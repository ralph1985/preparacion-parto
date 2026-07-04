import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { SiteSettings } from "../../domain/site";

export async function getSiteSettings(): Promise<SiteSettings> {
  const sitePath = join(
    process.cwd(),
    "src/infrastructure/content/data/site.json",
  );
  return JSON.parse(await readFile(sitePath, "utf8")) as SiteSettings;
}
