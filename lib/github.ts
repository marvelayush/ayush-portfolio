import { GITHUB_USER } from "@/data/site";

/**
 * Typed, failure-tolerant GitHub data layer.
 * Every fetcher returns a discriminated result so the UI can hide a block
 * cleanly instead of rendering a broken state. Wired into the UI in phase 4.
 */

const API = "https://api.github.com";
const REVALIDATE = 3600;

export type Ok<T> = { ok: true; data: T };
export type Err = { ok: false; error: "rate-limit" | "network" | "not-found" | "unknown" };
export type Result<T> = Ok<T> | Err;

export type GithubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  htmlUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
};

export type GithubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
};

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  total: number;
  weeks: ContributionDay[][];
};

async function ghFetch(path: string): Promise<Response | null> {
  try {
    return await fetch(`${API}${path}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE },
    });
  } catch {
    return null;
  }
}

function classify(res: Response): Err {
  if (res.status === 403 || res.status === 429) return { ok: false, error: "rate-limit" };
  if (res.status === 404) return { ok: false, error: "not-found" };
  return { ok: false, error: "unknown" };
}

export async function getProfile(): Promise<Result<GithubProfile>> {
  const res = await ghFetch(`/users/${GITHUB_USER}`);
  if (!res) return { ok: false, error: "network" };
  if (!res.ok) return classify(res);
  try {
    const j = await res.json();
    return {
      ok: true,
      data: {
        login: j.login,
        name: j.name ?? null,
        bio: j.bio ?? null,
        avatarUrl: j.avatar_url,
        htmlUrl: j.html_url,
        followers: j.followers ?? 0,
        following: j.following ?? 0,
        publicRepos: j.public_repos ?? 0,
      },
    };
  } catch {
    return { ok: false, error: "unknown" };
  }
}

export async function getTopRepos(limit = 6): Promise<Result<GithubRepo[]>> {
  const res = await ghFetch(`/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
  if (!res) return { ok: false, error: "network" };
  if (!res.ok) return classify(res);
  try {
    const raw: any[] = await res.json();
    const repos = raw
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, limit)
      .map<GithubRepo>((r) => ({
        name: r.name,
        description: r.description ?? null,
        htmlUrl: r.html_url,
        language: r.language ?? null,
        languageColor: r.language ? LANGUAGE_COLORS[r.language] ?? "#8a8a90" : null,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        updatedAt: r.updated_at,
      }));
    return { ok: true, data: repos };
  } catch {
    return { ok: false, error: "unknown" };
  }
}

export type RepoStat = {
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  /** ISO timestamp of the last push (falls back to updated_at). */
  pushedAt: string;
};

/**
 * All of the user's non-fork repos keyed by lowercased html_url, so a project's
 * `repoUrl` can be matched regardless of case. Fetched once and ISR-cached
 * (revalidate 1h) — resolved at build / on the server, never client-side.
 * Returns `{}` on any failure so cards simply omit the metadata row.
 */
export async function getRepoStats(): Promise<Record<string, RepoStat>> {
  const res = await ghFetch(`/users/${GITHUB_USER}/repos?per_page=100`);
  if (!res || !res.ok) return {};
  try {
    const raw: any[] = await res.json();
    const map: Record<string, RepoStat> = {};
    for (const r of raw) {
      if (!r.html_url) continue;
      map[String(r.html_url).toLowerCase()] = {
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        language: r.language ?? null,
        languageColor: r.language
          ? LANGUAGE_COLORS[r.language] ?? "#8a8a90"
          : null,
        pushedAt: r.pushed_at ?? r.updated_at ?? "",
      };
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * Contribution calendar via a no-auth mirror of the GitHub GraphQL data.
 * Shaped into weeks (columns) for a calendar-style grid.
 */
export async function getContributions(): Promise<Result<ContributionCalendar>> {
  let res: Response | null = null;
  try {
    res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`,
      { next: { revalidate: REVALIDATE } },
    );
  } catch {
    return { ok: false, error: "network" };
  }
  if (!res.ok) return classify(res);
  try {
    const j = await res.json();
    const days: ContributionDay[] = (j.contributions ?? []).map((d: any) => ({
      date: d.date,
      count: d.count ?? 0,
      level: Math.max(0, Math.min(4, d.level ?? 0)) as ContributionDay["level"],
    }));
    if (days.length === 0) return { ok: false, error: "unknown" };

    const weeks: ContributionDay[][] = [];
    let week: ContributionDay[] = [];
    // Pad so the first column starts on Sunday.
    const firstDow = new Date(days[0].date).getUTCDay();
    for (let i = 0; i < firstDow; i++) {
      week.push({ date: "", count: 0, level: 0 });
    }
    for (const day of days) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length) weeks.push(week);

    const total =
      typeof j.total?.lastYear === "number"
        ? j.total.lastYear
        : days.reduce((s, d) => s + d.count, 0);

    return { ok: true, data: { total, weeks } };
  } catch {
    return { ok: false, error: "unknown" };
  }
}

/** Subset of GitHub linguist colors for languages likely to appear here. */
export const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  "Jupyter Notebook": "#DA5B0B",
  Go: "#00ADD8",
  Rust: "#dea584",
};
