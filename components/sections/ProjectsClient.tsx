"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import { site } from "@/data/site";
import type { RepoStat } from "@/lib/github";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/ui/ProjectModal";
import Lightbox from "@/components/ui/Lightbox";
import { GitHubIcon, MagnifyIcon } from "@/components/ui/icons";

function monthYear(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProjectsClient({
  repoStats,
}: {
  repoStats: Record<string, RepoStat>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const active = projects.find((p) => p.id === activeId) ?? null;
  const lightboxProject = projects.find((p) => p.id === lightboxId) ?? null;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = useCallback((id: string, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setActiveId(id);
  }, []);

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    triggerRef.current?.focus();
  }, [active]);

  return (
    <section
      id="projects"
      aria-labelledby="projects-h"
      className="scroll-mt-24 border-t border-border py-20 sm:py-28"
    >
      {/* keep old in-page links working after the GitHub merge */}
      <span id="github" className="block scroll-mt-24" aria-hidden />
      <span id="work" className="block scroll-mt-24" aria-hidden />

      <Reveal>
        <SectionHeading index="02" title="Projects" id="projects-h">
          Builds across applied AI, real-time systems, and networking — open the
          breakdown on each for the full write-up, or jump straight to the repo.
        </SectionHeading>
      </Reveal>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <li key={project.id}>
            <Reveal delay={Math.min(i * 0.05, 0.25)}>
              <ProjectCard
                project={project}
                stat={
                  project.repoUrl
                    ? repoStats[project.repoUrl.toLowerCase()]
                    : undefined
                }
                onOpen={open}
                onEnlarge={() => setLightboxId(project.id)}
              />
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal>
        <a
          href={site.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 font-mono text-xs text-muted outline-offset-4 transition-colors duration-200 ease-smooth hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <GitHubIcon />
          All repositories
          <span aria-hidden>→</span>
        </a>
      </Reveal>

      <AnimatePresence>
        {active ? <ProjectModal project={active} onClose={close} /> : null}
      </AnimatePresence>

      <Lightbox
        open={!!lightboxProject}
        onClose={() => setLightboxId(null)}
        src={lightboxProject?.image ?? ""}
        alt={
          lightboxProject
            ? `${lightboxProject.title} — screenshot`
            : "screenshot"
        }
      />
    </section>
  );
}

function ProjectCard({
  project,
  stat,
  onOpen,
  onEnlarge,
}: {
  project: Project;
  stat?: RepoStat;
  onOpen: (id: string, el: HTMLButtonElement) => void;
  onEnlarge: () => void;
}) {
  const hasImage = !!project.image;
  const pushed = stat ? monthYear(stat.pushedAt) : null;

  return (
    <article
      className={`group relative flex min-h-[15rem] flex-col overflow-hidden rounded-xl border border-border transition-transform duration-300 ease-smooth hover:-translate-y-1.5 hover:rotate-[-0.4deg] focus-within:-translate-y-1.5 ${
        hasImage ? "bg-bg" : "bg-surface/40"
      }`}
    >
      {hasImage && project.image ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            placeholder="blur"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40 transition-colors duration-500 ease-out group-hover:from-black/70 group-hover:to-black/30" />
        </div>
      ) : null}

      {/* Screenshot trigger — a sibling button over the image region only
          (grows to fill the space above the text block; never under the
          footer). Not present on cards without a screenshot. */}
      {hasImage ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnlarge();
          }}
          aria-label={`View larger screenshot of ${project.title}`}
          className="relative z-10 flex-1 cursor-zoom-in rounded-t-xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-white/35 bg-black/45 px-1.5 py-1 font-mono text-[10px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 ease-out group-hover:opacity-100 group-focus-within:opacity-100">
            <MagnifyIcon />
            Enlarge
          </span>
        </button>
      ) : (
        <div className="flex-1" aria-hidden />
      )}

      {/* Text block — inert. No handlers; pointer-events-none so a click on the
          title / description / tags / gaps does nothing. The footer re-enables
          pointer events for its own controls only. */}
      <div className="pointer-events-none relative z-20 flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-display text-lg font-bold leading-snug tracking-tight ${
              hasImage ? "text-white" : "text-fg"
            }`}
          >
            {project.title}
          </h3>
          <span
            className={`mt-1 shrink-0 font-mono text-[11px] ${
              hasImage ? "text-white/70" : "text-muted"
            }`}
          >
            {project.year}
          </span>
        </div>

        <p
          className={`mt-2 text-sm leading-relaxed ${
            hasImage ? "text-white/85" : "text-muted"
          }`}
        >
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                hasImage
                  ? "border-white/25 text-white/80"
                  : "border-border text-muted"
              }`}
            >
              {s}
            </span>
          ))}
          {project.stack.length > 4 ? (
            <span
              className={`px-1 py-0.5 font-mono text-[11px] ${
                hasImage ? "text-white/70" : "text-muted"
              }`}
            >
              +{project.stack.length - 4}
            </span>
          ) : null}
        </div>

        {/* Repo metadata — build-time GitHub data, only when a repo is matched */}
        {stat ? (
          <div
            className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] ${
              hasImage ? "text-white/70" : "text-faint"
            }`}
          >
            <span className="inline-flex items-center gap-1" aria-label={`${stat.stars} stars`}>
              <span aria-hidden>★</span>
              {stat.stars}
            </span>
            {stat.language ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: stat.languageColor ?? "#8a8a90" }}
                />
                {stat.language}
              </span>
            ) : null}
            {pushed ? <span>updated {pushed}</span> : null}
          </div>
        ) : null}

        {/* Footer actions — distinct, separately focusable siblings.
            Tab order: [screenshot] → breakdown → repo. */}
        <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(project.id, e.currentTarget);
            }}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-accent outline-none outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <span className="border-b border-transparent transition-colors duration-200 ease-smooth group-hover:border-accent/40">
              Read the breakdown
            </span>
            <span
              aria-hidden
              className="transition-transform duration-200 ease-smooth group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>

          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} repository on GitHub`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-colors duration-200 ease-smooth outline-none outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                hasImage
                  ? "border-white/30 text-white hover:border-white/60"
                  : "border-border text-fg hover:border-fg/40"
              }`}
            >
              <GitHubIcon />
              View Repo
              <span aria-hidden>→</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
