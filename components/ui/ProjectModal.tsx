"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = `project-${project.id}-title`;

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{
          opacity: 0,
          y: reduce ? 0 : 24,
          scale: reduce ? 1 : 0.98,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-bg p-6 sm:rounded-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted">
              {project.role} · {project.year}
            </p>
            <h3
              id={titleId}
              className="mt-1.5 font-display text-2xl font-bold leading-snug tracking-tight text-fg"
            >
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-full border border-border p-2 text-muted transition-colors duration-200 ease-smooth hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <dl className="mt-7 space-y-5">
          <Block term="Problem">{project.problem}</Block>
          <Block term="Approach">{project.approach}</Block>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
              Stack
            </dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  {s}
                </span>
              ))}
            </dd>
          </div>
          <Block term="Outcome">{project.outcome}</Block>
        </dl>

        {project.links && project.links.length > 0 ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs text-fg transition-colors duration-200 ease-smooth hover:border-fg/40"
              >
                {l.label}
                <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function Block({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
        {term}
      </dt>
      <dd className="mt-2 text-sm leading-relaxed text-muted">{children}</dd>
    </div>
  );
}
