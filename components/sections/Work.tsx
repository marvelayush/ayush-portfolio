import { getRepoStats } from "@/lib/github";
import ProjectsClient from "./ProjectsClient";

/**
 * "Work" — the merged Projects + Code section. This server component resolves
 * the per-repo GitHub stats once (ISR-cached, revalidate 1h) and hands them to
 * the interactive client section; nothing is fetched in the browser.
 */
export default async function Work() {
  const repoStats = await getRepoStats();
  return <ProjectsClient repoStats={repoStats} />;
}
