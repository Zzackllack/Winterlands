import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "toml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const modsDir = path.resolve(repoRoot, "modpack", "mods");
const outputPath = path.resolve(__dirname, "../src/data/mods.generated.ts");
const curseforgeKey =
  process.env.CURSEFORGE_API_KEY ?? process.env.CF_API_KEY ?? "";

type Side = "client" | "server" | "both";
type Provider = "modrinth" | "curseforge";

interface PackwizMod {
  side?: Side;
  update?: {
    modrinth?: {
      "mod-id"?: string;
    };
    curseforge?: {
      "project-id"?: number;
    };
  };
}

interface ModEntry {
  slug: string;
  name: string;
  summary: string;
  description: string;
  source: Provider;
  projectId: string;
  side: Side;
  clientSupport: string;
  serverSupport: string;
  categories: string[];
  license: {
    id?: string;
    name?: string;
    url?: string;
    allowModrinthRedistribution: boolean;
  };
  links: {
    site?: string;
    issues?: string;
    source?: string;
    download?: string;
  };
}

async function readModFiles() {
  console.log("[readModFiles] Reading mods directory:", modsDir);
  const entries = await fs.readdir(modsDir);
  const tomlFiles = entries.filter((file) => file.endsWith(".toml"));
  console.log(`[readModFiles] Found ${tomlFiles.length} .toml files`);
  if (tomlFiles.length > 0) {
    console.log("[readModFiles] Files:", tomlFiles.join(", "));
  }
  return tomlFiles;
}

function normalizeSide(value?: string): Side {
  if (value === "client" || value === "server" || value === "both")
    return value;
  return "both";
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  console.log(`[fetchJson] GET ${url}`);
  if (init?.headers) {
    console.log(
      "[fetchJson] request headers:",
      Object.keys(init.headers).join(", ")
    );
  }
  const response = await fetch(url, init);
  console.log(
    `[fetchJson] Response ${response.status} ${response.statusText} for ${url}`
  );
  if (!response.ok) {
    // attempt to include a small response body for debugging if available
    let bodyPreview = "";
    try {
      const text = await response.text();
      bodyPreview = text.slice(0, 500).replace(/\s+/g, " ");
    } catch {
      bodyPreview = "<no preview>";
    }
    throw new Error(
      `Request failed ${response.status} ${response.statusText} for ${url} — preview: ${bodyPreview}`
    );
  }
  const json = await response.json();
  console.log(`[fetchJson] Successful JSON parse for ${url}`);
  return json as T;
}

async function fetchModrinthProject(id: string) {
  const url = `https://api.modrinth.com/v2/project/${id}`;
  console.log(`[modrinth] Fetching project ${id} -> ${url}`);
  return fetchJson<any>(url);
}

async function fetchCurseforgeProject(id: number) {
  console.log(`[curseforge] Fetching project ${id}`);
  if (!curseforgeKey) {
    console.error(
      "[curseforge] No API key found in environment (CURSEFORGE_API_KEY or CF_API_KEY)"
    );
    throw new Error("CURSEFORGE_API_KEY is required for CurseForge lookups.");
  }
  console.log("[curseforge] API key present: yes (not logging the key)");
  const url = `https://api.curseforge.com/v1/mods/${id}`;
  return fetchJson<any>(url, {
    headers: {
      Accept: "application/json",
      "x-api-key": curseforgeKey,
    },
  });
}

function sanitize(text?: string) {
  return (text ?? "").replace(/\r\n/g, "\n").trim();
}

function optionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }
  return undefined;
}

function pickString(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const result = optionalString(value);
    if (result) return result;
  }
  return undefined;
}

function normalizeLicense(id?: string, name?: string) {
  const combined = (name ?? id ?? '').toLowerCase();
  if (combined.includes('all-rights-reserved') || combined === 'arr') {
    return { id: 'ARR', name: 'All Rights Reserved' } as const;
  }
  return {
    id,
    name,
  } as const;
}

