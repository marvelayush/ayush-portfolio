import Reveal from "@/components/ui/Reveal";
import PortraitFigure from "@/components/photo/PortraitFigure";
import PcbTraces from "@/components/hero/PcbTraces";
import { site } from "@/data/site";

const ctas = [
  { href: site.links.resume, label: "Résumé", primary: true },
  { href: site.links.github, label: "GitHub", primary: false },
  { href: site.links.linkedin, label: "LinkedIn", primary: false },
  { href: site.links.instagram, label: "Instagram", primary: false },
];

/**
 * Middle-dot-joined line. Each segment is kept unbreakable so narrow widths
 * wrap only at the separators, never mid-phrase.
 */
function DotLine({
  segments,
  className,
}: {
  segments: readonly string[];
  className?: string;
}) {
  return (
    <p className={className}>
      {segments.map((seg, i) => (
        <span key={seg}>
          {i > 0 ? <span aria-hidden> · </span> : null}
          <span className="whitespace-nowrap">{seg}</span>
        </span>
      ))}
    </p>
  );
}

export default function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[88svh] flex-col items-center justify-center gap-10 py-20"
    >
      <PcbTraces className="canvas-fade-in pointer-events-none absolute inset-0 z-0" />

      <Reveal className="relative z-30">
        <p className="text-center font-mono text-xs uppercase tracking-[0.22em] text-muted">
          {site.location} · Backend · Applied AI
        </p>
      </Reveal>

      <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:gap-14">
        <div className="relative z-20 shrink-0">
          <PortraitFigure />
        </div>

        <div className="relative z-30 flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <Reveal delay={0.05}>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.02] tracking-tight text-fg">
              {site.name}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <DotLine
              segments={site.tagline}
              className="max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base"
            />
          </Reveal>

          <Reveal delay={0.15}>
            <DotLine
              segments={site.credential}
              className="font-mono text-xs text-faint"
            />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-2 flex flex-wrap justify-center gap-3 md:justify-start">
              {ctas.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-transform duration-200 ease-smooth hover:-translate-y-0.5 ${
                  c.primary
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border text-fg hover:border-fg/40"
                }`}
              >
                {c.label}
                <span
                  aria-hidden
                  className="transition-transform duration-200 ease-smooth group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
