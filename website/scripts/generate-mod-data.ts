import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'toml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const modsDir = path.resolve(repoRoot, 'modpack', 'mods');
const outputPath = path.resolve(__dirname, '../src/data/mods.generated.ts');
const curseforgeKey = process.env.CURSEFORGE_API_KEY ?? process.env.CF_API_KEY ?? '';

type Side = 'client' | 'server' | 'both';
type Provider = 'modrinth' | 'curseforge';

interface PackwizMod {
  side?: Side;
  update?: {
    modrinth?: {
      'mod-id'?: string;
    };
    curseforge?: {
      'project-id'?: number;
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
  const entries = await fs.readdir(modsDir);
  return entries.filter((file) => file.endsWith('.toml'));
}

function normalizeSide(value?: string): Side {
  if (value === 'client' || value === 'server' || value === 'both') return value;
  return 'both';
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed ${response.status} ${response.statusText} for ${url}`);
  }
  return response.json() as Promise<T>;
}

async function fetchModrinthProject(id: string) {
  return fetchJson<any>(`https://api.modrinth.com/v2/project/${id}`);
}

async function fetchCurseforgeProject(id: number) {
  if (!curseforgeKey) {
    throw new Error('CURSEFORGE_API_KEY is required for CurseForge lookups.');
  }
  return fetchJson<any>(`https://api.curseforge.com/v1/mods/${id}`, {
    headers: {
      Accept: 'application/json',
      'x-api-key': curseforgeKey,
    },
  });
}

function sanitize(text?: string) {
  return (text ?? '').replace(/\r\n/g, '\n').trim();
}

async function buildEntries(): Promise<ModEntry[]> {
  const files = await readModFiles();
  const mods: ModEntry[] = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(modsDir, file), 'utf8');
    const parsed = parse(raw) as PackwizMod;
    const side = normalizeSide(parsed.side);

    if (parsed.update?.modrinth?.['mod-id']) {
      const modId = parsed.update.modrinth['mod-id'];
      if (!modId) continue;
      const data = await fetchModrinthProject(modId);
      mods.push({
        slug: data.slug,
        name: data.title,
        summary: sanitize(data.description ?? data.body?.slice(0, 200)),
        description: sanitize(data.body ?? data.description ?? ''),
        source: 'modrinth',
        projectId: modId,
        side,
        clientSupport: data.client_side ?? 'unknown',
        serverSupport: data.server_side ?? 'unknown',
        categories: Array.isArray(data.categories) ? data.categories : [],
        license: {
          id: data.license?.id,
          name: data.license?.name,
          url: data.license?.url,
          allowModrinthRedistribution: true,
        },
        links: {
          site: data.website_url ?? data.source_url ?? data.issues_url,
          issues: data.issues_url ?? undefined,
          source: data.source_url ?? undefined,
          download: `https://modrinth.com/mod/${data.slug}`,
        },
      });
    } else if (parsed.update?.curseforge?.['project-id']) {
      const projectId = parsed.update.curseforge['project-id'];
      if (typeof projectId !== 'number') continue;
      const response = await fetchCurseforgeProject(projectId);
      const data = response.data;
      mods.push({
        slug: data.slug ?? String(projectId),
        name: data.name,
        summary: sanitize(data.summary),
        description: sanitize(data.summary ?? ''),
        source: 'curseforge',
        projectId: String(projectId),
        side,
        clientSupport: side === 'server' ? 'unsupported' : 'required',
        serverSupport: side === 'client' ? 'unsupported' : 'required',
        categories: Array.isArray(data.categories) ? data.categories.map((c: any) => c.name).filter(Boolean) : [],
        license: {
          id: data.license?.id ? String(data.license.id) : undefined,
          name: data.license?.name,
          url: data.links?.websiteUrl,
          allowModrinthRedistribution: false,
        },
        links: {
          site: data.links?.websiteUrl,
          issues: data.links?.issuesUrl,
          source: data.links?.sourceUrl,
          download: data.links?.websiteUrl,
        },
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  return mods.sort((a, b) => a.name.localeCompare(b.name));
}

function renderFile(mods: ModEntry[]) {
  const payload = JSON.stringify(mods, null, 2);
  return `// Auto-generated by scripts/generate-mod-data.ts on ${new Date().toISOString()}\nexport type ModSource = 'modrinth' | 'curseforge';\n\nexport interface ModEntry {\n  slug: string;\n  name: string;\n  summary: string;\n  description: string;\n  source: ModSource;\n  projectId: string;\n  side: 'client' | 'server' | 'both';\n  clientSupport: string;\n  serverSupport: string;\n  categories: string[];\n  license: {\n    id?: string;\n    name?: string;\n    url?: string;\n    allowModrinthRedistribution: boolean;\n  };\n  links: {\n    site?: string;\n    issues?: string;\n    source?: string;\n    download?: string;\n  };\n}\n\nexport const mods: ModEntry[] = ${payload};\n`;
}

async function run() {
  try {
    const mods = await buildEntries();
    const file = renderFile(mods);
    await fs.writeFile(outputPath, file);
    console.log(`Generated ${mods.length} mods → ${path.relative(repoRoot, outputPath)}`);
  } catch (error) {
    console.error('[generate-mod-data] Failed:', error);
    process.exit(1);
  }
}

run();