async function buildEntries(): Promise<ModEntry[]> {
  const files = await readModFiles();
  const mods: ModEntry[] = [];

  console.log(`[buildEntries] Processing ${files.length} mod files`);
  for (const file of files) {
    console.log(`\n[buildEntries] ----- Processing file: ${file} -----`);
    const filePath = path.join(modsDir, file);
    console.log(`[buildEntries] Reading ${filePath}`);
    const raw = await fs.readFile(filePath, "utf8");
    let parsed: PackwizMod;
    try {
      parsed = parse(raw) as PackwizMod;
      console.log(
        `[buildEntries] Parsed TOML for ${file} - side: ${parsed.side ?? "<unset>"}`
      );
    } catch (err) {
      console.error(`[buildEntries] Failed to parse TOML for ${file}:`, err);
      throw err;
    }

    const side = normalizeSide(parsed.side);
    console.log(`[buildEntries] Normalized side: ${side}`);

    if (parsed.update?.modrinth?.["mod-id"]) {
      const modId = parsed.update.modrinth["mod-id"];
      console.log(`[buildEntries] Detected Modrinth mod-id: ${modId}`);
      if (!modId) {
        console.warn(`[buildEntries] Empty mod-id in ${file}, skipping`);
        continue;
      }
      const data = await fetchModrinthProject(modId);
      console.log(
        `[buildEntries] Modrinth response: slug=${data.slug} title=${data.title}`
      );
      const entry: ModEntry = {
        slug: data.slug,
        name: data.title,
        summary: sanitize(data.description ?? data.body?.slice(0, 200)),
        description: sanitize(data.body ?? data.description ?? ""),
        source: "modrinth",
        projectId: modId,
        side,
        clientSupport: data.client_side ?? "unknown",
        serverSupport: data.server_side ?? "unknown",
        categories: Array.isArray(data.categories) ? data.categories : [],
        license: {
          ...normalizeLicense(
            optionalString(data.license?.id),
            optionalString(data.license?.name)
          ),
          url: optionalString(data.license?.url),
          allowModrinthRedistribution: true,
        },
        links: {
          site: pickString(data.website_url, data.source_url, data.issues_url),
          issues: optionalString(data.issues_url),
          source: optionalString(data.source_url),
          download: `https://modrinth.com/mod/${data.slug}`,
        },
      };
      console.log(
        `[buildEntries] Adding mod entry: ${entry.name} (${entry.slug})`
      );
      mods.push(entry);
    } else if (parsed.update?.curseforge?.["project-id"]) {
      const projectId = parsed.update.curseforge["project-id"];
      console.log(
        `[buildEntries] Detected CurseForge project-id: ${projectId}`
      );
      if (typeof projectId !== "number") {
        console.warn(
          `[buildEntries] project-id is not a number in ${file}, skipping`
        );
        continue;
      }
      const response = await fetchCurseforgeProject(projectId);
      const data = response.data;
      console.log(
        `[buildEntries] CurseForge response: name=${data.name} slug=${data.slug}`
      );
      const entry: ModEntry = {
        slug: data.slug ?? String(projectId),
        name: data.name,
        summary: sanitize(data.summary),
        description: sanitize(data.summary ?? ""),
        source: "curseforge",
        projectId: String(projectId),
        side,
        clientSupport: side === "server" ? "unsupported" : "required",
        serverSupport: side === "client" ? "unsupported" : "required",
        categories: Array.isArray(data.categories)
          ? data.categories.map((c: any) => c.name).filter(Boolean)
          : [],
        license: {
          ...normalizeLicense(
            data.license?.id ? String(data.license.id) : undefined,
            optionalString(data.license?.name)
          ),
          url: optionalString(data.links?.websiteUrl),
          allowModrinthRedistribution: false,
        },
        links: {
          site: optionalString(data.links?.websiteUrl),
          issues: optionalString(data.links?.issuesUrl),
          source: optionalString(data.links?.sourceUrl),
          download: optionalString(data.links?.websiteUrl),
        },
      };
      console.log(
        `[buildEntries] Adding mod entry: ${entry.name} (${entry.slug})`
      );
      mods.push(entry);
    } else {
      console.log(
        `[buildEntries] No recognized update provider (modrinth/curseforge) in ${file}, skipping`
      );
    }

    // politeness delay to avoid hammering APIs
    console.log("[buildEntries] Sleeping 150ms between requests");
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  console.log("[buildEntries] Sorting entries by name");
  return mods.sort((a, b) => a.name.localeCompare(b.name));
}

function renderFile(mods: ModEntry[]) {
  const payload = JSON.stringify(mods, null, 2);
  return `// Auto-generated by scripts/generate-mod-data.ts on ${new Date().toISOString()}\nexport type ModSource = 'modrinth' | 'curseforge';\n\nexport interface ModEntry {\n  slug: string;\n  name: string;\n  summary: string;\n  description: string;\n  source: ModSource;\n  projectId: string;\n  side: 'client' | 'server' | 'both';\n  clientSupport: string;\n  serverSupport: string;\n  categories: string[];\n  license: {\n    id?: string;\n    name?: string;\n    url?: string;\n    allowModrinthRedistribution: boolean;\n  };\n  links: {\n    site?: string;\n    issues?: string;\n    source?: string;\n    download?: string;\n  };\n}\n\nexport const mods: ModEntry[] = ${payload};\n`;
}

async function run() {
  console.log("[run] Starting generate-mod-data script");
  try {
    const mods = await buildEntries();
    console.log(`[run] Built ${mods.length} mod entries`);
    const file = renderFile(mods);
    console.log(`[run] Writing output to ${outputPath}`);
    await fs.writeFile(outputPath, file);
    console.log(
      `Generated ${mods.length} mods → ${path.relative(repoRoot, outputPath)}`
    );
  } catch (error) {
    console.error("[generate-mod-data] Failed:", error);
    process.exit(1);
  }
}

run();
